import Link from "next/link";
import { ArrowRight, Check, Circle, Clock, Copy, DoorClosed, Lock, Megaphone, MicOff, Square, UserPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Initials, RoleChip, StatusBadge } from "@/components/brand";
import { ManageShell, bigButton } from "@/components/shells";
import { booths, event, rubric, type Role } from "@/lib/mock";
import { cn } from "@/lib/utils";

const card = "rounded-3xl bg-card p-6 ring-1 ring-border/70";
const small = "h-10 rounded-xl px-4 font-semibold";

const checklist = [
  { label: "Event details, time and access", done: true },
  { label: "Hall preset · Hall (30 booths)", done: true },
  { label: "28 projects added · presenters invited", done: true },
  { label: "Booths filled in by teams", done: false, note: "25 of 28 complete" },
  { label: "Rubric and judge assignments", done: true },
  { label: "Published", done: true },
];

function Overview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Interested", String(event.interested), "before the event"],
          ["Joined", "418", "357 clicked Interested first (70%) · 61 didn’t"],
          ["In the hall now", "137", `seats: ${event.reserved} reserved · ${event.capacity} max`],
          ["Scores submitted", "201 / 336", "closes when the event ends"],
        ].map(([k, v, s]) => (
          <div key={k} className={card}>
            <div className="text-sm font-semibold text-muted-foreground">{k}</div>
            <div className="mt-1 text-3xl font-bold tracking-tight">{v}</div>
            <div className="text-sm text-muted-foreground">{s}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-6">
        <section className={cn(card, "min-w-0 flex-[2_1_480px]")}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Booths right now</h2>
            <Link href={`/manage/${event.slug}/projects`} className="text-sm font-semibold text-primary">All 28 projects</Link>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {booths.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <span className="w-8 text-sm font-bold text-muted-foreground">{b.no}</span>
                <span className="min-w-0 flex-[999_1_220px] font-semibold">{b.title}</span>
                <StatusBadge status={b.status} people={b.people} />
              </li>
            ))}
          </ul>
        </section>
        <section className={cn(card, "flex min-w-0 flex-[1_1_300px] flex-col gap-4")}>
          <h2 className="text-lg font-bold">Setup checklist</h2>
          <Progress value={83} aria-label="Setup 5 of 6 done" />
          <ul className="flex flex-col gap-3">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-start gap-3 text-[15px]">
                {c.done ? <Check className="mt-0.5 size-5 shrink-0 rounded-full bg-mint p-0.5 text-mint-ink" aria-label="Done" /> : <Circle className="mt-0.5 size-5 shrink-0 text-input" aria-label="Not done" />}
                <span>{c.label}{c.note && <span className="block text-sm text-muted-foreground">{c.note}</span>}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

const people: { name: string; email: string; role: Role; note?: string; pending?: boolean }[] = [
  { name: "Ploy Srisuk", email: "ploy.s@kmutt.ac.th", role: "Admin", note: "created the event" },
  { name: "Nat Wong", email: "nat.w@kmutt.ac.th", role: "Admin" },
  { name: "Judge One", email: "judge.one@kmutt.ac.th", role: "Judge" },
  { name: "", email: "guest.judge@company.com", role: "Judge", pending: true },
  { name: "Mint Chai", email: "mint.c@kmutt.ac.th", role: "Presenter", note: "Booth 01" },
];

