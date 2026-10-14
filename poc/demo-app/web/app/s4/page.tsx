'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Client, type Room as ColyseusRoom } from '@colyseus/sdk';
import { Room as LkRoom, RoomEvent, Track } from 'livekit-client';
import {
  HEAR_ENTER_TILES,
  HEAR_LEAVE_TILES,
  ProximityMedia,
  loadBooths,
  type Booth,
  type ProximitySnapshot,
} from '@/media/ProximityMedia';

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), { ssr: false });

const EVENT_ID = 's4-demo';
const LK_ROOM = `hall-${EVENT_ID}`; // 1 hall = 1 LiveKit room

// Debug hooks for spike checks (POC only)
declare global {
  interface Window {
    __lkRoom?: LkRoom;
    __proximity?: ProximityMedia;
  }
}

function realtimeUrl() {
  return process.env.NEXT_PUBLIC_REALTIME_URL ?? `${location.protocol}//${location.hostname}:2567`;
}

type Session = { colyseus: ColyseusRoom; lk: LkRoom; prox: ProximityMedia; presenterOf: string };

export default function S4Page() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [name, setName] = useState('');
  const [presenterOf, setPresenterOf] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [snap, setSnap] = useState<ProximitySnapshot>({ myBooth: null, peers: [], boothVideos: [] });
  const [error, setError] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const sessionRef = useRef<Session | null>(null);

  useEffect(() => {
    loadBooths().then(setBooths).catch((e) => setError(String(e)));
    const q = new URLSearchParams(location.search);
    setName(q.get('name') ?? '');
    setPresenterOf(q.get('presenter') ?? '');
    return () => leave();
  }, []);

  async function join() {
    setError(null);
    try {
      // 1) Colyseus first: its sessionId becomes the LiveKit identity, so positions and media match up
      const colyseus = await new Client(realtimeUrl()).joinOrCreate('hall', { name, eventId: EVENT_ID, presenterOf });
      // 2) LiveKit token: visitors may publish the microphone only
      const role = presenterOf ? 'presenter' : 'visitor';
      const q = new URLSearchParams({ room: LK_ROOM, name, identity: colyseus.sessionId, role });
      const res = await fetch(`/api/livekit-token?${q}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      const lk = new LkRoom({ adaptiveStream: true, dynacast: true });
      // autoSubscribe off: ProximityMedia decides every subscription from positions
      await lk.connect(body.url, body.token, { autoSubscribe: false });
      await lk.startAudio(); // inside the click handler, so autoplay is allowed
      await lk.localParticipant.setMicrophoneEnabled(true);
      for (const e of [RoomEvent.LocalTrackPublished, RoomEvent.LocalTrackUnpublished, RoomEvent.AudioPlaybackStatusChanged]) {
        lk.on(e, () => setTick((n) => n + 1));
      }
      const subscribeAll = new URLSearchParams(location.search).has('subscribeAll'); // track-capacity test only
      const prox = new ProximityMedia(colyseus, lk, booths, { subscribeAll, onChange: setSnap });
      const s = { colyseus, lk, prox, presenterOf };
      sessionRef.current = s;
      Object.assign(window, { __colyseusRoom: colyseus, __lkRoom: lk, __proximity: prox });
      setSession(s);
    } catch (e) {
      setError(String(e));
      leave();
    }
  }

  function leave() {
    const s = sessionRef.current;
    sessionRef.current = null;
    s?.prox.destroy();
    s?.lk.disconnect();
    s?.colyseus.leave();
    window.__lkRoom = window.__proximity = window.__colyseusRoom = undefined;
    setSession(null);
  }

  async function toggle(source: 'mic' | 'camera' | 'screen') {
    const lp = session?.lk.localParticipant;
    if (!lp) return;
    try {
      if (source === 'mic') await lp.setMicrophoneEnabled(!lp.isMicrophoneEnabled);
      if (source === 'camera') await lp.setCameraEnabled(!lp.isCameraEnabled);
      if (source === 'screen') await lp.setScreenShareEnabled(!lp.isScreenShareEnabled);
    } catch (e) {
      setError(String(e));
    }
    setTick((n) => n + 1);
  }

  if (!session) {
    return (
      <main style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
        <strong>S4 · Proximity media</strong>
        <span style={{ fontSize: 14 }}>
          เดินเข้าใกล้ (&lt; {HEAR_ENTER_TILES} ช่อง) แล้วได้ยินเสียง · ห่างเกิน {HEAR_LEAVE_TILES} ช่องเสียงหาย · เข้าโซนบูธแล้วเห็นจอ/กล้องของผู้นำเสนอบูธนั้น
        </span>
        <input placeholder="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} />
        <label style={{ fontSize: 14 }}>
          บทบาท{' '}
          <select value={presenterOf} onChange={(e) => setPresenterOf(e.target.value)}>
            <option value="">ผู้ชม (ไมค์อย่างเดียว)</option>
            {booths.map((b) => (
              <option key={b.name} value={b.name}>
                ผู้นำเสนอ {b.name}
              </option>
            ))}
          </select>
        </label>
        <button onClick={join} disabled={!name.trim() || booths.length === 0}>
          join
        </button>
        {error && <span style={{ color: 'crimson' }}>{error}</span>}
      </main>
    );
  }

  const lp = session.lk.localParticipant;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 16px', flexWrap: 'wrap', fontSize: 14 }}>
        <strong>S4 · Proximity media</strong>
        <span>
          {name}
          {session.presenterOf && ` · ผู้นำเสนอ ${session.presenterOf}`}
        </span>
        <span>บูธ: {snap.myBooth ?? '—'}</span>
        <button onClick={() => toggle('mic')}>{lp.isMicrophoneEnabled ? 'ปิดไมค์' : 'เปิดไมค์'}</button>
        {session.presenterOf && (
          <>
            <button onClick={() => toggle('screen')}>{lp.isScreenShareEnabled ? 'หยุดแชร์จอ' : 'แชร์จอ'}</button>
            <button onClick={() => toggle('camera')}>{lp.isCameraEnabled ? 'ปิดกล้อง' : 'เปิดกล้อง'}</button>
          </>
        )}
        {!session.lk.canPlaybackAudio && <button onClick={() => session.lk.startAudio()}>เปิดเสียง</button>}
        <button onClick={leave}>ออก</button>
        {error && <span style={{ color: 'crimson' }}>{error}</span>}
      </header>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <PhaserGame room={session.colyseus} />
        </div>
        <aside style={{ width: 340, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, borderLeft: '1px solid #ddd' }}>
          {snap.boothVideos.length > 0 ? (
            snap.boothVideos.map((v) => (
              <figure key={`${v.identity}-${v.source}`} style={{ margin: 0 }}>
                <figcaption>
                  {v.name} · {v.source === Track.Source.ScreenShare ? 'จอ' : 'กล้อง'}
                </figcaption>
                <Video track={v.track} kind={v.source === Track.Source.ScreenShare ? 'screen' : 'camera'} />
              </figure>
            ))
          ) : (
            <span style={{ color: '#888' }}>{snap.myBooth ? 'ผู้นำเสนอบูธนี้ยังไม่แชร์จอ/กล้อง' : 'เข้าโซนบูธเพื่อดูจอของผู้นำเสนอ'}</span>
          )}
          <div>
            <strong>คนใกล้ๆ</strong>
            <ul style={{ paddingLeft: 16, margin: '4px 0' }}>
              {snap.peers.map((p) => (
                <li key={p.identity} data-identity={p.identity} style={{ color: p.hearing ? '#1d7a46' : '#999' }}>
                  {p.name}
                  {p.presenter && ' 🎤'} · {p.tiles} ช่อง · {p.hearing ? `ได้ยิน ${Math.round(p.volume * 100)}%` : 'ไม่ได้ยิน'}
                </li>
              ))}
              {snap.peers.length === 0 && <li style={{ color: '#888' }}>ไม่มีใครในระยะ</li>}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Video({ track, kind }: { track: Track; kind: 'camera' | 'screen' }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current!;
    track.attach(el);
    return () => void track.detach(el);
  }, [track]);
  return <video ref={ref} data-kind={kind} muted playsInline style={{ width: '100%', background: '#000', borderRadius: 4 }} />;
}
