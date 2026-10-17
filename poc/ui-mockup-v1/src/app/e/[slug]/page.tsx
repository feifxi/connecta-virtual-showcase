import Link from "next/link";
import { CalendarDays, Clock, Globe, Lock, Search, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HallMap } from "@/components/hall-map";
import { AvatarStack, Chip, StatusBadge } from "@/components/brand";
import { PublicHeader } from "@/components/shells";
import { booths, categories, event, toneClass, toneOf } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { EventCta, type EventState } from "./event-cta";

const stateLabel: Record<EventState, { text: string; tone: "mint" | "butter" | "lilac" }> = {
  published: { text: "Opens Sat 9:00 AM", tone: "butter" },
  live: { text: "Live now · ends 4:00 PM", tone: "mint" },
  exhibition: { text: "Exhibition · open until May 24", tone: "lilac" },
};

const winners = [...booths].sort((a, b) => b.score - a.score).slice(0, 3);

// Public event page · works without login · ?state=published|live|exhibition previews each phase
export default async function EventPage({ params, searchParams }: PageProps<"/e/[slug]">) {
  const { slug } = await params;
  const q = await searchParams;
  const state: EventState = q.state === "published" || q.state === "exhibition" ? q.state : "live";
  const s = stateLabel[state];
  return (
    <div className="bg-card">
      <PublicHeader />

      <nav aria-label="Preview event phase" className="border-b border-border bg-muted/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-2 text-xs">
          <span className="font-semibold text-muted-foreground">Mockup · preview phase:</span>
          {(["published", "live", "exhibition"] as EventState[]).map((p) => (
            <Link key={p} href={`?state=${p}`} className={cn("rounded-full px-3 py-1 font-semibold capitalize", p === state ? "bg-foreground text-background" : "bg-card ring-1 ring-border")}>{p}</Link>
          ))}
        </div>
      </nav>

      <section className="bg-secondary/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-10 px-6 py-14">
          <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Chip tone={s.tone} className="px-3 py-1">{s.text}</Chip>
              <span className="inline-flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-semibold"><Lock className="size-3" aria-hidden="true" />{event.access}</span>
              <span className="text-muted-foreground">by {event.org}</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">{event.name}</h1>
            <p className="max-w-xl text-lg text-muted-foreground">{event.blurb}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold">
              <span className="inline-flex items-center gap-2"><CalendarDays className="size-5 text-primary" aria-hidden="true" />{event.date}</span>
              <span className="inline-flex items-center gap-2"><Clock className="size-5 text-primary" aria-hidden="true" />{event.time}</span>
              <span className="inline-flex items-center gap-2"><Globe className="size-5 text-primary" aria-hidden="true" />Online · any browser</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <EventCta slug={slug} state={state} />
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <AvatarStack names={["Mint", "Beam", "Fah", "Oat"]} extra={event.interested - 4} /> interested
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Log in with your @kmutt.ac.th Microsoft account to join. Anyone can browse the projects below.</p>
          </div>
          <div className="flex-[1_1_380px]">
            <HallMap className="shadow-[0_24px_60px_-30px_rgba(27,29,58,0.45)]" />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[[event.works, "projects"], [categories.length, "zones"], [event.judges, "judges"]].map(([v, k]) => (
                <div key={k} className="rounded-2xl bg-card py-3"><div className="text-2xl font-bold">{v}</div><div className="text-sm text-muted-foreground">{k}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {state === "exhibition" && (
        <section className="mx-auto flex max-w-6xl flex-col gap-5 px-6 pt-16">
          <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><Trophy className="size-7 text-butter-ink" aria-hidden="true" />Winners</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ol className="flex flex-col gap-2 rounded-3xl bg-butter/50 p-6">
              <li className="mb-1 text-sm font-bold text-butter-ink">Judges&rsquo; award</li>
              {winners.map((b, i) => <li key={b.id} className="flex items-center gap-3 font-semibold"><span className="w-6 text-lg">{i + 1}</span>{b.title}</li>)}
            </ol>
            <ol className="flex flex-col gap-2 rounded-3xl bg-mint/50 p-6">
              <li className="mb-1 text-sm font-bold text-mint-ink">Audience award · Popular Vote</li>
              {[...booths].sort((a, b) => b.votes - a.votes).slice(0, 3).map((b, i) => <li key={b.id} className="flex items-center gap-3 font-semibold"><span className="w-6 text-lg">{i + 1}</span>{b.title}</li>)}
            </ol>
          </div>
        </section>
      )}

      <section id="projects" className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <p className="mt-1 text-muted-foreground">{state === "live" ? "Booth status updates live." : "Browse before you go in."}</p>
          </div>
          <div className="relative w-80 max-w-full">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input aria-label="Search projects" placeholder="Search by title, team or tag" className="h-11 rounded-xl pl-10" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by zone">
          <button type="button" aria-pressed="true" className="h-9 rounded-full bg-foreground px-4 text-sm font-semibold text-background">All</button>
          {categories.map((c) => (
            <button key={c.name} type="button" aria-pressed="false" className={cn("h-9 rounded-full px-4 text-sm font-semibold", toneClass[c.tone])}>{c.name}</button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {booths.map((b) => (
            <article key={b.id} className="flex flex-col gap-4 rounded-3xl p-6 ring-1 ring-border">
              <div className="flex items-center justify-between gap-2">
                <Chip tone={toneOf(b.category)}>{b.category}</Chip>
                {state === "live" && <StatusBadge status={b.status} people={b.people} />}
              </div>
              <div>
                <h3 className="text-lg font-bold leading-snug">{b.title}</h3>
                <p className="mt-2 line-clamp-2 text-[15px] text-muted-foreground">{b.summary}</p>
              </div>
              <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><AvatarStack names={b.members} /> {b.team}</span>
                <span>Booth {b.no}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-10 px-6 py-16">
          <div className="flex-[1_1_280px]">
            <h2 className="text-3xl font-bold tracking-tight">Agenda</h2>
            <p className="mt-2 text-muted-foreground">Booths are open all day. Walk in whenever you like.</p>
          </div>
          <ol className="flex min-w-0 flex-[2_1_480px] flex-col gap-3">
            {event.agenda.map((a) => (
              <li key={a.label} className="flex items-center gap-5 rounded-2xl bg-card px-6 py-4 ring-1 ring-border/70">
                <span className="w-20 text-lg font-bold">{a.time}</span>
                <span className="font-semibold">{a.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">See you in the hall</h2>
        <p className="max-w-lg text-muted-foreground">Bring headphones. Step into a booth and everyone inside hears each other; your mic starts muted.</p>
        <EventCta slug={slug} state={state} />
      </section>
    </div>
  );
}
