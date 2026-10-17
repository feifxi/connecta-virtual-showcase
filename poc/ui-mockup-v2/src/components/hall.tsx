"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Hand, ImageIcon, Map as MapIcon, MessageSquare, Mic, MicOff, Video, VideoOff, X } from "lucide-react";
import { BoothBadge, Button, Logo } from "@/components/ui";
import {
  BOOTH, BOOTH_CHAT, EVENT, HALL_BOOTHS, JUDGE_ASSIGNED, JUDGE_CROWD, JUDGE_INITIAL, JUDGE_PRESET, JUDGE_START, RUBRIC,
  VISITOR_CROWD, VISITOR_START, WORLD, project, type HallBooth, type Person,
} from "@/lib/data";

type Mode = "visitor" | "judge";
type Vec = { x: number; y: number };

const SPEED = 220; // world px per second
const HEAR = 110; // proximity radius (half of the 220px talk-range circle)
const FOOT = { dx: 22, dy: 54 }; // feet point inside the 44px avatar box
const TABLES = HALL_BOOTHS.map((b) => ({ x: b.x + 63, y: b.y + 84, w: 110, h: 31 }));

const center = (p: Vec) => ({ x: p.x + 22, y: p.y + 32 });
const feet = (p: Vec) => ({ x: p.x + FOOT.dx, y: p.y + FOOT.dy });
const boothAt = (p: Vec) => {
  const f = feet(p);
  return HALL_BOOTHS.find((b) => f.x >= b.x && f.x <= b.x + BOOTH.w && f.y >= b.y && f.y <= b.y + BOOTH.h) ?? null;
};
// spot in front of a booth's table, where you stand to talk
const standSpot = (b: HallBooth): Vec => ({ x: b.x + BOOTH.w / 2 - 22, y: b.y + 128 });

function blocked(p: Vec) {
  const f = feet(p);
  if (f.x < 14 || f.x > WORLD.floorRight - 14 || f.y < WORLD.wallH + 10 || f.y > WORLD.floorBottom) return true;
  return TABLES.some((t) => f.x + 8 > t.x && f.x - 8 < t.x + t.w && f.y > t.y && f.y - 6 < t.y + t.h);
}

