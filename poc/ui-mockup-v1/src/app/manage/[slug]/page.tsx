import Link from "next/link";
import { ArrowRight, Check, Circle, Copy, Megaphone, MicOff, Search, UserPlus, DoorClosed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { AvatarStack, Chip, Initials, StatusBadge } from "@/components/brand";
import { ManageShell, bigButton } from "@/components/shells";
import { booths, event, toneOf } from "@/lib/mock";
import { cn } from "@/lib/utils";

const card = "rounded-3xl bg-card p-6 ring-1 ring-border/70";

const checklist = [
  { label: "Event details and schedule", done: true },
  { label: "Hall template chosen (Expo hall · 40 booths)", done: true },
  { label: "39 teams invited", done: true },
  { label: "Booths filled in by teams", done: false, note: "36 of 39 ready" },
  { label: "Rubric and judge assignments", done: true },
  { label: "Publish registration page", done: true },
];

function Overview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Registered", "642", "goal 600"],
          ["Checked in", "418", "65% of registered"],
          ["In the hall now", "137", "across 21 booths"],
          ["Scores submitted", "214 / 468", "round closes 3:00 PM"],
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
            <Link href="?tab=booths" className="text-sm font-semibold text-primary">All 39 booths</Link>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {booths.slice(0, 5).map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <span className="w-8 text-sm font-bold text-muted-foreground">{b.no}</span>
                <span className="min-w-0 flex-[999_1_220px] font-semibold">{b.title}</span>
                <StatusBadge status={b.status} />
                <span className="w-20 text-right text-sm text-muted-foreground">{b.people} inside</span>
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

function BoothsTab() {
  return (
    <section className={cn(card, "p-0")}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div className="relative w-72 max-w-full">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search booths" placeholder="Search booths or teams" className="h-10 rounded-xl pl-10" />
        </div>
        <span className="text-sm text-muted-foreground">36 of 39 booths ready</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-[15px]">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="px-6 py-3 font-semibold">Booth</th>
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Team</th>
              <th className="px-3 py-3 font-semibold">Content</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {booths.map((b, i) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-6 py-3"><div className="font-semibold">{b.title}</div><div className="text-sm text-muted-foreground">Booth {b.no}</div></td>
                <td className="px-3 py-3"><Chip tone={toneOf(b.category)}>{b.category}</Chip></td>
                <td className="px-3 py-3"><AvatarStack names={b.members} /></td>
                <td className="px-3 py-3 text-sm">{i === 5 ? <span className="font-semibold text-peach-ink">Poster missing</span> : "Poster · slides · video"}</td>
                <td className="px-6 py-3"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const people = [
  { name: "Ploy Srisuk", email: "ploy.s@university.ac.th", role: "Owner" },
  { name: "Nat Wong", email: "nat.w@university.ac.th", role: "Staff" },
  { name: "Judge One", email: "judge.one@university.ac.th", role: "Judge" },
  { name: "Guest Judge", email: "guest.judge@company.com", role: "Judge" },
  { name: "Mint Chai", email: "mint.c@university.ac.th", role: "Presenter · Booth 01" },
];

function PeopleTab() {
  return (
    <section className={cn(card, "flex flex-col gap-4")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Team & roles</h2>
        <button type="button" className={cn(buttonVariants(), "h-10 rounded-xl px-4 font-semibold")}><UserPlus className="size-4" aria-hidden="true" />Invite</button>
      </div>
      <ul className="flex flex-col divide-y divide-border">
        {people.map((p) => (
          <li key={p.email} className="flex flex-wrap items-center gap-4 py-3">
            <Initials name={p.name} />
            <div className="min-w-0 flex-[999_1_240px]"><div className="font-semibold">{p.name}</div><div className="text-sm text-muted-foreground">{p.email}</div></div>
            <Chip tone={p.role === "Owner" ? "lilac" : p.role === "Staff" ? "sky" : p.role === "Judge" ? "butter" : "mint"}>{p.role}</Chip>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">Only the owner can add or remove staff. Staff can assign presenters and judges.</p>
    </section>
  );
}

function JudgingTab() {
  const rubric = [["Problem & value", 30], ["Technical quality", 30], ["Demo", 25], ["Presentation", 15]] as const;
  return (
    <div className="flex flex-wrap gap-6">
      <section className={cn(card, "min-w-0 flex-[1_1_320px]")}>
        <h2 className="text-lg font-bold">Rubric</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {rubric.map(([k, w]) => (
            <li key={k} className="flex items-center gap-3"><span className="flex-1 font-semibold">{k}</span><span className="w-12 text-right text-sm text-muted-foreground">{w}%</span></li>
          ))}
        </ul>
      </section>
      <section className={cn(card, "min-w-0 flex-[2_1_480px]")}>
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Scoring progress</h2><span className="text-sm text-muted-foreground">Round closes 3:00 PM</span></div>
        <ul className="mt-4 flex flex-col gap-4">
          {booths.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="min-w-0 flex-[999_1_220px] font-semibold">{b.title}</span>
              <Progress value={(b.scored / 12) * 100} className="w-40" aria-label={`${b.scored} of 12 judges`} />
              <span className="w-12 text-right text-sm text-muted-foreground">{b.scored}/12</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-xl px-4 font-semibold")}>Remind judges</button>
          <button type="button" className={cn(buttonVariants(), "h-10 rounded-xl px-4 font-semibold")}>Close round & publish results</button>
        </div>
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
          {[["Inappropriate message in event chat", "guest-215 · reported by 3 people · 2 min ago"], ["Video link in booth 17 does not open", "reported by a visitor · 14 min ago"]].map(([t, s]) => (
            <li key={t} className="flex flex-wrap items-center gap-3 rounded-2xl bg-peach/50 px-5 py-4">
              <div className="min-w-0 flex-[999_1_260px]"><div className="font-semibold">{t}</div><div className="text-sm text-muted-foreground">{s}</div></div>
              <button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-xl bg-card px-3")}>Review</button>
              <button type="button" className={cn(buttonVariants(), "h-9 rounded-xl px-3")}>Mute user</button>
            </li>
          ))}
        </ul>
      </section>
      <section className={cn(card, "flex min-w-0 flex-[1_1_280px] flex-col gap-4")}>
        <h2 className="text-lg font-bold">Emergency switches</h2>
        <label className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 font-semibold"><DoorClosed className="size-4" aria-hidden="true" />Stop new arrivals</span><Switch /></label>
        <label className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 font-semibold"><MicOff className="size-4" aria-hidden="true" />Mute everyone</span><Switch /></label>
        <p className="text-sm text-muted-foreground">Every action is saved to the audit log.</p>
      </section>
    </div>
  );
}

function SettingsTab() {
  return (
    <section className={cn(card, "flex max-w-2xl flex-col gap-5")}>
      <h2 className="text-lg font-bold">Event page</h2>
      <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-[15px]">
        <span className="min-w-0 flex-1 truncate">connecta.app/e/{event.slug}</span>
        <button type="button" aria-label="Copy link" className="inline-flex size-9 items-center justify-center rounded-xl hover:bg-card"><Copy className="size-4" /></button>
      </div>
      {["Registration open", "Show booth list before the event", "Open gallery after the event"].map((s, i) => (
        <label key={s} className="flex items-center justify-between gap-4 text-[15px] font-semibold">{s}<Switch defaultChecked={i !== 2} /></label>
      ))}
    </section>
  );
}

const tabs: Record<string, { title: string; el: () => React.ReactElement }> = {
  overview: { title: "Overview", el: Overview },
  booths: { title: "Booths", el: BoothsTab },
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
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"><span className="size-2 animate-pulse rounded-full bg-white" aria-hidden="true" />Live · ends 4:00 PM</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{tabs[key].title}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), bigButton)}><Megaphone className="size-4" aria-hidden="true" />Announce</button>
            <Link href={`/e/${slug}/hall`} className={cn(buttonVariants(), bigButton)}>Enter the hall <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </div>
        <Tab />
      </div>
    </ManageShell>
  );
}
