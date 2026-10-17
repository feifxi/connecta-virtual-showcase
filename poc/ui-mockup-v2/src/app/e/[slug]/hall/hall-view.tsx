"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HallControl } from "@/components/hall-game";
import { Brand, Icon, Pill, Portrait, Poster, Status } from "@/components/ui";
import type { BoothInfo, Hearing } from "@/game/HallScene";
import { AGENDA, CHARACTERS, EVENT, HALL_PROJECTS, PROJECTS, RUBRIC, type Role } from "@/lib/data";

const HallGame = dynamic(() => import("@/components/hall-game"), { ssr: false });
const MY_BOOTH = "02"; // the booth this mock presenter belongs to
type Panel = "booth" | "people" | "booths" | "agenda" | "chat" | "admin" | null;

export function HallView({ initialRole }: { initialRole: Role }) {
  const [role, setRole] = useState<Role>(initialRole);
  const [avatar, setAvatar] = useState<number | null>(null);
  const [booth, setBooth] = useState<BoothInfo | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [hearing, setHearing] = useState<Hearing>({ people: [], inBooth: null });
  const [mic, setMic] = useState(false); // everyone enters muted
  const [cam, setCam] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [zoom, setZoom] = useState(1.3);
  const [leaving, setLeaving] = useState(false);
  const control = useRef<HallControl | null>(null);
  const mapDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let a = 7;
    try { a = Number(localStorage.getItem("connecta-avatar") ?? 7) || 7; } catch {}
    setAvatar(a);
  }, []);

  const mine = role === "Presenter" && booth?.no === MY_BOOTH;
  const open = (p: Panel) => setPanel(panel === p ? null : p);
  const zoomBy = (d: number) => { const z = Math.min(2, Math.max(0.7, Math.round((zoom + d) * 10) / 10)); setZoom(z); control.current?.zoom(z); };
  const goTo = (no: string) => { control.current?.goTo(no); mapDialog.current?.close(); };

  return (
    <main id="main" className="page hall-page" aria-label="Exhibition hall">
      <h1 className="sr-only">Exhibition hall</h1>
      {avatar !== null && (
        <HallGame projects={HALL_PROJECTS} avatar={avatar} name={`${CHARACTERS[avatar].name} (you)`} control={control}
          onEnter={(b) => { setBooth(b); setPanel("booth"); }} onLeave={() => { setBooth(null); setPanel((p) => (p === "booth" ? null : p)); setSharing(false); }} onHearing={setHearing} />
      )}

      <div className="hall-title">
        <Brand href="/home" />
        <span className="divider" />
        <div className="hall-title-event"><strong>{EVENT.name}</strong><small><span className="dot" style={{ color: "var(--green)" }} /> Live · {EVENT.inHall} online · ends {EVENT.ends}</small></div>
      </div>

      <div className="hall-top-right">
        <div className="role-switch" role="group" aria-label="Mockup: preview as role">
          <span>Preview as</span>
          {(["Visitor", "Presenter", "Judge", "Admin"] as Role[]).map((r) => <button key={r} type="button" className={role === r ? "active" : ""} aria-pressed={role === r} onClick={() => { setRole(r); if (panel === "admin") setPanel(null); }}>{r}</button>)}
        </div>
        <Pill cls="green"><span className="dot" />Connected</Pill>
      </div>

      {role === "Judge" && <div className="judge-banner"><Icon name="trophy" /><strong>Judge</strong><span>7 of 12 submitted</span><span>· scoring closes when the event ends at {EVENT.ends}</span></div>}

      <nav className="hall-left-tools" aria-label="Hall tools">
        {([["booths", "grid", "All booths"], ["people", "users", "People nearby"], ["agenda", "calendar", "Agenda"]] as const).map(([p, i, l]) => (
          <button key={p} type="button" className={`icon-btn ${panel === p ? "active" : ""}`} aria-label={l} title={l} onClick={() => open(p)}><Icon name={i} /></button>
        ))}
      </nav>

      {booth?.live && (panel === "booth" || panel === null) && (
        <div className="video-tiles" aria-label="Inside the booth">
          <div className="share-tile"><Icon name="monitor" />{mine && sharing ? "You are sharing" : `${booth.presenter} is sharing`}</div>
          <div className="video-tile speaking"><span className="initials">{booth.presenter.slice(0, 2).toUpperCase()}</span><small>{booth.presenter} · camera</small><Icon name="mic" /></div>
        </div>
      )}

      {panel === "booth" && booth && (role === "Judge" ? <RubricPanel booth={booth} onClose={() => setPanel(null)} /> : <BoothPanel booth={booth} role={role} mine={mine} people={hearing.people} onClose={() => setPanel(null)} />)}
      {panel === "admin" && <AdminPanel onClose={() => setPanel(null)} />}
      {panel === "chat" && <ChatPanel onClose={() => setPanel(null)} />}
      {panel === "people" && (
        <Frame title={hearing.inBooth ? `In booth ${hearing.inBooth}` : "People nearby"} onClose={() => setPanel(null)}>
          <p className="field-note" style={{ marginBottom: 12 }}>{hearing.inBooth ? "Everyone in this booth hears each other. Nobody outside can hear in." : "Outside booths you hear people inside the dashed circle."}</p>
          <div className="people-list">
            {hearing.people.length ? hearing.people.map((n) => { const i = Math.max(0, CHARACTERS.findIndex((c) => n.startsWith(c.name))); return <div key={n} className="person"><Portrait index={i} /><div><strong>{n.split(" · ")[0]}</strong><small>{n.split(" · ")[1] ?? "Visitor"}</small></div><span className="dot" /></div>; }) : <p className="body-text">Nobody close by. Walk up to someone or step into a booth.</p>}
          </div>
        </Frame>
      )}
      {panel === "booths" && (
        <Frame title="All booths" onClose={() => setPanel(null)}>
          <p className="field-note" style={{ marginBottom: 10 }}>{HALL_PROJECTS.length} booths in 4 zones. Pick one to walk straight there.</p>
          {HALL_PROJECTS.map((p) => (
            <button key={p.no} type="button" className="person" style={{ width: "100%", background: "none", textAlign: "left" }} onClick={() => goTo(p.no)}>
              <span className="booth-code">{p.no}</span><div><strong>{p.short}</strong><small>{p.category}</small></div>{p.live && <span style={{ marginLeft: "auto" }}><Status text="Live" /></span>}
            </button>
          ))}
        </Frame>
      )}
      {panel === "agenda" && (
        <Frame title="Today’s agenda" onClose={() => setPanel(null)}>
          <Pill cls="blue">{EVENT.date}</Pill>
          {AGENDA.map((a) => <div key={a.time} style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}><span className="small-text muted">{a.time}</span><h3 style={{ fontSize: ".8125rem", marginTop: 4 }}>{a.label}</h3></div>)}
          <p className="field-note" style={{ marginTop: 12 }}>Booths are open all day. The stage and lounge are places to meet; voices there fade with distance.</p>
        </Frame>
      )}

      <div className="hall-hint">Move with <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or click · Step onto a booth carpet to join it</div>

      <div className="hall-toolbar" aria-label="Hall controls">
        <Tool label={mic ? "Mic on" : "Mic off"} icon={mic ? "mic" : "micOff"} active={mic} cls={mic ? "" : "mic-off"} onClick={() => setMic(!mic)} />
        {mine && <Tool label={cam ? "Camera on" : "Camera off"} icon={cam ? "video" : "videoOff"} active={cam} onClick={() => setCam(!cam)} />}
        {mine && <Tool label={sharing ? "Stop share" : "Share screen"} icon="share" active={sharing} onClick={() => setSharing(!sharing)} />}
        <Tool label="Chat" icon="chat" active={panel === "chat"} onClick={() => open("chat")} />
        <span className="toolbar-separator" />
        <div className="toolbar-presence">
          <strong><span className="dot" />{hearing.inBooth ? `Booth ${hearing.inBooth} · ${hearing.people.length + 1} hear each other` : `${hearing.people.length} ${hearing.people.length === 1 ? "person" : "people"} near you`}</strong>
          <span>{EVENT.inHall} people in the hall</span>
        </div>
        <span className="toolbar-separator" />
        <Tool label="Map" icon="map" onClick={() => mapDialog.current?.showModal()} />
        {role === "Admin" && <Tool label="Admin" icon="shield" active={panel === "admin"} cls="lav" onClick={() => open("admin")} />}
        <Tool label="Leave" icon="leave" cls="leave" onClick={() => setLeaving(true)} />
      </div>

      <div className="hall-zoom">
        <button type="button" className="icon-btn" aria-label="Zoom out" onClick={() => zoomBy(-0.1)}><Icon name="minus" /></button>
        <span>{Math.round((zoom / 1.3) * 100)}%</span>
        <button type="button" className="icon-btn" aria-label="Zoom in" onClick={() => zoomBy(0.1)}><Icon name="plus" /></button>
      </div>

      <dialog ref={mapDialog} className="modal" aria-labelledby="map-title" onClick={(e) => { if (e.target === mapDialog.current) mapDialog.current.close(); }}>
        <button type="button" className="icon-btn modal-close" aria-label="Close dialog" onClick={() => mapDialog.current?.close()}><Icon name="close" /></button>
        <h2 id="map-title">Find your way.</h2>
        <p>Pick a booth and your character walks there.</p>
        <div className="zone-grid">
          {["Engineering", "Computing", "Health", "Design"].map((cat) => (
            <div key={cat} className="zone-block">
              <Pill cls="light">{cat}</Pill>
              <div className="chips">{HALL_PROJECTS.filter((p) => p.category === cat).map((p) => <button key={p.no} type="button" className="chip" style={{ padding: "4px 9px" }} onClick={() => goTo(p.no)}>{p.no}{p.live ? " ●" : ""}</button>)}</div>
            </div>
          ))}
          <div className="zone-block" style={{ background: "var(--orange-tint)" }}><Pill cls="light">Lounge & stage</Pill><p className="small-text">Places to meet. Voices fade with distance.</p></div>
        </div>
      </dialog>

      {leaving && (
        <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="survey-title" style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", background: "rgb(15 26 58 / .42)" }}>
          <form className="modal" style={{ position: "static", display: "block" }} onSubmit={(e) => e.preventDefault()}>
            <h2 id="survey-title">Before you go — how was it?</h2>
            <p>One quick question. Asked once per event.</p>
            <div className="score-cells" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>{[1, 2, 3, 4, 5].map((n) => <label key={n} className="score-cell" style={{ display: "grid", placeItems: "center", height: 40, fontSize: ".875rem", cursor: "pointer" }}><input type="radio" name="sat" className="sr-only" />{n}</label>)}</div>
            <label className="field" style={{ marginTop: 16 }}>Anything to improve? <span className="field-note">optional</span><textarea style={{ minHeight: 70 }} /></label>
            <div className="modal-footer"><Link className="btn secondary" href="/home">Skip</Link><Link className="btn" href={`/e/${EVENT.slug}`}>Send & leave</Link></div>
          </form>
        </div>
      )}
    </main>
  );
}

