import Link from "next/link";
import { CalendarDays, CircleAlert, Gavel } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Initials, Logo, RoleChip } from "@/components/brand";
import { bigButton } from "@/components/shells";
import { cn } from "@/lib/utils";

// Invitation link from email · mockup shows the case where the signed-in account is not the invited address
export default function Invite() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Logo href="/home" />
          <span className="flex items-center gap-2 text-sm"><Initials name="Ploy" size="sm" />ploy.srisuk@gmail.com</span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 py-12">
        <section className="flex flex-col gap-5 rounded-3xl bg-card p-8 ring-1 ring-border/70">
          <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-butter text-butter-ink"><Gavel className="size-7" aria-hidden="true" /></span>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Dr. Nat Wong invited you to</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Data Science Research Day</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <RoleChip role="Judge" />
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden="true" />Nov 20, 2026</span>
            </div>
          </div>
          <p className="text-[15px] text-muted-foreground">As a judge you&rsquo;ll see the rubric and the 8 projects assigned to you, then score them in their booths on the day.</p>

          <div className="flex items-start gap-3 rounded-2xl bg-peach/60 px-4 py-3 text-[15px] text-peach-ink">
            <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span>This invite is for <b>k***@kmutt.ac.th</b>. You&rsquo;re signed in as <b>ploy.srisuk@gmail.com</b>.</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), bigButton, "flex-1")}>Switch account</Link>
            <Link href="/e/sit-capstone-2027/judge" className={cn(buttonVariants(), bigButton, "flex-1")}>Accept with this account</Link>
          </div>
          <p className="text-xs text-muted-foreground">If you accept, we remember k***@kmutt.ac.th as yours, so future invites to it come to this account. The link works once and expires on Dec 3.</p>
        </section>
      </main>
    </div>
  );
}