function PeopleTab() {
  return (
    <div className="flex flex-col gap-6">
      <section className={cn(card, "flex flex-col gap-4")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Admins, presenters & judges</h2>
          <div className="flex gap-2">
            <Input aria-label="Email to invite" placeholder="name@kmutt.ac.th" className="h-10 w-60 rounded-xl" />
            <select aria-label="Role" className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm"><option>Judge</option><option>Presenter</option><option>Admin</option></select>
            <button type="button" className={cn(buttonVariants(), small)}><UserPlus className="size-4" aria-hidden="true" />Invite</button>
          </div>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {people.map((p) => (
            <li key={p.email} className="flex flex-wrap items-center gap-4 py-3">
              <Initials name={p.name || p.email} />
              <div className="min-w-0 flex-[999_1_240px]"><div className="font-semibold">{p.name || "Invitation sent"}</div><div className="text-sm text-muted-foreground">{p.email}{p.note && ` · ${p.note}`}</div></div>
              {p.pending ? <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">Pending · Resend</span> : <RoleChip role={p.role} />}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">Every invitation reserves a seat. Admins can do everything; the last admin can&rsquo;t leave — add another admin first.</p>
      </section>
      <section className={cn(card, "flex flex-col gap-3")}>
        <h2 className="text-lg font-bold">Banned from this event</h2>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-muted px-4 py-3"><Initials name="Tee" size="sm" /><span className="flex-1 text-sm"><b>Tee K.</b> · spamming nearby chat · by Nat, 10:42</span><button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-xl bg-card")}>Lift ban</button></div>
      </section>
    </div>
  );
}

function JudgingTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6">
        <section className={cn(card, "min-w-0 flex-[1_1_320px]")}>
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Rubric</h2><span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Lock className="size-3.5" aria-hidden="true" />Locked · scoring started</span></div>
          <ul className="mt-4 flex flex-col gap-3">
            {rubric.map((r) => <li key={r.k} className="flex items-center gap-3"><span className="flex-1 font-semibold">{r.k}</span><span className="text-sm text-muted-foreground">0–{r.max} · {r.w}%</span></li>)}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">Criteria and weights lock after the first score. Descriptions can still be edited.</p>
        </section>
        <section className={cn(card, "min-w-0 flex-[2_1_480px]")}>
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Scoring progress</h2><span className="text-sm text-muted-foreground">Closes when the event ends · {event.endsAt}</span></div>
          <ul className="mt-4 flex flex-col gap-4">
            {booths.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="min-w-0 flex-[999_1_220px] font-semibold">{b.title}</span>
                <Progress value={(b.scored / 12) * 100} className="w-40" aria-label={`${b.scored} of 12 judges`} />
                <span className="w-12 text-right text-sm text-muted-foreground">{b.scored}/12</span>
              </li>
            ))}
          </ul>
          <button type="button" className={cn(buttonVariants({ variant: "outline" }), small, "mt-6")}>Remind judges who aren&rsquo;t done</button>
        </section>
      </div>
      <section className={cn(card, "flex flex-wrap items-center gap-4")}>
        <div className="min-w-0 flex-[999_1_320px]">
          <h2 className="text-lg font-bold">Announce results</h2>
          <p className="text-sm text-muted-foreground">Available after the event ends. Only the winners appear on the event page; teams see their own detailed scores.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">Show top <Input type="number" defaultValue={3} min={1} className="h-10 w-16 rounded-xl" /> for judges and audience</label>
        <button type="button" disabled className={cn(buttonVariants(), small)}>Announce results</button>
      </section>
    </div>
  );
}

