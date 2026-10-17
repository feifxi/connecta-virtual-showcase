import Link from "next/link";
import { ArrowRight, Eye, RotateCw, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Actor } from "@/components/actor";
import { Initials, Logo } from "@/components/brand";
import { bigButton } from "@/components/shells";
import { ME, event, visitorTypeOptions } from "@/lib/mock";
import { cn } from "@/lib/utils";

const field = "h-11 rounded-xl px-4 text-[15px]";

// First time entering an event's hall (every role) · ?full=1 shows the hall-full state for visitors
export default async function Join({ params, searchParams }: PageProps<"/e/[slug]/join">) {
  const { slug } = await params;
  const q = await searchParams;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Logo href="/home" />
          <Link href={q.full ? "?" : "?full=1"} className="text-xs font-semibold text-muted-foreground hover:text-foreground">Mockup · {q.full ? "show the form" : "show “hall is full”"}</Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 py-12">
        {q.full ? (
          <section className="flex flex-col items-center gap-4 rounded-3xl bg-card p-8 text-center ring-1 ring-border/70">
            <div className="flex items-end" aria-hidden="true">
              <Actor index={ME.avatar} direction={1} className="size-20" />
              <span className="mb-3 inline-flex size-12 items-center justify-center rounded-2xl bg-peach text-peach-ink"><Users className="size-6" /></span>
              <Actor index={3} direction={2} className="size-16 opacity-60" />
            </div>
            <h1 className="text-2xl font-bold">Hall is full</h1>
            <p className="text-[15px] text-muted-foreground">{event.capacity} of {event.capacity} people are in the hall right now. Seats free up as people leave — try again in a minute.</p>
            <button type="button" className={cn(buttonVariants(), bigButton)}><RotateCw className="size-4" aria-hidden="true" />Try again</button>
            <Link href={`/e/${slug}`} className="text-sm font-semibold text-muted-foreground hover:text-foreground">Browse the projects meanwhile</Link>
          </section>
        ) : (
          <form action={`/e/${slug}/hall`} className="flex flex-col gap-6 rounded-3xl bg-card p-8 ring-1 ring-border/70">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">{event.name}</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">Before you go in</h1>
                <p className="mt-1 text-[15px] text-muted-foreground">Only the first time for this event.</p>
              </div>
              <Actor index={ME.avatar} walk direction={0} name="You" you className="size-20" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="dn" className="font-semibold">Your name in this event</Label>
              <Input id="dn" defaultValue="Ploy Srisuk" className={field} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="vt" className="font-semibold">Coming as</Label>
              <select id="vt" defaultValue={visitorTypeOptions[0]} className={cn(field, "border border-input bg-transparent")}>
                {visitorTypeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
              <p className="text-sm text-muted-foreground">From your profile. Change it just for this event, e.g. if you come as an alumnus.</p>
            </div>

            <fieldset className="flex flex-col gap-3 rounded-2xl bg-muted p-5">
              <legend className="sr-only">Questions from the organizer</legend>
              <p className="text-sm font-bold">From the organizer</p>
              <Label htmlFor="q1" className="font-semibold">How did you hear about this event?</Label>
              <select id="q1" className={cn(field, "border border-input bg-card")}>
                <option>Faculty Facebook page</option><option>A friend</option><option>My teacher</option><option>Other</option>
              </select>
              <p className="text-xs text-muted-foreground">Used for: planning next year&rsquo;s publicity.</p>
            </fieldset>

            <div className="flex items-start gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground">
              <Eye className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span className="flex flex-wrap items-center gap-1.5">People in this event will see <Initials name="Ploy" size="sm" /> <b>Ploy Srisuk</b> · SIT, KMUTT · 4th year. <Link href="/profile" className="font-semibold underline">Edit profile</Link></span>
            </div>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox className="mt-0.5" />
              <span>Email me about future events from this organizer.</span>
            </label>

            <button type="submit" className={cn(buttonVariants(), bigButton)}>Enter the hall <ArrowRight className="size-4" aria-hidden="true" /></button>
            <p className="text-center text-xs text-muted-foreground">Your mic starts muted. You choose when to talk.</p>
          </form>
        )}
      </main>
    </div>
  );
}
