import { Download, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Chip } from "@/components/brand";
import { ManageShell } from "@/components/shells";
import { booths, event, hourly, toneOf } from "@/lib/mock";
import { cn } from "@/lib/utils";

const card = "rounded-3xl bg-card p-6 ring-1 ring-border/70";
const peak = Math.max(...hourly.map((h) => h.v));
const ranked = [...booths].filter((b) => b.score > 0).sort((a, b) => b.score - a.score);
const funnel = [
  { k: "Registered", v: 642 },
  { k: "Checked in", v: 418 },
  { k: "Visited 3+ booths", v: 301 },
  { k: "Left feedback", v: 127 },
];

export default async function Analytics({ params }: PageProps<"/manage/[slug]/analytics">) {
  const { slug } = await params;
  return (
    <ManageShell slug={slug} name={event.name} active="analytics">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Chip tone="mint" className="px-3 py-1">Event ended · Apr 24, 2027</Chip>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">How the event went</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl px-5 font-semibold")}><Download className="size-4" aria-hidden="true" />Export CSV</button>
            <button type="button" className={cn(buttonVariants(), "h-11 rounded-xl px-5 font-semibold")}>Share report</button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Attendees", "418", "65% of registrations"],
            ["Avg. time in hall", "1 h 42 m", "per attendee"],
            ["Booth visits", "2,914", "7.0 per attendee"],
            ["Feedback notes", "312", "for 39 teams"],
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
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold">People in the hall</h2>
              <span className="text-sm text-muted-foreground">Peak {peak} at 11 AM</span>
            </div>
            <figure className="mt-6">
              <div className="flex h-52 items-end gap-3" role="img" aria-label={`People in the hall by hour, peaking at ${peak} at 11 AM`}>
                {hourly.map((h) => (
                  <div key={h.h} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">{h.v}</span>
                    <div className={cn("w-full max-w-12 rounded-t-xl", h.v === peak ? "bg-primary" : "bg-[#C9CEF8]")} style={{ height: `${(h.v / peak) * 85}%` }} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-3 border-t border-border pt-2">
                {hourly.map((h) => <span key={h.h} className="flex-1 text-center text-xs text-muted-foreground">{h.h}{Number(h.h) >= 9 && Number(h.h) <= 11 ? "am" : "pm"}</span>)}
              </div>
            </figure>
          </section>

          <section className={cn(card, "flex min-w-0 flex-[1_1_300px] flex-col gap-4")}>
            <h2 className="text-lg font-bold">Attendee journey</h2>
            {funnel.map((f, i) => (
              <div key={f.k} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[15px]"><span className="font-semibold">{f.k}</span><span className="text-muted-foreground">{f.v}</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", ["bg-primary", "bg-[#7C87F0]", "bg-[#A5ADF5]", "bg-[#C9CEF8]"][i])} style={{ width: `${(f.v / funnel[0].v) * 100}%` }} />
                </div>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">35% of registrations didn&rsquo;t show up. Reminder emails went out 1 day before.</p>
          </section>
        </div>

        <div className="flex flex-wrap gap-6">
          <section className={cn(card, "min-w-0 flex-[1_1_320px]")}>
            <h2 className="flex items-center gap-2 text-lg font-bold"><Trophy className="size-5 text-butter-ink" aria-hidden="true" />Judging results</h2>
            <ol className="mt-4 flex flex-col gap-3">
              {ranked.map((b, i) => (
                <li key={b.id} className={cn("flex items-center gap-4 rounded-2xl px-4 py-3", i === 0 ? "bg-butter text-butter-ink" : "bg-muted")}>
                  <span className="w-6 text-lg font-bold">{i + 1}</span>
                  <span className="min-w-0 flex-1 font-semibold">{b.title}</span>
                  <span className="text-lg font-bold">{b.score}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className={cn(card, "min-w-0 flex-[2_1_480px] p-0")}>
            <h2 className="px-6 pt-6 text-lg font-bold">Booths</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[620px] text-[15px]">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="px-6 py-3 font-semibold">Booth</th>
                    <th className="px-3 py-3 text-right font-semibold">Visits</th>
                    <th className="px-3 py-3 text-right font-semibold">Avg. stay</th>
                    <th className="px-3 py-3 text-right font-semibold">Feedback</th>
                    <th className="px-6 py-3 text-right font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {booths.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-6 py-3"><div className="font-semibold">{b.title}</div><Chip tone={toneOf(b.category)} className="mt-1">{b.category}</Chip></td>
                      <td className="px-3 py-3 text-right">{b.visits}</td>
                      <td className="px-3 py-3 text-right">{b.avgMinutes} min</td>
                      <td className="px-3 py-3 text-right">{b.feedback}</td>
                      <td className="px-6 py-3 text-right font-semibold">{b.score || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </ManageShell>
  );
}
