import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Chip } from "@/components/brand";
import { ManageShell } from "@/components/shells";
import { booths, event, hourly, toneOf, visitorTypes } from "@/lib/mock";
import { cn } from "@/lib/utils";

const card = "rounded-3xl bg-card p-6 ring-1 ring-border/70";
const peak = Math.max(...hourly.map((h) => h.v));
const funnel = [
  { k: "Interested", v: 512 },
  { k: "Joined (from Interested)", v: 357 },
  { k: "Visited 3+ booths", v: 301 },
  { k: "Left feedback", v: 127 },
];
// heatmap: 8 x 5 cells of the hall, darker = more time spent
const heat = [
  [1, 2, 4, 4, 2, 1, 0, 0], [2, 5, 9, 8, 4, 3, 2, 1], [1, 3, 6, 7, 5, 6, 4, 2], [0, 2, 3, 4, 6, 8, 5, 2], [0, 1, 1, 2, 3, 4, 2, 1],
];
const heatColor = ["bg-[#EEF0FA]", "bg-[#DDE1FB]", "bg-[#C9CEF8]", "bg-[#B3B9F5]", "bg-[#9AA4F2]", "bg-[#7C87F0]", "bg-[#6672EC]", "bg-[#5561EA]", "bg-[#4655E8]", "bg-[#3442D6]"];

export default async function Analytics({ params }: PageProps<"/manage/[slug]/analytics">) {
  const { slug } = await params;
  return (
    <ManageShell slug={slug} name={event.name} active="analytics">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Chip tone="mint" className="px-3 py-1">Ended Apr 24 · Exhibition open until May 24</Chip>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">How the event went</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl px-5 font-semibold")}><Download className="size-4" aria-hidden="true" />Export CSV</button>
            <button type="button" className={cn(buttonVariants(), "h-11 rounded-xl px-5 font-semibold")}><Download className="size-4" aria-hidden="true" />Export PDF</button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Joined", "418", "357 clicked Interested first · 61 didn't"],
            ["Avg. time in hall", "1 h 42 m", "per person"],
            ["Booth visits", "2,914", "7.0 per person"],
            ["Feedback · votes", "312 · 1,840", "for 28 teams"],
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
            <h2 className="text-lg font-bold">Interested → came</h2>
            {funnel.map((f, i) => (
              <div key={f.k} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[15px]"><span className="font-semibold">{f.k}</span><span className="text-muted-foreground">{f.v}</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", ["bg-primary", "bg-[#7C87F0]", "bg-[#A5ADF5]", "bg-[#C9CEF8]"][i])} style={{ width: `${(f.v / funnel[0].v) * 100}%` }} />
                </div>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">70% of people who clicked Interested came. 61 more came straight from a shared link.</p>
          </section>
        </div>

        <div className="flex flex-wrap gap-6">
          <section className={cn(card, "min-w-0 flex-[1_1_360px]")}>
            <h2 className="text-lg font-bold">Where people spent time</h2>
            <div className="mt-4 grid grid-cols-8 gap-1 rounded-2xl bg-muted p-2" role="img" aria-label="Heatmap of the hall: busiest around the AI zone and booth 04">
              {heat.flat().map((v, i) => <span key={i} className={cn("aspect-square rounded-[4px]", heatColor[v])} />)}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Busiest: AI & Data zone and Games (booth 04). Quiet corner: the back-right lounge.</p>
          </section>
          <section className={cn(card, "flex min-w-0 flex-[1_1_300px] flex-col gap-3")}>
            <h2 className="text-lg font-bold">Who came</h2>
            {visitorTypes.map((t) => (
              <div key={t.k} className="flex items-center gap-3 text-[15px]">
                <span className="w-44 shrink-0">{t.k}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${t.v * 2}%` }} /></div>
                <span className="w-10 text-right text-sm text-muted-foreground">{t.v}%</span>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">From 23 provinces · 38% outside Bangkok.</p>
          </section>
        </div>

        <section className={cn(card, "p-0")}>
          <h2 className="px-6 pt-6 text-lg font-bold">Booths</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[760px] text-[15px]">
              <thead>
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="px-6 py-3 font-semibold">Booth</th>
                  <th className="px-3 py-3 text-right font-semibold">Visits</th>
                  <th className="px-3 py-3 text-right font-semibold">Passed by</th>
                  <th className="px-3 py-3 text-right font-semibold">Avg. stay</th>
                  <th className="px-3 py-3 text-right font-semibold">Feedback</th>
                  <th className="px-3 py-3 text-right font-semibold">Votes</th>
                  <th className="px-6 py-3 text-right font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {booths.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="px-6 py-3"><div className="font-semibold">{b.title}</div><Chip tone={toneOf(b.category)} className="mt-1">{b.category}</Chip></td>
                    <td className="px-3 py-3 text-right">{b.visits}</td>
                    <td className={cn("px-3 py-3 text-right", b.passedBy > b.visits && "font-semibold text-peach-ink")}>{b.passedBy}</td>
                    <td className="px-3 py-3 text-right">{b.avgMinutes} min</td>
                    <td className="px-3 py-3 text-right">{b.feedback}</td>
                    <td className="px-3 py-3 text-right">{b.votes}</td>
                    <td className="px-6 py-3 text-right font-semibold">{b.score || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-6 py-4 text-sm text-muted-foreground">“Passed by” = walked in front of the booth without going in. High numbers mean the cover or title didn&rsquo;t pull people in.</p>
        </section>
      </div>
    </ManageShell>
  );
}
