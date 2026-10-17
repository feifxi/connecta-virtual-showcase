import Link from "next/link";
import { CalendarDays, Clock, Globe, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HallMap } from "@/components/hall-map";
import { AvatarStack, Chip, StatusBadge } from "@/components/brand";
import { PublicHeader, bigButton } from "@/components/shells";
import { booths, categories, event, toneClass, toneOf } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { RegisterDialog } from "./register-dialog";

export default async function EventPage({ params }: PageProps<"/e/[slug]">) {
  const { slug } = await params;
  return (
    <div className="bg-card">
      <PublicHeader />

      <section className="bg-secondary/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-10 px-6 py-14">
          <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Chip tone="mint" className="px-3 py-1">Registration open</Chip>
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
              <RegisterDialog slug={slug} />
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <AvatarStack names={["Mint", "Beam", "Fah", "Oat"]} extra={638} /> registered
              </span>
            </div>
          </div>
          <div className="flex-[1_1_380px]">
            <HallMap className="shadow-[0_24px_60px_-30px_rgba(27,29,58,0.45)]" />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[[event.works, "projects"], [event.categoriesCount, "categories"], [event.judges, "judges"]].map(([v, k]) => (
                <div key={k} className="rounded-2xl bg-card py-3"><div className="text-2xl font-bold">{v}</div><div className="text-sm text-muted-foreground">{k}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <p className="mt-1 text-muted-foreground">Status updates live during the event.</p>
          </div>
          <div className="relative w-80 max-w-full">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input aria-label="Search projects" placeholder="Search by title, team or topic" className="h-11 rounded-xl pl-10" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
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
                <StatusBadge status={b.status} />
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
        <Link href="#" className={cn(buttonVariants({ variant: "outline" }), bigButton, "self-center")}>Show all {event.works} projects</Link>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-10 px-6 py-16">
          <div className="flex-[1_1_280px]">
            <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
            <p className="mt-2 text-muted-foreground">Booths stay open all day. Teams present in their session.</p>
          </div>
          <ol className="flex min-w-0 flex-[2_1_480px] flex-col gap-3">
            {event.schedule.map((s, i) => (
              <li key={s.label} className="flex items-center gap-5 rounded-2xl bg-card px-6 py-4 ring-1 ring-border/70">
                <span className={cn("w-20 text-lg font-bold", i === 1 || i === 2 ? "text-primary" : "")}>{s.time}</span>
                <span className="font-semibold">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">See you in the hall</h2>
        <p className="max-w-lg text-muted-foreground">Bring headphones. You&rsquo;ll hear people near you, so you can join conversations naturally.</p>
        <RegisterDialog slug={slug} label="Register now" />
      </section>
    </div>
  );
}
