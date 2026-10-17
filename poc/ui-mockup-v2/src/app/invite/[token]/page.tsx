import { Btn, Header, Icon, RoleChip } from "@/components/ui";

// Invitation link from email · shows the case where the signed-in account isn't the invited address
export default function Invite() {
  return (
    <>
      <Header />
      <main id="main" className="page container narrow page-content" style={{ maxWidth: 560 }}>
        <section className="surface panel-card stack">
          <span className="role-icon" style={{ width: 52, height: 52, borderRadius: 15, display: "grid", placeItems: "center", background: "var(--blue-tint)", color: "var(--blue)" }}><Icon name="trophy" /></span>
          <div>
            <p className="small-text">Dr. Arun Wattanapong invited you to</p>
            <h1 style={{ fontSize: "1.9rem", margin: "6px 0 10px" }}>Data Science Research Day</h1>
            <div className="flex"><RoleChip role="Judge" /><span className="small-text muted">Thu 20 Nov 2026</span></div>
          </div>
          <p className="body-text">You&rsquo;ll see the rubric and the 8 projects assigned to you, then score them in their booths on the day.</p>
          <div className="notice"><Icon name="info" /><span>This invite is for <b>a***@kmutt.ac.th</b>. You&rsquo;re signed in as <b>nont@gmail.com</b>.</span></div>
          <div className="form-row">
            <Btn href="/login" cls="secondary wide">Switch account</Btn>
            <Btn href="/e/senior-design-2026/judge" cls="wide">Accept with this account</Btn>
          </div>
          <p className="field-note">If you accept, future invites to a***@kmutt.ac.th come to this account. The link works once and expires in 14 days.</p>
        </section>
      </main>
    </>
  );
}