export function Hall({ mode, slug, startBooth }: { mode: Mode; slug: string; startBooth?: string }) {
  const crowd = mode === "judge" ? JUDGE_CROWD : VISITOR_CROWD;
  const initial = useMemo(() => {
    const b = HALL_BOOTHS.find((x) => x.code === startBooth);
    return b ? standSpot(b) : mode === "judge" ? JUDGE_START : VISITOR_START;
  }, [mode, startBooth]);

  const [me, setMe] = useState<Vec>(initial);
  const [moving, setMoving] = useState(false);
  const [flip, setFlip] = useState(false);
  const [scale, setScale] = useState(1);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(false);
  const [waving, setWaving] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const keys = useRef(new Set<string>());
  const target = useRef<Vec | null>(null);
  const meRef = useRef(me);
  const stage = useRef<HTMLDivElement>(null);
  meRef.current = me;

  // fit the 1200x760 hall into the window
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / WORLD.w, window.innerHeight / WORLD.h));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // keyboard
  useEffect(() => {
    const map: Record<string, string> = { ArrowUp: "u", w: "u", W: "u", ArrowDown: "d", s: "d", S: "d", ArrowLeft: "l", a: "l", A: "l", ArrowRight: "r", d: "r", D: "r" };
    const typing = (e: KeyboardEvent) => e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    const down = (e: KeyboardEvent) => {
      if (typing(e)) return;
      if (e.key === "Escape") { setMapOpen(false); setChatOpen(false); }
      const k = map[e.key];
      if (!k) return;
      e.preventDefault();
      keys.current.add(k);
      target.current = null;
    };
    const up = (e: KeyboardEvent) => { const k = map[e.key]; if (k) keys.current.delete(k); };
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  }, []);

  // movement loop: keys or click target, axis-separated collision so you slide along tables
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let stuck = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = keys.current;
      let dx = Number(k.has("r")) - Number(k.has("l"));
      let dy = Number(k.has("d")) - Number(k.has("u"));
      const p = meRef.current;
      if (!dx && !dy && target.current) {
        const tx = target.current.x - p.x, ty = target.current.y - p.y;
        const d = Math.hypot(tx, ty);
        if (d < 3) target.current = null;
        else { dx = tx / d; dy = ty / d; }
      }
      if (dx || dy) {
        const len = Math.hypot(dx, dy);
        const step = SPEED * dt;
        let next = { ...p };
        const nx = { x: p.x + (dx / len) * step, y: p.y };
        if (!blocked(nx)) next = nx;
        const ny = { x: next.x, y: p.y + (dy / len) * step };
        if (!blocked(ny)) next = ny;
        const progressed = Math.hypot(next.x - p.x, next.y - p.y) > 0.01;
        stuck = progressed ? 0 : stuck + dt;
        if (stuck > 0.4) target.current = null;
        if (dx) setFlip(dx < 0);
        setMoving(progressed);
        if (progressed) setMe(next);
      } else setMoving(false);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const walkTo = useCallback((p: Vec) => { target.current = p; }, []);

  const onFloorClick = (e: React.MouseEvent) => {
    const r = stage.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / scale, y = (e.clientY - r.top) / scale;
    walkTo({ x: x - FOOT.dx, y: y - FOOT.dy });
  };

  const current = boothAt(me);
  // you hear people inside the talk range, plus everyone standing in the same booth
  const near = crowd
    .map((p) => ({ p, d: Math.hypot(center(p).x - center(me).x, center(p).y - center(me).y) }))
    .filter((e) => e.d <= HEAR || (current && boothAt(e.p)?.code === current.code))
    .sort((a, b) => a.d - b.d)
    .map((e) => e.p);
  const speaking = near.find((p) => p.presenter && p.presenter === current?.code) ?? near[0];

  // judge state
  const [status, setStatus] = useState(JUDGE_INITIAL);
  const [scores, setScores] = useState<Record<string, number[]>>(JUDGE_PRESET);
  const [notes, setNotes] = useState<Record<string, string>>({ B03: "Clear demo of the sensor mesh. Ask about battery life over a full season." });
  const scoredCount = 7 + Object.keys(status).filter((c) => status[c] === "scored" && JUDGE_INITIAL[c] !== "scored").length;
  const todo = HALL_BOOTHS.filter((b) => status[b.code] !== "scored" && b.code !== current?.code).map((b) => b.code);

  const boothLabel = (b: HallBooth) => {
    if (mode === "judge") {
      if (status[b.code] === "scored") return `✓ ${b.code} · scored`;
      return b.code === current?.code ? `${b.code} · scoring now` : `${b.code} · to score`;
    }
    if (!b.live) return `${b.code} · away`;
    return b.code === current?.code ? `● ${b.code} · presenting` : `● ${b.code} · live`;
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#e9ebf1]">
      <div
        ref={stage}
        className="absolute left-1/2 top-1/2 select-none overflow-hidden bg-[#efe8da]"
        style={{ width: WORLD.w, height: WORLD.h, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {/* floor + wall */}
        <div
          className="absolute inset-0 cursor-pointer"
          style={{ backgroundImage: "repeating-conic-gradient(#e8dfcc 0 25%, transparent 0 50%)", backgroundSize: "64px 64px" }}
          onClick={onFloorClick}
          aria-hidden
        />
        <div className="absolute inset-x-0 top-0 h-[104px] bg-[#3d4a68] shadow-[inset_0_-8px_0_#2e3953]" />
        {[40, 660].map((x) => (
          <div key={x} className="absolute top-[22px] h-[52px] w-[150px] rounded bg-[#bfe0f5] shadow-[inset_0_0_0_4px_#2e3953]" style={{ left: x }} />
        ))}

        {/* booths */}
        {HALL_BOOTHS.map((b) => (
          <div
            key={b.code}
            className="absolute rounded-lg shadow-[inset_0_0_0_4px_rgba(15,26,58,.07)]"
            style={{ left: b.x, top: b.y, width: BOOTH.w, height: BOOTH.h, background: b.carpet }}
            onClick={() => walkTo(standSpot(b))}
          >
            {b.code === current?.code && <div className="pointer-events-none absolute -inset-1 rounded-[11px] border-[3px] border-primary shadow-[0_0_0_6px_rgba(29,92,245,.18)]" />}
            <div className="absolute left-11 top-3 h-[50px] w-[148px] rounded-[5px] bg-[#2e3953] p-1">
              <div className="flex h-full flex-col justify-center rounded-[3px] bg-white px-[7px] py-1">
                <span className="text-[10px] font-extrabold text-primary">{b.code}</span>
                <span className="truncate text-[10px] font-semibold leading-[1.15]">{project(b.code).short}</span>
              </div>
            </div>
            <div className="absolute left-[63px] top-[84px] h-[26px] w-[110px] rounded bg-[#c08a56] shadow-[0_5px_0_#946339]" />
            <div className="absolute left-2.5 top-3 size-[22px] rounded-full bg-[#6cba6f] shadow-[inset_-4px_-4px_0_#4f9a55]" />
            <div className="absolute right-2.5 top-3 size-[22px] rounded-full bg-[#6cba6f] shadow-[inset_-4px_-4px_0_#4f9a55]" />
            <span className="absolute bottom-2.5 left-2.5 whitespace-nowrap rounded-md bg-white/90 px-2 py-[3px] text-[11px] font-bold">{boothLabel(b)}</span>
          </div>
        ))}

        {/* talk range */}
        <div
          className={`pointer-events-none absolute size-[220px] rounded-full border-2 border-dashed ${mode === "judge" ? "border-ink/35 bg-ink/[.06]" : "border-primary/45 bg-primary/[.07]"}`}
          style={{ left: center(me).x - 110, top: center(me).y - 110 }}
        />

        {/* people, sorted so lower ones draw on top */}
        {[...crowd.map((p) => ({ ...p, me: false })), { name: mode === "judge" ? "You · judge" : "You", sprite: mode === "judge" ? 7 : 1, x: me.x, y: me.y, me: true }]
          .sort((a, b) => a.y - b.y)
          .map((p, i) => (
            <Avatar key={p.me ? "me" : p.name} person={p} me={p.me} moving={p.me && moving} flip={p.me && flip} index={i} waving={p.me && waving} speaking={!p.me && p.name === speaking?.name} />
          ))}

        {/* video tiles: people in range */}
        {near.length > 0 && (
          <div className="absolute left-[236px] top-3.5 flex gap-2">
            {near.slice(0, 3).map((p) => (
              <div key={p.name} className={`relative h-[76px] w-[118px] overflow-hidden rounded-[10px] bg-[#dfe7fb] ${p === speaking ? "shadow-[0_0_0_3px_#33c27f]" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/assets/sprite-${p.sprite}.png`} alt="" className="pixel absolute -top-4 left-1/2 h-[124px] max-w-none -translate-x-1/2" />
                <span className="absolute bottom-1.5 left-1.5 rounded-[5px] bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">{p.name}</span>
              </div>
            ))}
          </div>
        )}

        {mode === "judge" && (
          <span className="absolute left-6 top-28 rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white">
            Judge mode · scored {scoredCount} of {JUDGE_ASSIGNED} · closes in 1h 24m
          </span>
        )}

        {/* right panel */}
        <aside className="absolute bottom-[84px] left-[848px] top-4 flex w-[336px] flex-col gap-3 overflow-hidden rounded-[18px] bg-white p-[22px] shadow-float" aria-label="Booth panel">
          {!current ? (
            <EmptyPanel onGo={(b) => walkTo(standSpot(b))} mode={mode} />
          ) : mode === "judge" ? (
            <RubricPanel
              key={current.code}
              booth={current}
              scored={status[current.code] === "scored"}
              values={scores[current.code] ?? [0, 0, 0, 0]}
              note={notes[current.code] ?? ""}
              onValues={(v) => setScores((s) => ({ ...s, [current.code]: v }))}
              onNote={(n) => setNotes((s) => ({ ...s, [current.code]: n }))}
              onSubmit={() => setStatus((s) => ({ ...s, [current.code]: "scored" }))}
              onEdit={() => setStatus((s) => ({ ...s, [current.code]: "todo" }))}
            />
          ) : (
            <BoothPanel key={current.code} booth={current} />
          )}
        </aside>

        {/* toolbar */}
        <div className="absolute inset-x-4 bottom-3.5 flex h-14 items-center gap-2 rounded-[14px] bg-bar pl-4 pr-2.5 text-white">
          <Logo size={18} dark label={EVENT.short} className="mr-3 text-sm" />
          <ToolButton label={mic ? "Mute microphone" : "Unmute microphone"} active={mic} onClick={() => setMic(!mic)}>{mic ? <Mic className="size-[18px]" /> : <MicOff className="size-[18px]" />}</ToolButton>
          <ToolButton label={cam ? "Turn camera off" : "Turn camera on"} active={cam} onClick={() => setCam(!cam)}>{cam ? <Video className="size-[18px]" /> : <VideoOff className="size-[18px]" />}</ToolButton>
          <ToolButton label="Event chat" active={chatOpen} onClick={() => setChatOpen(!chatOpen)}><MessageSquare className="size-[18px]" /></ToolButton>
          <button type="button" onClick={() => { setWaving(true); setTimeout(() => setWaving(false), 1600); }} className="h-10 rounded-[10px] bg-bar-btn px-3 text-[13px] font-semibold hover:bg-[#34405f]">Wave</button>
          <span className="ml-auto text-[13px] text-bar-meta" aria-live="polite">
            {mode === "judge"
              ? `Next to score: ${todo.slice(0, 2).join(" · ") || "all done"}`
              : `${near.length} ${near.length === 1 ? "person" : "people"} can hear you · ${EVENT.inHall} online`}
          </span>
          <button type="button" onClick={() => setMapOpen(true)} className="flex h-10 items-center gap-1.5 rounded-[10px] bg-bar-btn px-3.5 text-[13px] font-semibold hover:bg-[#34405f]"><MapIcon className="size-4" />Map</button>
          <Link href={`/e/${slug}${mode === "judge" ? "?role=judge" : ""}`} className="flex h-10 items-center rounded-[10px] bg-leave px-3.5 text-[13px] font-semibold text-leave-fg hover:bg-[#4a2629]">Leave</Link>
        </div>

        {chatOpen && <EventChat onClose={() => setChatOpen(false)} />}
        {mapOpen && <HallMap mode={mode} status={status} current={current?.code} onClose={() => setMapOpen(false)} onGo={(b) => { walkTo(standSpot(b)); setMapOpen(false); }} />}

        {!chatOpen && <span className="pointer-events-none absolute bottom-[88px] left-6 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-muted">
          Arrow keys / WASD or click to walk
        </span>}
      </div>
    </div>
  );
}

function Avatar({ person, me, moving, flip, index, waving, speaking }: { person: Person; me: boolean; moving: boolean; flip: boolean; index: number; waving: boolean; speaking: boolean }) {
  return (
    <div className="pointer-events-none absolute flex w-11 flex-col items-center gap-0.5" style={{ left: person.x, top: person.y }}>
      {waving && (
        <span className="absolute -top-7 grid size-7 animate-bounce place-items-center rounded-full bg-white text-primary shadow-card" aria-label="Waving"><Hand className="size-4" /></span>
      )}
      <div className="relative flex h-[54px] w-11 items-end justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/sprite-${person.sprite}.png`}
          alt=""
          className={`pixel h-[62px] w-auto max-w-none ${moving ? "walk" : "idle"}`}
          style={{ transform: flip ? "scaleX(-1)" : undefined, animationDelay: `${-index * 0.37}s` }}
        />
      </div>
      <span className={`whitespace-nowrap rounded-[5px] px-1.5 py-px text-[10px] font-bold text-white ${me ? "bg-primary" : "bg-ink/80"} ${speaking ? "ring-2 ring-speak" : ""}`}>{person.name}</span>
    </div>
  );
}

function ToolButton({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} aria-pressed={active} onClick={onClick} className={`grid size-10 place-items-center rounded-[10px] ${active ? "bg-primary hover:bg-primary-hover" : "bg-bar-btn hover:bg-[#34405f]"}`}>
      {children}
    </button>
  );
}

