import Link from "next/link";
import { Actor } from "@/components/actor";
import { AvatarStack, Brand, Btn, EventArt, Header, Icon, Pill, Status } from "@/components/ui";
import { EXPLORE } from "@/lib/data";

const STEPS = [
  ["Find your event", "Tap Interested and we remind you when the hall opens. No seat booking, no forms yet."],
  ["Make yourself at home", "Pick a character once. Your mic starts muted, so you choose when to talk."],
  ["Step into a booth", "Everyone inside a booth hears each other like one room. Ask, listen, vote."],
];

export default function Landing() {
  return (
    <>
      <Header home />
      <main id="main" className="page home">
        <div className="container">
          <section className="hero">
            <div className="hero-copy reveal">
              <span className="pill light"><span className="dot live-dot" />3 showcases live right now</span>
              <h1>Demo day,<br />without the venue.</h1>
              <p>Walk into a hall of student projects. Step into a booth to talk with the team, get feedback, and see what happens next.</p>
              <div className="hero-cta">
                <Btn href="/explore" icon="arrow">Explore events</Btn>
                <Btn href="/e/senior-design-2026" cls="secondary" icon="play">See an event</Btn>
              </div>
              <div className="social-proof"><AvatarStack /><span>Free for events up to 50 people at once.</span></div>
            </div>
            <div className="hero-art reveal" style={{ animationDelay: "100ms" }}>
              <div className="browser-card">
                <div className="browser-top"><div className="traffic-lights"><i /><i /><i /></div><span className="browser-url">connecta.space / showcase</span><Icon name="globe" /></div>
                <div className="hero-world">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/hall-reference.png" width={1536} height={855} alt="Connecta showcase hall with colourful booths" />
                  <Actor index={7} walk direction={3} name="You" you style={{ left: "55%", top: "64%" }} />
                  <Actor index={9} walk direction={2} style={{ left: "72%", top: "48%" }} />
                  <Actor index={12} style={{ left: "37%", top: "56%" }} />
                  <div className="mini-hud">{["micOff", "chat", "map"].map((i) => <Icon key={i} name={i} />)}</div>
                </div>
              </div>
              <div className="connection-note"><Icon name="checkCircle" />A new connection is one hello away.</div>
              <div className="booth-float">
                <div className="flex between"><span className="booth-code">Booth 02</span><Status text="Live" /></div>
                <h3>Sign-language recognition<br />on edge devices</h3>
                <div className="flex"><AvatarStack /><span className="small-text muted">22 people in the booth</span></div>
              </div>
            </div>
          </section>

          <section className="roles-strip" aria-label="Who Connecta is for">
            {[["users", "Come curious. Leave connected.", "Step into booths and talk to the people behind the projects."], ["monitor", "Give your ideas a little room.", "Present, share your screen, and collect feedback and votes."], ["trophy", "Every perspective counts.", "Judges score with one rubric, right in the booth."]].map(([i, h, p]) => (
              <div key={h} className="role-item"><span className="role-icon"><Icon name={i} /></span><div><h3>{h}</h3><p>{p}</p></div></div>
            ))}
          </section>

          <section className="home-section">
            <div className="section-heading"><div><h2>Happening on Connecta</h2><p>Every event is listed. Some are only for one university.</p></div><Link className="text-link" href="/explore">All events <Icon name="arrow" /></Link></div>
            <div className="event-grid">
              {EXPLORE.map((e, i) => (
                <article key={e.slug} className="event-card">
                  <Link href={`/e/senior-design-2026${e.state === "Live" ? "" : "?state=published"}`} className="event-image" aria-label={`View ${e.name}`}>
                    <EventArt art={e.art} title={i === 1 ? <>Good ideas.<br />Greener futures.</> : <>Made here.<br />Shared everywhere.</>} sub={e.host} actor={i === 1 ? 9 : 7} />
                    {e.state === "Live" ? <Status /> : <Pill cls="light">Upcoming</Pill>}
                  </Link>
                  <div className="event-card-body">
                    <span className="small-text muted">{e.date}</span>
                    <h3>{e.name}</h3>
                    <p>{e.host}</p>
                    <div className="event-card-foot"><span className="foot-meta"><span className="flex"><Icon name="grid" />{e.booths} booths</span><span className="flex"><Icon name={e.access.startsWith("@") ? "shield" : "globe"} />{e.access}</span></span><Link href={`/e/senior-design-2026${e.state === "Live" ? "" : "?state=published"}`} className="text-link">{e.state === "Live" ? "Join" : "Interested"} <Icon name="arrow" /></Link></div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="home-section">
            <div className="section-heading"><div><h2>A few steps. A lot to discover.</h2><p>Getting together should be the easy part.</p></div></div>
            <div className="steps-grid">
              {STEPS.map(([h, p], i) => (
                <article key={h}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="step-image"><img src={`/assets/step-${i + 1}.png`} alt={h} width={600} height={400} loading="lazy" /></div>
                  <div className="step-title"><span className="step-num">{i + 1}</span><h3>{h}</h3></div>
                  <p>{p}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="host-banner">
            <div><h2>Running a demo day this term?</h2><p>Pick a hall, import your projects, invite judges. Free up to 50 people at once.</p></div>
            <Btn href="/login" icon="plus">Create event</Btn>
          </section>
          <footer className="footer"><Brand /><Link href="/explore">Events</Link><Link href="/home">My events</Link><Link href="/profile">Your profile</Link><span>Made for meeting minds.</span></footer>
        </div>
      </main>
    </>
  );
}
