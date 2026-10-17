import Link from "next/link";
import { Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HallMap } from "@/components/hall-map";
import { Logo } from "@/components/brand";
import { bigButton } from "@/components/shells";
import { cn } from "@/lib/utils";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
      <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.8-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.8 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

export default function Login() {
  return (
    <div className="flex min-h-screen flex-wrap">
      <div className="flex min-w-0 flex-[1_1_480px] flex-col px-8 py-8 sm:px-14">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-7 py-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Log in to join events, manage your booth or run your own showcase.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/home" className={cn(buttonVariants({ variant: "outline" }), bigButton, "w-full gap-3")}>
              <GoogleMark /> Continue with Google
            </Link>
            <Link href="/home" className={cn(buttonVariants({ variant: "outline" }), bigButton, "w-full gap-3")}>
              <MicrosoftMark /> Continue with Microsoft
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" />or get a sign-in link<span className="h-px flex-1 bg-border" />
          </div>
          <form action="/home" className="flex flex-col gap-3">
            <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@university.ac.th" className="h-11 rounded-xl px-4 text-[15px]" />
            <button type="submit" className={cn(buttonVariants(), bigButton, "w-full")}>
              <Mail className="size-4" aria-hidden="true" /> Email me a link
            </button>
          </form>
          <p className="text-xs leading-relaxed text-muted-foreground">
            By continuing you agree to the <Link href="#" className="underline">terms</Link> and <Link href="#" className="underline">privacy policy</Link>. We only share your name with booths you choose to connect with.
          </p>
        </div>
      </div>
      <div className="hidden min-w-0 flex-[1_1_480px] flex-col justify-center gap-8 bg-secondary px-14 py-12 lg:flex">
        <HallMap showMe />
        <div className="max-w-md">
          <p className="text-xl font-semibold leading-snug text-secondary-foreground">Walk in. Listen. Ask the team.</p>
          <p className="mt-2 text-[15px] text-secondary-foreground/80">Voices fade in as you get closer to a booth, so joining a conversation feels as easy as it does on a real exhibition floor.</p>
        </div>
      </div>
    </div>
  );
}
