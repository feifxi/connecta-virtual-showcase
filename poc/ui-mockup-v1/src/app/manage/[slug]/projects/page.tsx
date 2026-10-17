import { Download, FileSpreadsheet, Plus, Search, Sparkles, Sprout, TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AvatarStack, Chip } from "@/components/brand";
import { ManageShell } from "@/components/shells";
import { booths, categories, event, toneClass, toneOf } from "@/lib/mock";
import { cn } from "@/lib/utils";

const card = "rounded-3xl bg-card ring-1 ring-border/70";
const small = "h-10 rounded-xl px-4 font-semibold";

// 5 blocks of 6 slots · one category per block (zone) · blocks without projects become lounges
const blocks = [
  { id: "A2", cat: "AI & Data", used: 6 },
  { id: "C2", cat: "AI & Data", used: 2 },
  { id: "B1", cat: "IoT", used: 6 },
  { id: "A1", cat: "Web & Mobile", used: 6 },
  { id: "C1", cat: "Games", used: 4 },
];

export default async function Projects({ params }: PageProps<"/manage/[slug]/projects">) {
  const { slug } = await params;
  return (
    <ManageShell slug={slug} name={event.name} active="projects">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects & hall</h1>
            <p className="mt-1 text-muted-foreground">28 projects · each one is a booth. Presenters get an invitation when the event is published.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), small)}><FileSpreadsheet className="size-4" aria-hidden="true" />Import CSV / XLSX</button>
            <button type="button" className={cn(buttonVariants({ variant: "outline" }), small)}><Sparkles className="size-4" aria-hidden="true" />AI import <Chip tone="lilac">Pro</Chip></button>
            <button type="button" className={cn(buttonVariants(), small)}><Plus className="size-4" aria-hidden="true" />Add project</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <section className={cn(card, "flex min-w-0 flex-[1_1_300px] flex-col gap-3 p-6")}>
            <h2 className="text-lg font-bold">Submission form</h2>
            <p className="text-sm text-muted-foreground">Let teams add their own project instead of you typing it in. The category field only shows because this event has categories.</p>
            <label className="flex items-center justify-between font-semibold">Accept submissions<Switch defaultChecked /></label>
            <div className="rounded-xl bg-muted px-3 py-2 text-sm">connecta.app/e/{event.slug}/submit</div>
            <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><Download className="size-4" aria-hidden="true" />CSV template: title, category, member emails, summary</a>
          </section>

          <section className={cn(card, "flex min-w-0 flex-[2_1_480px] flex-col gap-4 p-6")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Hall layout · Hall preset</h2>
              <span className="text-sm text-muted-foreground">5 blocks × 6 slots · 24 of 30 used</span>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#EEF0FA] p-4">
              {blocks.map((b) => (
                <div key={b.id} className={cn("flex flex-col gap-2 rounded-xl p-2", b.cat ? "bg-card" : "bg-peach/40")}>
                  <span className={cn("self-start rounded-full px-2 py-0.5 text-[11px] font-bold", b.cat ? toneClass[toneOf(b.cat)] : "bg-card text-peach-ink")}>{b.cat ?? "Lounge"}</span>
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span key={i} className={cn("flex aspect-[3/2] items-center justify-center rounded-[4px]", b.cat && i < b.used ? toneClass[toneOf(b.cat)] : "text-mint-ink/40")}>{(!b.cat || i >= b.used) && <Sprout className="size-3" aria-hidden="true" />}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="flex items-start gap-2 rounded-xl bg-butter px-3 py-2 text-sm text-butter-ink">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Each category gets its own block. AI & Data has 8 projects so it takes 2 blocks, leaving none for EdTech (4 projects) — pick a bigger preset or turn off categories.
            </p>
            <p className="text-xs text-muted-foreground">You can swap booth positions until the hall opens. Projects added during the event go into a free slot in their zone; nobody else moves.</p>
          </section>
        </div>

        <section className={cn(card, "p-0")}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <div className="relative w-72 max-w-full">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input aria-label="Search projects" placeholder="Search projects or teams" className="h-10 rounded-xl pl-10" />
            </div>
            <div className="flex flex-wrap gap-1.5">{categories.map((c) => <span key={c.name} className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", toneClass[c.tone])}>{c.name}</span>)}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-[15px]">
              <thead>
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="px-6 py-3 font-semibold">Project</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Presenters</th>
                  <th className="px-3 py-3 font-semibold">Booth content</th>
                  <th className="px-6 py-3 font-semibold">Slot</th>
                </tr>
              </thead>
              <tbody>
                {booths.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="px-6 py-3"><div className="font-semibold">{b.title}</div><div className="text-sm text-muted-foreground">{b.team}</div></td>
                    <td className="px-3 py-3"><Chip tone={toneOf(b.category)}>{b.category}</Chip></td>
                    <td className="px-3 py-3"><AvatarStack names={b.members} /></td>
                    <td className="px-3 py-3 text-sm">{b.ready ? "Complete" : <span className="font-semibold text-peach-ink">Missing poster & slides</span>}</td>
                    <td className="px-6 py-3 text-sm font-semibold">Booth {b.no}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ManageShell>
  );
}
