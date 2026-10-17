import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Logo: ring with a transparent right quarter + orange dot, then the wordmark
export function Logo({ size = 28, dark = false, label = "Connecta", href, className = "" }: { size?: number; dark?: boolean; label?: string; href?: string; className?: string }) {
  const stroke = Math.round(size * 0.215);
  const dot = Math.round(size * 0.25);
  const mark = (
    <span className={`flex items-center gap-2.5 font-bold tracking-[-0.01em] ${className}`} style={{ fontSize: size * 0.75 }}>
      <span
        aria-hidden
        className="relative shrink-0 rounded-full"
        style={{ width: size, height: size, border: `${stroke}px solid ${dark ? "#7fa3ff" : "#1d5cf5"}`, borderRightColor: "transparent" }}
      >
        <span className="absolute rounded-full bg-accent" style={{ width: dot, height: dot, right: -dot, top: size * 0.21 }} />
      </span>
      {label}
    </span>
  );
  return href ? <Link href={href} aria-label="Connecta home">{mark}</Link> : mark;
}

const BTN = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-white border border-input text-ink hover:border-faint",
  ghost: "text-ink hover:bg-subtle",
} as const;

export function btn(variant: keyof typeof BTN = "primary", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${BTN[variant]} ${extra}`;
}

export function Button({ variant = "primary", className = "", ...rest }: ComponentProps<"button"> & { variant?: keyof typeof BTN }) {
  return <button type="button" className={btn(variant, className)} {...rest} />;
}

export function LinkButton({ variant = "primary", className = "", ...rest }: ComponentProps<typeof Link> & { variant?: keyof typeof BTN }) {
  return <Link className={btn(variant, className)} {...rest} />;
}

export function Chip({ tone = "subtle", children, className = "" }: { tone?: "subtle" | "live" | "primary" | "ink"; children: ReactNode; className?: string }) {
  const t = { subtle: "bg-subtle text-ink-2", live: "bg-live-bg text-live", primary: "bg-primary-tint text-primary", ink: "bg-ink text-white" }[tone];
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-[5px] text-[13px] font-semibold ${t} ${className}`}>{children}</span>;
}

export function BoothBadge({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap rounded-[7px] bg-primary-tint px-[9px] py-[3px] text-xs font-semibold text-primary">{children}</span>;
}

export function Segmented<T extends string>({ options, value, onChange, label }: { options: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-1 rounded-xl bg-subtle p-1 text-sm font-semibold" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange(o)}
          className={`rounded-[9px] p-2.5 transition-colors ${o === value ? "bg-white text-primary shadow-seg" : "text-muted hover:text-ink"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function TopNav({ active = "Events", right }: { active?: string; right?: ReactNode }) {
  return (
    <header className="flex h-[68px] items-center gap-7 border-b border-line bg-white px-10">
      <Logo size={24} href="/" />
      <nav className="ml-4 flex gap-6 text-sm font-medium text-ink-2">
        {["Events", "Showcase", "Archive"].map((n) => (
          <span key={n} className={n === active ? "text-primary" : ""}>{n}</span>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">{right}</div>
    </header>
  );
}

export function Avatar({ initials = "AK" }: { initials?: string }) {
  return <span className="grid size-[34px] place-items-center rounded-full bg-[#c9d8ff] text-xs font-bold">{initials}</span>;
}
