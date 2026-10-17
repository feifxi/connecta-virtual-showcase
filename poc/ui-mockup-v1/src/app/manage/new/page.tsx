"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Info, Mail, Sprout, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Chip, Logo } from "@/components/brand";
import { bigButton } from "@/components/shells";
import { categories, toneClass } from "@/lib/mock";
import { cn } from "@/lib/utils";

const steps = ["Basics", "Hall", "Features", "People", "Review"];

const presets = [
  { id: "room", name: "Room", booths: 12, fits: "A class poster session · one room, open space in the middle", cols: 6, rows: 2 },
  { id: "hall", name: "Hall", booths: 30, fits: "A capstone day · rows of booths, stage, workshop and lounge", cols: 6, rows: 5 },
];

const modules = [
  { id: "judging", name: "Judging", text: "Rubric, judge assignments and scoring in the booth.", on: true },
  { id: "vote", name: "Popular Vote", text: "Visitors vote for projects they visited. Becomes the Audience award.", on: true },
  { id: "feedback", name: "Feedback", text: "Visitors leave notes for teams during and after the event.", on: true },
  { id: "ai", name: "AI booth assistant", text: "Answers visitor questions from the team's own files when they're away.", on: false, pro: true },
  { id: "3d", name: "3D model viewer", text: "Teams show a .glb model that everyone in the booth rotates together.", on: false },
];

const field = "h-11 rounded-xl px-4 text-[15px]";
const planLimit = 50; // Free

