"use client";

import { cn } from "@/lib/utils";
import { booths, toneClass, toneOf, type Booth } from "@/lib/mock";

// Stylised top-down hall: a stand-in for the Phaser world in this mockup.
const fillers = ["07", "08", "09", "10", "11", "12"].map((no) => ({ no, title: `Booth ${no}`, category: "Web", status: "empty" as const, people: 0 }));
const slots = [...booths.slice(0, 4), fillers[0], booths[4], fillers[1], booths[5], fillers[2], fillers[3], fillers[4], fillers[5]];

const crowd = [
  { x: 14, y: 28, n: "Mint" }, { x: 19, y: 34, n: "Book" }, { x: 37, y: 26, n: "Ploy" }, { x: 41, y: 33, n: "Nat" },
  { x: 33, y: 36, n: "Jay" }, { x: 63, y: 30, n: "Fah" }, { x: 86, y: 31, n: "Beam" }, { x: 60, y: 62, n: "Kla" },
  { x: 47, y: 52, n: "Ice" }, { x: 22, y: 64, n: "Oat" }, { x: 75, y: 80, n: "Tong" }, { x: 40, y: 82, n: "Pim" },
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
        {slots.map((b) => {
          const real = "id" in b ? (b as Booth) : null;
          const selected = real && real.id === selectedId;
          const tone = toneOf(b.category);
          const body = (
            <>
              <span className={cn("absolute inset-x-[12%] top-0 h-[16%] rounded-b-lg", real ? toneClass[tone] : "bg-[#DDE0EE]")} aria-hidden="true" />
              {real && <span className="mt-[18%] line-clamp-2 text-[clamp(8px,0.9vw,12px)] font-semibold leading-tight text-foreground">{real.title}</span>}
              <span className="mt-auto flex w-full items-end justify-between gap-1">
                <span className="text-[11px] font-bold text-muted-foreground">{b.no}</span>
                {b.status === "presenting" && <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">LIVE</span>}
                {b.people > 0 && b.status !== "presenting" && <span className="text-[10px] font-semibold text-muted-foreground">{b.people}</span>}
              </span>
            </>
          );
          const cls = cn(
            "relative flex aspect-[3/2] flex-col rounded-2xl border-2 bg-card p-2 text-left transition",
            real ? "border-transparent shadow-[0_2px_0_#D9DCEF]" : "border-dashed border-[#D9DCEF] bg-card/60",
            selected && "border-primary ring-4 ring-primary/20",
            interactive && real && "hover:-translate-y-0.5 hover:shadow-md",
          );
          return interactive && real ? (
            <button key={b.no} type="button" onClick={() => onSelect?.(real)} className={cls} aria-label={`Booth ${b.no}: ${b.title}`} aria-pressed={!!selected}>
              {body}
            </button>
          ) : (
            <div key={b.no} className={cls} aria-hidden={!interactive}>{body}</div>
          );
        })}
      </div>

      {crowd.map((p) => (
        <span key={p.n} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-hidden="true">
          <span className="block size-5 rounded-full border-2 border-white bg-[#9AA4F5] shadow-sm" />
        </span>
      ))}

      {showMe && (
        <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "26%", top: "35%" }} aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/40 bg-primary/5" />
          <span className="relative flex flex-col items-center">
            <span className="mb-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold text-background">You</span>
            <span className="block size-6 rounded-full border-[3px] border-white bg-primary shadow-md" />
          </span>
        </span>
      )}
    </div>
  );
}
