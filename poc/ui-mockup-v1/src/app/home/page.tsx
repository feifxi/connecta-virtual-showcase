import Link from "next/link";
import { ArrowRight, CalendarDays, Mail, Plus, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { RoleChip } from "@/components/brand";
import { AppHeader, bigButton } from "@/components/shells";
import { invites, myEvents, toneClass, type MyEvent } from "@/lib/mock";
import { cn } from "@/lib/utils";

const stateStyle: Record<MyEvent["state"], string> = {
  Live: "bg-primary text-primary-foreground",
  Published: "bg-secondary text-secondary-foreground",
  Draft: "bg-butter text-butter-ink",
  Exhibition: "bg-mint text-mint-ink",
  Archived: "bg-muted text-muted-foreground",
};

function actionFor(e: MyEvent) {
  if (e.role === "Admin") return { label: e.state === "Draft" ? "Continue setup" : "Manage", href: `/manage/${e.slug}` };
  if (e.role === "Presenter") return { label: "Edit my booth", href: `/e/${e.slug}/my-booth` };
  if (e.role === "Judge") return { label: "My judging list", href: `/e/${e.slug}/judge` };
  return { label: e.state === "Exhibition" ? "Visit the exhibition" : "Open event", href: `/e/${e.slug}` };
}

export default function Home() {
  const live = myEvents.find((e) => e.state === "Live");
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hi Ploy, here are your events</h1>
            <p className="mt-1 text-muted-foreground">Everything you organize, present at, judge or attend.</p>
          </div>
          <Link href="/manage/new" className={cn(buttonVariants(), bigButton)}>
            <Plus className="size-4" aria-hidden="true" /> Create event
          </Link>
        </div>

        {invites.length > 0 && (
          <section className="flex flex-col gap-3" aria-label="Pending invitations">
            {invites.map((i) => (
              <div key={i.token} className="flex flex-wrap items-center gap-4 rounded-3xl bg-card px-6 py-5 ring-2 ring-butter">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-butter text-butter-ink"><Mail className="size-5" aria-hidden="true" /></span>
                <div className="min-w-0 flex-[999_1_280px]">
                  <div className="font-bold">{i.by} invited you to judge <span className="text-primary">{i.event}</span></div>
                  <div className="text-sm text-muted-foreground">{i.date} · expires in 12 days</div>
                </div>
                <Link href={`/invite/${i.token}`} className={cn(buttonVariants(), "h-10 rounded-xl px-4 font-semibold")}>View invitation</Link>
              </div>
            ))}
          </section>
        )}

        {live && (
          <section className="flex flex-wrap items-center gap-6 rounded-3xl bg-primary px-8 py-7 text-primary-foreground">
            <div className="min-w-0 flex-[999_1_360px]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                <span className="size-2 animate-pulse rounded-full bg-white" aria-hidden="true" /> Happening now
              </span>
              <h2 className="mt-3 text-2xl font-bold">{live.name}</h2>
              <p className="mt-1 text-primary-foreground/85">137 people are in the hall · 21 booths are Live · ends 4:00 PM</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/e/${live.slug}/hall`} className={cn(buttonVariants({ variant: "secondary" }), bigButton)}>Enter the hall</Link>
              <Link href={`/manage/${live.slug}`} className={cn(bigButton, "inline-flex items-center gap-2 border border-white/40 text-primary-foreground hover:bg-white/10")}>
                Dashboard <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by role">
          {["All", "Admin", "Presenting", "Judging", "Interested & attended"].map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={i === 0} className={cn("h-10 rounded-full px-4 text-sm font-semibold", i === 0 ? "bg-foreground text-background" : "bg-card text-muted-foreground ring-1 ring-border hover:text-foreground")}>
              {t}
            </button>
          ))}
        </div>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Your events">
          {myEvents.map((e) => {
            const a = actionFor(e);
            return (
              <article key={e.slug} className="flex flex-col overflow-hidden rounded-3xl bg-card shadow-[0_1px_0_var(--border)] ring-1 ring-border/60">
                <div className={cn("relative h-28", toneClass[e.tone])}>
                  <svg className="absolute inset-0 size-full opacity-60" aria-hidden="true">
                    <pattern id={`p-${e.slug}`} width="26" height="26" patternUnits="userSpaceOnUse">
                      <rect x="4" y="4" width="14" height="10" rx="3" fill="currentColor" opacity="0.18" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#p-${e.slug})`} />
                  </svg>
                  <span className={cn("absolute left-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-bold", stateStyle[e.state])}>{e.state}</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <RoleChip role={e.role} className="self-start" />
                  <h3 className="text-lg font-bold leading-snug">{e.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden="true" />{e.date}</span>
                    {e.people > 0 && <span className="inline-flex items-center gap-1.5"><Users className="size-4" aria-hidden="true" />{e.people} interested</span>}
                  </div>
                  <Link href={a.href} className={cn(buttonVariants({ variant: e.role === "Admin" ? "default" : "outline" }), "mt-auto h-10 rounded-xl text-sm font-semibold")}>
                    {a.label}
                  </Link>
                </div>
              </article>
            );
          })}
          <Link href="/manage/new" className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-input p-6 text-center text-muted-foreground hover:border-primary hover:text-primary">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground"><Plus className="size-6" aria-hidden="true" /></span>
            <span className="font-semibold">Start a new event</span>
            <span className="max-w-56 text-sm">A capstone day, a class poster session or an open house.</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
