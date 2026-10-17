import Link from "next/link";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneClass, type BoothStatus, type Role, type Tone } from "@/lib/mock";

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

// Booth status from outside: "● Live" only when a presenter is inside, plus how many people are in the booth
export function StatusBadge({ status, people, className }: { status: BoothStatus; people?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {status === "live" && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
          <span className="size-1.5 rounded-full bg-white" aria-hidden="true" />Live
        </span>
      )}
      {people !== undefined && (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
          <Users className="size-3" aria-hidden="true" />{people}
        </span>
      )}
    </span>
  );
}

const roleTone: Record<Role, Tone> = { Admin: "lilac", Presenter: "mint", Judge: "butter", Visitor: "sky" };

export function RoleChip({ role, className }: { role: Role; className?: string }) {
  return <Chip tone={roleTone[role]} className={className}>{role}</Chip>;
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