function PanelHead({ left, right }: { left: ReactNode; right: ReactNode }) {
  return <div className="flex items-center justify-between text-xs font-semibold">{left}{right}</div>;
}

function BoothPanel({ booth }: { booth: HallBooth }) {
  const p = project(booth.code);
  const [chat, setChat] = useState(BOOTH_CHAT[booth.code] ?? []);
  const [asking, setAsking] = useState(false);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (asking) input.current?.focus(); }, [asking]);

  return (
    <>
      <PanelHead left={<BoothBadge>Booth {booth.code} · you&rsquo;re here</BoothBadge>} right={p.live ? <span className="text-live">● Presenting</span> : <span className="text-faint">{p.status}</span>} />
      <h2 className="text-[21px] font-extrabold leading-[1.15] tracking-[-0.02em]">{p.title}</h2>
      <div className="text-[13px] text-muted">{p.dept} · {p.supervisor}</div>
      <p className="text-sm leading-normal text-ink-2">{p.abstract}</p>
      <div className="flex min-h-[90px] flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-input bg-subtle text-sm font-semibold text-muted">
        <ImageIcon className="size-5" aria-hidden />Poster preview
      </div>
      <div className="flex flex-col gap-1.5 rounded-xl bg-app px-3 py-2.5 text-[13px]">
        <span className="font-bold">Booth chat</span>
        <div className="flex max-h-24 flex-col gap-1.5 overflow-y-auto">
          {chat.length ? chat.map((m, i) => <span key={i}><b>{m.who}:</b> {m.text}</span>) : <span className="text-muted">No messages yet.</span>}
        </div>
        {asking && (
          <form className="mt-1 flex gap-1.5" onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; setChat([...chat, { who: "You", text: draft.trim() }]); setDraft(""); setAsking(false); }}>
            <input ref={input} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type your question" aria-label="Your question" className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-white px-2.5 text-[13px] focus:border-primary focus:outline-none" />
            <Button type="submit" className="h-9 rounded-lg px-3 text-[13px]">Send</Button>
          </form>
        )}
      </div>
      <div className="flex gap-2">
        <Button className="h-[42px] flex-1 text-sm" onClick={() => setAsking(true)}>Ask a question</Button>
        <Button variant="secondary" aria-pressed={saved} className="h-[42px] px-4 text-sm" onClick={() => setSaved(!saved)}>{saved ? "Saved ✓" : "Save"}</Button>
      </div>
    </>
  );
}