function Tool({ label, icon, active = false, cls = "", onClick }: { label: string; icon: string; active?: boolean; cls?: string; onClick?: () => void }) {
  return <button type="button" className={`tool ${active ? "active" : ""} ${cls}`} title={label} aria-label={label} onClick={onClick}><Icon name={icon} /><span>{label}</span></button>;
}

function Frame({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <aside className="hall-panel" aria-label={title}>
      <header className="panel-head"><h2>{title}</h2><button type="button" className="icon-btn" aria-label="Close panel" onClick={onClose}><Icon name="close" /></button></header>
      <div className="panel-body">{children}</div>
    </aside>
  );
}

function BoothPanel({ booth, role, mine, people, onClose }: { booth: BoothInfo; role: Role; mine: boolean; people: string[]; onClose: () => void }) {
  const p = PROJECTS.find((x) => x.code === booth.no);
  const [voted, setVoted] = useState(false);
  const [contact, setContact] = useState<"closed" | "open" | "sent">("closed");
  const canMute = mine || role === "Admin";
  return (
    <Frame title={booth.short} onClose={onClose}>
      <div className="flex between"><span className="booth-code">Booth {booth.no} · {booth.category}</span>{booth.live ? <Status text="Live" /> : <Pill>No presenter now</Pill>}</div>
      <h2>{booth.title}</h2>
      {p && <p>{p.abstract}</p>}
      {p && <div className="project-poster"><Poster p={p} /></div>}
      <div className="resource"><Icon name="file" />Poster · follows the presenter&rsquo;s zoom<small>PDF</small></div>
      {!booth.live && (
        <div className="info-note" style={{ marginTop: 16, flexDirection: "column", background: "var(--lavender)", color: "#5b3fb0" }}>
          <strong className="flex"><Icon name="bot" />The team is away — ask the AI</strong>
          <span>Answers only from the team&rsquo;s poster and report.</span>
          <div className="chat-input" style={{ marginTop: 6 }}><input placeholder="How does it work offline?" aria-label="Ask the AI" /><button type="button" className="btn small">Ask</button></div>
        </div>
      )}

      {mine ? (
        <Link className="btn secondary wide small" href={`/e/${EVENT.slug}/my-booth`} style={{ marginTop: 18 }}><Icon name="monitor" />Edit booth</Link>
      ) : (
        <>
          <div className="panel-section-title">Your say</div>
          <button type="button" className={`vote-btn ${voted ? "on" : ""}`} aria-pressed={voted} onClick={() => setVoted(!voted)}>
            <Icon name="heart" /><span><strong style={{ display: "block" }}>{voted ? "You voted for this project" : "Vote for this project"}</strong><span className="field-note" style={{ color: "inherit" }}>Popular Vote · as many projects as you like, once each</span></span>
          </button>
          <label className="field" style={{ marginTop: 14 }}>Feedback for the team<textarea placeholder="What did you like? What could be better?" style={{ minHeight: 70 }} /></label>
          <label className="consent" style={{ marginTop: 8 }}><input type="checkbox" /><span>Hide my name from the team · only the team and admins see feedback</span></label>
          <button type="button" className="btn small" style={{ marginTop: 10 }}>Send feedback</button>
          {contact === "closed" && <button type="button" className="btn secondary wide small" style={{ marginTop: 14 }} onClick={() => setContact("open")}><Icon name="user" />Ask the team to contact me</button>}
          {contact === "open" && (
            <form className="surface" style={{ padding: 14, marginTop: 14 }} onSubmit={(e) => { e.preventDefault(); setContact("sent"); }}>
              <label className="field">Email<input defaultValue="nont@kmutt.ac.th" /></label>
              <label className="field" style={{ marginTop: 10 }}>Phone or LinkedIn <span className="field-note">optional</span><input /></label>
              <p className="field-note" style={{ margin: "10px 0" }}>The team will see your name, organization and what you enter.</p>
              <button type="submit" className="btn small wide">Send to the team</button>
            </form>
          )}
          {contact === "sent" && <div className="info-note" style={{ marginTop: 14, background: "var(--green-tint)", color: "var(--green)" }}><Icon name="checkCircle" />Sent. You can withdraw it any time.</div>}
        </>
      )}

      <div className="panel-section-title">In this booth · you all hear each other</div>
      {[`${booth.presenter} · Presenter`, ...people.filter((n) => !n.startsWith(booth.presenter))].map((n) => {
        const i = Math.max(0, CHARACTERS.findIndex((c) => n.startsWith(c.name)));
        const presenter = n.includes("Presenter");
        return (
          <div key={n} className="person">
            <Portrait index={i} /><div><strong>{n.split(" · ")[0]}</strong><small>{n.split(" · ")[1] ?? "Visitor"}</small></div>
            {canMute && !presenter ? <button type="button" className="btn ghost small" style={{ marginLeft: "auto" }}><Icon name="micOff" />Mute</button> : <span className="dot" />}
          </div>
        );
      })}
      {canMute && <p className="field-note" style={{ marginTop: 8 }}>Muted people can unmute themselves. Nobody can turn on someone else&rsquo;s mic.</p>}
    </Frame>
  );
}

