import Link from "next/link";
import { Btn, EventArt, Header, Icon, Pill, RoleChip, Status } from "@/components/ui";
import { MY_EVENTS } from "@/lib/data";

const action = (e: (typeof MY_EVENTS)[number]): [string, string] =>
  e.role === "Admin" ? ["Manage", `/manage/${e.slug === "senior-design-2026" ? e.slug : "senior-design-2026"}`]
  : e.role === "Presenter" ? ["Edit my booth", "/e/senior-design-2026/my-booth"]
  : e.role === "Judge" ? ["My judging list", "/e/senior-design-2026/judge"]
  : ["Visit", "/e/senior-design-2026?state=exhibition"];

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

        <div className="event-grid">
          {MY_EVENTS.map((e, i) => {
            const [label, href] = action(e);
            return (
              <article key={e.slug} className="event-card">
                <Link href={href} className="event-image" aria-label={e.name}>
                  <EventArt art={e.art} title={i === 1 ? <>Good ideas.<br />Greener futures.</> : <>Made here.<br />Shared everywhere.</>} sub={e.date} actor={i === 1 ? 9 : 7} />
                  {e.state === "Live" ? <Status /> : <Pill cls="light">{e.state === "Published" ? "Upcoming" : e.state}</Pill>}
                </Link>
                <div className="event-card-body">
                  <RoleChip role={e.role} />
                  <h3>{e.name}</h3>
                  <p>{e.date} · {e.people} interested</p>
                  <div className="event-card-foot"><span>{e.state === "Live" ? "211 in the hall now" : "Opens on the day"}</span><Link href={href} className="text-link">{label} <Icon name="arrow" /></Link></div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="event-summary-strip"><div><h3>Interested in an event?</h3><p>Find one in Explore and tap Interested. We remind you in the app when the hall opens.</p></div><Btn href="/explore" cls="secondary small" icon="search">Explore events</Btn></div>
      </main>
    </>
  );
}
