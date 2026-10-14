'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Client, type Room } from '@colyseus/sdk';

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), { ssr: false });

// Default: same host as the page, port 2567 — so phones/laptops on the LAN work without config
function realtimeUrl() {
  return process.env.NEXT_PUBLIC_REALTIME_URL ?? `${location.protocol}//${location.hostname}:2567`;
}

type Stats = { players: number; rttMs: number | null; downKBps: number };

export default function S2Page() {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [booth, setBooth] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ players: 0, rttMs: null, downKBps: 0 });

  // Join on mount, leave on unmount. `cancelled` covers StrictMode's mount → unmount → mount in dev
  useEffect(() => {
    let cancelled = false;
    let joined: Room | null = null;
    const name = new URLSearchParams(location.search).get('name') ?? `guest-${Math.floor(Math.random() * 1000)}`;
    new Client(realtimeUrl())
      .joinOrCreate('hall', { name, eventId: 'demo' })
      .then((r) => {
        if (cancelled) return void r.leave();
        joined = r;
        window.__colyseusRoom = r;
        setRoom(r);
      })
      .catch((e) => setError(`เชื่อม realtime server ไม่ได้: ${e?.message ?? e}`));
    return () => {
      cancelled = true;
      joined?.leave();
      window.__colyseusRoom = undefined;
    };
  }, []);

  // Header numbers: player count, round-trip to the server, download rate of this tab
  useEffect(() => {
    if (!room) return;
    let bytes = 0;
    const ws = (room.connection.transport as unknown as { ws: WebSocket }).ws;
    const count = (e: MessageEvent) => (bytes += (e.data as ArrayBuffer).byteLength ?? 0);
    ws.addEventListener('message', count);
    const id = setInterval(async () => {
      const t0 = performance.now();
      const rtt = await room.request('ping').then(() => Math.round(performance.now() - t0)).catch(() => null);
      const players = (room.state as { players?: { size: number } }).players?.size ?? 0;
      setStats({ players, rttMs: rtt, downKBps: Math.round(bytes / 2 / 102.4) / 10 });
      bytes = 0;
    }, 2000);
    return () => {
      clearInterval(id);
      ws.removeEventListener('message', count);
    };
  }, [room]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '8px 16px', flexWrap: 'wrap', fontSize: 14 }}>
        <strong>S3 · Movement sync</strong>
        <span>เปิดหลายแท็บ/หลายเครื่องเพื่อเห็นกัน</span>
        <span>บูธ: {booth ?? '—'}</span>
        <span>
          ผู้เล่น {stats.players} · rtt {stats.rttMs ?? '—'} ms · รับ {stats.downKBps} KB/s
        </span>
        {error && <span style={{ color: 'crimson' }}>{error}</span>}
      </header>
      <div style={{ flex: 1, minHeight: 0 }}>
        {room && <PhaserGame room={room} onBoothEnter={(b) => setBooth(b.title)} onBoothLeave={() => setBooth(null)} />}
      </div>
    </div>
  );
}
