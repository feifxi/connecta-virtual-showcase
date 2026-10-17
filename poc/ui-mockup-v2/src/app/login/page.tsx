import Link from "next/link";
import { AvatarStack, Brand, Icon } from "@/components/ui";

// Everyone logs in (no guests): Microsoft for university accounts · Google · email link as the fallback
export default function Login() {
  return (
    <main id="main" className="page auth-layout">
      <section className="auth-visual">
        <Brand />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="auth-picture"><img src="/assets/lobby.png" width={1104} height={1424} alt="Students and lecturers talking in a sunlit university lobby" /></div>
        <div>
          <span className="pill light">Your next connection starts here</span>
          <h2 style={{ marginTop: 16 }}>One account for every showcase you visit, present at or judge.</h2>
          <p style={{ marginTop: 14 }}>Roles come from invitations, not from sign-up.</p>
        </div>
        <div className="auth-quote"><AvatarStack /><span>A little closer, wherever you are.</span></div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <Link href="/" className="text-link" style={{ marginBottom: 26 }}><Icon name="back" /> Back to Connecta</Link>
          <h1>Log in to Connecta</h1>
          <p>Everyone logs in — it keeps the hall safe and your votes and scores tied to you.</p>
          <div className="auth-fields">
            <Link href="/onboarding" className="btn secondary wide"><Icon name="shield" />Continue with Microsoft</Link>
            <span className="field-note" style={{ textAlign: "center", marginTop: -8 }}>University accounts like @kmutt.ac.th use Microsoft</span>
            <Link href="/onboarding" className="btn secondary wide"><Icon name="globe" />Continue with Google</Link>
          </div>
          <div className="divider-text">or use an email link</div>
          <form action="/onboarding" className="auth-fields">
            <label className="field" htmlFor="email">Email<input id="email" name="email" type="email" autoComplete="email" spellCheck={false} placeholder="you@university.ac.th…" required /></label>
            <button className="btn wide" type="submit"><Icon name="mail" />Email me a sign-in link</button>
          </form>
          <p className="field-note" style={{ marginTop: 24, textAlign: "center" }}>People in an event see your name, character, organization and position.</p>
        </div>
      </section>
    </main>
  );
}
