import { Icon, Pill, Workspace } from "@/components/ui";
import { EVENT, PROJECTS } from "@/lib/data";

const ZONE: Record<string, string> = { Engineering: "#dfe8fb", Computing: "#e6dcfb", Health: "#dbeedd", Design: "#fde2d4" };
// 5 blocks × 6 slots · one category per block · empty slots become plants
const BLOCKS: [string, string, number][] = [["Engineering", "A2", 6], ["Engineering", "C2", 2], ["Computing", "B1", 6], ["Health", "A1", 5], ["Design", "C1", 5]];

export default function Projects() {
  return (
    <Workspace active="Projects & hall">
      <div className="section-heading">
        <div><h1>Projects & hall.</h1><p>{EVENT.booths} projects · each one is a booth. Presenters get their invitation when you publish.</p></div>
        <div className="flex">
          <button type="button" className="btn secondary small"><Icon name="upload" />Import CSV / XLSX</button>
          <button type="button" className="btn secondary small"><Icon name="bot" />AI import <Pill cls="lav">Pro</Pill></button>
          <button type="button" className="btn small"><Icon name="plus" />Add project</button>
        </div>
      </div>
      <div className="workspace-grid" style={{ gridTemplateColumns: "1fr 1.3fr" }}>
        <section className="surface panel-card stack">
          <h2 style={{ marginBottom: 0 }}>Submission form</h2>
          <p className="body-text">Let teams add their own project. The category field shows because this event has categories.</p>
          <label className="module-row"><h3>Accept submissions</h3><input type="checkbox" className="switch" defaultChecked aria-label="Accept submissions" /></label>
          <div className="resource"><Icon name="link" />connecta.space/e/{EVENT.slug}/submit<small>Copy</small></div>
          <a className="text-link" href="#"><Icon name="download" />CSV template: title, category, member emails, summary</a>
        </section>
        <section className="surface panel-card stack">
          <div className="flex between"><h2 style={{ marginBottom: 0 }}>Hall layout · Hall preset</h2><span className="small-text muted">24 of 30 slots used</span></div>
          <div className="zone-grid">
            {BLOCKS.map(([cat, id, used]) => (
              <div key={id} className="zone-block">
                <span className="pill" style={{ background: ZONE[cat], color: "var(--ink)" }}>{cat}</span>
                <div className="zone-slots">{Array.from({ length: 6 }).map((_, i) => <i key={i} style={{ background: i < used ? ZONE[cat] : undefined }} />)}</div>
              </div>
            ))}
          </div>
          <div className="notice butter"><Icon name="info" /><span>One category per block. Every block is used now — a new category won&rsquo;t fit. Pick a bigger preset or turn off categories.</span></div>
          <p className="field-note">Swap booths until the hall opens. Projects added during the event go into a free slot in their zone; nobody else moves.</p>
        </section>
      </div>
      <section className="surface" style={{ marginTop: 22 }}>
        <div className="table-wrap"><table><thead><tr><th>Booth</th><th>Project</th><th>Category</th><th>Presenter</th><th>Booth content</th></tr></thead><tbody>
          {PROJECTS.map((p, i) => <tr key={p.code}><td><span className="booth-code">{p.code}</span></td><td><strong style={{ fontWeight: 600 }}>{p.title}</strong></td><td>{p.category}</td><td>{p.presenter}</td><td>{i === 3 ? <span style={{ color: "var(--red)", fontWeight: 600 }}>Missing poster</span> : <span style={{ color: "var(--green)" }}>Complete</span>}</td></tr>)}
        </tbody></table></div>
      </section>
    </Workspace>
  );
}
