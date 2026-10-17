"use client";

import Link from "next/link";
import { useState } from "react";
import { EventArt, Icon, Pill, RoleChip, Status } from "@/components/ui";
import { MY_EVENTS, type Role } from "@/lib/data";

type MyEvent = (typeof MY_EVENTS)[number];

const FILTERS: [string, Role | null][] = [["All", null], ["Admin", "Admin"], ["Presenting", "Presenter"], ["Judging", "Judge"], ["Interested & attended", "Visitor"]];

const action = (e: MyEvent): [string, string] =>
  e.role === "Admin" ? ["Manage", `/manage/${e.slug === "senior-design-2026" ? e.slug : "senior-design-2026"}`]
  : e.role === "Presenter" ? ["Edit my booth", "/e/senior-design-2026/my-booth"]
  : e.role === "Judge" ? ["My judging list", "/e/senior-design-2026/judge"]
  : ["Visit", "/e/senior-design-2026?state=exhibition"];

const ART: Record<string, [React.ReactNode, number]> = {
  "greener-tomorrow": [<>Good ideas.<br />Greener futures.</>, 9],
  "capstone-demo": [<>Made here.<br />Shared everywhere.</>, 7],
  "it-open-house": [<>Open house.<br />Come say hi.</>, 4],
};

const foot = (e: MyEvent) => e.state === "Live" ? "211 in the hall now" : e.state === "Exhibition" ? "Projects open to browse" : "Opens on the day";

export function MyEventGrid() {
  const [filter, setFilter] = useState<Role | null>(null);
  const shown = MY_EVENTS.filter((e) => !filter || e.role === filter);
  return (
    <>
      <div className="chips" style={{ marginBottom: 22 }}>
        {FILTERS.map(([l, r]) => <button key={l} type="button" className={`chip ${filter === r ? "active" : ""}`} aria-pressed={filter === r} onClick={() => setFilter(r)}>{l}</button>)}
      </div>
      <div className="event-grid">
        {shown.map((e) => {
          const [label, href] = action(e);
          const [title, actor] = ART[e.slug] ?? [null, undefined];
          return (
            <article key={e.slug} className="event-card">
              <Link href={href} className="event-image" aria-label={e.name}>
                <EventArt art={e.art} title={title} sub={e.date} actor={actor} />
                {e.state === "Live" ? <Status /> : <Pill cls="light">{e.state === "Published" ? "Upcoming" : e.state}</Pill>}
              </Link>
              <div className="event-card-body">
                <RoleChip role={e.role} />
                <h3>{e.name}</h3>
                <p>{e.date} · {e.people} interested</p>
                <div className="event-card-foot"><span>{foot(e)}</span><Link href={href} className="text-link">{label} <Icon name="arrow" /></Link></div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
