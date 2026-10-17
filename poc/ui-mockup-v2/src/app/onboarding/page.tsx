"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Actor } from "@/components/actor";
import { Header, Icon, Pill } from "@/components/ui";
import { CHARACTERS, VISITOR_TYPES } from "@/lib/data";

// One-time profile after the first login (TestUI character lobby) · then back to where the user was going
export default function Onboarding() {
  const router = useRouter();
  const [avatar, setAvatar] = useState(7);
  const [dir, setDir] = useState(0);
  const [walk, setWalk] = useState(false);
  const [name, setName] = useState("Nont");
  const pick = (i: number) => { setAvatar(i); try { localStorage.setItem("connecta-avatar", String(i)); } catch {} };
  return (
    <>
      <Header />
      <main id="main" className="page container narrow page-content">
        <div className="page-title"><h1>Set up your profile</h1><p>One-time setup, about 30 seconds. Every event you join uses it.</p></div>
        <div className="lobby-layout">
          <section>
            <div className="avatar-stage">
              <div className="avatar-stage-caption"><Pill cls="blue">Your character</Pill></div>
              <Actor index={avatar} direction={dir} walk={walk} name={name || "You"} />
              <div className="avatar-controls">
                <button type="button" className="icon-btn" aria-label="Turn left" onClick={() => setDir(2)}><Icon name="back" /></button>
                <button type="button" className="icon-btn" aria-label="Face forward" onClick={() => setDir(0)}><Icon name="user" /></button>
                <button type="button" className="icon-btn" aria-label="Turn right" onClick={() => setDir(3)}><Icon name="arrow" /></button>
                <button type="button" className="icon-btn" aria-label="Preview walking" aria-pressed={walk} onClick={() => setWalk(!walk)}><Icon name={walk ? "pause" : "play"} /></button>
              </div>
            </div>
            <div className="flex between" style={{ marginTop: 21 }}><h3 style={{ fontSize: ".875rem" }}>Pick your character</h3><span className="small-text muted">14 to choose from</span></div>
            <div className="character-grid">
              {CHARACTERS.map((c, i) => (
                <button key={c.id} type="button" className={`character-option ${avatar === i ? "active" : ""}`} aria-pressed={avatar === i} aria-label={`Choose ${c.name}`} onClick={() => pick(i)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.portrait} width={80} height={80} alt="" /><span>{c.name}</span>
                </button>
              ))}
            </div>
          </section>
          <form className="surface lobby-settings stack" onSubmit={(e) => { e.preventDefault(); router.push("/e/senior-design-2026"); }}>
            <h2 style={{ marginBottom: 0 }}>About you</h2>
            <label className="field">Display name<input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} required autoComplete="nickname" /><span className="field-note">From your Microsoft account. Shown above your character.</span></label>
            <div className="form-row">
              <label className="field">I am a…<select>{VISITOR_TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="field">Province<select><option>Bangkok</option><option>Chiang Mai</option><option>Khon Kaen</option><option>Other</option></select></label>
            </div>
            <div className="info-note"><Icon name="shield" /><span>Nobody sees these two. Organizers only get totals, like how many provinces their event reached.</span></div>
            <div className="form-row">
              <label className="field">Organization <span className="field-note">optional</span><input placeholder="e.g. SIT, KMUTT" /></label>
              <label className="field">Position or year <span className="field-note">optional</span><input placeholder="e.g. 4th year" /></label>
            </div>
            <span className="field-note">People in your events see these. Leave them blank if you prefer.</span>
            <button className="btn wide" type="submit">Continue to Senior Design Showcase <Icon name="arrow" /></button>
          </form>
        </div>
      </main>
    </>
  );
}
