"use client";

import Link from "next/link";
import { useState } from "react";
import { Hand, LogOut, MessageCircle, Mic, MicOff, MonitorPlay, Send, Star, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HallMap } from "@/components/hall-map";
import { AvatarStack, Chip, Initials, Logo, StatusBadge } from "@/components/brand";
import { booths, event, toneOf, type Booth } from "@/lib/mock";
import { cn } from "@/lib/utils";

const rubric = [
  { k: "Problem & value", w: 30 },
  { k: "Technical quality", w: 30 },
  { k: "Demo", w: 25 },
  { k: "Presentation", w: 15 },
];

const chat = [
  { who: "Staff · Nat", text: "Session 2 starts at 1:00 PM. Booths 21–39 will present then.", staff: true },
  { who: "Beam", text: "Is booth 05 doing a live demo?" },
  { who: "Fah", text: "Yes! Come in, we're running it now" },
];

const nearby = [
  { n: "Mint", talking: true }, { n: "Book", talking: false }, { n: "Jay", talking: false },
];

type Tab = "booth" | "score" | "chat";

export default function Hall() {
  const [booth, setBooth] = useState<Booth | null>(booths[1]);
  const [tab, setTab] = useState<Tab>("booth");
  const [mic, setMic] = useState(true);
  const [scores, setScores] = useState<number[]>([8, 7, 9, 8]);
  const total = Math.round(rubric.reduce((s, r, i) => s + (scores[i] / 10) * r.w, 0));

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-2.5">
        <div className="flex items-center gap-4">
          <Logo href="/home" />
          <span className="hidden h-6 w-px bg-border sm:block" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold">{event.name}</div>
            <div className="text-xs text-muted-foreground">Session 1 · Booths 01–20 · until 12:00</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold"><Users className="size-4" aria-hidden="true" />137 in the hall</span>
          <Chip tone="butter">Judge</Chip>
          <Link href="/home" className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><LogOut className="size-4" aria-hidden="true" />Leave</Link>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1 overflow-auto p-5">
          <HallMap interactive showMe selectedId={booth?.id} onSelect={(b) => { setBooth(b); setTab("booth"); }} className="mx-auto max-w-5xl" />

          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-2xl bg-foreground p-2 text-background shadow-xl">
              <button type="button" onClick={() => setMic(!mic)} aria-pressed={!mic} aria-label={mic ? "Mute microphone" : "Unmute microphone"} className={cn("inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold", mic ? "bg-white/10 hover:bg-white/20" : "bg-destructive text-white")}>
                {mic ? <Mic className="size-5" aria-hidden="true" /> : <MicOff className="size-5" aria-hidden="true" />}{mic ? "Mic on" : "Muted"}
              </button>
              <span className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2" aria-label="People you can hear">
                {nearby.map((p) => (
                  <span key={p.n} className={cn("rounded-full", p.talking && "ring-2 ring-mint ring-offset-2 ring-offset-foreground")}><Initials name={p.n} size="sm" className="ring-0" /></span>
                ))}
                <span className="pl-1 text-xs text-background/80">can hear you</span>
              </span>
              <button type="button" aria-label="Raise hand" className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"><Hand className="size-5" /></button>
              <button type="button" onClick={() => { setTab("chat"); if (!booth) setBooth(booths[1]); }} aria-label="Open chat" className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"><MessageCircle className="size-5" /></button>
            </div>
          </div>
        </main>

        {booth && (
          <aside className="flex w-[400px] max-w-full shrink-0 flex-col border-l border-border bg-card" aria-label="Booth panel">
            <div className="flex items-start justify-between gap-3 px-5 pt-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2"><span className="text-sm font-bold text-muted-foreground">Booth {booth.no}</span><StatusBadge status={booth.status} /></div>
                <h2 className="mt-1 text-lg font-bold leading-snug">{booth.title}</h2>
              </div>
              <button type="button" onClick={() => setBooth(null)} aria-label="Close panel" className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"><X className="size-5" /></button>
            </div>
            <div className="mx-5 mt-4 flex gap-1 rounded-xl bg-muted p-1" role="tablist">
              {(["booth", "score", "chat"] as Tab[]).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("h-9 flex-1 rounded-lg text-sm font-semibold capitalize", tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>
                  {t === "score" ? "Score" : t === "chat" ? "Chat" : "Booth"}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              {tab === "booth" && (
                <div className="flex flex-col gap-5">
                  <figure className="overflow-hidden rounded-2xl bg-foreground text-background">
                    <div className="flex aspect-video flex-col justify-between bg-[#2A3290] p-4">
                      <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-bold"><MonitorPlay className="size-3.5" aria-hidden="true" />Mint is sharing</span>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">Slide 4 of 12</div>
                        <div className="text-base font-bold">How the recommender ranks electives</div>
                      </div>
                    </div>
                    <figcaption className="px-4 py-2 text-xs text-background/80">You see this because you&rsquo;re inside the booth.</figcaption>
                  </figure>
                  <p className="text-[15px] text-muted-foreground">{booth.summary}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Chip tone={toneOf(booth.category)}>{booth.category}</Chip>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground"><AvatarStack names={booth.members} />{booth.team}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-semibold">Open poster</Button>
                    <Button variant="outline" className="h-11 rounded-xl font-semibold">Demo video</Button>
                  </div>
                  <div className="flex flex-col gap-2 rounded-2xl bg-muted p-4">
                    <Label htmlFor="fb" className="font-semibold">Leave feedback for the team</Label>
                    <Textarea id="fb" rows={3} placeholder="What did you like? Any questions?" className="rounded-xl bg-card" />
                    <Button className="h-10 self-end rounded-xl px-4 font-semibold">Send</Button>
                  </div>
                </div>
              )}

              {tab === "score" && (
                <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex items-center justify-between rounded-2xl bg-butter px-4 py-3 text-butter-ink">
                    <span className="text-sm font-semibold">Your score · draft</span>
                    <span className="text-2xl font-bold">{total}<span className="text-sm font-semibold">/100</span></span>
                  </div>
                  {rubric.map((r, i) => (
                    <div key={r.k} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`s-${i}`} className="font-semibold">{r.k} <span className="font-normal text-muted-foreground">· {r.w}%</span></Label>
                        <span className="w-10 text-right font-bold">{scores[i]}/10</span>
                      </div>
                      <input id={`s-${i}`} type="range" min={0} max={10} value={scores[i]} onChange={(e) => setScores(scores.map((s, j) => (j === i ? Number(e.target.value) : s)))} className="h-2 w-full accent-[var(--primary)]" />
                    </div>
                  ))}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cm" className="font-semibold">Comment for the team</Label>
                    <Textarea id="cm" rows={3} placeholder="Shared with the team after results are published" className="rounded-xl" />
                  </div>
                  <Button type="submit" className="h-11 rounded-xl font-semibold"><Star className="size-4" aria-hidden="true" />Submit score</Button>
                  <p className="text-center text-xs text-muted-foreground">You&rsquo;ve scored 7 of 12 assigned booths</p>
                </form>
              )}

              {tab === "chat" && (
                <div className="flex h-full flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Event chat · not saved after the event</p>
                  <ul className="flex flex-col gap-3">
                    {chat.map((m, i) => (
                      <li key={i} className={cn("rounded-2xl px-4 py-3 text-[15px]", m.staff ? "bg-secondary text-secondary-foreground" : "bg-muted")}>
                        <div className="text-xs font-bold">{m.who}</div>{m.text}
                      </li>
                    ))}
                  </ul>
                  <form className="mt-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <Input aria-label="Message" placeholder="Say something to everyone" className="h-11 rounded-xl" />
                    <Button type="submit" aria-label="Send" className="size-11 rounded-xl"><Send className="size-4" /></Button>
                  </form>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
