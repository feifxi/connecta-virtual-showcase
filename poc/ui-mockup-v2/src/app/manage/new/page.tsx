"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, Pill, Workspace } from "@/components/ui";

const STEPS = ["Event details", "Your hall", "Features & people", "Review"];
const PRESETS = [{ id: "Room", booths: 12, text: "A class poster session · one room, space to chat in the middle" }, { id: "Hall", booths: 30, text: "A capstone day · rows of booths, stage, workshop and lounge" }];
const MODULES: [string, string, boolean, boolean?][] = [
  ["Judging", "One rubric, judges score in the booth", true],
  ["Popular Vote", "Visitors vote for projects they visited", true],
  ["Feedback", "Notes for teams during and after the event", true],
  ["AI booth assistant", "Answers from the team's files when they're away", false, true],
  ["3D model viewer", "Rotate a .glb model together in the booth", false],
];

export default function CreateEvent() {
  const [step, setStep] = useState(0);
  const [preset, setPreset] = useState("Hall");
  const [now, setNow] = useState(false);
  return (
    <Workspace active="Overview">
      <div className="breadcrumb"><Link href="/home">My events</Link><Icon name="chevron" /><span>Create an event</span></div>
      <div className="section-heading"><div><h1>Make room for your ideas.</h1><p>A few details, a hall, and you&rsquo;re ready. It starts as a draft — nothing is sent until you publish.</p></div><Pill cls="blue">Free · up to 50 people at once · 5 judges</Pill></div>
      <div className="setup-stepper">
        {STEPS.map((s, i) => (
          <span key={s} className="flex" style={{ gap: 18, flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <button type="button" className={`setup-step ${i === step ? "active" : ""}`} onClick={() => setStep(i)} style={{ background: "none" }}><span>{i + 1}</span>{s}</button>
            {i < STEPS.length - 1 && <i className="setup-line" />}
          </span>
        ))}
      </div>
      <div className="workspace-grid">
        <section className="surface panel-card stack">
          {step === 0 && (
            <>
              <h2 style={{ marginBottom: 0 }}>Start with the essentials.</h2>
              <label className="field">Event name<input defaultValue="INT371 Poster Session" maxLength={100} /></label>
              <label className="field">Description<textarea defaultValue="Teams present their term posters. Walk into any booth and talk to the team." /></label>
              <div className="chips">{[["Schedule a time", false], ["Start now", true]].map(([l, v]) => <button key={l as string} type="button" className={`chip ${now === v ? "active" : ""}`} onClick={() => setNow(v as boolean)}>{l}</button>)}</div>
              {!now && <div className="form-row"><label className="field">Date<input type="date" defaultValue="2026-12-03" /></label><label className="field">Start time<input type="time" defaultValue="13:00" /></label></div>}
              <label className="field">Ends (required)<input type="time" defaultValue="23:59" /><span className="field-note">The event ends by itself at this time so it never stays open by accident. You can extend it on the day.</span></label>
              <label className="field">Only visitors from (optional)<input placeholder="@kmutt.ac.th" /><span className="field-note">Every event is listed in Explore. With a domain, only those accounts can join as visitors; invited presenters and judges always can.</span></label>
              <label className="field">Categories (optional)<input defaultValue="Engineering, Computing, Health, Design" /><span className="field-note">Each category becomes a zone in the hall.</span></label>
              <label className="upload-area"><Icon name="upload" />Add an event cover<input type="file" accept="image/png,image/jpeg,image/webp" aria-label="Choose event cover" /></label>
            </>
          )}
          {step === 1 && (
            <>
              <h2 style={{ marginBottom: 0 }}>Pick a hall.</h2>
              <p className="body-text">Booths are placed from your project list. Empty slots become plants and seating, so a small event never looks empty.</p>
              <div className="setup-map-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {PRESETS.map((t) => (
                  <button key={t.id} type="button" className={`map-option ${preset === t.id ? "active" : ""}`} aria-pressed={preset === t.id} onClick={() => setPreset(t.id)}>
                    <div className="zone-slots" style={{ gridTemplateColumns: "repeat(6,1fr)", padding: 8, background: "var(--subtle)", borderRadius: 6 }}>{Array.from({ length: t.booths }).map((_, i) => <i key={i} style={{ background: i < 8 ? "var(--blue-tint)" : undefined }} />)}</div>
                    <span>{t.id} · up to {t.booths} booths</span>
                    <span className="field-note" style={{ fontWeight: 400 }}>{t.text}</span>
                  </button>
                ))}
              </div>
              <label className="field">People in the hall at once<input type="number" defaultValue={50} max={50} /><span className="field-note">Up to 50 on Free. Everyone you invite gets a reserved seat; visitors share the rest. Need more? Buy an Event add-on.</span></label>
            </>
          )}
          {step === 2 && (
            <>
              <h2 style={{ marginBottom: 0 }}>What the event needs.</h2>
              {MODULES.map(([t, p, on, pro]) => <label key={t} className="module-row"><div><h3>{t} {pro && <Pill cls="lav">Pro</Pill>}</h3><p>{p}</p></div><input type="checkbox" className="switch" defaultChecked={on} disabled={pro} aria-label={t} /></label>)}
              <label className="field">Admins<textarea defaultValue="fah.c@kmutt.ac.th" style={{ minHeight: 60 }} /><span className="field-note">Admins run the event with you and can do everything. We suggest 2–3.</span></label>
              <label className="field">Judges<textarea defaultValue={"pim.r@kmutt.ac.th\nguest.judge@company.com"} style={{ minHeight: 70 }} /><span className="field-note">Invited when you publish. Free: up to 5.</span></label>
            </>
          )}
          {step === 3 && (
            <>
              <h2 style={{ marginBottom: 0 }}>Ready to create.</h2>
              {[["Event", "INT371 Poster Session"], ["When", now ? "Starts now · ends 23:59" : "Thu 3 Dec · 13:00–23:59"], ["Hall", `${preset} · 50 people at once`], ["Seats reserved", "3 of 50 (admins + judges)"], ["Features", "Judging, Popular Vote, Feedback"]].map(([k, v]) => <div key={k} className="device-row"><span className="muted">{k}</span><strong>{v}</strong></div>)}
              <div className="info-note"><Icon name="mail" /><span>Projects and presenters come next on Projects & hall. Invitations go out when you publish.</span></div>
            </>
          )}
          <div className="flex between">
            <button type="button" className="btn ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><Icon name="back" />Back</button>
            {step < STEPS.length - 1 ? <button type="button" className="btn" onClick={() => setStep(step + 1)}>Continue <Icon name="arrow" /></button> : <Link className="btn" href="/manage/senior-design-2026/projects">Create draft & add projects <Icon name="arrow" /></Link>}
          </div>
        </section>
        <aside>
          <section className="surface panel-card setup-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/hall-reference.png" alt="Hall preview" width={1536} height={855} />
            <h2 style={{ fontSize: "1.125rem" }}>A hall that fits your event.</h2>
            <p className="body-text">Booths sit on coloured carpets by category. Step onto a carpet and everyone there hears each other — like one room.</p>
          </section>
        </aside>
      </div>
    </Workspace>
  );
}
