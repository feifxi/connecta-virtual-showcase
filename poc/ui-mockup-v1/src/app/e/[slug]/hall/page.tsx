"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Bot, Camera, Check, DoorClosed, FileImage, Heart, LogOut, Megaphone, MessageCircle, Mic, MicOff, MonitorPlay, MonitorUp, Pencil,
  Minus, Plus, Search, Send, ShieldCheck, UserRoundPlus, Users, Video, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { HallControl } from "@/components/hall-game";
import type { BoothInfo, Hearing } from "@/game/HallScene";
import { AvatarStack, Chip, Initials, Logo, RoleChip, StatusBadge } from "@/components/brand";
import { ME, booths, categories, event, hallProjects, rubric, toneClass, toneOf, type Booth, type Role } from "@/lib/mock";
import { cn } from "@/lib/utils";

// Phaser hall (map + booth placement from poc/demo-app · 2D characters from poc/TestUI) · ?as=Presenter|Judge|Admin starts in that role
const HallGame = dynamic(() => import("@/components/hall-game"), { ssr: false });
const zones = categories.map((c) => ({ category: c.name, tone: c.tone }));
// every booth in the hall as a Booth (the 6 sample booths keep their full details)
const hallBooths: Booth[] = hallProjects.map((h) => booths.find((b) => b.no === h.no) ?? {
  id: `booth-${h.no}`, no: h.no, title: h.title, team: `Team ${h.no}`, members: [h.presenter], category: h.category, status: h.live ? "live" : "idle", people: 0,
  summary: "A capstone project from this year's cohort. Step in and ask the team how it works.", tags: [], visits: 0, passedBy: 0, avgMinutes: 0, feedback: 0, votes: 0, contacts: 0, scored: 0, score: 0, ready: true,
});
const ROLES: Role[] = ["Visitor", "Presenter", "Judge", "Admin"];
type Tab = "booth" | "feedback" | "score" | "people";
const roleOf = (label: string): Role => (ROLES.find((r) => label.endsWith(r)) ?? "Visitor");
const chat = {
  nearby: [{ who: "Beam", text: "Is booth 05 doing a live demo?" }, { who: "Fah", text: "Yes! Come in, we're running it now" }],
  everyone: [{ who: "Admin · Nat", text: "Judging closes at 3:30 PM. The event ends at 4:00 PM.", admin: true }, { who: "Oat", text: "Booth 04 is amazing, go see it" }],
};

