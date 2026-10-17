import Link from "next/link";
import { Bell, ChartColumn, LayoutGrid, Settings, ShieldCheck, Store, Trophy, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Initials, Logo } from "@/components/brand";
import { cn } from "@/lib/utils";

export const bigButton = "h-11 rounded-xl px-5 text-[15px] font-semibold";

export function PublicHeader({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="border-b border-border/70 bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Logo />
        {!minimal && (
          <nav aria-label="Main" className="flex flex-wrap items-center gap-1 text-[15px]">
            <Link href="/#how" className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">How it works</Link>
            <Link href="/#organizers" className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">For organizers</Link>
            <Link href="/e/sit-capstone-2027" className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">Explore events</Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "ml-2 h-10 rounded-xl px-4 text-[15px]")}>Log in</Link>
            <Link href="/login" className={cn(buttonVariants(), "h-10 rounded-xl px-4 text-[15px]")}>Get started</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export function AppHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-6">
          <Logo href="/home" />
          <nav aria-label="App" className="hidden items-center gap-1 text-[15px] sm:flex">
            <Link href="/home" className="rounded-lg bg-secondary px-3 py-2 font-semibold text-secondary-foreground">My events</Link>
            <Link href="/e/sit-capstone-2027" className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">Explore</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Notifications" className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted">
            <Bell className="size-5" />
          </button>
          <Link href="/profile" className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-3 hover:bg-muted">
            <Initials name="Ploy" />
            <span className="text-sm font-semibold">Ploy S.</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

const manageNav = [
  { key: "overview", label: "Overview", icon: LayoutGrid, href: "" },
  { key: "projects", label: "Projects & hall", icon: Store, href: "/projects" },
  { key: "people", label: "People & roles", icon: Users, href: "?tab=people" },
  { key: "judging", label: "Judging", icon: Trophy, href: "?tab=judging" },
  { key: "analytics", label: "Analytics", icon: ChartColumn, href: "/analytics" },
  { key: "moderation", label: "Moderation", icon: ShieldCheck, href: "?tab=moderation" },
  { key: "settings", label: "Settings", icon: Settings, href: "?tab=settings" },
];

export function ManageShell({ slug, name, active, children }: { slug: string; name: string; active: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap">
      <aside className="flex w-full flex-col gap-1 border-b border-border bg-card px-3 py-4 lg:w-64 lg:border-r lg:border-b-0">
        <div className="px-3 pb-4"><Logo href="/home" /></div>
        <div className="mx-1 mb-3 rounded-xl bg-muted px-3 py-2.5">
          <div className="text-xs text-muted-foreground">Event</div>
          <div className="truncate text-sm font-semibold">{name}</div>
        </div>
        <nav aria-label="Event management" className="flex flex-wrap gap-1 lg:flex-col">
          {manageNav.map(({ key, label, icon: Icon, href }) => (
            <Link
              key={key}
              href={href.startsWith("?") || href === "" ? `/manage/${slug}${href}` : `/manage/${slug}${href}`}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px]",
                active === key ? "bg-secondary font-semibold text-secondary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden px-3 pt-6 text-xs text-muted-foreground lg:block">
          <Link href="/home" className="hover:text-foreground">← Back to my events</Link>
        </div>
      </aside>
      <main className="min-w-0 flex-[999_1_560px] px-6 py-6 lg:px-10 lg:py-8">{children}</main>
    </div>
  );
}
