"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Segmented } from "@/components/ui";
import { EVENT } from "@/lib/data";

const ROLE_OPTIONS = ["Visitor", "Presenter", "Judge", "Staff"] as const;
export type Role = (typeof ROLE_OPTIONS)[number];

// Mock only: no account is created. The chosen role decides where you land.
const NEXT: Record<Role, string> = {
  Visitor: `/e/${EVENT.slug}`,
  Presenter: `/e/${EVENT.slug}`,
  Judge: `/e/${EVENT.slug}?role=judge`,
  Staff: `/manage/${EVENT.slug}/report`,
};

export function SignupForm({ initialRole }: { initialRole: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const field = "h-12 rounded-xl border border-input bg-white px-4 text-[15px] placeholder:text-faint focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15";

  return (
    <form
      className="flex flex-col justify-center gap-[18px] px-[72px] py-14"
      onSubmit={(e) => { e.preventDefault(); router.push(NEXT[role]); }}
    >
      <h1 className="text-[34px] font-extrabold tracking-[-0.03em]">Create your account</h1>
      <div className="flex flex-col gap-2">
        <span id="role-label" className="text-[13px] font-semibold">I&rsquo;m joining as</span>
        <Segmented label="I'm joining as" options={ROLE_OPTIONS} value={role} onChange={setRole} />
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold">Full name</span>
        <input required name="name" autoComplete="name" placeholder="Aisha Karim" className={field} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold">University email</span>
        <input required type="email" name="email" autoComplete="email" placeholder="a.karim@uni.ac.uk" className={field} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold">Password</span>
        <input required type="password" name="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" className={field} />
      </label>
      <Button type="submit" className="mt-1.5 h-[50px] text-[15px]">Create account and register</Button>
      <div className="flex items-center gap-3 text-[13px] text-faint"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <Button variant="secondary" className="h-[50px] text-[15px]" onClick={() => router.push(NEXT[role])}>Continue with university SSO</Button>
      <div className="text-center text-sm text-muted">
        Already have an account? <Link href={NEXT[role]} className="font-semibold text-primary hover:text-primary-hover">Sign in</Link>
      </div>
    </form>
  );
}