export default function NewEvent() {
  const [step, setStep] = useState(0);
  const [preset, setPreset] = useState("hall");
  const [startNow, setStartNow] = useState(false);
  const [capacity, setCapacity] = useState(50);
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(modules.map((m) => [m.id, m.on])));
  const reserved = 2 + 4 + 0; // admins + judges invited so far (presenters come from projects)

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Logo href="/home" />
          <Link href="/home" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Save draft & exit</Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary">New event</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Set up your showcase</h1>
          </div>
          <Chip tone="sky" className="px-3 py-1">Free plan · up to {planLimit} people at once · 5 judges</Chip>
        </div>

        <ol className="flex flex-wrap gap-2" aria-label="Setup steps">
          {steps.map((s, i) => (
            <li key={s}>
              <button type="button" onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined}
                className={cn("flex h-10 items-center gap-2 rounded-full pl-1.5 pr-4 text-sm font-semibold", i === step ? "bg-foreground text-background" : i < step ? "bg-mint text-mint-ink" : "bg-card text-muted-foreground ring-1 ring-border")}>
                <span className={cn("inline-flex size-7 items-center justify-center rounded-full text-xs", i === step ? "bg-background text-foreground" : "bg-card/70")}>{i < step ? <Check className="size-4" aria-hidden="true" /> : i + 1}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>

        <section className="rounded-3xl bg-card p-8 ring-1 ring-border/70">
          {step === 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="name" className="font-semibold">Event name</Label>
                <Input id="name" defaultValue="INT371 Poster Session" className={field} />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="desc" className="font-semibold">Short description</Label>
                <Textarea id="desc" rows={3} className="rounded-xl px-4 py-3 text-[15px]" defaultValue="Students present their term posters. Walk into any booth and talk to the team." />
              </div>
              <div className="flex flex-col gap-3 md:col-span-2">
                <span className="text-sm font-semibold">Starts</span>
                <div className="flex gap-2" role="radiogroup" aria-label="Start">
                  {[["Schedule a time", false], ["Start now", true]].map(([l, v]) => (
                    <button key={l as string} type="button" role="radio" aria-checked={startNow === v} onClick={() => setStartNow(v as boolean)} className={cn("h-10 rounded-xl px-4 text-sm font-semibold", startNow === v ? "bg-foreground text-background" : "ring-1 ring-border")}>{l}</button>
                  ))}
                </div>
              </div>
              {!startNow && (
                <>
                  <div className="flex flex-col gap-2"><Label htmlFor="date" className="font-semibold">Date</Label><Input id="date" type="date" defaultValue="2026-12-03" className={field} /></div>
                  <div className="flex flex-col gap-2"><Label htmlFor="start" className="font-semibold">Start time</Label><Input id="start" type="time" defaultValue="13:00" className={field} /></div>
                </>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="end" className="font-semibold">Ends</Label>
                <Input id="end" type="time" defaultValue="23:59" className={field} />
                <p className="text-sm text-muted-foreground">Required. The event ends by itself at this time, so it never stays open by accident. You can extend it on the day.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="domain" className="font-semibold">Only visitors from <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <div className="flex items-center gap-2"><span className="text-muted-foreground">@</span><Input id="domain" placeholder="kmutt.ac.th" className={field} /></div>
                <p className="text-sm text-muted-foreground">Leave empty to let anyone who logs in join. Invited presenters and judges can always get in.</p>
              </div>
              <div className="flex flex-col gap-3 md:col-span-2">
                <span className="text-sm font-semibold">Categories <span className="font-normal text-muted-foreground">(optional · each becomes a zone in the hall)</span></span>
                <div className="flex flex-wrap items-center gap-2">
                  {categories.slice(0, 3).map((c) => <span key={c.name} className={cn("inline-flex items-center gap-1 rounded-full py-1.5 pl-3 pr-2 text-sm font-semibold", toneClass[c.tone])}>{c.name}<X className="size-3.5" aria-label={`Remove ${c.name}`} /></span>)}
                  <Input aria-label="Add a category" placeholder="Add category" className="h-9 w-40 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold">Pick a hall</h2>
                <p className="text-muted-foreground">Booths are placed from your project list. Empty slots become plants and seating, so a small event never looks empty.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2" role="radiogroup" aria-label="Hall preset">
                {presets.map((t) => (
                  <button key={t.id} type="button" role="radio" aria-checked={preset === t.id} onClick={() => setPreset(t.id)}
                    className={cn("flex flex-col gap-4 rounded-2xl border-2 p-5 text-left transition", preset === t.id ? "border-primary bg-secondary/50" : "border-border hover:border-input")}>
                    <span className="grid gap-1.5 rounded-xl bg-[#EEF0FA] p-3" style={{ gridTemplateColumns: `repeat(${t.cols}, minmax(0, 1fr))` }} aria-hidden="true">
                      {Array.from({ length: t.booths }).map((_, i) => <span key={i} className={cn("flex aspect-[3/2] items-center justify-center rounded-[4px]", i < 8 ? "bg-card" : "text-mint-ink/40")}>{i >= 8 && <Sprout className="size-3" />}</span>)}
                    </span>
                    <span>
                      <span className="flex items-center justify-between font-bold">{t.name}<span className="text-sm font-semibold text-muted-foreground">up to {t.booths} booths</span></span>
                      <span className="text-sm text-muted-foreground">{t.fits}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-end gap-6 rounded-2xl bg-muted p-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cap" className="font-semibold">People in the hall at once</Label>
                  <Input id="cap" type="number" min={1} max={planLimit} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className={cn(field, "w-32 bg-card")} />
                </div>
                <p className="flex min-w-0 flex-[1_1_260px] items-start gap-2 text-sm text-muted-foreground">
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  Up to {planLimit} on Free. Everyone you invite (admins, presenters, judges) gets a reserved seat; visitors share the rest. Need more? Upgrade this event with an Event add-on.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">What the event needs</h2>
              <p className="mb-4 text-muted-foreground">Turned-off features disappear completely for visitors and teams.</p>
              <ul className="flex flex-col divide-y divide-border rounded-2xl ring-1 ring-border">
                {modules.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-6 px-5 py-4">
                    <div>
                      <Label htmlFor={`m-${m.id}`} className="text-[15px] font-semibold">{m.name}{m.pro && <Chip tone="lilac" className="ml-2">Pro</Chip>}</Label>
                      <p className="text-sm text-muted-foreground">{m.text}</p>
                    </div>
                    <Switch id={`m-${m.id}`} checked={on[m.id]} disabled={m.pro} onCheckedChange={(v) => setOn({ ...on, [m.id]: v })} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold">Admins</h2>
                <p className="text-muted-foreground">Admins run the event with you and can do everything. We suggest 2–3, so the event isn&rsquo;t stuck if one person can&rsquo;t log in.</p>
                <Label htmlFor="admins" className="font-semibold">Admin emails</Label>
                <Textarea id="admins" rows={3} className="rounded-xl px-4 py-3 text-[15px]" defaultValue={"nat.w@kmutt.ac.th"} />
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold">Judges</h2>
                <p className="text-muted-foreground">They get an invitation email after you publish. Free plan: up to 5.</p>
                <Label htmlFor="judges" className="font-semibold">Judge emails</Label>
                <Textarea id="judges" rows={4} className="rounded-xl px-4 py-3 text-[15px]" placeholder="one email per line" defaultValue={"judge.one@kmutt.ac.th\nguest.judge@company.com\naj.som@kmutt.ac.th\naj.lek@kmutt.ac.th"} />
              </div>
              <p className="rounded-2xl bg-muted px-5 py-4 text-sm text-muted-foreground md:col-span-2">Projects and their presenters come next, on the Projects page: add them by hand, import a CSV/XLSX, or open a submission form for teams.</p>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold">Ready to create</h2>
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {[
                  ["Event", "INT371 Poster Session"],
                  ["When", startNow ? "Starts now · ends 23:59 today" : "Thu, Dec 3, 2026 · 1:00 PM – 11:59 PM"],
                  ["Hall", `${presets.find((t) => t.id === preset)?.name} · up to ${presets.find((t) => t.id === preset)?.booths} booths · ${capacity} people at once`],
                  ["Seats reserved", `${reserved} of ${capacity} (admins + judges)`],
                  ["Features", modules.filter((m) => on[m.id]).map((m) => m.name).join(", ")],
                  ["Categories", "AI & Data, IoT, Web & Mobile"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-muted px-5 py-4"><dt className="text-sm text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
                ))}
              </dl>
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="size-4" aria-hidden="true" />The event is created as a draft. Invitations go out when you publish.</p>
            </div>
          )}
        </section>

        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" className={bigButton} disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft className="size-4" aria-hidden="true" /> Back</Button>
          {step < steps.length - 1 ? (
            <Button className={bigButton} onClick={() => setStep(step + 1)}>Continue <ArrowRight className="size-4" aria-hidden="true" /></Button>
          ) : (
            <Link href="/manage/sit-capstone-2027/projects" className={cn(buttonVariants(), bigButton)}>Create draft & add projects</Link>
          )}
        </div>
      </main>
    </div>
  );
}
