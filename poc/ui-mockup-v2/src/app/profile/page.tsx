import { Actor } from "@/components/actor";
import { Btn, Header, Icon, Pill } from "@/components/ui";
import { VISITOR_TYPES } from "@/lib/data";

// One profile for every event · no contact details stored here (contact goes only through "Ask the team to contact me")
export default function Profile() {
  return (
    <>
      <Header />
      <main id="main" className="page container narrow page-content">
        <div className="page-title"><h1>A familiar face in every room.</h1><p>One profile for every event you join. Change it any time.</p></div>
        <div className="profile-layout">
          <aside className="surface profile-summary">
            <Actor index={7} style={{ position: "relative", margin: "0 auto 18px", ["--sprite-size" as string]: "115px" }} />
            <div><h2>Nont</h2><p>SIT, KMUTT · 4th year</p><Btn href="/onboarding" cls="secondary small" icon="user">Change character</Btn></div>
          </aside>
          <form className="surface profile-form">
            <div className="flex between" style={{ marginBottom: 20 }}><h2 style={{ margin: 0 }}>What people in your events see</h2><Pill cls="blue">Visible in the hall</Pill></div>
            <div className="form-row">
              <label className="field">Display name<input defaultValue="Nont" maxLength={30} /></label>
              <label className="field">Position or year <span className="field-note">optional</span><input defaultValue="4th year" /></label>
            </div>
            <label className="field">University or organization <span className="field-note">optional</span><input defaultValue="SIT, KMUTT" /></label>
            <div className="flex between" style={{ margin: "30px 0 18px" }}><h2 style={{ margin: 0 }}>Only for event statistics</h2><Pill cls="green">Never shown</Pill></div>
            <div className="form-row">
              <label className="field">I am a…<select defaultValue={VISITOR_TYPES[0]}>{VISITOR_TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="field">Province<select><option>Bangkok</option><option>Other</option></select></label>
            </div>
            <div className="info-note" style={{ marginTop: 18 }}><Icon name="info" />We don&rsquo;t keep phone numbers or social links on your profile. When a team interests you, use “Ask the team to contact me” in their booth.</div>
            <div className="flex between" style={{ marginTop: 26 }}>
              <button className="btn" type="submit"><Icon name="save" /> Save profile</button>
              <button type="button" className="btn danger small">Delete account</button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
