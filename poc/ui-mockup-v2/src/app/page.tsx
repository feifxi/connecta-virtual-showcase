import Image from "next/image";
import Link from "next/link";
import { LinkButton, Logo } from "@/components/ui";
import { EVENT, LANDING } from "@/lib/data";

export default function Landing() {
  return (
    <div className="mx-auto max-w-[1280px] px-10">
      <nav className="flex h-[76px] items-center gap-8">
        <Logo href="/" />
        <div className="ml-6 flex gap-7 text-sm font-medium text-ink-2">
          <Link href={`/e/${EVENT.slug}`} className="hover:text-ink">Events</Link>
          <span>Showcase</span>
          <span>Archive</span>
          <span>For organizers</span>
        </div>
        <div className="ml-auto flex gap-2.5">
          <LinkButton href="/signup" variant="ghost" className="rounded-[10px] px-[18px] py-[11px] text-sm">Sign in</LinkButton>
          <LinkButton href="/signup?role=staff" className="rounded-[10px] px-[18px] py-[11px] text-sm">Host a showcase</LinkButton>
        </div>
      </nav>

      <section className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-14 pb-[72px] pt-12">
        <div className="flex flex-col gap-[22px]">
          <span className="flex items-center gap-2 self-start rounded-full border border-line bg-white py-1.5 pl-2 pr-3 text-[13px] font-semibold text-ink-2">
            <span className="size-2 rounded-full bg-accent shadow-[0_0_0_4px_#ffe6d8]" />3 showcases live right now
          </span>
          <h1 className="text-balance text-[58px] font-extrabold leading-[1.02] tracking-[-0.035em]">Demo day, without the venue.</h1>
          <p className="max-w-[460px] text-pretty text-lg leading-[1.55] text-ink-2">
            Students present at booths in a 2D hall. Visitors walk up and talk to them live, and judges score from the same room.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <LinkButton href={`/e/${EVENT.slug}`} className="px-[22px] py-[15px] text-[15px]">Explore events →</LinkButton>
            <LinkButton href={`/e/${EVENT.slug}/hall`} variant="secondary" className="px-[22px] py-[15px] text-[15px]">Watch the tour</LinkButton>
          </div>
        </div>
        <div className="relative">
          <div className="relative h-[460px] overflow-hidden rounded-3xl border border-line bg-subtle">
            <Image src="/assets/lobby.png" alt="Students meeting in a pixel-art showcase lobby" fill priority sizes="720px" className="object-cover" />
          </div>
          <div className="pointer-events-none absolute -left-7 bottom-9 flex w-[280px] flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-[0_12px_32px_rgba(15,26,58,.14)]">
            <div className="flex justify-between text-xs font-semibold"><span className="text-primary">Booth A07</span><span className="text-[#d4520c]">● Presenting</span></div>
            <div className="text-[15px] font-bold leading-tight">Sign-language recognition on edge devices</div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="flex">
                {["#c9d8ff", "#ffd6bf", "#cdeedd"].map((c, i) => (
                  <span key={c} className="size-[22px] rounded-full border-2 border-white" style={{ background: c, marginLeft: i ? -7 : 0 }} />
                ))}
              </span>
              22 people listening
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-5 pb-[88px]">
        {LANDING.roles.map((r) => (
          <div key={r.who} className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-7">
            <span className="text-xs font-bold uppercase tracking-[.08em] text-primary">{r.who}</span>
            <div className="text-[22px] font-bold leading-[1.2] tracking-[-0.02em]">{r.title}</div>
            <p className="text-[15px] leading-[1.55] text-muted">{r.body}</p>
            <Link href={r.href} className="mt-1.5 text-sm font-semibold text-primary hover:text-primary-hover">{r.cta} →</Link>
          </div>
        ))}
      </section>

      <section className="pb-[88px]">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-[34px] font-extrabold tracking-[-0.03em]">Happening on Connecta</h2>
          <Link href={`/e/${EVENT.slug}`} className="text-sm font-semibold text-primary hover:text-primary-hover">All events →</Link>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {LANDING.events.map((e) => (
            <div key={e.title} className="flex flex-col gap-3.5 rounded-[20px] border border-line bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] font-semibold">
                <span className="text-muted">{e.date}</span>
                {e.live ? (
                  <span className="whitespace-nowrap rounded-full bg-live-bg px-2.5 py-1 text-live">Live · {e.people} in hall</span>
                ) : (
                  <span className="whitespace-nowrap rounded-full bg-subtle px-2.5 py-1 text-ink-2">Registration open</span>
                )}
              </div>
              <div className="text-xl font-bold leading-tight tracking-[-0.02em]">{e.title}</div>
              <div className="text-sm text-muted">{e.host}</div>
              <div className="flex items-center justify-between border-t border-subtle pt-3.5 text-sm">
                <span className="text-muted">{e.booths} booths</span>
                <Link href={e.href} className="font-semibold text-primary hover:text-primary-hover">{e.cta} →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-[88px]">
        <h2 className="mb-6 text-[34px] font-extrabold tracking-[-0.03em]">How it works</h2>
        <div className="grid grid-cols-3 gap-5">
          {LANDING.steps.map((s) => (
            <div key={s.n} className="overflow-hidden rounded-[20px] border border-line bg-white">
              <div className="relative h-[170px] overflow-hidden" style={{ background: s.bg }}>
                <Image src={s.img} alt="" fill sizes="400px" className="scale-[1.04] object-cover" />
              </div>
              <div className="flex flex-col gap-2 px-6 pb-[26px] pt-[22px]">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-[26px] place-items-center rounded-lg bg-primary text-[13px] font-bold text-white">{s.n}</span>
                  <span className="text-[19px] font-bold tracking-[-0.01em]">{s.title}</span>
                </div>
                <p className="text-[15px] leading-[1.55] text-muted">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-[minmax(0,4fr)_minmax(0,8fr)] items-center gap-12 pb-[88px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.03em]">See a showcase in 90 seconds</h2>
          <p className="text-base leading-[1.6] text-muted">A walk through last spring&rsquo;s engineering demo day, from the entrance to a judge submitting a score.</p>
        </div>
        <div className="grid aspect-video place-items-center rounded-3xl border border-dashed border-input bg-subtle text-sm font-semibold text-faint">Video poster frame</div>
      </section>

      <section className="pb-[88px]">
        <h2 className="mb-6 text-[34px] font-extrabold tracking-[-0.03em]">Everything a showcase needs</h2>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line">
          {LANDING.features.map((f) => (
            <div key={f.title} className="flex flex-col gap-2 bg-white px-8 py-7">
              <div className="text-[19px] font-bold tracking-[-0.01em]">{f.title}</div>
              <p className="max-w-[460px] text-[15px] leading-[1.55] text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 flex items-center justify-between gap-8 rounded-[28px] bg-primary px-14 py-12 text-white">
        <div>
          <h2 className="text-[34px] font-extrabold tracking-[-0.03em]">Running a demo day this term?</h2>
          <p className="mt-2 text-base text-[#dbe5ff]">Set up a hall in an afternoon. Free for student-run events.</p>
        </div>
        <div className="flex flex-none gap-3">
          <Link href="/signup?role=staff" className="rounded-xl bg-white px-[22px] py-[15px] text-[15px] font-bold text-primary hover:bg-primary-tint">Host a showcase</Link>
          <span className="rounded-xl border border-primary-light px-[22px] py-[15px] text-[15px] font-semibold">Talk to us</span>
        </div>
      </section>

      <footer className="flex items-center gap-6 border-t border-line pb-10 pt-7 text-[13px] text-muted">
        <Logo size={20} className="text-ink" />
        <span>Events</span><span>Archive</span><span>For organizers</span><span>About</span>
        <span className="ml-auto">Terms of Service</span><span>Privacy Policy</span>
      </footer>
    </div>
  );
}
