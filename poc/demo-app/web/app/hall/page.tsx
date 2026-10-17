'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { BoothInfo } from '@/components/ShowcaseGame';

// Hall art POC (not a spike): chibi characters + D-Day-like hall, offline with NPCs
const ShowcaseGame = dynamic(() => import('@/components/ShowcaseGame'), { ssr: false });

const ZONE: Record<string, { bg: string; ink: string }> = {
  mint: { bg: '#cdeedd', ink: '#1f6b4c' },
  lilac: { bg: '#e4dbfa', ink: '#4e3a99' },
  peach: { bg: '#ffe0d1', ink: '#9a4523' },
  sky: { bg: '#d6e9fb', ink: '#1f5a96' },
};
const STATUS = { live: ['Presenting now', '#f0506e'], present: ['Presenter here', '#3fae7f'], empty: ['No one at booth', '#8f86a6'] } as const;

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.96)', borderRadius: 18, boxShadow: '0 10px 30px -12px rgba(59,47,79,0.45)',
  border: '1px solid #e6e1ef', color: '#2b2340',
};

export default function HallPage() {
  const [booth, setBooth] = useState<BoothInfo | null>(null);
  const [nearby, setNearby] = useState<string[]>([]);
  const [mic, setMic] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#efeaf6', fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <ShowcaseGame onBoothEnter={setBooth} onBoothLeave={() => setBooth(null)} onNearby={setNearby} />

      <div style={{ ...card, position: 'absolute', top: 12, left: 12, padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ width: 30, height: 30, borderRadius: 10, background: '#4655e8', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>C</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Senior Project Showcase 2027</div>
          <div style={{ fontSize: 12, color: '#6b6380' }}>24 projects · 4 zones · sample crowd</div>
        </div>
      </div>

      <div style={{ ...card, position: 'absolute', top: 12, right: 12, padding: '8px 12px', fontSize: 12, color: '#6b6380', lineHeight: 1.6 }}>
        Walk: arrows / WASD / click · Zoom: scroll · Minimap: click to go
      </div>

      {booth && (
        <div style={{ ...card, position: 'absolute', left: 12, bottom: 88, width: 320, padding: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, fontWeight: 700 }}>
            <span style={{ color: '#6b6380' }}>Booth {booth.no}</span>
            <span style={{ background: ZONE[booth.zone]?.bg, color: ZONE[booth.zone]?.ink, borderRadius: 999, padding: '2px 8px' }}>{booth.category}</span>
            <span style={{ color: STATUS[booth.status][1], marginLeft: 'auto' }}>● {STATUS[booth.status][0]}</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>{booth.title}</div>
          <div style={{ fontSize: 13, color: '#6b6380', marginTop: 4 }}>
            {booth.presenters.length ? `Presenters: ${booth.presenters.join(', ')}` : 'The team is away. Leave feedback for later.'}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {['Open poster', 'Leave feedback'].map((t) => (
              <button key={t} type="button" style={{ flex: 1, height: 36, borderRadius: 10, border: '1px solid #d9d3e6', background: '#fff', fontWeight: 700, color: '#2b2340', cursor: 'pointer' }}>{t}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ ...card, pointerEvents: 'auto', background: '#2b2340', color: '#fff', padding: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" onClick={() => setMic(!mic)} aria-pressed={mic}
            style={{ height: 40, padding: '0 14px', borderRadius: 12, border: 0, fontWeight: 700, cursor: 'pointer', color: '#fff', background: mic ? 'rgba(255,255,255,0.14)' : '#f0506e' }}>
            {mic ? 'Mic on' : 'Mic off'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', minWidth: 180 }}>
            {nearby.slice(0, 6).map((n) => (
              <span key={n} title={n} style={{ width: 28, height: 28, borderRadius: 999, background: '#c9cef8', color: '#2a3290', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800, border: '2px solid #2b2340' }}>
                {n.slice(0, 2)}
              </span>
            ))}
            <span style={{ fontSize: 12, opacity: 0.8 }}>{nearby.length ? `${nearby.length} can hear you` : 'No one nearby'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
