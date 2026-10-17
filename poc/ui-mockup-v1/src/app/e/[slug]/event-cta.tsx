"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bell, CalendarPlus, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { bigButton } from "@/components/shells";
import { cn } from "@/lib/utils";

export type EventState = "published" | "live" | "exhibition";

// The main button changes with the event state: Interested (before) · Join (live) · Visit (after)
export function EventCta({ slug, state }: { slug: string; state: EventState }) {
  const [interested, setInterested] = useState(false);

  if (state === "live")
    return (
      <Link href={`/e/${slug}/join`} className={cn(buttonVariants(), bigButton, "h-12 px-6")}>
        Join <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    );
  if (state === "exhibition")
    return (
      <Link href={`/e/${slug}/hall`} className={cn(buttonVariants(), bigButton, "h-12 px-6")}>
        Visit the exhibition <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    );
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => setInterested(!interested)} variant={interested ? "secondary" : "default"} className={cn(bigButton, "h-12 px-6")} aria-pressed={interested}>
        {interested ? <Check className="size-4" aria-hidden="true" /> : <Bell className="size-4" aria-hidden="true" />}
        {interested ? "Interested · hall opens Sat 9:00 AM" : "Interested"}
      </Button>
      {interested && (
        <button type="button" className={cn(buttonVariants({ variant: "outline" }), bigButton, "h-12")}>
          <CalendarPlus className="size-4" aria-hidden="true" /> Add to calendar
        </button>
      )}
    </div>
  );
}
