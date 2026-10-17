import Link from "next/link";
import { ArrowRight, ChartColumn, ClipboardCheck, Footprints, Mic, MonitorUp, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HallMap } from "@/components/hall-map";
import { Chip, Logo } from "@/components/brand";
import { PublicHeader, bigButton } from "@/components/shells";
import { cn } from "@/lib/utils";
import { toneClass } from "@/lib/mock";

const steps = [
  { icon: Footprints, title: "Walk the hall", text: "Move your avatar between booths like a real exhibition floor. See which booths are busy before you go in.", tone: "sky" as const },
  { icon: Mic, title: "Talk when you're close", text: "Voices fade in as you approach and fade out as you leave. No meeting links, no waiting room.", tone: "mint" as const },
  { icon: MonitorUp, title: "Watch the demo", text: "Step inside a booth to see the team's shared screen, slides and poster up close.", tone: "peach" as const },
];

const organizerPoints = [
  { icon: ClipboardCheck, title: "Judging built in", text: "Rubrics, judge assignments and live scoring progress in one place." },
  { icon: ChartColumn, title: "Know what happened", text: "Visits, time spent per booth and feedback for every team after the event." },
  { icon: Sparkles, title: "Set up in an afternoon", text: "Pick a hall template, invite teams by email and they fill in their own booths." },
];

export default function Landing() {
  return (
    <div className="bg-card">
      <PublicHeader />

      <section className="mx-auto flex max-w-6xl flex-wrap items-center gap-12 px-6 pb-16 pt-14">
        <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-6">
          <Chip tone="butter" className="self-start px-3 py-1 text-[13px]">For capstone days, poster sessions and project fairs</Chip>
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            Project showcases people actually <span className="text-primary">walk through</span>.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Connecta turns an online event into a hall of booths. Visitors stroll around, drop into conversations and talk to student teams face to face — from any browser.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className={cn(buttonVariants(), bigButton, "h-12 px-6")}>
              Host an event <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/e/sit-capstone-2027" className={cn(buttonVariants({ variant: "outline" }), bigButton, "h-12 px-6")}>
              Visit a live event
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">No install for visitors · Works in any modern browser</p>
        </div>
        <div className="flex-[1_1_420px]">
          <HallMap showMe className="shadow-[0_24px_60px_-30px_rgba(27,29,58,0.45)]" />
        </div>
      </section>

      <section id="how" className="bg-background py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">Feels like the real event, works from home</h2>
            <p className="mt-2 text-lg text-muted-foreground">Video calls make visitors wait in one room. A hall lets everyone wander, the way a project fair should feel.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text, tone }, i) => (
              <article key={title} className="flex flex-col gap-4 rounded-3xl bg-card p-7 shadow-[0_1px_0_var(--border)]">
                <div className="flex items-center justify-between">
                  <span className={cn("inline-flex size-12 items-center justify-center rounded-2xl", toneClass[tone])}>
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="organizers" className="mx-auto flex max-w-6xl flex-wrap items-start gap-12 px-6 py-20">
        <div className="flex-[1_1_320px]">
          <h2 className="text-3xl font-bold tracking-tight">Everything the organizing team needs</h2>
          <p className="mt-3 text-lg text-muted-foreground">From registration to the final score sheet, without stitching five tools together.</p>
          <Link href="/login" className={cn(buttonVariants(), bigButton, "mt-6")}>Create your first event</Link>
        </div>
        <div className="grid min-w-0 flex-[2_1_480px] gap-4 sm:grid-cols-3">
          {organizerPoints.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-3 rounded-3xl border border-border p-6">
              <Icon className="size-6 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-[15px] text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <Logo />
          <span>A capstone project by team CP26SSI3 · SIT, KMUTT</span>
          <Link href="#" className="hover:text-foreground">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
