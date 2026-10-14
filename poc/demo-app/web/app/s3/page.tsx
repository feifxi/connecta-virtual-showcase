'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { Participant, Room, RoomEvent, Track } from 'livekit-client';

// Debug hook for spike checks (POC only)
declare global {
  interface Window {
    __room?: Room;
  }
}

const ROOM = 's3';

// Any of these changes what the page shows, so re-render on all of them
const RENDER_EVENTS = [
  RoomEvent.ConnectionStateChanged,
  RoomEvent.ParticipantConnected,
  RoomEvent.ParticipantDisconnected,
  RoomEvent.TrackSubscribed,
  RoomEvent.TrackUnsubscribed,
  RoomEvent.TrackMuted,
  RoomEvent.TrackUnmuted,
  RoomEvent.LocalTrackPublished,
  RoomEvent.LocalTrackUnpublished,
  RoomEvent.ActiveSpeakersChanged,
  RoomEvent.AudioPlaybackStatusChanged,
] as const;

export default function S3Page() {
  const roomRef = useRef<Room | null>(null);
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const room = roomRef.current;

  // Leaving the page must close the connection and stop camera/mic
  useEffect(() => () => void roomRef.current?.disconnect(), []);

  async function join() {
    setError(null);
    try {
      const res = await fetch(`/api/livekit-token?room=${ROOM}&name=${encodeURIComponent(name)}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);

      // adaptiveStream: receive only the resolution each <video> needs · dynacast: stop sending layers nobody watches
      const r = new Room({ adaptiveStream: true, dynacast: true });
      for (const e of RENDER_EVENTS) r.on(e, rerender);
      r.on(RoomEvent.Disconnected, () => {
        roomRef.current = null;
        window.__room = undefined;
        rerender();
      });
      await r.connect(body.url, body.token);
      roomRef.current = r;
      window.__room = r;
      await r.startAudio(); // inside the click handler, so autoplay is allowed
      await r.localParticipant.setMicrophoneEnabled(true);
      rerender();
    } catch (e) {
      setError(String(e));
    }
  }

  async function toggle(source: 'mic' | 'camera' | 'screen') {
    if (!room) return;
    const lp = room.localParticipant;
    setError(null);
    try {
      if (source === 'mic') await lp.setMicrophoneEnabled(!lp.isMicrophoneEnabled);
      if (source === 'camera') await lp.setCameraEnabled(!lp.isCameraEnabled); // simulcast is on by default
      if (source === 'screen') await lp.setScreenShareEnabled(!lp.isScreenShareEnabled);
    } catch (e) {
      setError(String(e)); // e.g. permission denied or the screen picker was cancelled
    }
    rerender();
  }

  if (!room) {
    return (
      <main style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
        <strong>S3 · LiveKit: เสียง · กล้อง · แชร์จอ</strong>
        <span style={{ fontSize: 14 }}>เปิด 2 แท็บ (หรือ 2 เครื่อง) แล้ว join ห้องเดียวกัน</span>
        <input placeholder="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={join} disabled={!name.trim()}>
          join
        </button>
        {error && <span style={{ color: 'crimson' }}>{error}</span>}
      </main>
    );
  }

  const lp = room.localParticipant;
  const participants: Participant[] = [lp, ...room.remoteParticipants.values()];

  return (
    <main style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', fontSize: 14 }}>
        <strong>S3 · ห้อง {ROOM}</strong>
        <span>{room.state}</span>
        <span>{participants.length} คน</span>
        <button onClick={() => toggle('mic')}>{lp.isMicrophoneEnabled ? 'ปิดไมค์' : 'เปิดไมค์'}</button>
        <button onClick={() => toggle('camera')}>{lp.isCameraEnabled ? 'ปิดกล้อง' : 'เปิดกล้อง'}</button>
        <button onClick={() => toggle('screen')}>{lp.isScreenShareEnabled ? 'หยุดแชร์จอ' : 'แชร์จอ'}</button>
        {!room.canPlaybackAudio && <button onClick={() => room.startAudio().then(rerender)}>เปิดเสียง</button>}
        <button onClick={() => room.disconnect()}>ออก</button>
        {error && <span style={{ color: 'crimson' }}>{error}</span>}
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {participants.map((p) => (
          <ParticipantTile key={p.identity} participant={p} />
        ))}
      </div>
    </main>
  );
}

function ParticipantTile({ participant: p }: { participant: Participant }) {
  const cam = p.getTrackPublication(Track.Source.Camera);
  const screen = p.getTrackPublication(Track.Source.ScreenShare);
  const mic = p.getTrackPublication(Track.Source.Microphone);

  return (
    <section
      data-identity={p.identity}
      style={{ border: `2px solid ${p.isSpeaking ? '#2e9e5b' : '#ccc'}`, borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}
    >
      <div style={{ fontSize: 14 }}>
        {p.name || p.identity}
        {p.isLocal && ' (คุณ)'} · ไมค์ {mic && !mic.isMuted ? 'เปิด' : 'ปิด'}
        {p.isSpeaking && ' · กำลังพูด'}
      </div>
      {screen?.track && !screen.isMuted && <MediaView track={screen.track} kind="screen" />}
      {cam?.track && !cam.isMuted && <MediaView track={cam.track} kind="camera" />}
      {/* Own mic is never played back (echo) */}
      {!p.isLocal && mic?.track && <MediaView track={mic.track} kind="audio" />}
    </section>
  );
}

function MediaView({ track, kind }: { track: Track; kind: 'camera' | 'screen' | 'audio' }) {
  const ref = useRef<HTMLVideoElement & HTMLAudioElement>(null);

  // attach() wires the MediaStream to the element; detach() on unmount releases it
  useEffect(() => {
    const el = ref.current!;
    track.attach(el);
    return () => void track.detach(el);
  }, [track]);

  if (kind === 'audio') return <audio ref={ref} data-kind={kind} />;
  return <video ref={ref} data-kind={kind} muted playsInline style={{ width: '100%', background: '#000', borderRadius: 4 }} />;
}