function ModerationTab() {
  return (
    <div className="flex flex-wrap gap-6">
      <section className={cn(card, "min-w-0 flex-[2_1_480px]")}>
        <h2 className="text-lg font-bold">Reports to review</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {[["Rude messages in nearby chat", "Tee K. · reported by 3 people · 2 min ago · message copied"], ["Inappropriate feedback on booth 17", "reported by the team · 14 min ago"]].map(([t, s]) => (
            <li key={t} className="flex flex-wrap items-center gap-3 rounded-2xl bg-peach/50 px-5 py-4">
              <div className="min-w-0 flex-[999_1_260px]"><div className="font-semibold">{t}</div><div className="text-sm text-muted-foreground">{s}</div></div>
              <button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-xl bg-card px-3")}>Dismiss</button>
              <button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-xl bg-card px-3")}>Kick</button>
              <button type="button" className={cn(buttonVariants(), "h-9 rounded-xl px-3")}>Ban</button>
            </li>
          ))}
        </ul>
        <h3 className="mt-6 text-sm font-bold">Audit log</h3>
        <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
          <li>10:42 · Nat banned Tee K. · “spamming nearby chat”</li>
          <li>10:15 · Ploy made Earth K. a Presenter of booth 04</li>
          <li>09:58 · Mint edited booth 01 during the event</li>
        </ul>
      </section>
      <section className={cn(card, "flex min-w-0 flex-[1_1_280px] flex-col gap-4")}>
        <h2 className="text-lg font-bold">Emergency switches</h2>
        <label className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 font-semibold"><DoorClosed className="size-4" aria-hidden="true" />Stop new arrivals</span><Switch /></label>
        <label className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 font-semibold"><MicOff className="size-4" aria-hidden="true" />Mute everyone</span><Switch /></label>
        <p className="text-sm text-muted-foreground">Kick removes someone for now — they can come back. Ban keeps them out of this event.</p>
      </section>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <section className={cn(card, "flex flex-col gap-5")}>
        <h2 className="text-lg font-bold">Event</h2>
        <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-[15px]">
          <span className="min-w-0 flex-1 truncate">connecta.app/e/{event.slug}</span>
          <button type="button" aria-label="Copy link" className="inline-flex size-9 items-center justify-center rounded-xl hover:bg-card"><Copy className="size-4" /></button>
        </div>
        <label className="flex items-center justify-between gap-4 text-[15px] font-semibold">Only visitors from<span className="flex items-center gap-1 font-normal">@<Input defaultValue="kmutt.ac.th" className="h-10 w-40 rounded-xl" /></span></label>
        <label className="flex items-center justify-between gap-4 text-[15px] font-semibold">Ends at<span className="flex items-center gap-2"><Input type="time" defaultValue="16:00" className="h-10 w-32 rounded-xl" /><button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-xl")}>+30 min</button></span></label>
        {["Judging", "Popular Vote", "Feedback", "AI booth assistant", "3D model viewer"].map((s, i) => (
          <label key={s} className="flex items-center justify-between gap-4 text-[15px] font-semibold">{s}<Switch defaultChecked={i < 4} /></label>
        ))}
      </section>
      <section className={cn(card, "flex flex-col gap-3 ring-destructive/40")}>
        <h2 className="text-lg font-bold text-destructive">Delete event</h2>
        <p className="text-sm text-muted-foreground">Removes the hall, projects, scores and files for good. Type the event name to confirm.</p>
        <div className="flex flex-wrap gap-2"><Input aria-label="Type the event name" placeholder={event.name} className="h-10 min-w-0 flex-1 rounded-xl" /><button type="button" disabled className={cn(buttonVariants({ variant: "destructive" }), small)}>Delete</button></div>
      </section>
    </div>
  );
}

const tabs: Record<string, { title: string; el: () => React.ReactElement }> = {
  overview: { title: "Overview", el: Overview },
  people: { title: "People & roles", el: PeopleTab },
  judging: { title: "Judging", el: JudgingTab },
  moderation: { title: "Moderation", el: ModerationTab },
  settings: { title: "Settings", el: SettingsTab },
};

export default async function ManageEvent({ params, searchParams }: PageProps<"/manage/[slug]">) {
  const { slug } = await params;
  const q = await searchParams;
  const key = typeof q.tab === "string" && q.tab in tabs ? q.tab : "overview";
  const Tab = tabs[key].el;
  return (
    <ManageShell slug={slug} name={event.name} active={key}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"><span className="size-2 animate-pulse rounded-full bg-white" aria-hidden="true" />Live · ends {event.endsAt}</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{tabs[key].title}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), bigButton)}><Megaphone className="size-4" aria-hidden="true" />Announce</button>
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), bigButton)}><Clock className="size-4" aria-hidden="true" />Extend</button>
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), bigButton, "text-destructive")}><Square className="size-4" aria-hidden="true" />End event</button>
            <Link href={`/e/${slug}/hall`} className={cn(buttonVariants(), bigButton)}>Enter the hall <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </div>
        <Tab />
      </div>
    </ManageShell>
  );
}
