'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Phaser touches window on import, so it must never render on the server
const PhaserGame = dynamic(() => import('@/components/PhaserGame'), { ssr: false });

type Stats = { games: number; canvases: number; heapMB: number | null };

function readStats(): Stats {
  const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
  return {
    games: window.__phaserGames ?? 0,
    canvases: document.querySelectorAll('canvas').length,
    heapMB: mem ? Math.round(mem.usedJSHeapSize / 1048576) : null,
  };
}

export default function S1Page() {
  const [mounted, setMounted] = useState(true);
  const [booth, setBooth] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ games: 0, canvases: 0, heapMB: null });
  const [stress, setStress] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setStats(readStats()), 500);
    return () => clearInterval(id);
  }, []);

  // Leak check: mount/unmount the game N times, then compare games/canvases/heap
  async function runStress(n: number) {
    const before = readStats();
    for (let i = 1; i <= n; i++) {
      setStress(`${i}/${n}`);
      setMounted(false);
      await new Promise((r) => setTimeout(r, 250));
      setMounted(true);
      await new Promise((r) => setTimeout(r, 400));
    }
    await new Promise((r) => setTimeout(r, 1000));
    const after = readStats();
    setStress(
      `done ${n}x · games ${before.games}→${after.games} · canvases ${before.canvases}→${after.canvases}` +
        (after.heapMB !== null ? ` · heap ${before.heapMB}→${after.heapMB} MB` : ''),
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '8px 16px', flexWrap: 'wrap', fontSize: 14 }}>
        <strong>S1 · Phaser 4 + Tiled</strong>
        <span>เดิน: ลูกศร / WASD / คลิก</span>
        <span>บูธ: {booth ?? '—'}</span>
        <span>
          games {stats.games} · canvases {stats.canvases}
          {stats.heapMB !== null && ` · heap ${stats.heapMB} MB`}
        </span>
        <button onClick={() => setMounted((m) => !m)}>{mounted ? 'unmount' : 'mount'}</button>
        <button onClick={() => runStress(20)} disabled={stress !== null && !stress.startsWith('done')}>
          leak test 20x
        </button>
        {stress && <span>{stress}</span>}
      </header>
      <div style={{ flex: 1, minHeight: 0 }}>
        {mounted && (
          <PhaserGame onBoothEnter={(b) => setBooth(b.title)} onBoothLeave={() => setBooth(null)} />
        )}
      </div>
    </div>
  );
}