export default function Hall() {
  const [as, setAs] = useState<Role>("Visitor");
  const [booth, setBooth] = useState<Booth | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [avatar, setAvatar] = useState<number | null>(null);
  const [hearing, setHearing] = useState<Hearing>({ people: [], inBooth: null });
  const [zoom, setZoom] = useState(1.3);
  const control = useRef<HallControl | null>(null);
  const [tab, setTab] = useState<Tab>("booth");
  const [mic, setMic] = useState(false); // muted on entry
  const [chatOpen, setChatOpen] = useState<"nearby" | "everyone" | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [voted, setVoted] = useState(false);
  const [contact, setContact] = useState<"closed" | "open" | "sent">("closed");
  const [scores, setScores] = useState<number[]>([8, 7, 9, 0]);
  const filled = scores.every((s) => s > 0);
  const total = Math.round(rubric.reduce((sum, r, i) => sum + (scores[i] / r.max) * r.w, 0));
  const isPresenterHere = as === "Presenter" && booth?.id === booths[0].id;
  const canMute = isPresenterHere || as === "Admin";
  const tabs: Tab[] = ["booth", ...(as === "Visitor" || as === "Admin" ? (["feedback"] as Tab[]) : []), ...(as === "Judge" ? (["score"] as Tab[]) : []), "people"];

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("as");
    if (ROLES.includes(r as Role)) setAs(r as Role);
    let a = ME.avatar;
    try { const v = localStorage.getItem("connecta-avatar"); if (v !== null) a = Number(v) || 0; } catch {}
    setAvatar(a);
  }, []);
  const enter = (info: BoothInfo) => {
    setBooth(hallBooths.find((b) => b.no === info.no) ?? null);
    setPanelOpen(true); setTab("booth"); setContact("closed"); setVoted(false);
  };
  const walkTo = (b: Booth) => control.current?.goTo(b.no);
  const zoomBy = (d: number) => { const z = Math.min(2, Math.max(0.7, Math.round((zoom + d) * 10) / 10)); setZoom(z); control.current?.zoom(z); };
  // the presenter stands in the booth; the rest comes from who you can hear in the hall
  const inBooth = booth ? [{ n: booth.members[0], role: "Presenter" as Role, talking: booth.status === "live" }, ...hearing.people.filter((h) => !h.startsWith(booth.members[0])).map((h) => ({ n: h.split(" · ")[0], role: roleOf(h), talking: false }))] : [];
  const showPanel = booth && panelOpen;

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-2.5">
        <div className="flex items-center gap-4">
          <Logo href="/home" />
          <span className="hidden h-6 w-px bg-border sm:block" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold">{event.name}</div>
            <div className="text-xs text-muted-foreground">Live · ends {event.endsAt}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl bg-muted p-1 text-xs" role="group" aria-label="Mockup: preview as role">
            <span className="px-1.5 font-semibold text-muted-foreground">Preview as</span>
            {(["Visitor", "Presenter", "Judge", "Admin"] as Role[]).map((r) => (
              <button key={r} type="button" aria-pressed={as === r} onClick={() => { setAs(r); setTab("booth"); setAdminOpen(false); if (booth) setPanelOpen(true); }} className={cn("h-7 rounded-lg px-2.5 font-semibold", as === r ? "bg-card shadow-sm" : "text-muted-foreground")}>{r}</button>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold"><Users className="size-4" aria-hidden="true" />137 in the hall</span>
          {as !== "Visitor" && <RoleChip role={as} />}
          <button type="button" onClick={() => setLeaving(true)} className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><LogOut className="size-4" aria-hidden="true" />Leave</button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* booth list: the overview people get when they enter */}
        {!showPanel && !adminOpen && (
          <aside className="flex w-[320px] max-w-full shrink-0 flex-col gap-3 border-r border-border bg-card p-4" aria-label="All booths">
            <h2 className="text-lg font-bold">Booths in this hall</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input aria-label="Search booths" placeholder="Title, team or tag" className="h-10 rounded-xl pl-9" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => <span key={c.name} className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", toneClass[c.tone])}>{c.name}</span>)}
            </div>
            <ul className="-mx-1 flex min-h-0 flex-1 flex-col overflow-y-auto">
              {hallBooths.map((b) => (
                <li key={b.id}>
                  <button type="button" onClick={() => walkTo(b)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-muted">
                    <span className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold", toneClass[toneOf(b.category)])}>{b.no}</span>
                    <span className="min-w-0 flex-1"><span className="line-clamp-1 text-sm font-semibold">{b.title}</span><span className="text-xs text-muted-foreground">{b.category}</span></span>
                    <StatusBadge status={b.status} people={b.people} />
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">Pick a booth to walk straight there.</p>
          </aside>
        )}

        <main className="relative min-w-0 flex-1 overflow-hidden bg-[#EEF0FA]">
          {avatar !== null && (
            <HallGame projects={hallProjects} zones={zones} title={event.name} avatar={avatar} name="Ploy (you)" control={control}
              onEnter={enter} onLeave={() => { setBooth(null); setPanelOpen(false); }} onHearing={setHearing} />
          )}
          <p className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow-sm">Move with <b>W A S D</b> or click · step onto a booth carpet to join it</p>
          <div className="absolute bottom-6 right-5 flex items-center gap-1 rounded-xl bg-card p-1 shadow-md ring-1 ring-border">
            <button type="button" aria-label="Zoom out" onClick={() => zoomBy(-0.1)} className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"><Minus className="size-4" /></button>
            <span className="w-11 text-center text-xs font-semibold">{Math.round((zoom / 1.3) * 100)}%</span>
            <button type="button" aria-label="Zoom in" onClick={() => zoomBy(0.1)} className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"><Plus className="size-4" /></button>
          </div>

          {chatOpen && (
            <section className="absolute bottom-24 left-5 flex w-80 max-w-[calc(100%-2.5rem)] flex-col gap-3 rounded-2xl bg-card p-4 shadow-xl ring-1 ring-border" aria-label="Chat">
              <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
                {(["nearby", "everyone"] as const).map((c) => (
                  <button key={c} type="button" aria-pressed={chatOpen === c} onClick={() => setChatOpen(c)} className={cn("h-8 flex-1 rounded-lg text-sm font-semibold", chatOpen === c ? "bg-card shadow-sm" : "text-muted-foreground")}>{c === "nearby" ? "Nearby" : "Everyone"}</button>
                ))}
                <button type="button" aria-label="Close chat" onClick={() => setChatOpen(null)} className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground"><X className="size-4" /></button>
              </div>
              <p className="text-xs text-muted-foreground">{chatOpen === "nearby" ? "People around you · messages float above heads and fade" : "The whole hall · not saved after the event"}</p>
              <ul className="flex flex-col gap-2">
                {chat[chatOpen].map((m, i) => (
                  <li key={i} className={cn("rounded-xl px-3 py-2 text-sm", "admin" in m && m.admin ? "bg-secondary text-secondary-foreground" : "bg-muted")}><div className="text-xs font-bold">{m.who}</div>{m.text}</li>
                ))}
              </ul>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input aria-label="Message" placeholder="Type a message" className="h-10 rounded-xl" />
                <Button type="submit" aria-label="Send" className="size-10 rounded-xl"><Send className="size-4" /></Button>
              </form>
            </section>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-2xl bg-foreground p-2 text-background shadow-xl">
              <button type="button" onClick={() => setMic(!mic)} aria-pressed={mic} className={cn("inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold", mic ? "bg-white/10 hover:bg-white/20" : "bg-destructive text-white")}>
                {mic ? <Mic className="size-5" aria-hidden="true" /> : <MicOff className="size-5" aria-hidden="true" />}{mic ? "Mic on" : "Mic off"}
              </button>
              {isPresenterHere && (
                <>
                  <button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-semibold hover:bg-white/20"><MonitorUp className="size-5" aria-hidden="true" />Share screen</button>
                  <button type="button" aria-label="Camera" className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"><Camera className="size-5" /></button>
                </>
              )}
              <span className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                {(booth ? inBooth.length : hearing.people.length) > 0 && <AvatarStack names={(booth ? inBooth.map((p) => p.n) : hearing.people.map((h) => h.split(" · ")[0])).slice(0, 3)} />}
                <span className="pl-1 text-xs text-background/80">{booth ? `In booth ${booth.no} · ${inBooth.length + 1} hear each other` : hearing.people.length ? `${hearing.people.length} ${hearing.people.length === 1 ? "person" : "people"} nearby can hear you` : "Nobody nearby · walk up to someone"}</span>
              </span>
              <button type="button" onClick={() => setChatOpen(chatOpen ? null : "nearby")} aria-label="Chat" className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"><MessageCircle className="size-5" /></button>
              {as === "Admin" && (
                <button type="button" onClick={() => setAdminOpen(!adminOpen)} aria-pressed={adminOpen} className="inline-flex h-11 items-center gap-2 rounded-xl bg-lilac px-3 text-sm font-semibold text-lilac-ink"><ShieldCheck className="size-5" aria-hidden="true" />Admin panel</button>
              )}
            </div>
          </div>
        </main>

        {adminOpen && (
          <aside className="flex w-[360px] max-w-full shrink-0 flex-col gap-5 overflow-y-auto border-l border-border bg-card p-5" aria-label="Admin panel">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Admin panel</h2><button type="button" aria-label="Close" onClick={() => setAdminOpen(false)} className="inline-flex size-9 items-center justify-center rounded-xl hover:bg-muted"><X className="size-5" /></button></div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["137", "in hall"], ["21", "booths Live"], ["2", "reports"]].map(([v, k]) => <div key={k} className="rounded-xl bg-muted py-2"><div className="text-xl font-bold">{v}</div><div className="text-xs text-muted-foreground">{k}</div></div>)}
            </div>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <Label htmlFor="ann" className="font-semibold">Announce to everyone</Label>
              <Textarea id="ann" rows={2} placeholder="e.g. Judging closes in 30 minutes" className="rounded-xl" />
              <Button className="h-10 self-end rounded-xl px-4 font-semibold"><Megaphone className="size-4" aria-hidden="true" />Send</Button>
            </form>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold">Reports</h3>
              {[["Rude messages in nearby chat", "guest Tee · by 3 people"], ["Shouting in booth 04", "user Boss · by Mint (Presenter)"]].map(([t, s]) => (
                <div key={t} className="flex flex-col gap-2 rounded-xl bg-peach/50 p-3">
                  <div className="text-sm font-semibold">{t}<div className="text-xs font-normal text-muted-foreground">{s}</div></div>
                  <div className="flex gap-2"><Button variant="outline" className="h-8 flex-1 rounded-lg bg-card text-xs">Mute</Button><Button variant="outline" className="h-8 flex-1 rounded-lg bg-card text-xs">Kick</Button><Button className="h-8 flex-1 rounded-lg text-xs">Ban</Button></div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Kick = removed, can come back · Ban = can&rsquo;t enter this event again.</p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold">Emergency</h3>
              <label className="flex items-center justify-between text-sm font-semibold"><span className="flex items-center gap-2"><DoorClosed className="size-4" aria-hidden="true" />Stop new arrivals</span><Switch /></label>
              <label className="flex items-center justify-between text-sm font-semibold"><span className="flex items-center gap-2"><MicOff className="size-4" aria-hidden="true" />Mute everyone</span><Switch /></label>
            </div>
            <p className="flex items-start gap-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground"><UserRoundPlus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />Click anyone&rsquo;s avatar in the hall to make them a Presenter, Judge or Admin.</p>
          </aside>
        )}

        {showPanel && !adminOpen && (
          <aside className="flex w-[400px] max-w-full shrink-0 flex-col border-l border-border bg-card" aria-label="Booth panel">
            <div className="flex items-start justify-between gap-3 px-5 pt-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2"><span className="text-sm font-bold text-muted-foreground">Booth {booth.no}</span><StatusBadge status={booth.status} people={booth.people} /></div>
                <h2 className="mt-1 text-lg font-bold leading-snug">{booth.title}</h2>
              </div>
              <button type="button" onClick={() => setPanelOpen(false)} aria-label="Close panel and show all booths" className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"><X className="size-5" /></button>
            </div>
            <div className="mx-5 mt-4 flex gap-1 rounded-xl bg-muted p-1" role="tablist">
              {tabs.map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("h-9 flex-1 rounded-lg text-sm font-semibold capitalize", tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>{t}</button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              {tab === "booth" && (
                <div className="flex flex-col gap-5">
                  {booth.status === "live" ? (
                    <figure className="overflow-hidden rounded-2xl bg-foreground text-background">
                      <div className="relative flex aspect-video flex-col justify-between bg-[#2A3290] p-4">
                        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-bold"><MonitorPlay className="size-3.5" aria-hidden="true" />{booth.members[0]} is sharing</span>
                        <div><div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">Slide 4 of 12</div><div className="text-base font-bold">How it works</div></div>
                        <Initials name={booth.members[0]} size="xl" className="absolute bottom-3 right-3 size-14 rounded-xl ring-white" />
                      </div>
                      <figcaption className="px-4 py-2 text-xs text-background/80">Only people inside the booth see the screen and the presenter&rsquo;s camera.</figcaption>
                    </figure>
                  ) : (
                    <div className="flex flex-col gap-3 rounded-2xl bg-lilac/40 p-4">
                      <div className="flex items-center gap-2 font-semibold"><Bot className="size-5 text-lilac-ink" aria-hidden="true" />The team is away — ask the AI assistant</div>
                      <p className="text-sm text-muted-foreground">Answers only from the team&rsquo;s poster and report. It says so when it doesn&rsquo;t know.</p>
                      <div className="flex gap-2"><Input aria-label="Ask the AI" placeholder="How does booking work offline?" className="h-10 rounded-xl bg-card" /><Button aria-label="Ask" className="size-10 rounded-xl"><Send className="size-4" /></Button></div>
                    </div>
                  )}
                  <p className="text-[15px] text-muted-foreground">{booth.summary}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip tone={toneOf(booth.category)}>{booth.category}</Chip>
                    {booth.tags.map((t) => <span key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">#{t}</span>)}
                  </div>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground"><AvatarStack names={booth.members} />{booth.team}</span>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-semibold"><FileImage className="size-4" aria-hidden="true" />Poster</Button>
                    <Button variant="outline" className="h-11 rounded-xl font-semibold"><Video className="size-4" aria-hidden="true" />Demo video</Button>
                  </div>
                  <p className="-mt-2 text-xs text-muted-foreground">When a presenter opens the poster, it zooms and scrolls along with them for everyone in the booth.</p>
                  {isPresenterHere && <Link href="/e/sit-capstone-2027/my-booth" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground"><Pencil className="size-4" aria-hidden="true" />Edit booth</Link>}
                  {as === "Presenter" && !isPresenterHere && <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">You present at booth 01. Here you&rsquo;re a visitor. <button type="button" className="font-semibold underline" onClick={() => control.current?.goTo("01")}>Walk to booth 01</button></p>}
                </div>
              )}

              {tab === "feedback" && (
                <div className="flex flex-col gap-5">
                  <button type="button" onClick={() => setVoted(!voted)} aria-pressed={voted} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-left", voted ? "bg-peach text-peach-ink" : "bg-muted")}>
                    <Heart className={cn("size-6", voted && "fill-current")} aria-hidden="true" />
                    <span><span className="block font-semibold">{voted ? "You voted for this project" : "Vote for this project"}</span><span className="text-xs opacity-80">Popular Vote · vote for as many as you like, once each · until 4:00 PM</span></span>
                  </button>
                  <form className="flex flex-col gap-2 rounded-2xl bg-muted p-4" onSubmit={(e) => e.preventDefault()}>
                    <Label htmlFor="fb" className="font-semibold">Feedback for the team</Label>
                    <Textarea id="fb" rows={3} placeholder="What did you like? What could be better?" className="rounded-xl bg-card" />
                    <label className="flex items-center gap-2 text-sm"><Checkbox />Hide my name from the team</label>
                    <p className="text-xs text-muted-foreground">Only the team and admins see feedback.</p>
                    <Button className="h-10 self-end rounded-xl px-4 font-semibold">Send</Button>
                  </form>
                  {contact === "closed" && <Button variant="outline" onClick={() => setContact("open")} className="h-11 rounded-xl font-semibold">Ask the team to contact me</Button>}
                  {contact === "open" && (
                    <form className="flex flex-col gap-3 rounded-2xl ring-1 ring-border p-4" onSubmit={(e) => { e.preventDefault(); setContact("sent"); }}>
                      <p className="font-semibold">Leave your contact for the team</p>
                      <Input aria-label="Email" defaultValue="ploy.s@kmutt.ac.th" className="h-10 rounded-xl" />
                      <Input aria-label="Phone or LinkedIn (optional)" placeholder="Phone or LinkedIn (optional)" className="h-10 rounded-xl" />
                      <Textarea aria-label="Short message (optional)" rows={2} placeholder="e.g. We'd like to offer an internship" className="rounded-xl" />
                      <p className="text-xs text-muted-foreground">The team will see your name, organization and what you enter.</p>
                      <Button type="submit" className="h-10 rounded-xl font-semibold">Send to the team</Button>
                    </form>
                  )}
                  {contact === "sent" && <p className="flex items-center gap-2 rounded-2xl bg-mint px-4 py-3 text-sm font-semibold text-mint-ink"><Check className="size-4" aria-hidden="true" />Sent. You can withdraw it any time.</p>}
                </div>
              )}

              {tab === "score" && (
                <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex items-center justify-between rounded-2xl bg-butter px-4 py-3 text-butter-ink">
                    <span className="text-sm font-semibold">Your score · draft saved</span>
                    <span className="text-2xl font-bold">{total}<span className="text-sm font-semibold">/100</span></span>
                  </div>
                  {rubric.map((r, i) => (
                    <div key={r.k} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`s-${i}`} className="font-semibold">{r.k} <span className="font-normal text-muted-foreground">· weight {r.w}%</span></Label>
                        <span className="w-12 text-right font-bold">{scores[i] || "–"}/{r.max}</span>
                      </div>
                      <input id={`s-${i}`} type="range" min={0} max={r.max} value={scores[i]} onChange={(e) => setScores(scores.map((s, j) => (j === i ? Number(e.target.value) : s)))} className="h-2 w-full accent-[var(--primary)]" />
                    </div>
                  ))}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cm" className="font-semibold">Comment for the team</Label>
                    <Textarea id="cm" rows={3} placeholder="Sent to the team after results are announced" className="rounded-xl" />
                  </div>
                  <Button type="submit" disabled={!filled} className="h-11 rounded-xl font-semibold">Submit score</Button>
                  <p className="text-center text-xs text-muted-foreground">{filled ? "" : "Score every criterion to submit. "}A complete draft counts automatically when the event ends.</p>
                </form>
              )}

              {tab === "people" && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">Everyone inside the booth hears each other. People outside can&rsquo;t hear in, and you can&rsquo;t hear out.</p>
                  <ul className="flex flex-col divide-y divide-border">
                    {inBooth.map((p) => (
                      <li key={p.n} className="flex items-center gap-3 py-2.5">
                        <span className={cn("rounded-full", p.talking && "ring-2 ring-mint ring-offset-2 ring-offset-card")}><Initials name={p.n} size="sm" /></span>
                        <span className="flex-1 text-sm font-semibold">{p.n}</span>
                        {p.role !== "Visitor" && <RoleChip role={p.role} />}
                        {canMute && p.role !== "Presenter" && <Button variant="outline" className="h-8 rounded-lg px-2.5 text-xs"><MicOff className="size-3.5" aria-hidden="true" />Mute</Button>}
                      </li>
                    ))}
                  </ul>
                  {canMute && <p className="text-xs text-muted-foreground">Muted people can unmute themselves. Nobody can turn on someone else&rsquo;s mic.</p>}
                  <Button variant="ghost" className="h-9 self-start rounded-lg px-2 text-xs text-muted-foreground">Report someone</Button>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {leaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" role="dialog" aria-modal="true" aria-labelledby="sv-title">
          <form className="flex w-full max-w-md flex-col gap-4 rounded-3xl bg-card p-7" onSubmit={(e) => e.preventDefault()}>
            <h2 id="sv-title" className="text-xl font-bold">Before you go — how was it?</h2>
            <div className="flex justify-between gap-2" role="radiogroup" aria-label="Satisfaction 1 to 5">
              {[1, 2, 3, 4, 5].map((n) => <label key={n} className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-xl bg-muted font-bold has-checked:bg-primary has-checked:text-primary-foreground"><input type="radio" name="sat" className="sr-only" />{n}</label>)}
            </div>
            <Textarea aria-label="Comment" rows={2} placeholder="Anything we should improve? (optional)" className="rounded-xl" />
            <div className="flex gap-3">
              <Link href="/home" className="inline-flex h-11 flex-1 items-center justify-center rounded-xl font-semibold text-muted-foreground hover:bg-muted">Skip</Link>
              <Link href="/home" className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground">Send & leave</Link>
            </div>
            <p className="text-center text-xs text-muted-foreground">Asked once per event.</p>
          </form>
        </div>
      )}
    </div>
  );
}
