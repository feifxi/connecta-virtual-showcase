"use client";

import Link from "next/link";
import { useState } from "react";
import { Btn, Empty, EventArt, Header, Icon, Pill, Status } from "@/components/ui";
import { EXPLORE } from "@/lib/data";

const FILTERS = ["All events", "Live now", "Upcoming", "Exhibition"] as const;

// Explore: every event is listed, each with its access badge
export default function Explore() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All events");
  const [q, setQ] = useState("");
  const shown = EXPLORE.filter((e) => (filter === "All events" || (filter === "Live now" ? e.state === "Live" : filter === "Upcoming" ? e.state === "Published" : false)) && e.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <Header active="Events" />
      <main id="main" className="page container page-content">
        <div className="page-title"><h1>Explore events</h1><p>Every event on Connecta. A lock badge means only one university&rsquo;s accounts can join as visitors.</p></div>
        <div className="project-toolbar">
          <div className="chips">{FILTERS.map((f) => <button key={f} type="button" className={`chip ${filter === f ? "active" : ""}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}</div>
          <div className="search"><Icon name="search" /><input className="search-input" type="search" aria-label="Search events" placeholder="Search events…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        </div>
        <div className="event-grid">
          {shown.length ? shown.map((e, i) => (
            <article key={e.slug} className="event-card">
              <Link href={`/e/senior-design-2026${e.state === "Live" ? "" : "?state=published"}`} className="event-image" aria-label={`View ${e.name}`}>
                <EventArt art={e.art} title={i === 1 ? <>Good ideas.<br />Greener futures.</> : <>Made here.<br />Shared everywhere.</>} sub={e.host} actor={i === 1 ? 9 : 7} />
                {e.state === "Live" ? <Status /> : <Pill cls="light">Upcoming</Pill>}
              </Link>
              <div className="event-card-body">
                <span className="small-text muted">{e.date}</span>
                <h3>{e.name}</h3>
                <p>{e.host}</p>
                <Pill cls={e.access.startsWith("@") ? "lav" : "green"} style={{ marginTop: 10 }}>{e.access.startsWith("@") ? "🔒 " : ""}{e.access}</Pill>
                <div className="event-card-foot"><span className="flex"><Icon name="grid" />{e.booths} booths</span><Link href={`/e/senior-design-2026${e.state === "Live" ? "" : "?state=published"}`} className="text-link">{e.state === "Live" ? "Join" : "Interested"} <Icon name="arrow" /></Link></div>
              </div>
            </article>
          )) : <Empty title={filter === "Exhibition" ? "No exhibitions open right now" : "No events found"} text="Try another search or browse all events." />}
        </div>
        <div className="event-summary-strip"><div><h3>Your ideas deserve an audience.</h3><p>Planning a showcase for your class or department? Free up to 50 people at once.</p></div><Btn href="/manage/new" cls="secondary small" icon="plus">Create an event</Btn></div>
      </main>
    </>
  );
}
