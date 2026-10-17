import { Btn, Icon, Kpis, Pill, Portrait, Poster, Workspace } from "@/components/ui";
import { CATEGORIES, PROJECTS } from "@/lib/data";

const p = PROJECTS[1];
const CHECK: [string, boolean][] = [["Title, summary and category", true], ["Cover image", true], ["Poster (PDF)", true], ["Slides", false], ["Demo video link", true]];

// Presenter edits the booth before and during the event (same as "Edit booth" in the hall)
export default function MyBooth() {
  return (
    <Workspace active="My booth" kind="presenter">
      <div className="section-heading">
        <div><div className="flex" style={{ marginBottom: 9 }}><Pill cls="green">Presenter</Pill><span className="booth-code">Booth {p.code} · {p.category} zone</span></div><h1>Edit your booth</h1><p>Edit any time — before or during the event. Changes show in the hall right away.</p></div>
        <Btn href="/e/senior-design-2026/hall?as=Presenter" cls="secondary small" icon="arrow">Open in the hall</Btn>
      </div>
      <Kpis items={[["Booth visitors", "188", "24 in the last hour", "users"], ["Avg. visit", "6.2 min", "Event average 4.8 min", "clock"], ["Feedback", "23", "3 new today", "chat"], ["Popular Vote", "96", "Rank shown after results", "heart"]]} />
      <div className="workspace-grid">
        <form className="surface panel-card stack">
          <h2 style={{ marginBottom: 0 }}>Booth details</h2>
          <label className="field">Project title<input defaultValue={p.title} maxLength={120} /></label>
          <label className="field">Summary<textarea defaultValue={p.abstract} maxLength={1200} /><span className="field-note">Visitors read this before walking in. 2–3 sentences works best.</span></label>
          <div className="field">Category · sets your zone in the hall<div className="chips">{CATEGORIES.map((c) => <button key={c} type="button" className={`chip ${c === p.category ? "active" : ""}`}>{c}</button>)}</div></div>
          <label className="field">Tags<input defaultValue="edge AI, accessibility" /></label>
          <label className="field">Demo video<input type="url" defaultValue="https://youtu.be/[your-video]" /><span className="field-note">YouTube or Vimeo link — we don&rsquo;t host videos.</span></label>
          <div>
            <h3 style={{ fontSize: ".875rem", marginBottom: 10 }}>Files</h3>
            {[["cover.png", "Cover image", false], ["poster-final.pdf", "Poster · zooms with you in the booth", true], ["capstone-report.pdf", "For the AI assistant", true]].map(([f, d, ai]) => (
              <div key={f as string} className="resource"><Icon name="file" />{f as string}<small>{d as string}</small>{ai ? <label className="flex small-text" style={{ gap: 6 }}>AI<input type="checkbox" className="switch" defaultChecked /></label> : null}</div>
            ))}
            <label className="upload-area" style={{ display: "block", marginTop: 14 }}><Icon name="upload" />Add slides or a file<small>PDF, PPTX or DOCX, up to 20 MB</small><input type="file" aria-label="Choose a file" /></label>
            <p className="field-note" style={{ marginTop: 8 }}>We check the real file type, not the extension. Max 20 MB each.</p>
          </div>
          <section className="surface" style={{ padding: 18, background: "var(--lavender)", border: 0 }}>
            <div className="flex between"><h3 className="flex" style={{ fontSize: ".875rem" }}><Icon name="bot" />AI assistant <Pill cls="light">Pro</Pill></h3><input type="checkbox" className="switch" aria-label="Answer visitors when we're away" /></div>
            <p className="small-text" style={{ margin: "8px 0 12px", color: "#685a86" }}>Answers visitors from your ticked files when no presenter is in the booth. It says when it doesn&rsquo;t know.</p>
            <div className="chat-input"><input placeholder="Try a question before turning it on…" aria-label="Try the AI" /><button type="button" className="btn small">Ask</button></div>
          </section>
          <button className="btn" type="submit"><Icon name="save" /> Save booth</button>
        </form>
        <aside className="stack">
          <section className="surface panel-card">
            <div className="flex between"><h3 style={{ fontSize: ".875rem" }}>Checklist</h3><span className="small-text muted">4 of 5</span></div>
            {CHECK.map(([k, ok]) => <div key={k} className={`check-row ${ok ? "" : "todo"}`}><Icon name={ok ? "checkCircle" : "clock"} />{k}</div>)}
            <div className="notice butter" style={{ marginTop: 12 }}><Icon name="calendar" /><span>Organizer&rsquo;s deadline: <b>12 Oct</b>. A reminder only — you can still edit during the event.</span></div>
          </section>
          <section className="surface panel-card">
            <div className="flex between"><h3 style={{ fontSize: ".875rem" }}>How visitors see it</h3><Pill cls="live"><span className="dot" />Live when you&rsquo;re inside</Pill></div>
            <div className="project-poster"><Poster p={p} /></div>
            <h3>{p.title}</h3>
          </section>
          <section className="surface panel-card">
            <div className="flex between"><h3 style={{ fontSize: ".875rem" }}>Team</h3><button type="button" className="btn ghost small"><Icon name="plus" />Invite</button></div>
            {[[9, "Prae", "Presenter"], [8, "Phum", "Presenter"]].map(([i, n, r]) => <div key={n} className="person"><Portrait index={i as number} /><div><strong>{n}</strong><small>{r}</small></div></div>)}
            <div className="person"><span className="avatar-dot">?</span><div><strong>ken.s@kmutt.ac.th</strong><small>Invitation pending</small></div></div>
          </section>
          <section className="surface panel-card">
            <div className="flex between"><h3 style={{ fontSize: ".875rem" }}>Asked you to contact them</h3><button type="button" className="btn ghost small"><Icon name="download" />CSV</button></div>
            {[[10, "Dr. Arun", "Lab partner · lab@example.com"], [13, "Dr. May", "Internship · hr@example.com"]].map(([i, n, d]) => <div key={n as string} className="person"><Portrait index={i as number} /><div><strong>{n}</strong><small>{d}</small></div></div>)}
            <p className="field-note" style={{ marginTop: 10 }}>Only people who chose to leave their contact appear here.</p>
          </section>
        </aside>
      </div>
    </Workspace>
  );
}
