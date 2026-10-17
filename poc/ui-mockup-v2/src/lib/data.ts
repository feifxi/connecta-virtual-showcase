// Sample data for the UI mockup only — every project, person and number is made up.

export type Role = "Visitor" | "Presenter" | "Judge" | "Admin";
export type EventState = "published" | "live" | "exhibition";

// 14 characters from poc/TestUI (80px frames · 4 columns × 4 rows · rows: down, up, left, right)
export const CHARACTERS = [
  "Mika", "Haru", "Nami", "Ren", "Sora", "Yuki", "Mali", "Nont", "Phum", "Prae", "Dr. Arun", "Dr. Pim", "Fah", "Dr. May",
].map((name, i) => {
  const id = `character-${String(i + 1).padStart(2, "0")}`;
  return { id, name, walk: `/assets/characters/${id}-walk.png`, idle: i >= 8 ? `/assets/characters/${id}-idle.png` : null, portrait: `/assets/characters/${id}-portrait.png` };
});

export const EVENT = {
  slug: "senior-design-2026",
  name: "Senior Design Showcase 2026",
  faculty: "Faculty of Engineering",
  date: "Friday, 16 October 2026",
  dateShort: "Fri 16 Oct",
  time: "10:00–16:00",
  ends: "16:00",
  booths: 24,
  inHall: 211,
  interested: 512,
  capacity: 300,
  reserved: 86,
  access: "@kmutt.ac.th only",
  blurb: "A year of making, questioning and figuring things out. Walk into any booth and talk to the students turning their ideas into something real.",
};

