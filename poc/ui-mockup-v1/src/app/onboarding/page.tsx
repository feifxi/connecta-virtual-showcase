import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand";
import { bigButton } from "@/components/shells";
import { CharacterPicker } from "@/components/character-picker";
import { visitorTypeOptions } from "@/lib/mock";
import { cn } from "@/lib/utils";

const field = "h-11 rounded-xl px-4 text-[15px]";
const provinces = ["Bangkok", "Chiang Mai", "Khon Kaen", "Nonthaburi", "Phuket", "Other"];

// One-time setup after the first login · then back to the page the user was going to
export default function Onboarding() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3"><Logo /><span className="text-sm text-muted-foreground">Takes about 30 seconds</span></div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
        <div>
          <p className="text-sm font-semibold text-primary">One-time setup</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Set up your profile</h1>
          <p className="mt-1 text-muted-foreground">You do this once. Every event you join uses it.</p>
        </div>

        <form action="/e/sit-capstone-2027" className="flex flex-col gap-6 rounded-3xl bg-card p-8 ring-1 ring-border/70">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="font-semibold">Display name</Label>
            <Input id="name" defaultValue="Ploy Srisuk" className={field} />
            <p className="text-sm text-muted-foreground">From your Microsoft account. Shown above your character in the hall.</p>
          </div>

          <CharacterPicker />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="type" className="font-semibold">I am a…</Label>
              <select id="type" defaultValue={visitorTypeOptions[0]} className={cn(field, "border border-input bg-transparent")}>
                {visitorTypeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prov" className="font-semibold">Province</Label>
              <select id="prov" defaultValue="Bangkok" className={cn(field, "border border-input bg-transparent")}>
                {provinces.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <p className="flex items-start gap-2 text-sm text-muted-foreground sm:col-span-2">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Nobody sees these two. Organizers only get totals, like “how many high school students came” or “how many provinces we reached”.
            </p>
            <div className="flex flex-col gap-2">
              <Label htmlFor="org" className="font-semibold">School or organization <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id="org" placeholder="e.g. SIT, KMUTT" className={field} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pos" className="font-semibold">Position or year <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id="pos" placeholder="e.g. 4th year · HR manager" className={field} />
            </div>
            <p className="text-sm text-muted-foreground sm:col-span-2">People in the events you join see these. Leave them blank if you prefer.</p>
          </div>

          <button type="submit" className={cn(buttonVariants(), bigButton, "self-end")}>
            Continue to SIT Capstone Showcase 2027 <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </form>
        <Link href="/home" className="self-center text-sm font-semibold text-muted-foreground hover:text-foreground">Go to my events instead</Link>
      </main>
    </div>
  );
}
