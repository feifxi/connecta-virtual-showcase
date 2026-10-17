import Link from "next/link";
import { Eye, FileImage, Link2, Plus, Presentation, Video } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvatarStack, Chip, Initials } from "@/components/brand";
import { AppHeader, bigButton } from "@/components/shells";
import { booths, categories, toneClass } from "@/lib/mock";
import { cn } from "@/lib/utils";

const field = "h-11 rounded-xl px-4 text-[15px]";
const b = booths[1];

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
            <p className="mt-1 text-muted-foreground">SIT Capstone Showcase 2027 · Booth {b.no} · due Apr 20</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/e/${slug}/hall`} className={cn(buttonVariants({ variant: "outline" }), bigButton)}><Eye className="size-4" aria-hidden="true" />Preview in hall</Link>
            <button type="button" className={cn(buttonVariants(), bigButton)}>Save changes</button>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-8">
          <form className="flex min-w-0 flex-[999_1_520px] flex-col gap-6">
            <section className="flex flex-col gap-5 rounded-3xl bg-card p-7 ring-1 ring-border/70">
              <h2 className="text-lg font-bold">About the project</h2>
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="font-semibold">Project title</Label>
                <Input id="title" defaultValue={b.title} className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="summary" className="font-semibold">One-paragraph summary</Label>
                <Textarea id="summary" rows={4} defaultValue={b.summary} className="rounded-xl px-4 py-3 text-[15px]" />
                <p className="text-sm text-muted-foreground">Visitors read this before walking in. 2–3 sentences works best.</p>
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-semibold">Category</legend>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <label key={c.name} className={cn("cursor-pointer rounded-full px-4 py-2 text-sm font-semibold ring-2 ring-transparent has-checked:ring-primary", toneClass[c.tone])}>
                      <input type="radio" name="category" value={c.name} defaultChecked={c.name === b.category} className="sr-only" />
                      {c.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            </section>

            <section className="flex flex-col gap-5 rounded-3xl bg-card p-7 ring-1 ring-border/70">
              <h2 className="text-lg font-bold">Materials</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-input px-6 py-8 text-center hover:border-primary">
                  <FileImage className="size-7 text-primary" aria-hidden="true" />
                  <span className="font-semibold">Poster (PDF)</span>
                  <span className="text-sm text-muted-foreground">poster-final.pdf · 4.2 MB ✓</span>
                  <input type="file" accept="application/pdf" className="sr-only" />
                </label>
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-input px-6 py-8 text-center hover:border-primary">
                  <Presentation className="size-7 text-primary" aria-hidden="true" />
                  <span className="font-semibold">Slides (PDF)</span>
                  <span className="text-sm text-muted-foreground">Drop a file or click to upload</span>
                  <input type="file" accept="application/pdf" className="sr-only" />
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="video" className="font-semibold">Demo video link</Label>
                <div className="relative">
                  <Video className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input id="video" placeholder="YouTube or Vimeo link" defaultValue="https://youtu.be/[your-video]" className={cn(field, "pl-10")} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="repo" className="font-semibold">Other link <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input id="repo" placeholder="Live demo, repo or report" className={cn(field, "pl-10")} />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4 rounded-3xl bg-card p-7 ring-1 ring-border/70">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Team</h2>
                <button type="button" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><Plus className="size-4" aria-hidden="true" />Add member</button>
              </div>
              <ul className="flex flex-col divide-y divide-border">
                {[["Mint Chai", "mint.c@university.ac.th", "Presenter"], ["Book Panya", "book.p@university.ac.th", "Presenter"]].map(([n, e, r]) => (
                  <li key={e} className="flex flex-wrap items-center gap-4 py-3">
                    <Initials name={n} />
                    <div className="min-w-0 flex-[999_1_200px]"><div className="font-semibold">{n}</div><div className="text-sm text-muted-foreground">{e}</div></div>
                    <Chip tone="mint">{r}</Chip>
                  </li>
                ))}
              </ul>
            </section>
          </form>

          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 lg:sticky lg:top-6">
            <h2 className="text-sm font-semibold text-muted-foreground">How visitors will see it</h2>
            <article className="overflow-hidden rounded-3xl bg-card ring-1 ring-border">
              <div className="flex h-40 items-center justify-center bg-lilac text-lilac-ink">
                <span className="rounded-xl bg-card/70 px-3 py-1.5 text-sm font-semibold">Poster preview</span>
              </div>
              <div className="flex flex-col gap-3 p-5">
                <Chip tone="lilac" className="self-start">{b.category}</Chip>
                <h3 className="text-lg font-bold leading-snug">{b.title}</h3>
                <p className="text-[15px] text-muted-foreground">{b.summary}</p>
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><AvatarStack names={b.members} />{b.team}</span>
              </div>
            </article>
            <div className="rounded-2xl bg-butter px-5 py-4 text-sm text-butter-ink">
              <span className="font-semibold">Almost there:</span> add slides so judges can review before the event.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