// categories = zones in the hall (optional per event)
export const CATEGORIES = ["Engineering", "Computing", "Health", "Design"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Project = {
  code: string; title: string; short: string; category: Category; tag: string; abstract: string;
  color: "blue" | "purple" | "green" | "orange"; presenter: string; avatar: number; team: number[];
  live: boolean; people: number; visits: number; votes: number; score: number;
};

export const PROJECTS: Project[] = [
  { code: "01", team: [0, 4, 7], title: "Mapping urban heat with open satellite data", short: "Aurora", category: "Engineering", tag: "Climate & cities", color: "blue", presenter: "Mika", avatar: 0, live: true, people: 14, visits: 151, votes: 64, score: 8.4, abstract: "Turning open satellite imagery into practical maps of urban heat, so greener streets go where they help most." },
  { code: "02", team: [9, 2], title: "Sign-language recognition on edge devices", short: "Pixel Path", category: "Computing", tag: "AI & accessibility", color: "purple", presenter: "Prae", avatar: 9, live: true, people: 22, visits: 188, votes: 96, score: 8.9, abstract: "Making everyday conversations more accessible. Our on-device model recognises hand gestures in real time, with no internet connection required." },
  { code: "03", team: [8, 5, 1], title: "A smarter soil-moisture network for campus gardens", short: "GreenLoop", category: "Engineering", tag: "Environment & IoT", color: "green", presenter: "Phum", avatar: 8, live: true, people: 9, visits: 127, votes: 41, score: 7.7, abstract: "Small sensors, healthier gardens. A low-cost network that tells gardeners which beds need water today." },
  { code: "04", team: [3, 6], title: "A modular bike-share dock from recycled aluminium", short: "Re:Cycle", category: "Design", tag: "Circular design", color: "orange", presenter: "Ren", avatar: 3, live: false, people: 2, visits: 119, votes: 22, score: 7.4, abstract: "A repairable bike dock made from reclaimed aluminium, designed to make short campus trips easier." },
  { code: "05", team: [11, 10, 4], title: "Adaptive prosthetic grip with tactile feedback", short: "Touchpoint", category: "Health", tag: "Assistive technology", color: "purple", presenter: "Dr. Pim", avatar: 11, live: false, people: 0, visits: 98, votes: 35, score: 8.6, abstract: "A lightweight prosthetic hand that buzzes the wearer when an object starts to slip." },
  { code: "06", team: [12, 1], title: "Speech-to-text tutoring for first-generation students", short: "Open Notes", category: "Computing", tag: "Education & HCI", color: "blue", presenter: "Fah", avatar: 12, live: true, people: 11, visits: 164, votes: 58, score: 7.9, abstract: "Accessible lecture notes and real-time captions, co-designed with students to make learning easier to follow." },
];

export const RUBRIC = [{ k: "Technical depth", w: 35 }, { k: "Problem & impact", w: 30 }, { k: "Presentation", w: 20 }, { k: "Feasibility", w: 15 }];

export const MY_EVENTS: { slug: string; name: string; date: string; role: Role; state: "Draft" | "Published" | "Live" | "Exhibition"; people: number; art: "map" | "purple" | "orange" }[] = [
  { slug: EVENT.slug, name: EVENT.name, date: "Today · 10:00–16:00", role: "Admin", state: "Live", people: 512, art: "map" },
  { slug: "greener-tomorrow", name: "Ideas for a greener tomorrow", date: "23 Oct · 10:00–15:00", role: "Presenter", state: "Published", people: 128, art: "purple" },
  { slug: "capstone-demo", name: "Capstone Demo Day", date: "30 Oct · 09:00–16:00", role: "Judge", state: "Published", people: 210, art: "orange" },
  { slug: "it-open-house", name: "Open House: IT Projects", date: "2 Oct · 09:00–15:00", role: "Visitor", state: "Exhibition", people: 380, art: "purple" },
];

export const EXPLORE = [
  { slug: EVENT.slug, name: EVENT.name, host: "Faculty of Engineering", date: "Today · 10:00–16:00", state: "Live" as const, booths: 24, access: "@kmutt.ac.th only", art: "map" as const },
  { slug: "greener-tomorrow", name: "Ideas for a greener tomorrow", host: "Sustainability & Design Lab", date: "23 Oct · 10:00–15:00", state: "Published" as const, booths: 12, access: "Open to everyone", art: "purple" as const },
  { slug: "capstone-demo", name: "Capstone Demo Day", host: "School of Information Technology", date: "30 Oct · 09:00–16:00", state: "Published" as const, booths: 28, access: "Open to everyone", art: "orange" as const },
];

export const AGENDA = [
  { time: "10:00", label: "Hall opens, with a short tour of how to get around" },
  { time: "10:15", label: "Booths open — walk in any time" },
  { time: "15:30", label: "Last call for judges" },
  { time: "16:00", label: "Event ends, results are announced after" },
];

export const VISITOR_TYPES = ["University student", "High school student", "Company", "Alumni", "Parent", "Teacher"];

export const SCREENS: [string, string, string, string][] = [
  ["/", "Landing", "The first hello", "globe"],
  ["/explore", "Explore events", "Every event, with its access badge", "search"],
  ["/login", "Log in", "Microsoft · Google · email link", "leave"],
  ["/onboarding", "Profile setup", "Character & a few details · once", "users"],
  ["/home", "My events", "By role · invitations", "grid"],
  ["/invite/demo", "Invitation", "Accept · account mismatch", "mail"],
  [`/e/${EVENT.slug}`, "Event page", "Interested · Join · Visit", "calendar"],
  [`/e/${EVENT.slug}/join`, "Before you go in", "First-time form · hall full", "check"],
  [`/e/${EVENT.slug}/hall`, "Hall (Phaser)", "Walk, booths, roles", "map"],
  [`/e/${EVENT.slug}/my-booth`, "My booth", "Presenter workspace", "monitor"],
  [`/e/${EVENT.slug}/judge`, "Judging list", "Assigned projects · rubric", "trophy"],
  ["/manage/new", "Create event", "Basics · hall · features", "plus"],
  [`/manage/${EVENT.slug}`, "Admin overview", "Live event at a glance", "settings"],
  [`/manage/${EVENT.slug}/projects`, "Projects & hall", "Import · zones · layout", "file"],
  [`/manage/${EVENT.slug}/analytics`, "Event report", "Attendance · heatmap · results", "chart"],
  ["/profile", "My profile", "What people see", "user"],
];

// 24 booths for the Phaser hall: the 6 featured projects + 18 more · Engineering 8 (2 zones) · Computing 6 · Health 5 · Design 5
const EXTRA: [string, Category, boolean][] = [
  ["Bridge strain sensing", "Engineering", true], ["Solar bench", "Engineering", false], ["Flood alert", "Engineering", true], ["Smart parking", "Engineering", false], ["Drone mapping", "Engineering", true], ["Air quality kit", "Engineering", false],
  ["Campus chatbot", "Computing", true], ["Exam planner", "Computing", false], ["Bus tracker", "Computing", true], ["Lost & found", "Computing", false],
  ["Fall detector", "Health", true], ["Diet coach", "Health", false], ["Sleep tracker", "Health", true], ["Rehab game", "Health", false],
  ["Library seats", "Design", true], ["Eco packaging", "Design", false], ["Wayfinding", "Design", true], ["Desk lamp", "Design", false],
];
export const HALL_PROJECTS = [
  ...PROJECTS.map((p) => ({ no: p.code, title: p.title, short: p.short, category: p.category, live: p.live, presenter: p.presenter, avatar: p.avatar })),
  ...EXTRA.map(([short, category, live], i) => ({ no: String(i + 7).padStart(2, "0"), title: short, short, category, live, presenter: CHARACTERS[(i * 3 + 1) % 14].name, avatar: (i * 3 + 1) % 14 })),
];
