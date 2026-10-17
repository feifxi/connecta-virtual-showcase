"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bigButton } from "@/components/shells";
import { cn } from "@/lib/utils";

export function RegisterDialog({ slug, label = "Register for free", className }: { slug: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Dialog onOpenChange={(o) => !o && setDone(false)}>
      <DialogTrigger render={<Button className={cn(bigButton, "h-12 px-6", className)} />}>{label}</DialogTrigger>
      <DialogContent className="rounded-3xl p-7 sm:max-w-md">
        {done ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-mint text-mint-ink"><CalendarCheck className="size-7" aria-hidden="true" /></span>
            <DialogTitle className="text-2xl font-bold">You&rsquo;re in!</DialogTitle>
            <DialogDescription className="text-[15px]">We&rsquo;ll email you a reminder the day before. The hall opens at 9:00 AM.</DialogDescription>
            <Link href={`/e/${slug}/hall`} className={cn(buttonVariants(), bigButton, "w-full")}>Preview the hall</Link>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Register</DialogTitle>
              <DialogDescription className="text-[15px]">Takes 30 seconds. You can change what others see in your profile any time.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-name" className="font-semibold">Display name</Label>
              <Input id="r-name" defaultValue="Ploy S." className="h-11 rounded-xl px-4" />
              <p className="text-sm text-muted-foreground">Shown above your avatar in the hall.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-org" className="font-semibold">School or organization <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id="r-org" placeholder="e.g. SIT, KMUTT" className="h-11 rounded-xl px-4" />
            </div>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox defaultChecked className="mt-0.5" />
              <span>Let teams I visit see my name and organization so they can follow up.</span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox className="mt-0.5" />
              <span>Email me about future events from this organizer.</span>
            </label>
            <Button type="submit" className={cn(bigButton, "w-full")}>Confirm registration</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
