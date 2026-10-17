import { EyeOff, Info, Lock, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chip } from "@/components/brand";
import { CharacterPicker } from "@/components/character-picker";
import { AppHeader, bigButton } from "@/components/shells";
import { visitorTypeOptions } from "@/lib/mock";
import { cn } from "@/lib/utils";

const field = "h-11 rounded-xl px-4 text-[15px]";

// One profile for every event · no contact details stored here (contact goes only through "Ask the team to contact me")
export default function Profile() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your profile</h1>
          <p className="mt-1 text-muted-foreground">One profile for every event you join. Change it any time.</p>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
          <section className="rounded-3xl bg-card p-7 ring-1 ring-border/70"><CharacterPicker /></section>
          <form className="flex flex-col gap-6 rounded-3xl bg-card p-7 ring-1 ring-border/70">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-bold">What people in your events see</h2><Chip tone="sky">Shown in the hall</Chip></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2"><Label htmlFor="dn" className="font-semibold">Display name</Label><Input id="dn" defaultValue="Ploy Srisuk" maxLength={30} className={field} /></div>
              <div className="flex flex-col gap-2"><Label htmlFor="pos" className="font-semibold">Position or year <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="pos" defaultValue="4th year" className={field} /></div>
              <div className="flex flex-col gap-2 sm:col-span-2"><Label htmlFor="org" className="font-semibold">School or organization <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="org" defaultValue="SIT, KMUTT" className={field} /></div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-6"><h2 className="text-lg font-bold">Only for event statistics</h2><Chip tone="mint"><EyeOff className="mr-1 size-3" aria-hidden="true" />Never shown</Chip></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2"><Label htmlFor="vt" className="font-semibold">I am a…</Label><select id="vt" defaultValue={visitorTypeOptions[0]} className={cn(field, "border border-input bg-transparent")}>{visitorTypeOptions.map((t) => <option key={t}>{t}</option>)}</select></div>
              <div className="flex flex-col gap-2"><Label htmlFor="pv" className="font-semibold">Province</Label><select id="pv" className={cn(field, "border border-input bg-transparent")}><option>Bangkok</option><option>Other</option></select></div>
            </div>
            <p className="flex items-start gap-2 text-sm text-muted-foreground"><Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />Organizers only get totals, like how many provinces their event reached.</p>
            <p className="flex items-start gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />We don&rsquo;t keep phone numbers or social links on your profile. When a team interests you, use &ldquo;Ask the team to contact me&rdquo; in their booth.</p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button type="submit" className={bigButton}><Save className="size-4" aria-hidden="true" />Save profile</Button>
              <Button type="button" variant="ghost" className="h-10 rounded-xl text-destructive hover:text-destructive"><Trash2 className="size-4" aria-hidden="true" />Delete account</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
