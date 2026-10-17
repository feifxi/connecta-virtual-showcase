// Sample data for the UI mockup only — every number here is made up.

export type Tone = "peach" | "mint" | "butter" | "lilac" | "sky";
// ● Live = at least one presenter is inside the booth · idle = no presenter right now
export type BoothStatus = "live" | "idle";
export type Role = "Admin" | "Presenter" | "Judge" | "Visitor";

export const toneClass: Record<Tone, string> = {
  peach: "bg-peach text-peach-ink",
  mint: "bg-mint text-mint-ink",
  butter: "bg-butter text-butter-ink",
  lilac: "bg-lilac text-lilac-ink",
  sky: "bg-sky text-sky-ink",
};

// event categories = hall zones (optional per event)
export const categories: { name: string; tone: Tone }[] = [
  { name: "AI & Data", tone: "lilac" },
  { name: "IoT", tone: "mint" },
  { name: "Web & Mobile", tone: "sky" },
  { name: "Games", tone: "peach" },
  { name: "EdTech", tone: "butter" },
];

export const toneOf = (cat: string): Tone => categories.find((c) => c.name === cat)?.tone ?? "sky";

export type Booth = {
  id: string;
  no: string;
  title: string;
  team: string;
  members: string[];
  category: string;
  status: BoothStatus;
  people: number;
  summary: string;
  tags: string[];
  visits: number;
  passedBy: number; // walked past without entering
  avgMinutes: number;
  feedback: number;
  votes: number;
  contacts: number;
  scored: number; // judges with a submitted sheet
  score: number; // weighted average out of 100
  ready: boolean; // booth checklist complete
};

export const booths: Booth[] = [
  { id: "course-recommender", no: "01", title: "AI Elective Course Recommender", team: "Team A1", members: ["Mint", "Book"], category: "AI & Data", status: "live", people: 12, summary: "Suggests electives from your transcript, career goals and what seniors with similar paths took.", tags: ["recommender", "LLM"], visits: 88, passedBy: 31, avgMinutes: 5.2, feedback: 17, votes: 64, contacts: 4, scored: 9, score: 84, ready: true },
  { id: "pm25-tracker", no: "02", title: "Community PM2.5 Tracker", team: "Team B4", members: ["Beam", "Jay"], category: "IoT", status: "live", people: 5, summary: "Low-cost sensors on 40 homes and a map that warns neighbours before the air turns bad.", tags: ["sensors", "maps"], visits: 44, passedBy: 52, avgMinutes: 3.8, feedback: 6, votes: 21, contacts: 2, scored: 4, score: 76, ready: true },
  { id: "room-booking", no: "03", title: "Smart Classroom Booking Platform", team: "Team C2", members: ["Oat", "Praew"], category: "Web & Mobile", status: "idle", people: 2, summary: "Finds a free room that fits your class size and equipment, then books it in one tap.", tags: ["booking", "PWA"], visits: 12, passedBy: 47, avgMinutes: 1.3, feedback: 1, votes: 3, contacts: 0, scored: 0, score: 0, ready: false },
  { id: "sign-language-game", no: "04", title: "Thai Sign Language Game for Kids", team: "Team A7", members: ["Ploy", "Nat", "Earth"], category: "Games", status: "live", people: 18, summary: "A tablet game that teaches 200 everyday Thai signs through short camera-checked challenges.", tags: ["education", "computer vision"], visits: 96, passedBy: 12, avgMinutes: 6.7, feedback: 23, votes: 88, contacts: 6, scored: 12, score: 88, ready: true },
  { id: "auto-grader", no: "05", title: "Automatic Programming Homework Grader", team: "Team D3", members: ["Fah", "Tong", "Pim"], category: "EdTech", status: "live", people: 7, summary: "Runs student code in a sandbox, grades against hidden tests and explains each failure.", tags: ["sandbox", "grading"], visits: 61, passedBy: 20, avgMinutes: 4.4, feedback: 9, votes: 35, contacts: 3, scored: 6, score: 79, ready: true },
  { id: "factory-twin", no: "06", title: "Digital Twin for a Small Factory", team: "Team B1", members: ["Kla", "Ice"], category: "IoT", status: "idle", people: 3, summary: "A live model of a production line fed by machine sensors, for spotting bottlenecks.", tags: ["digital twin", "3D"], visits: 39, passedBy: 28, avgMinutes: 4.9, feedback: 5, votes: 18, contacts: 1, scored: 5, score: 81, ready: true },
];