function RubricPanel({ booth, scored, values, note, onValues, onNote, onSubmit, onEdit }: {
  booth: HallBooth; scored: boolean; values: number[]; note: string;
  onValues: (v: number[]) => void; onNote: (n: string) => void; onSubmit: () => void; onEdit: () => void;
}) {
  const p = project(booth.code);
  const complete = values.every((v) => v > 0);
  const total = complete ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : "—";
  return (
    <>
      <PanelHead left={<BoothBadge>Booth {booth.code}</BoothBadge>} right={<span className={scored ? "text-success" : "text-muted"}>{scored ? "✓ Scored" : "Rubric · /10"}</span>} />
      <h2 className="text-[21px] font-extrabold leading-[1.15] tracking-[-0.02em]">{p.title}</h2>
      {RUBRIC.map((name, i) => (
        <div key={name} className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[13px]"><span className="font-semibold">{name}</span><span className="font-bold text-primary">{values[i] || "–"}</span></div>
          <div className="grid grid-cols-10 gap-[3px]" role="radiogroup" aria-label={`${name} score`}>
            {Array.from({ length: 10 }, (_, c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={values[i] === c + 1}
                aria-label={`${c + 1} of 10`}
                disabled={scored}
                onClick={() => onValues(values.map((v, j) => (j === i ? c + 1 : v)))}
                className={`h-2.5 rounded-[3px] transition-colors ${c < values[i] ? "bg-primary" : "bg-subtle"} ${scored ? "" : "hover:outline hover:outline-1 hover:outline-primary-light"}`}
              />
            ))}
          </div>
        </div>
      ))}
      <label className="flex flex-1 flex-col gap-1.5">
        <span className="text-[13px] font-semibold">Private note</span>
        <textarea value={note} onChange={(e) => onNote(e.target.value)} readOnly={scored} placeholder="Only you can see this" className="min-h-16 flex-1 resize-none rounded-xl border border-input p-3 text-[13px] leading-normal text-ink-2 focus:border-primary focus:outline-none" />
      </label>
      <div className="flex items-center justify-between border-t border-subtle pt-3">
        <span className="text-[13px] text-muted">Total <b className="text-xl text-ink">{total}</b></span>
        {scored ? (
          <Button variant="secondary" className="h-[42px] px-5 text-sm" onClick={onEdit}>Edit score</Button>
        ) : (
          <Button className="h-[42px] px-5 text-sm" disabled={!complete} onClick={onSubmit}>Submit score</Button>
        )}
      </div>
    </>
  );
}

