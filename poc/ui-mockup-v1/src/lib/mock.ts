// Sample data for the UI mockup only — every number here is made up.

export type Tone = "peach" | "mint" | "butter" | "lilac" | "sky";
export type BoothStatus = "presenting" | "staffed" | "empty";

export const toneClass: Record<Tone, string> = {
  peach: "bg-peach text-peach-ink",
  mint: "bg-mint text-mint-ink",
  butter: "bg-butter text-butter-ink",
  lilac: "bg-lilac text-lilac-ink",
  sky: "bg-sky text-sky-ink",
};

export const categories: { name: string; tone: Tone }[] = [
  { name: "AI", tone: "lilac" },
  { name: "IoT", tone: "mint" },
  { name: "Web", tone: "sky" },
  { name: "Game", tone: "peach" },
  { name: "EdTech", tone: "butter" },
  { name: "3D", tone: "lilac" },
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
  visits: number;
  avgMinutes: number;
  feedback: number;
  scored: number; // judges who submitted a score
  score: number; // weighted average out of 100
};

export const booths: Booth[] = [
  { id: "sign-language-game", no: "04", title: "Thai Sign Language Game for Kids", team: "Team A7", members: ["Ploy", "Nat", "Earth"], category: "Game", status: "presenting", people: 18, summary: "A tablet game that teaches 200 everyday Thai signs through short camera-checked challenges.", visits: 96, avgMinutes: 6.7, feedback: 23, scored: 12, score: 88 },
  { id: "course-recommender", no: "01", title: "AI Elective Course Recommender", team: "Team A1", members: ["Mint", "Book"], category: "AI", status: "presenting", people: 12, summary: "Suggests electives from your transcript, career goals and what seniors with similar paths took.", visits: 88, avgMinutes: 5.2, feedback: 17, scored: 9, score: 84 },
  { id: "auto-grader", no: "05", title: "Automatic Programming Homework Grader", team: "Team D3", members: ["Fah", "Tong", "Pim"], category: "EdTech", status: "staffed", people: 7, summary: "Runs student code in a sandbox, grades against hidden tests and explains each failure.", visits: 61, avgMinutes: 4.4, feedback: 9, scored: 6, score: 79 },
  { id: "pm25-tracker", no: "02", title: "Community PM2.5 Tracker", team: "Team B4", members: ["Beam", "Jay"], category: "IoT", status: "staffed", people: 5, summary: "Low-cost sensors on 40 homes and a map that warns neighbours before the air turns bad.", visits: 44, avgMinutes: 3.8, feedback: 6, scored: 4, score: 76 },
  { id: "factory-twin", no: "06", title: "Digital Twin for a Small Factory", team: "Team B1", members: ["Kla", "Ice"], category: "3D", status: "staffed", people: 3, summary: "A live 3D model of a production line fed by machine sensors, for spotting bottlenecks.", visits: 39, avgMinutes: 4.9, feedback: 5, scored: 5, score: 81 },
  { id: "room-booking", no: "03", title: "Smart Classroom Booking Platform", team: "Team C2", members: ["Oat", "Praew"], category: "Web", status: "empty", people: 0, summary: "Finds a free room that fits your class size and equipment, then books it in one tap.", visits: 12, avgMinutes: 1.3, feedback: 1, scored: 0, score: 0 },
];

export const event = {
  slug: "sit-capstone-2027",
  name: "SIT Capstone Showcase 2027",
  org: "School of Information Technology, KMUTT",
  date: "Saturday, April 24, 2027",
  time: "9:00 AM – 4:00 PM (GMT+7)",
  works: 39,
  categoriesCount: 6,
  judges: 12,
  blurb: "Final-year students present 39 capstone projects. Walk into any booth, listen in and ask the team questions — no queue, no meeting links.",
  schedule: [
    { time: "9:00", label: "Opening & how to get around the hall" },
    { time: "9:30", label: "Session 1 · Booths 01–20" },
    { time: "1:00 PM", label: "Session 2 · Booths 21–39" },
    { time: "3:30 PM", label: "Awards" },
  ],
};

export type MyEvent = {
  slug: string;
  name: string;
  date: string;
  role: "Organizer" | "Presenter" | "Judge" | "Visitor";
  state: "Draft" | "Upcoming" | "Live" | "Ended";
  people: number;
  tone: Tone;
};

export const myEvents: MyEvent[] = [
  { slug: "sit-capstone-2027", name: "SIT Capstone Showcase 2027", date: "Apr 24, 2027", role: "Organizer", state: "Live", people: 642, tone: "lilac" },
  { slug: "int371-posters", name: "INT371 Poster Session", date: "Dec 3, 2026", role: "Organizer", state: "Draft", people: 0, tone: "mint" },
  { slug: "hci-final-demo", name: "HCI Final Project Demo Day", date: "Nov 28, 2026", role: "Presenter", state: "Upcoming", people: 128, tone: "peach" },
  { slug: "ds-research-day", name: "Data Science Research Day", date: "Nov 20, 2026", role: "Judge", state: "Upcoming", people: 210, tone: "sky" },
  { slug: "it-open-house", name: "Open House: IT Projects", date: "Oct 2, 2026", role: "Visitor", state: "Ended", people: 380, tone: "butter" },
];

export const hourly = [
  { h: "9", v: 40 }, { h: "10", v: 110 }, { h: "11", v: 137 }, { h: "12", v: 120 },
  { h: "1", v: 60 }, { h: "2", v: 95 }, { h: "3", v: 130 }, { h: "4", v: 80 },
];
