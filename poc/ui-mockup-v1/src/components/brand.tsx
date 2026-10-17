import Link from "next/link";
import { cn } from "@/lib/utils";
import { toneClass, type BoothStatus, type Tone } from "@/lib/mock";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="10" fill="var(--primary)" />
        <circle cx="11" cy="16" r="4" fill="#FFFFFF" />
        <circle cx="21.5" cy="10.5" r="3" fill="var(--butter)" />
        <circle cx="21.5" cy="21.5" r="3" fill="var(--mint)" />
        <path d="M14.5 14.2l4.3-2.4M14.5 17.8l4.3 2.4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="text-lg font-bold tracking-tight">connecta</span>
    </Link>
  );
}

export function Chip({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", toneClass[tone], className)}>{children}</span>;
}

const statusStyle: Record<BoothStatus, { label: string; cls: string; dot: string }> = {
  presenting: { label: "Presenting now", cls: "bg-primary text-primary-foreground", dot: "bg-white" },
  staffed: { label: "Team is here", cls: "bg-secondary text-secondary-foreground", dot: "bg-primary" },
  empty: { label: "No one yet", cls: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/60" },
};

export function StatusBadge({ status, className }: { status: BoothStatus; className?: string }) {
  const s = statusStyle[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", s.cls, className)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden="true" />
      {s.label}
    </span>
  );
}

const avatarTones: Tone[] = ["peach", "mint", "butter", "lilac", "sky"];

export function Initials({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const tone = avatarTones[name.charCodeAt(0) % avatarTones.length];
  const sz = { sm: "size-7 text-[11px]", md: "size-9 text-xs", lg: "size-12 text-sm" }[size];
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold ring-2 ring-card", toneClass[tone], sz, className)} aria-hidden="true">
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function AvatarStack({ names, extra }: { names: string[]; extra?: number }) {
  return (
    <span className="flex items-center" aria-label={`${names.join(", ")}${extra ? ` and ${extra} more` : ""}`}>
      {names.map((n, i) => (
        <Initials key={n} name={n} size="sm" className={i ? "-ml-2" : ""} />
      ))}
      {extra ? <span className="-ml-2 inline-flex size-7 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground ring-2 ring-card">+{extra}</span> : null}
    </span>
  );
}