export const event = {
  slug: "sit-capstone-2027",
  name: "SIT Capstone Showcase 2027",
  org: "School of Information Technology, KMUTT",
  date: "Saturday, April 24, 2027",
  time: "9:00 AM – 4:00 PM (GMT+7)",
  endsAt: "4:00 PM",
  access: "@kmutt.ac.th only" as "Open to everyone" | "@kmutt.ac.th only",
  plan: "Pro" as "Free" | "Pro",
  hall: { preset: "Hall", slots: 30 },
  capacity: 300,
  reserved: 96, // invitations (pending + accepted) hold seats
  works: 28,
  judges: 12,
  interested: 512,
  blurb: "Final-year students present 28 capstone projects. Walk into any booth, listen in and ask the team questions — no queue, no meeting links.",
  agenda: [
    { time: "9:00", label: "Hall opens · short tour of how to get around" },
    { time: "9:15", label: "Booths open — walk in any time" },
    { time: "3:30 PM", label: "Judging closes" },
    { time: "4:00 PM", label: "Event ends · results announced after" },
  ],
};

export const rubric = [
  { k: "Problem & value", max: 10, w: 30 },
  { k: "Technical quality", max: 10, w: 30 },
  { k: "Demo", max: 10, w: 25 },
  { k: "Presentation", max: 10, w: 15 },
];

export type MyEvent = {
  slug: string;
  name: string;
  date: string;
  role: Role;
  state: "Draft" | "Published" | "Live" | "Exhibition" | "Archived";
  people: number;
  tone: Tone;
};

export const myEvents: MyEvent[] = [
  { slug: "sit-capstone-2027", name: "SIT Capstone Showcase 2027", date: "Apr 24, 2027", role: "Admin", state: "Live", people: 512, tone: "lilac" },
  { slug: "int371-posters", name: "INT371 Poster Session", date: "Dec 3, 2026", role: "Admin", state: "Draft", people: 0, tone: "mint" },
  { slug: "hci-final-demo", name: "HCI Final Project Demo Day", date: "Nov 28, 2026", role: "Presenter", state: "Published", people: 128, tone: "peach" },
  { slug: "ds-research-day", name: "Data Science Research Day", date: "Nov 20, 2026", role: "Judge", state: "Published", people: 210, tone: "sky" },
  { slug: "it-open-house", name: "Open House: IT Projects", date: "Oct 2, 2026", role: "Visitor", state: "Exhibition", people: 380, tone: "butter" },
];

export const invites = [
  { token: "demo", event: "Data Science Research Day", role: "Judge", by: "Dr. Nat Wong", date: "Nov 20, 2026", tone: "sky" as Tone },
];

export const hourly = [
  { h: "9", v: 40 }, { h: "10", v: 110 }, { h: "11", v: 137 }, { h: "12", v: 120 },
  { h: "1", v: 60 }, { h: "2", v: 95 }, { h: "3", v: 130 }, { h: "4", v: 80 },
];

export const visitorTypes = [
  { k: "University students", v: 46 }, { k: "High school students", v: 21 }, { k: "Companies", v: 14 },
  { k: "Alumni", v: 9 }, { k: "Parents", v: 6 }, { k: "Teachers", v: 4 },
];

export const visitorTypeOptions = ["University student", "High school student", "Company", "Alumni", "Parent", "Teacher"];
