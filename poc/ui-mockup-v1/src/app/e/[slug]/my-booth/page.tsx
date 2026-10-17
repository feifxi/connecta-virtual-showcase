import Link from "next/link";
import { Bot, Check, Circle, Eye, FileImage, FileText, ImageIcon, Link2, Presentation, Send, UserPlus, Video } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AvatarStack, Chip, Initials, RoleChip } from "@/components/brand";
import { AppHeader, bigButton } from "@/components/shells";
import { booths, categories, toneClass } from "@/lib/mock";
import { cn } from "@/lib/utils";

const field = "h-11 rounded-xl px-4 text-[15px]";
const card = "flex flex-col gap-5 rounded-3xl bg-card p-7 ring-1 ring-border/70";
const b = booths[0];
const checklist = [
  { k: "Title, summary and category", done: true },
  { k: "Cover image", done: true },
  { k: "Poster (PDF)", done: true },
  { k: "Slides", done: false },
  { k: "Demo video link", done: true },
];

// Presenter edits the booth before and during the event (same page as the Edit button in the hall)
export default async function MyBooth({ params }: PageProps<"/e/[slug]/my-booth">) {
  const { slug } = await params;
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/home" className="text-sm font-semibold text-muted-foreground hover:text-foreground">← My events</Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Your booth</h1>
            <p className="mt-1 text-muted-foreground">SIT Capstone Showcase 2027 · Booth {b.no} · {b.category} zone</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/e/${slug}/hall`} className={cn(buttonVariants({ variant: "outline" }), bigButton)}><Eye className="size-4" aria-hidden="true" />Open in hall</Link>
            <button type="button" className={cn(buttonVariants(), bigButton)}>Save changes</button>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-8">
          <form className="flex min-w-0 flex-[999_1_520px] flex-col gap-6">
            <section className={card}>
              <h2 className="text-lg font-bold">About the project</h2>
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="font-semibold">Project title</Label>
                <Input id="title" defaultValue={b.title} className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="summary" className="font-semibold">Summary</Label>
                <Textarea id="summary" rows={4} defaultValue={b.summary} className="rounded-xl px-4 py-3 text-[15px]" />
                <p className="text-sm text-muted-foreground">Visitors read this before walking in. 2–3 sentences works best.</p>
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-semibold">Category <span className="font-normal text-muted-foreground">· sets your zone in the hall</span></legend>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <label key={c.name} className={cn("cursor-pointer rounded-full px-4 py-2 text-sm font-semibold ring-2 ring-transparent has-checked:ring-primary", toneClass[c.tone])}>
                      <input type="radio" name="category" value={c.name} defaultChecked={c.name === b.category} className="sr-only" />
                      {c.name}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="flex flex-col gap-2">
                <Label htmlFor="tags" className="font-semibold">Tags</Label>
                <Input id="tags" defaultValue={b.tags.join(", ")} className={field} />
                <p className="text-sm text-muted-foreground">Comma separated. Helps people find you in search.</p>
              </div>
            </section>

            <section className={card}>
              <h2 className="text-lg font-bold">Materials</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: ImageIcon, k: "Cover image", v: "cover.png ✓" },
                  { icon: FileImage, k: "Poster (PDF)", v: "poster-final.pdf · 4.2 MB ✓" },
                  { icon: Presentation, k: "Slides (PDF)", v: "Drop a file or click" },
                ].map(({ icon: Icon, k, v }) => (
                  <label key={k} className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-input px-4 py-6 text-center hover:border-primary">
                    <Icon className="size-7 text-primary" aria-hidden="true" />
                    <span className="font-semibold">{k}</span>
                    <span className="text-sm text-muted-foreground">{v}</span>
                    <input type="file" className="sr-only" />
                  </label>
                ))}
              </div>
              <p className="-mt-2 text-sm text-muted-foreground">We check the real file type, not just the extension. Max 20 MB each.</p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="video" className="font-semibold">Demo video</Label>
                <div className="relative">
                  <Video className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input id="video" placeholder="YouTube or Vimeo link" defaultValue="https://youtu.be/[your-video]" className={cn(field, "pl-10")} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="repo" className="font-semibold">Other links <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input id="repo" placeholder="Live demo, repo or report" className={cn(field, "pl-10")} />
                </div>
              </div>
            </section>

            <section className={card}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold"><Bot className="size-5 text-primary" aria-hidden="true" />AI assistant <Chip tone="lilac">Pro</Chip></h2>
                <label className="flex items-center gap-2 text-sm font-semibold">Answer visitors when we&rsquo;re away <Switch /></label>
              </div>
              <p className="text-[15px] text-muted-foreground">It answers only from the files you tick below, and says so when it doesn&rsquo;t know. Visitors see that answers come from AI.</p>
              <ul className="flex flex-col gap-2">
                {[["poster-final.pdf", true], ["capstone-report.pdf", true], ["README.md", false]].map(([f, on]) => (
                  <li key={f as string} className="flex items-center gap-3 rounded-xl bg-muted px-4 py-2.5 text-sm"><FileText className="size-4 text-muted-foreground" aria-hidden="true" /><span className="flex-1 font-semibold">{f}</span><label className="flex items-center gap-2">Use for AI<Checkbox defaultChecked={on as boolean} /></label></li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 rounded-2xl bg-lilac/40 p-4">
                <Label htmlFor="try" className="font-semibold">Try it before turning it on</Label>
                <div className="flex gap-2"><Input id="try" placeholder="How do you pick which electives to show?" className="h-10 rounded-xl bg-card" /><button type="button" aria-label="Ask" className={cn(buttonVariants(), "size-10 rounded-xl")}><Send className="size-4" /></button></div>
              </div>
            </section>

            <section className="flex flex-col gap-4 rounded-3xl bg-card p-7 ring-1 ring-border/70">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold">Team</h2>
                <div className="flex gap-2"><Input aria-label="Teammate email" placeholder="teammate@kmutt.ac.th" className="h-10 w-60 rounded-xl" /><button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-xl")}><UserPlus className="size-4" aria-hidden="true" />Invite</button></div>
              </div>
              <ul className="flex flex-col divide-y divide-border">
                {[["Mint Chai", "mint.c@kmutt.ac.th", "joined"], ["Book Panya", "book.p@kmutt.ac.th", "joined"], ["", "earth.k@kmutt.ac.th", "pending"]].map(([n, e, s]) => (
                  <li key={e} className="flex flex-wrap items-center gap-4 py-3">
                    <Initials name={n || e} />
                    <div className="min-w-0 flex-[999_1_200px]"><div className="font-semibold">{n || "Invitation sent"}</div><div className="text-sm text-muted-foreground">{e}</div></div>
                    {s === "pending" ? <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">Pending</span> : <RoleChip role="Presenter" />}
                  </li>
                ))}
              </ul>
            </section>
          </form>

          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 lg:sticky lg:top-6">
            <section className="flex flex-col gap-3 rounded-3xl bg-card p-6 ring-1 ring-border/70">
              <div className="flex items-center justify-between"><h2 className="font-bold">Checklist</h2><span className="text-sm text-muted-foreground">4 of 5</span></div>
              <ul className="flex flex-col gap-2.5">
                {checklist.map((c) => (
                  <li key={c.k} className="flex items-center gap-3 text-[15px]">
                    {c.done ? <Check className="size-5 shrink-0 rounded-full bg-mint p-0.5 text-mint-ink" aria-label="Done" /> : <Circle className="size-5 shrink-0 text-input" aria-label="Missing" />}{c.k}
                  </li>
                ))}
              </ul>
              <p className="rounded-xl bg-butter px-3 py-2 text-sm text-butter-ink">Organizer&rsquo;s deadline: <b>Apr 20</b>. Just a reminder — you can still edit during the event.</p>
            </section>
            <h2 className="text-sm font-semibold text-muted-foreground">How visitors see it</h2>
            <article className="overflow-hidden rounded-3xl bg-card ring-1 ring-border">
              <div className="flex h-36 items-center justify-center bg-lilac text-lilac-ink"><span className="rounded-xl bg-card/70 px-3 py-1.5 text-sm font-semibold">Cover</span></div>
              <div className="flex flex-col gap-3 p-5">
                <Chip tone="lilac" className="self-start">{b.category}</Chip>
                <h3 className="text-lg font-bold leading-snug">{b.title}</h3>
                <p className="text-[15px] text-muted-foreground">{b.summary}</p>
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><AvatarStack names={b.members} />{b.team}</span>
              </div>
            </article>
          </aside>
        </div>
      </main>
    </div>
  );
}
