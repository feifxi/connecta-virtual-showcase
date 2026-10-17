"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Footprints, Pause } from "lucide-react";
import { Actor } from "@/components/actor";
import { ME, characters } from "@/lib/mock";
import { cn } from "@/lib/utils";

const KEY = "connecta-avatar"; // the hall reads this to pick your character

// Character lobby (from poc/TestUI): big preview that turns and walks + a grid of 14 characters
export function CharacterPicker({ name = ME.short }: { name?: string }) {
  const [pick, setPick] = useState(ME.avatar);
  const [dir, setDir] = useState(0);
  const [walk, setWalk] = useState(true);
  useEffect(() => {
    try { const v = localStorage.getItem(KEY); if (v !== null) setPick(Number(v) || 0); } catch {}
  }, []);
  const choose = (i: number) => {
    setPick(i);
    try { localStorage.setItem(KEY, String(i)); } catch {}
  };
  const turn = (d: number) => setDir((dir + d + 4) % 4);
  const ctl = "inline-flex size-9 items-center justify-center rounded-xl bg-card text-foreground shadow-sm ring-1 ring-border hover:bg-muted";
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-2 text-sm font-semibold">Your character</legend>
      <div className="relative flex h-56 items-end justify-center overflow-hidden rounded-3xl bg-sky/60 [background-image:radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:20px_20px]">
        <span className="absolute bottom-6 h-10 w-48 rounded-[50%] bg-primary/15" aria-hidden="true" />
        <Actor index={pick} direction={[0, 2, 1, 3][dir]} walk={walk} className="relative bottom-6 size-36" name={name} you />
        <div className="absolute right-3 top-3 flex gap-1.5">
          <button type="button" className={ctl} aria-label="Turn left" onClick={() => turn(-1)}><ArrowLeft className="size-4" /></button>
          <button type="button" className={ctl} aria-label="Turn right" onClick={() => turn(1)}><ArrowRight className="size-4" /></button>
          <button type="button" className={ctl} aria-label={walk ? "Stand still" : "Walk"} aria-pressed={walk} onClick={() => setWalk(!walk)}>{walk ? <Pause className="size-4" /> : <Footprints className="size-4" />}</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2" role="radiogroup" aria-label="Pick your character">
        {characters.map((c, i) => (
          <button
            key={c.id} type="button" role="radio" aria-checked={pick === i} aria-label={`Character ${i + 1}`} onClick={() => choose(i)}
            className={cn("flex aspect-square items-center justify-center rounded-2xl bg-muted ring-2 ring-transparent transition hover:-translate-y-0.5", pick === i && "bg-secondary ring-primary")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.portrait} alt="" width={80} height={80} className="size-[80%] [image-rendering:pixelated]" />
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">This is you in every hall. Change it any time from your profile.</p>
    </fieldset>
  );
}
