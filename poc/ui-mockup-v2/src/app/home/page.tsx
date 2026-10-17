import { Btn, Header, Icon } from "@/components/ui";
import { MyEventGrid } from "./my-event-grid";

export default function Home() {
  return (
    <>
      <Header active="My events" />
      <main id="main" className="page container page-content">
        <div className="section-heading page-title"><div><h1>Hi Nont, here are your events.</h1><p>Everything you run, present at, judge or are interested in.</p></div><Btn href="/manage/new" icon="plus">Create event</Btn></div>

        <div className="surface flex" style={{ padding: "18px 22px", marginBottom: 26, borderColor: "#ffd98a" }}>
          <span className="role-icon" style={{ background: "#fff4cf", color: "#8a5b00", width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center" }}><Icon name="mail" /></span>
          <div style={{ flex: 1 }}><strong style={{ fontSize: ".875rem" }}>Dr. Arun invited you to judge <span style={{ color: "var(--blue)" }}>Data Science Research Day</span></strong><p className="small-text">Thu 20 Nov · the link expires in 12 days</p></div>
          <Btn href="/invite/demo" cls="small">View invitation</Btn>
        </div>

        <MyEventGrid />
        <div className="event-summary-strip"><div><h3>Interested in an event?</h3><p>Find one in Explore and tap Interested. We remind you in the app when the hall opens.</p></div><Btn href="/explore" cls="secondary small" icon="search">Explore events</Btn></div>
      </main>
    </>
  );
}
