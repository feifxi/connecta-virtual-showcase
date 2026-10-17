import Link from "next/link";
import { Icon, Kpis, Pill, Workspace } from "@/components/ui";
import { PROJECTS } from "@/lib/data";
import { ExportActions } from "./export-actions";

const ATTENDANCE = [32, 48, 66, 74, 70, 58, 80, 100, 92, 76, 54, 30];
const HEAT = [[1, 2, 4, 4, 2, 1, 0, 0], [2, 5, 9, 8, 4, 3, 2, 1], [1, 3, 6, 7, 5, 6, 4, 2], [0, 2, 3, 4, 6, 8, 5, 2]];
const TYPES: [string, number][] = [["University students", 46], ["High school students", 21], ["Companies", 14], ["Alumni", 9], ["Parents", 6], ["Teachers", 4]];

export default function Analytics() {
  const ranked = [...PROJECTS].sort((a, b) => b.score - a.score);
  const top = Math.max(...PROJECTS.map((p) => p.visits));
  return (
    <Workspace active="Event report">
      <div className="breadcrumb"><Link href="/manage/senior-design-2026">Your showcase</Link><Icon name="chevron" /><span>Event report</span></div>
      <div className="section-heading"><div><h1>Every connection, counted.</h1><p>Senior Design Showcase 2026 · ended 16:00 · Exhibition open until 15 Nov</p></div><ExportActions /></div>
      <Kpis items={[["Interested", "512", "before the event", "bell"], ["Joined", "438", "371 from Interested · 67 didn't", "checkCircle"], ["Peak in hall", "211", "At 13:30 ICT", "chart"], ["Avg. time in hall", "47 min", "6.2 booths visited each", "clock"]]} />
      <div className="analytics-grid">
        <div className="stack">
          <section className="surface chart-card">
            <div className="chart-head"><h3>People in the hall</h3><Pill cls="blue">Event day</Pill></div>
            <div className="chart" role="img" aria-label="Attendance peaks at 211 at 13:30">{ATTENDANCE.map((v, i) => <div key={i} className="chart-bar" style={{ ["--bar" as string]: `${v}%`, ["--delay" as string]: `${i * 25}ms` }}><span className="chart-tip">{Math.round(v * 2.11)} people</span></div>)}</div>
            <div className="chart-labels"><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span></div>
          </section>
          <section className="surface chart-card">
            <div className="chart-head"><h3>Where people spent time</h3><small>Heatmap of the hall</small></div>
            <div className="heat" role="img" aria-label="Busiest around the Computing zone">{HEAT.flat().map((v, i) => <i key={i} style={{ background: `rgb(29 92 245 / ${0.06 + v * 0.1})` }} />)}</div>
            <p className="field-note" style={{ marginTop: 10 }}>Busiest: Computing zone (booths 02 and 06). Quiet: the back-right corner.</p>
          </section>
          <section className="surface chart-card">
            <div className="chart-head"><h3>Booths</h3><small>Visits · passed by without entering</small></div>
            <div className="booth-bars">{[...PROJECTS].sort((a, b) => b.visits - a.visits).map((p) => <div key={p.code} className="booth-bar-row"><span>{p.code}</span><div className="bar-track"><div className="bar-fill" style={{ ["--bar" as string]: `${(p.visits / top) * 100}%` }} /></div><strong>{p.visits}</strong></div>)}</div>
            <p className="field-note" style={{ marginTop: 12 }}>Booth 04 had 64 people walk past without going in — check its cover and title.</p>
          </section>
        </div>
        <div className="stack">
          <section className="surface chart-card">
            <div className="chart-head"><h3>Judging results</h3><small>Weighted · / 10</small></div>
            {ranked.map((p, i) => <div key={p.code} className="ranking-row"><span className="rank-num">{i + 1}</span><div className="rank-info"><strong>{p.title}</strong><small>Booth {p.code} · {p.votes} votes</small></div><span className="rank-score">{p.score.toFixed(1)}</span></div>)}
            <div className="info-note" style={{ marginTop: 18 }}><Icon name="shield" />Results stay private until an admin announces them from Judging.</div>
          </section>
          <section className="surface chart-card">
            <div className="chart-head"><h3>Who came</h3><small>From 23 provinces</small></div>
            <div className="booth-bars">{TYPES.map(([k, v]) => <div key={k} className="booth-bar-row" style={{ gridTemplateColumns: "150px 1fr 36px" }}><span style={{ color: "var(--ink-2)", fontWeight: 500 }}>{k}</span><div className="bar-track"><div className="bar-fill" style={{ ["--bar" as string]: `${v * 2}%`, background: "var(--blue)" }} /></div><strong>{v}%</strong></div>)}</div>
          </section>
        </div>
      </div>
    </Workspace>
  );
}
