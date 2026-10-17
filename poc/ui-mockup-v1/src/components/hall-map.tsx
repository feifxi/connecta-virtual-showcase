"use client";

import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { Actor } from "@/components/actor";
import { ME, avatarFor, booths, toneClass, toneOf, type Booth } from "@/lib/mock";

// Stylised top-down hall: a stand-in for the Phaser world in this mockup.
// Booths are placed from the project list; slots without a project become decoration, never empty tables.
type Slot = Booth | { no: string; deco: true };
const slots: Slot[] = [...booths.slice(0, 4), { no: "07", deco: true }, booths[4], { no: "08", deco: true }, booths[5], { no: "09", deco: true }, { no: "10", deco: true }, { no: "11", deco: true }, { no: "12", deco: true }];

// x, y = feet position in % · they stand in the aisles between booth rows · d = sheet row (0 down · 1 up · 2 left · 3 right) · w = walking
const crowd = [
  { x: 9, y: 41, n: "Mint", d: 1 }, { x: 16, y: 42, n: "Book", d: 1 }, { x: 37, y: 41, n: "Nadia", d: 1 }, { x: 44, y: 42, n: "Nat", d: 2 },
  { x: 55, y: 41, n: "Jay", d: 3, w: true }, { x: 81, y: 41, n: "Fah", d: 1 }, { x: 89, y: 42, n: "Beam", d: 1 },
  { x: 22, y: 82, n: "Kla", d: 3, w: true }, { x: 48, y: 81, n: "Ice", d: 2, w: true }, { x: 64, y: 82, n: "Oat", d: 0 }, { x: 72, y: 82, n: "Tong", d: 2 }, { x: 91, y: 81, n: "Pim", d: 0, w: true },
];

type Props = {
  interactive?: boolean;
  selectedId?: string | null;
  onSelect?: (b: Booth) => void;
  showMe?: boolean;
  className?: string;
};

export function HallMap({ interactive = false, selectedId, onSelect, showMe = false, className }: Props) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-[#EEF0FA] p-[4%] [background-image:radial-gradient(#D9DCEF_1.2px,transparent_1.2px)] [background-size:22px_22px]", className)}>
      <div className="grid grid-cols-4 gap-x-[6%] gap-y-[clamp(14px,3.2vw,44px)]">
        {slots.map((s) => {
          if ("deco" in s)
            return (
              <div key={s.no} className="flex aspect-[3/2] items-center justify-center gap-1 rounded-2xl text-mint-ink/50" aria-hidden="true">
                <Sprout className="size-6" /><Sprout className="size-4" />
              </div>
            );
          const b = s;
          const selected = b.id === selectedId;
          const body = (
            <>
              <span className={cn("absolute inset-x-[12%] top-0 h-[16%] rounded-b-lg", toneClass[toneOf(b.category)])} aria-hidden="true" />
              <span className="mt-[18%] line-clamp-2 text-[clamp(8px,0.9vw,12px)] font-semibold leading-tight text-foreground">{b.title}</span>
              <span className="mt-auto flex w-full items-end justify-between gap-1">
                <span className="text-[11px] font-bold text-muted-foreground">{b.no}</span>
                <span className="flex items-center gap-1">
                  {b.status === "live" && <span className="whitespace-nowrap rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">● Live</span>}
                  {b.people > 0 && <span className="hidden whitespace-nowrap text-[10px] font-semibold text-muted-foreground xl:inline">👥 {b.people}</span>}
                </span>
              </span>
            </>
          );
          const cls = cn(
            "relative flex aspect-[3/2] flex-col rounded-2xl border-2 border-transparent bg-card p-2 text-left shadow-[0_2px_0_#D9DCEF] transition",
            selected && "border-primary ring-4 ring-primary/20",
            interactive && "hover:-translate-y-0.5 hover:shadow-md",
          );
          return interactive ? (
            <button key={b.no} type="button" onClick={() => onSelect?.(b)} className={cls} aria-label={`Booth ${b.no}: ${b.title}`} aria-pressed={selected}>
              {body}
            </button>
          ) : (
            <div key={b.no} className={cls} aria-hidden={!interactive}>{body}</div>
          );
        })}
      </div>

      {crowd.map((p) => (
        <span key={p.n} className="pointer-events-none absolute -translate-x-1/2 -translate-y-full" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-hidden="true">
          <Actor index={avatarFor(p.n)} direction={p.d} walk={p.w} className="block size-[clamp(24px,2.8vw,38px)]" />
        </span>
      ))}

      {showMe && (
        <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "27%", top: "38%" }} aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/40 bg-primary/5" />
          <span className="relative flex flex-col items-center">
            <span className="mb-0.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">You</span>
            <Actor index={ME.avatar} direction={3} walk className="size-[clamp(26px,3vw,42px)]" />
          </span>
        </span>
      )}
    </div>
  );
}