function RubricPanel({ booth, onClose }: { booth: BoothInfo; onClose: () => void }) {
  const [values, setValues] = useState([0, 0, 0, 0]);
  const [submitted, setSubmitted] = useState(false);
  const total = RUBRIC.reduce((a, r, i) => a + values[i] * r.w, 0) / 100;
  return (
    <Frame title="Project evaluation" onClose={onClose}>
      <div className="flex between"><span className="booth-code">Booth {booth.no}</span><Pill cls={submitted ? "green" : "blue"}>{submitted ? "Submitted" : "Draft · saved"}</Pill></div>
      <h2 style={{ fontSize: "1rem" }}>{booth.title}</h2>
      <p className="field-note">Score 1–10 for each criterion. Weights come from the event&rsquo;s rubric.</p>
      {RUBRIC.map((r, j) => (
        <div key={r.k} className="rubric-item">
          <div className="rubric-label">{r.k} · {r.w}%<span>{values[j] || "–"} / 10</span></div>
          <div className="score-cells" role="group" aria-label={r.k}>
            {Array.from({ length: 10 }, (_, i) => <button key={i} type="button" disabled={submitted} className={`score-cell ${i < values[j] ? "filled" : ""}`} aria-label={`${r.k}: ${i + 1} out of 10`} onClick={() => setValues(values.map((v, k) => (k === j ? i + 1 : v)))}>{i + 1}</button>)}
          </div>
        </div>
      ))}
      <label className="field">Comment for the team<textarea placeholder="Sent after results are announced…" disabled={submitted} /></label>
      <div className="rubric-total"><span className="small-text muted">Weighted</span><strong>{total.toFixed(1)}<small> / 10</small></strong></div>
      <button type="button" className="btn wide" disabled={submitted || values.some((v) => !v)} onClick={() => setSubmitted(true)}><Icon name={submitted ? "checkCircle" : "check"} />{submitted ? "Score submitted" : "Submit score"}</button>
      <p className="field-note" style={{ textAlign: "center", marginTop: 10 }}>When the event ends, complete drafts count; incomplete ones don&rsquo;t.</p>
    </Frame>
  );
}

