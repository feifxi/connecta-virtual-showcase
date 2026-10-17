"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { BoothBadge } from "@/components/ui";
import { FILTERS, PROJECTS, type Filter } from "@/lib/data";

export function ProjectGrid({ slug }: { slug: string }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const shown = PROJECTS.filter((p) =>
    (filter === "All" || (filter === "Live now" ? p.live : p.group === filter)) &&
    (!term || [p.title, p.dept, p.booth, p.supervisor].some((s) => s.toLowerCase().includes(term))),
  );

  return (
    <>
      <div className="flex items-center gap-2">
        <h2 className="mr-4 text-[22px] font-extrabold tracking-[-0.02em]">Projects</h2>
        <div role="group" aria-label="Filter projects" className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
              className={`rounded-full border border-line px-3.5 py-[7px] text-[13px] font-semibold transition-colors ${f === filter ? "bg-ink text-white" : "bg-white text-ink-2 hover:border-input"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="relative ml-auto">
          <span className="sr-only">Search projects or teams</span>
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects or teams"
            className="h-[38px] w-[260px] rounded-[10px] border border-input bg-white pl-10 pr-3.5 text-sm placeholder:text-faint focus:border-primary focus:outline-none"
          />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {shown.map((p) => (
          <Link
            key={p.booth}
            href={`/e/${slug}/hall?booth=${p.booth}`}
            className="flex h-[132px] flex-col gap-2 rounded-[18px] border border-line bg-white px-5 py-[18px] transition hover:border-primary-light hover:shadow-card"
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <BoothBadge>Booth {p.booth}</BoothBadge>
              {p.live ? <span className="whitespace-nowrap text-live">● Presenting · {p.visitors} here</span> : <span className="whitespace-nowrap text-faint">{p.status}</span>}
            </div>
            <div className="text-pretty text-base font-bold leading-[1.3] tracking-[-0.01em]">{p.title}</div>
            <div className="mt-auto text-[13px] text-muted">{p.dept}</div>
          </Link>
        ))}
        {!shown.length && (
          <div className="col-span-3 rounded-[18px] border border-dashed border-input bg-white p-8 text-center text-sm text-muted">
            No projects match. <button type="button" className="font-semibold text-primary" onClick={() => { setFilter("All"); setQ(""); }}>Clear filters</button>
          </div>
        )}
      </div>
    </>
  );
}
