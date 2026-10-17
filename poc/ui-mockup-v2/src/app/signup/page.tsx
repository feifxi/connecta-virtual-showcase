import Image from "next/image";
import { Logo } from "@/components/ui";
import { EVENT } from "@/lib/data";
import { SignupForm, type Role } from "./signup-form";

const ROLES: Record<string, Role> = { visitor: "Visitor", presenter: "Presenter", judge: "Judge", staff: "Staff" };

export default async function Signup({ searchParams }: PageProps<"/signup">) {
  const { role } = await searchParams;
  const initial = ROLES[String(role ?? "").toLowerCase()] ?? "Visitor";
  return (
    <main className="grid min-h-screen grid-cols-2">
      <div className="flex flex-col justify-between gap-8 bg-lav px-11 py-9">
        <Logo href="/" />
        <div className="relative h-[340px] overflow-hidden rounded-[20px] bg-lav-2">
          <Image src="/assets/lobby.png" alt="Students meeting in a pixel-art showcase lobby" fill priority sizes="600px" className="object-cover object-[50%_60%]" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em]">You&rsquo;re registering for {EVENT.name}</div>
          <div className="text-[15px] text-ink-2">{EVENT.dateShort} · {EVENT.time} · {EVENT.booths} booths</div>
        </div>
      </div>
      <SignupForm initialRole={initial} />
    </main>
  );
}
