"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Mail, Upload } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/brand";
import { bigButton } from "@/components/shells";
import { cn } from "@/lib/utils";

const steps = ["Basics", "Hall", "Features", "Invite", "Review"];

const templates = [
  { id: "small", name: "Studio hall", booths: 12, fits: "One class or a small poster session", cols: 4, rows: 3 },
  { id: "medium", name: "Fair hall", booths: 24, fits: "A department project day", cols: 6, rows: 4 },
  { id: "large", name: "Expo hall", booths: 40, fits: "A faculty-wide capstone showcase", cols: 8, rows: 5 },
];

const modules = [
  { id: "judging", name: "Judging", text: "Rubrics, judge assignments and live scoring.", on: true },
  { id: "vote", name: "Popular vote", text: "Visitors vote for their favourite booths after visiting them.", on: true },
  { id: "feedback", name: "Feedback", text: "Visitors leave notes for teams during and after the event.", on: true },
  { id: "ai", name: "AI booth assistant", text: "Answers visitor questions from the team's own materials.", on: false },
  { id: "3d", name: "3D model viewer", text: "Teams can show a .glb model that visitors rotate together.", on: false },
];

const field = "h-11 rounded-xl px-4 text-[15px]";

export default function NewEvent() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("large");
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(modules.map((m) => [m.id, m.on])));

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Logo href="/home" />
          <Link href="/home" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Save draft & exit</Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <div>
          <p className="text-sm font-semibold text-primary">New event</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Set up your showcase</h1>
        </div>

        <ol className="flex flex-wrap gap-2" aria-label="Setup steps">
          {steps.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full pl-1.5 pr-4 text-sm font-semibold",
                  i === step ? "bg-foreground text-background" : i < step ? "bg-mint text-mint-ink" : "bg-card text-muted-foreground ring-1 ring-border",
                )}
              >
                <span className={cn("inline-flex size-7 items-center justify-center rounded-full text-xs", i === step ? "bg-background text-foreground" : "bg-card/70")}>
                  {i < step ? <Check className="size-4" aria-hidden="true" /> : i + 1}
                </span>
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
                <Input id="name" defaultValue="SIT Capstone Showcase 2027" className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="type" className="font-semibold">Type</Label>
                <select id="type" defaultValue="capstone" className={cn(field, "border border-input bg-transparent")}>
                  <option value="capstone">Capstone / project day</option>
                  <option value="poster">Class poster session</option>
                  <option value="open">Open house</option>
                  <option value="conf">Conference poster session</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="font-semibold">Date</Label>
                <Input id="date" type="date" defaultValue="2027-04-24" className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="start" className="font-semibold">Starts</Label>
                <Input id="start" type="time" defaultValue="09:00" className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="end" className="font-semibold">Ends</Label>
                <Input id="end" type="time" defaultValue="16:00" className={field} />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="desc" className="font-semibold">Short description</Label>
                <Textarea id="desc" rows={3} className="rounded-xl px-4 py-3 text-[15px]" defaultValue="Final-year students present their capstone projects. Walk into any booth and talk to the team." />
                <p className="text-sm text-muted-foreground">Shown on the public event page and in invitations.</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold">Pick a hall</h2>
                <p className="text-muted-foreground">You can rename booths and move teams later. Expected visitors: up to 300 at once per hall.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3" role="radiogroup" aria-label="Hall template">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={template === t.id}
                    onClick={() => setTemplate(t.id)}
                    className={cn("flex flex-col gap-4 rounded-2xl border-2 p-5 text-left transition", template === t.id ? "border-primary bg-secondary/50" : "border-border hover:border-input")}
                  >
                    <span className="grid gap-1.5 rounded-xl bg-[#EEF0FA] p-3" style={{ gridTemplateColumns: `repeat(${t.cols}, minmax(0, 1fr))` }} aria-hidden="true">
                      {Array.from({ length: t.booths }).map((_, i) => (
                        <span key={i} className="aspect-[3/2] rounded-[4px] bg-card" />
                      ))}
                    </span>
                    <span>
                      <span className="flex items-center justify-between font-bold">{t.name}<span className="text-sm font-semibold text-muted-foreground">{t.booths} booths</span></span>
                      <span className="text-sm text-muted-foreground">{t.fits}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">Choose what the event needs</h2>
              <p className="mb-4 text-muted-foreground">Turned-off features disappear completely for visitors and teams.</p>
              <ul className="flex flex-col divide-y divide-border rounded-2xl ring-1 ring-border">
                {modules.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-6 px-5 py-4">
                    <div>
                      <Label htmlFor={`m-${m.id}`} className="text-[15px] font-semibold">{m.name}</Label>
                      <p className="text-sm text-muted-foreground">{m.text}</p>
                    </div>
                    <Switch id={`m-${m.id}`} checked={on[m.id]} onCheckedChange={(v) => setOn({ ...on, [m.id]: v })} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold">Presenting teams</h2>
                <p className="text-muted-foreground">Each team gets a booth and fills it in themselves.</p>
                <button type="button" className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-input px-6 py-8 text-center text-muted-foreground hover:border-primary hover:text-primary">
                  <Upload className="size-6" aria-hidden="true" />
                  <span className="font-semibold">Upload a CSV of teams</span>
                  <span className="text-sm">team name, project title, member emails</span>
                </button>
                <Link href="#" className="text-sm font-semibold text-primary">Download the template</Link>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold">Judges & staff</h2>
                <p className="text-muted-foreground">They get an email with a sign-in link.</p>
                <Label htmlFor="judges" className="font-semibold">Judge emails</Label>
                <Textarea id="judges" rows={4} className="rounded-xl px-4 py-3 text-[15px]" placeholder="one email per line" defaultValue={"judge.one@university.ac.th\nguest.judge@company.com"} />
                <Label htmlFor="staff" className="font-semibold">Co-organizers</Label>
                <Input id="staff" placeholder="name@university.ac.th" className={field} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold">Ready to create</h2>
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {[
                  ["Event", "SIT Capstone Showcase 2027"],
                  ["When", "Sat, Apr 24, 2027 · 9:00 AM – 4:00 PM"],
                  ["Hall", `${templates.find((t) => t.id === template)?.name} · ${templates.find((t) => t.id === template)?.booths} booths`],
                  ["Features", modules.filter((m) => on[m.id]).map((m) => m.name).join(", ")],
                  ["Teams", "39 from teams.csv"],
                  ["Judges", "2 invited"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-muted px-5 py-4">
                    <dt className="text-sm text-muted-foreground">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="size-4" aria-hidden="true" /> Invitations are sent when you publish the event, not now.</p>
            </div>
          )}
        </section>

        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" className={bigButton} disabled={step === 0} onClick={() => setStep(step - 1)}>
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button className={bigButton} onClick={() => setStep(step + 1)}>
              Continue <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          ) : (
            <Link href="/manage/sit-capstone-2027" className={cn(buttonVariants(), bigButton)}>Create event</Link>
          )}
        </div>
      </main>
    </div>
  );
}
