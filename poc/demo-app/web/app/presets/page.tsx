'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import type { BoothCard, PresetGameHandle } from '@/components/PresetGame';
import type { Hearing, LayoutInfo, PresetId } from '@/game/PresetScene';

// Hall preset POC (not a spike): same map for any number of booths, with or without categories
const PresetGame = dynamic(() => import('@/components/PresetGame'), { ssr: false });

const CAPACITY: Record<PresetId, number> = { room: 12, hall: 30 };
const CAT: Record<string, { bg: string; ink: string }> = {
  'AI & Data': { bg: '#cdeedd', ink: '#1f6b4c' },
  'Web & Mobile': { bg: '#e4dbfa', ink: '#4e3a99' },
  'IoT & Robotics': { bg: '#ffe0d1', ink: '#9a4523' },
  'Games & XR': { bg: '#d6e9fb', ink: '#1f5a96' },
};

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.96)', borderRadius: 18, boxShadow: '0 10px 30px -12px rgba(59,47,79,0.45)',
  border: '1px solid #e6e1ef', color: '#2b2340',
};
const seg = (on: boolean): React.CSSProperties => ({
  flex: 1, height: 32, borderRadius: 9, border: 0, fontWeight: 700, fontSize: 13, cursor: 'pointer',
  background: on ? '#4655e8' : 'transparent', color: on ? '#fff' : '#4a4360',
});

export default function PresetsPage() {
  const game = useRef<PresetGameHandle | null>(null);
  const [preset, setPreset] = useState<PresetId>('hall');
  const [categories, setCategories] = useState(true);
  const [count, setCount] = useState(18);
  const [layout, setLayout] = useState<LayoutInfo | null>(null);
  const [booth, setBooth] = useState<BoothCard | null>(null);
  const [note, setNote] = useState('');
  const [range, setRange] = useState(5);
  const [hearing, setHearing] = useState<Hearing | null>(null);

  const choosePreset = (p: PresetId) => {
    const c = Math.min(count, CAPACITY[p]);
    setPreset(p);
    setCount(c);
    setBooth(null);
    setNote('');
    game.current?.setPreset(p, c, categories);
  };
  const setup = (c: number, cats: boolean) => {
    setCount(c);
    setCategories(cats);
    setNote('');
    game.current?.setup(c, cats);
  };
  const onLayout = (info: LayoutInfo) => {
    setLayout(info);
    if (info.added) {
      setCount((c) => c + 1);
      setNote(`Added "${info.added}" to a free slot · no one else moved`);
    }
    if (info.full) setNote(info.full === 'all' ? 'All slots are taken → pick a bigger preset' : `No room left for ${info.full} (its zone is full, no empty block) → pick a bigger preset`);
    if (info.unplaced) setNote(`${info.unplaced} projects don't fit: each category needs its own block → pick a bigger preset, or turn off categories`);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#efeaf6', fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <PresetGame control={game} onLayout={onLayout} onBoothEnter={setBooth} onBoothLeave={() => setBooth(null)} onHearing={setHearing} />

      <div style={{ ...card, position: 'absolute', top: 12, left: 12, width: 300, padding: 14, display: 'grid', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Hall presets</div>
          <div style={{ fontSize: 12, color: '#6b6380' }}>One map, booths placed from the project list</div>
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#f1eef7', borderRadius: 11, padding: 3 }}>
          <button type="button" style={seg(preset === 'room')} onClick={() => choosePreset('room')}>Room · 12</button>
          <button type="button" style={seg(preset === 'hall')} onClick={() => choosePreset('hall')}>Hall · 30</button>
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#f1eef7', borderRadius: 11, padding: 3 }}>
          <button type="button" style={seg(categories)} onClick={() => setup(count, true)}>By category</button>
          <button type="button" style={seg(!categories)} onClick={() => setup(count, false)}>No categories</button>
        </div>

        <label style={{ display: 'grid', gap: 6, fontSize: 12, color: '#4a4360', fontWeight: 700 }}>
          <span style={{ display: 'flex' }}>Projects before the event<span style={{ marginLeft: 'auto' }}>{count} / {CAPACITY[preset]}</span></span>
          <input type="range" min={0} max={CAPACITY[preset]} value={count} aria-label="Number of projects"
            onChange={(e) => setup(Number(e.target.value), categories)} />
        </label>

        <button type="button" onClick={() => game.current?.addBooth()}
          style={{ height: 36, borderRadius: 10, border: '1px solid #d9d3e6', background: '#fff', fontWeight: 700, color: '#2b2340', cursor: 'pointer' }}>
          + Add booth during the event
        </button>

        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontSize: 12, color: '#4a4360', fontWeight: 700 }}>Hearing range outside booths</div>
          <div style={{ display: 'flex', gap: 4, background: '#f1eef7', borderRadius: 11, padding: 3 }}>
            {[[5, '5 tiles (Gather)'], [8, '8 tiles (compare)']].map(([r, label]) => (
              <button key={r} type="button" style={seg(range === r)} onClick={() => { setRange(r as number); game.current?.setRange(r as number); }}>{label}</button>
            ))}
          </div>
          {hearing && (
            <div style={{ fontSize: 12, color: '#6b6380' }}>
              {hearing.where === 'booth' ? <>In a booth zone: you hear <b style={{ color: '#2b2340' }}>{hearing.people}</b> people in this booth only</> : <>You hear <b style={{ color: '#2b2340' }}>{hearing.people}</b> people · full volume within 2 tiles</>}
            </div>
          )}
        </div>

        {layout && (
          <div style={{ fontSize: 12, color: '#6b6380', lineHeight: 1.6 }}>
            <div><b style={{ color: '#2b2340' }}>{layout.booths}</b> booths on the map · <b style={{ color: '#2b2340' }}>{layout.empty}</b> empty slots (empty block → lounge)</div>
            {layout.blocks.map((b) => (
              <div key={b.id}>Block {b.id}: {b.label}</div>
            ))}
          </div>
        )}
        {note && <div style={{ fontSize: 12, fontWeight: 700, color: '#f0506e' }}>{note}</div>}
      </div>

      <div style={{ ...card, position: 'absolute', top: 12, right: 12, padding: '8px 12px', fontSize: 12, color: '#6b6380' }}>
        Walk: arrows / WASD / click · Zoom: scroll · Minimap: click to go
      </div>

      {booth && (
        <div style={{ ...card, position: 'absolute', left: 12, bottom: 16, width: 300, padding: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, fontWeight: 700 }}>
            <span style={{ color: '#6b6380' }}>Booth {booth.no}</span>
            {booth.categories && (
              <span style={{ background: CAT[booth.category]?.bg, color: CAT[booth.category]?.ink, borderRadius: 999, padding: '2px 8px' }}>{booth.category}</span>
            )}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>{booth.title}</div>
          <div style={{ fontSize: 12, color: '#6b6380', marginTop: 4 }}>Slot {booth.slot}</div>
        </div>
      )}
    </div>
  );
}
