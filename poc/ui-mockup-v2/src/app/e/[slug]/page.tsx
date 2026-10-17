import { Avatar, Chip, LinkButton, TopNav } from "@/components/ui";
import { EVENT } from "@/lib/data";
import { ProjectGrid } from "./project-grid";

export default async function EventPage({ params, searchParams }: PageProps<"/e/[slug]">) {
  const { slug } = await params;
  const judge = (await searchParams).role === "judge";
  return (
    <div className="min-h-screen">
      <TopNav right={<Avatar />} />
      <main className="mx-auto flex max-w-[1200px] flex-col gap-[22px] px-10 pb-12 pt-7">
        <section className="grid grid-cols-[1fr_340px] gap-6 rounded-3xl border border-line bg-white px-8 py-7">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Chip tone="live">● Live now · {EVENT.inHall} in hall</Chip>
              <Chip>{EVENT.faculty}</Chip>
            </div>
            <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-[-0.035em]">{EVENT.name}</h1>
            <p className="max-w-[560px] text-base leading-[1.55] text-muted">{EVENT.blurb}</p>
          </div>
          <div className="flex flex-col justify-center gap-3 border-l border-subtle pl-6">
            {[["Date", EVENT.date], ["Time", EVENT.time], ["Booths", `${EVENT.booths} · ${EVENT.live} live`]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm"><span className="text-muted">{k}</span><span className="font-semibold">{v}</span></div>
            ))}
            <LinkButton href={`/e/${slug}/${judge ? "judge" : "hall"}`} className="mt-1.5 h-[50px] text-[15px]">
              {judge ? "Enter the hall as judge →" : "Enter the hall →"}
            </LinkButton>
            <span className="text-center text-[13px] font-semibold text-success">✓ You&rsquo;re registered{judge ? " as a judge" : ""}</span>
          </div>
        </section>
        <ProjectGrid slug={slug} />
      </main>
    </div>
  );
}