function EmptyPanel({ mode, onGo }: { mode: Mode; onGo: (b: HallBooth) => void }) {
  return (
    <>
      <PanelHead left={<BoothBadge>Hall · {HALL_BOOTHS.length} booths nearby</BoothBadge>} right={<span className="text-muted">{EVENT.inHall} online</span>} />
      <h2 className="text-[21px] font-extrabold leading-[1.15] tracking-[-0.02em]">Walk onto a booth carpet to open it</h2>
      <p className="text-sm leading-normal text-ink-2">{mode === "judge" ? "Your rubric opens when you step into an assigned booth." : "You hear people inside the dashed circle. Presenters at the booth you stand in come through clearly."}</p>
      <ul className="flex flex-col gap-1.5">
        {HALL_BOOTHS.map((b) => (
          <li key={b.code}>
            <button type="button" onClick={() => onGo(b)} className="flex w-full items-center gap-3 rounded-xl border border-line px-3 py-2 text-left text-[13px] hover:border-primary-light">
              <span className="font-extrabold text-primary">{b.code}</span>
              <span className="flex-1 truncate font-semibold">{project(b.code).short}</span>
              <span className="text-faint">Go →</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function EventChat({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState([
    { who: "Staff · Nadia", text: "Judging closes at 16:00. Results go out at 16:30." },
    { who: "Ravi", text: "Is A07 doing another demo?" },
  ]);
  const [draft, setDraft] = useState("");
  return (
    <div className="absolute bottom-[84px] left-4 flex w-[300px] flex-col gap-2 rounded-[18px] bg-white p-4 shadow-float" role="dialog" aria-label="Event chat">
      <div className="flex items-center justify-between"><span className="text-sm font-bold">Event chat</span><button type="button" aria-label="Close chat" onClick={onClose} className="rounded-md p-1 text-muted hover:bg-subtle"><X className="size-4" /></button></div>
      <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto text-[13px]">{msgs.map((m, i) => <span key={i}><b>{m.who}:</b> {m.text}</span>)}</div>
      <form className="flex gap-1.5" onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; setMsgs([...msgs, { who: "You", text: draft.trim() }]); setDraft(""); }}>
        <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message everyone" aria-label="Message" className="h-9 min-w-0 flex-1 rounded-lg border border-input px-2.5 text-[13px] focus:border-primary focus:outline-none" />
        <Button type="submit" className="h-9 rounded-lg px-3 text-[13px]">Send</Button>
      </form>
    </div>
  );
}

function HallMap({ mode, status, current, onClose, onGo }: { mode: Mode; status: Record<string, string>; current?: string; onClose: () => void; onGo: (b: HallBooth) => void }) {
  const s = 0.32;
  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-ink/40" onClick={onClose}>
      <div role="dialog" aria-label="Hall map" className="flex w-[560px] flex-col gap-4 rounded-[18px] bg-white p-6 shadow-float" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 className="text-xl font-extrabold tracking-[-0.02em]">Hall map</h2><button type="button" aria-label="Close map" onClick={onClose} className="rounded-md p-1 text-muted hover:bg-subtle"><X className="size-5" /></button></div>
        <div className="relative mx-auto overflow-hidden rounded-xl bg-[#efe8da]" style={{ width: WORLD.floorRight * s + 20, height: (WORLD.floorBottom - 60) * s }}>
          {HALL_BOOTHS.map((b) => (
            <button key={b.code} type="button" onClick={() => onGo(b)} className={`absolute rounded text-[10px] font-extrabold ${b.code === current ? "ring-2 ring-primary" : ""}`} style={{ left: b.x * s, top: (b.y - 110) * s, width: BOOTH.w * s, height: BOOTH.h * s, background: b.carpet }}>
              {b.code}
            </button>
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-1.5">
          {HALL_BOOTHS.map((b) => (
            <li key={b.code}>
              <button type="button" onClick={() => onGo(b)} className="flex w-full items-center gap-2 rounded-xl border border-line px-3 py-2 text-left text-[13px] hover:border-primary-light">
                <span className="font-extrabold text-primary">{b.code}</span>
                <span className="flex-1 truncate font-semibold">{project(b.code).short}</span>
                <span className="text-faint">{mode === "judge" ? (status[b.code] === "scored" ? "✓" : "to score") : b.live ? "live" : "away"}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
