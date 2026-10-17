import Link from "next/link";
import { Logo } from "@/components/ui";
import { ATTENDANCE, EVENT, KPIS, RESULTS, VISITS } from "@/lib/data";
import { ReportActions } from "./report-actions";

const card = "rounded-[18px] border border-line bg-white";
const HOURS = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"];

export default async function Report({ params }: PageProps<"/manage/[slug]/report">) {
  const { slug } = await params;
  const top = VISITS[0][1];
  return (
    <main className="mx-auto flex min-h-screen max-w-[1200px] flex-col gap-[18px] px-9 py-7">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="mb-3 inline-block"><Logo size={22} /></Link>
          <div className="text-sm text-muted">{EVENT.name} · ended 16:00 · <Link href={`/e/${slug}`} className="font-semibold text-primary hover:text-primary-hover">Event page</Link></div>
          <h1 className="mt-0.5 text-[34px] font-extrabold tracking-[-0.03em]">Event report</h1>
        </div>
        <ReportActions />
      </div>

      <div className="grid grid-cols-4 gap-3.5">
        {KPIS.map((k) => (
          <div key={k.label} className={`${card} px-5 py-4`}>
            <div className="text-[13px] font-medium text-muted">{k.label}</div>
            <div className="text-4xl font-extrabold tracking-[-0.03em] tabular-nums">{k.value}</div>
            <div className="text-[13px] font-semibold text-success">{k.note}</div>
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-[1fr_1.05fr] gap-3.5">
        <div className="flex flex-col gap-3.5">
          <section className={`${card} flex min-h-[230px] flex-1 flex-col gap-2.5 px-5 py-[18px]`}>
            <h2 className="text-base font-bold">People in the hall</h2>
            <div className="flex flex-1 items-end gap-2 border-b border-line" role="img" aria-label="People in the hall by half hour, peaking at 211 at 13:30">
              {ATTENDANCE.map((v, i) => (
                <div key={i} title={`${HOURS[i]} · ${Math.round((v / 100) * 211)} people`} className="flex-1 rounded-t-md bg-primary hover:bg-primary-hover" style={{ height: `${v}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted"><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span></div>
          </section>
          <section className={`${card} flex flex-col gap-[9px] px-5 py-4`}>
            <h2 className="text-base font-bold">Most visited booths</h2>
            {VISITS.map(([code, n]) => (
              <div key={code} className="grid grid-cols-[40px_1fr_40px] items-center gap-2.5 text-[13px] font-semibold">
                <span className="text-primary">{code}</span>
                <div className="h-2.5 rounded-full bg-subtle"><div className="h-2.5 rounded-full bg-accent" style={{ width: `${Math.round((n / top) * 100)}%` }} /></div>
                <span className="text-right tabular-nums">{n}</span>
              </div>
            ))}
          </section>
        </div>
        <section className={`${card} flex flex-col px-5 py-[18px]`}>
          <div className="mb-1.5 flex items-baseline justify-between"><h2 className="text-base font-bold">Judging results</h2><span className="text-xs text-muted">Mean score /10</span></div>
          <ol>
            {RESULTS.map((j) => (
              <li key={j.rank} className="grid grid-cols-[36px_1fr_56px] items-center gap-3 border-t border-subtle py-2.5">
                <span className="grid size-[30px] place-items-center rounded-[9px] bg-primary-tint text-[13px] font-bold text-primary">{j.rank}</span>
                <div>
                  <div className="text-sm font-semibold leading-tight">{j.title}</div>
                  <div className="text-xs text-muted">{j.booth} · {j.judges} judges</div>
                </div>
                <span className="text-right text-[19px] font-extrabold tabular-nums">{j.score.toFixed(1)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
