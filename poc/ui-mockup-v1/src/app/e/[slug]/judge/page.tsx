"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock, Footprints } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Chip, StatusBadge } from "@/components/brand";
import { AppHeader } from "@/components/shells";
import { booths, event, rubric, toneOf } from "@/lib/mock";
import { cn } from "@/lib/utils";

type Sheet = "Not started" | "Draft" | "Submitted";
const sheets: Sheet[] = ["Submitted", "Draft", "Not started", "Submitted", "Draft", "Not started"];
const sheetStyle: Record<Sheet, string> = {
  Submitted: "bg-mint text-mint-ink",
  Draft: "bg-butter text-butter-ink",
  "Not started": "bg-muted text-muted-foreground",
};

// Judge's assigned projects · score here or from the booth panel in the hall (same API)
export default function JudgeList() {
  const [open, setOpen] = useState(1);
  const [scores, setScores] = useState<number[]>([7, 8, 0, 0]);
  const b = booths[open];
  const submitted = sheets.filter((s) => s === "Submitted").length;
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/home" className="text-sm font-semibold text-muted-foreground hover:text-foreground">← My events</Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Your judging list</h1>
            <p className="mt-1 text-muted-foreground">{event.name} · {booths.length} projects assigned to you</p>
          </div>
          <Link href={`/e/${event.slug}/hall`} className={cn(buttonVariants(), "h-11 rounded-xl px-5 font-semibold")}>Enter the hall <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-card px-6 py-4 ring-1 ring-border/70">
          <span className="font-semibold">{submitted} of {booths.length} submitted</span>
          <Progress value={(submitted / booths.length) * 100} className="max-w-xs flex-1" aria-label={`${submitted} of ${booths.length} submitted`} />
          <span className="ml-auto inline-flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4" aria-hidden="true" />Scoring closes when the event ends at {event.endsAt}</span>
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <ul className="flex min-w-0 flex-[2_1_480px] flex-col gap-3">
            {booths.map((x, i) => (
              <li key={x.id}>
                <button type="button" onClick={() => setOpen(i)} aria-pressed={open === i} className={cn("flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-card px-5 py-4 text-left ring-1 ring-border/70", open === i && "ring-2 ring-primary")}>
                  <span className="w-8 text-sm font-bold text-muted-foreground">{x.no}</span>
                  <span className="min-w-0 flex-[999_1_220px]"><span className="block font-semibold">{x.title}</span><Chip tone={toneOf(x.category)} className="mt-1">{x.category}</Chip></span>
                  <StatusBadge status={x.status} people={x.people} />
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", sheetStyle[sheets[i]])}>{sheets[i]}</span>
                </button>
              </li>
            ))}
          </ul>

          <form className="flex min-w-0 flex-[1_1_340px] flex-col gap-5 rounded-3xl bg-card p-6 ring-1 ring-border/70 lg:sticky lg:top-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <div className="text-sm font-bold text-muted-foreground">Booth {b.no}</div>
              <h2 className="text-lg font-bold leading-snug">{b.title}</h2>
            </div>
            <Link href={`/e/${event.slug}/hall`} className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-xl font-semibold")}><Footprints className="size-4" aria-hidden="true" />Go to the booth</Link>
            {rubric.map((r, i) => (
              <div key={r.k} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`j-${i}`} className="font-semibold">{r.k} <span className="font-normal text-muted-foreground">· {r.w}%</span></Label>
                  <span className="font-bold">{scores[i] || "–"}/{r.max}</span>
                </div>
                <input id={`j-${i}`} type="range" min={0} max={r.max} value={scores[i]} onChange={(e) => setScores(scores.map((s, j) => (j === i ? Number(e.target.value) : s)))} className="h-2 w-full accent-[var(--primary)]" />
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <Label htmlFor="jc" className="font-semibold">Comment for the team</Label>
              <Textarea id="jc" rows={3} className="rounded-xl" placeholder="Sent after results are announced" />
            </div>
            <Button type="submit" disabled={scores.some((s) => s === 0)} className="h-11 rounded-xl font-semibold">Submit score</Button>
            <p className="text-xs text-muted-foreground">Saved as a draft while you edit. When the event ends, complete drafts count; incomplete ones don&rsquo;t.</p>
          </form>
        </div>
      </main>
    </div>
  );
}