function AdminPanel({ onClose }: { onClose: () => void }) {
  return (
    <Frame title="Admin panel" onClose={onClose}>
      <div className="flex between" style={{ marginBottom: 14 }}>{[["211", "in hall"], ["13", "Live"], ["2", "reports"]].map(([v, k]) => <div key={k} className="surface" style={{ padding: "8px 14px", textAlign: "center" }}><strong style={{ fontSize: "1.1rem" }}>{v}</strong><div className="field-note">{k}</div></div>)}</div>
      <label className="field">Announce to everyone<textarea placeholder="e.g. Judging closes in 30 minutes" style={{ minHeight: 60 }} /></label>
      <button type="button" className="btn small" style={{ marginTop: 8 }}><Icon name="megaphone" />Send</button>
      <div className="panel-section-title">Reports</div>
      {["Rude messages in nearby chat · Ren", "Shouting in booth 04 · Sora"].map((t) => (
        <div key={t} className="notice" style={{ marginBottom: 8, flexDirection: "column" }}><strong>{t}</strong><div className="flex"><button type="button" className="btn secondary small">Mute</button><button type="button" className="btn secondary small">Kick</button><button type="button" className="btn dark small">Ban</button></div></div>
      ))}
      <p className="field-note">Kick = removed, can come back · Ban = can&rsquo;t enter this event again.</p>
      <label className="module-row"><h3>Stop new arrivals</h3><input type="checkbox" className="switch" aria-label="Stop new arrivals" /></label>
      <label className="module-row"><h3>Mute everyone</h3><input type="checkbox" className="switch" aria-label="Mute everyone" /></label>
      <div className="info-note"><Icon name="users" />Click someone in People nearby to make them a Presenter, Judge or Admin.</div>
    </Frame>
  );
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"Nearby" | "Everyone">("Nearby");
  const msgs = tab === "Nearby" ? [["Prae", "Hi! Want to see how our sign-language model works?"], ["Phum", "Yes — does it run offline?"]] : [["Admin · Fah", "Judging closes at 16:00 with the event."], ["Mika", "Booth 02 is amazing, go see it"]];
  return (
    <Frame title="Chat" onClose={onClose}>
      <div className="role-segment">{(["Nearby", "Everyone"] as const).map((t) => <button key={t} type="button" className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>
      <p className="field-note" style={{ marginBottom: 16 }}>{tab === "Nearby" ? "Only people close to you. Messages float above heads and fade — not saved." : "The whole hall. Not saved after the event."}</p>
      <div className="chat-messages">{msgs.map(([w, m]) => <div key={m}><div className="chat-name">{w}</div><div className="chat-bubble">{m}</div></div>)}</div>
      <form className="chat-input" onSubmit={(e) => e.preventDefault()}><input aria-label="Your message" placeholder="Say something…" /><button className="btn small" aria-label="Send" type="submit"><Icon name="arrow" /></button></form>
      <button type="button" className="btn ghost small" style={{ marginTop: 10 }}>Report a message</button>
    </Frame>
  );
}
