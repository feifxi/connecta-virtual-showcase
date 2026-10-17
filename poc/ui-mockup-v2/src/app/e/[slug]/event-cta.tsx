"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui";
import type { EventState } from "@/lib/data";

// Main button by event state: Interested (before, not a seat booking) · Join (live) · Visit (exhibition)
export function EventCta({ slug, state }: { slug: string; state: EventState }) {
  const [interested, setInterested] = useState(false);
  if (state === "live") return <Link className="btn" href={`/e/${slug}/join`}>Join <Icon name="arrow" /></Link>;
  if (state === "exhibition") return <Link className="btn" href={`/e/${slug}/hall`}>Visit the exhibition <Icon name="arrow" /></Link>;
  return (
    <>
      <button type="button" className={`btn ${interested ? "secondary" : ""}`} aria-pressed={interested} onClick={() => setInterested(!interested)}>
        <Icon name={interested ? "checkCircle" : "bell"} />{interested ? "Interested" : "I'm interested"}
      </button>
      {interested && <button type="button" className="btn secondary small"><Icon name="calendar" />Add to calendar</button>}
      <span className="registered">{interested ? "We'll remind you in the app when the hall opens." : "Get a reminder. Not a seat booking."}</span>
    </>
  );
}
