// Sample data from the Claude Design file (Connecta Flow.dc.html). Not real projects or people.

export const EVENT = {
  slug: "senior-design-2026",
  name: "Senior Design Showcase 2026",
  short: "Senior Design Showcase",
  faculty: "Faculty of Engineering",
  blurb: "Forty-two final-year teams present their projects. Walk between booths and talk to presenters live. Judging closes at 16:00.",
  date: "Fri 14 Nov 2026",
  dateShort: "Fri 14 Nov",
  time: "10:00–16:00",
  booths: 42,
  live: 31,
  inHall: 211,
};

export type Group = "Engineering" | "Computing" | "Health" | "Other";

export type Project = {
  booth: string;
  title: string;
  short: string;
  dept: string;
  group: Group;
  live: boolean;
  visitors?: number;
  status?: string;
  supervisor: string;
  abstract: string;
};

export const PROJECTS: Project[] = [
  { booth: "A01", title: "Mapping heat islands in Lagos with open satellite data", short: "Lagos heat islands", dept: "Geography", group: "Other", live: true, visitors: 14, supervisor: "Dr. O. Adeyemi", abstract: "Land-surface temperature from Landsat combined with street-level sensors to find the hottest blocks and where shade trees help most." },
  { booth: "A03", title: "A digital twin for campus energy use", short: "Campus energy twin", dept: "Electrical Eng.", group: "Engineering", live: true, visitors: 8, supervisor: "Prof. L. Grant", abstract: "Live meter data from 14 buildings drives a 3D model that shows where heating is wasted overnight." },
  { booth: "A07", title: "Sign-language gesture recognition on edge devices", short: "Sign-language on edge", dept: "Computer Science", group: "Computing", live: true, visitors: 22, supervisor: "Dr. H. Moreau", abstract: "A wrist-worn camera module that translates 120 BSL signs to text in under 80 ms, running entirely on a microcontroller." },
  { booth: "B01", title: "Flood-risk dashboard for river towns", short: "Flood-risk dashboard", dept: "Civil Eng.", group: "Engineering", live: true, visitors: 6, supervisor: "Dr. S. Okafor", abstract: "River gauges and rainfall forecasts combined into a six-hour flood warning that councils can read at a glance." },
  { booth: "B03", title: "Low-cost soil moisture network for campus gardens", short: "Soil moisture network", dept: "Environmental Eng.", group: "Engineering", live: true, visitors: 9, supervisor: "Dr. R. Lindqvist", abstract: "Solar-powered sensor nodes form a mesh across the gardens and tell the grounds team which beds need water today." },
  { booth: "B05", title: "Tracking insulin through the cold chain", short: "Insulin cold chain", dept: "Biomedical Eng.", group: "Health", live: false, status: "Away", supervisor: "Dr. P. Shah", abstract: "Cheap temperature tags that flag insulin which got too warm in transit before it reaches the pharmacy." },
  { booth: "B09", title: "A modular bike-share dock from recycled aluminium", short: "Bike-share dock", dept: "Mechanical Eng.", group: "Engineering", live: false, status: "Away", supervisor: "Prof. K. Brandt", abstract: "A dock that bolts together from four cast parts, made from recycled aluminium." },
  { booth: "C02", title: "Adaptive prosthetic grip with tactile feedback", short: "Prosthetic grip", dept: "Biomedical Eng.", group: "Health", live: false, status: "Back at 14:30", supervisor: "Dr. A. Novak", abstract: "Pressure sensors in the fingertips adjust grip strength and buzz the wearer when an object starts to slip." },
  { booth: "C05", title: "Speech-to-text tutoring for first-generation students", short: "Speech-to-text tutor", dept: "Education & HCI", group: "Computing", live: true, visitors: 11, supervisor: "Dr. M. Ito", abstract: "Lecture audio turned into searchable notes with plain-language summaries for students who are first in their family at university." },
];

export const FILTERS = ["All", "Live now", "Engineering", "Computing", "Health"] as const;
export type Filter = (typeof FILTERS)[number];

export const project = (booth: string) => PROJECTS.find((p) => p.booth === booth)!;

// ---------- hall ----------
export const WORLD = { w: 1200, h: 760, wallH: 104, floorRight: 832, floorBottom: 690 };
export const BOOTH = { w: 236, h: 220 };
const POS: [number, number][] = [[32, 128], [300, 128], [568, 128], [32, 396], [300, 396], [568, 396]];
const CARPETS = ["#dfe8fb", "#e6dcfb", "#dbeedd", "#fde2d4", "#e6dcfb", "#dfe8fb"];
export const HALL_BOOTHS = ["A01", "A03", "A07", "B01", "B03", "B05"].map((code, i) => ({
  code, x: POS[i][0], y: POS[i][1], carpet: CARPETS[i], live: project(code).live,
}));
export type HallBooth = (typeof HALL_BOOTHS)[number];

export type Person = { name: string; sprite: number; x: number; y: number; presenter?: string };

// positions are the top-left of the 44px avatar box (as in the design)
export const VISITOR_CROWD: Person[] = [
  { name: "Aisha", sprite: 3, x: 572, y: 186, presenter: "A07" },
  { name: "Jonas", sprite: 4, x: 748, y: 186, presenter: "A07" },
  { name: "Lena", sprite: 2, x: 92, y: 196 },
  { name: "Dev", sprite: 6, x: 160, y: 210 },
  { name: "Ravi", sprite: 7, x: 396, y: 236 },
  { name: "Priya", sprite: 5, x: 520, y: 346 },
  { name: "Tom", sprite: 4, x: 130, y: 470 },
  { name: "Mei", sprite: 2, x: 420, y: 486 },
];
export const VISITOR_START = { x: 666, y: 244 };

export const JUDGE_CROWD: Person[] = [
  { name: "Maya", sprite: 6, x: 310, y: 452, presenter: "B03" },
  { name: "Ken", sprite: 5, x: 480, y: 452, presenter: "B03" },
  { name: "Lena", sprite: 2, x: 92, y: 196 },
  { name: "Omar", sprite: 1, x: 640, y: 230 },
  { name: "Tom", sprite: 4, x: 130, y: 470 },
];
export const JUDGE_START = { x: 398, y: 518 };

export const BOOTH_CHAT: Record<string, { who: string; text: string }[]> = {
  A07: [{ who: "Ravi", text: "What dataset did you train on?" }, { who: "Aisha", text: "Our own, 14k clips. Come closer and I'll show you." }],
  B03: [{ who: "Omar", text: "How long do the batteries last?" }, { who: "Maya", text: "About four months on one charge." }],
};

// ---------- judging ----------
export const RUBRIC = ["Technical depth", "Problem & impact", "Presentation", "Feasibility"];
export const JUDGE_ASSIGNED = 12;
export const JUDGE_INITIAL: Record<string, "scored" | "todo"> = { A01: "scored", A03: "todo", A07: "scored", B01: "scored", B03: "todo", B05: "todo" };
export const JUDGE_PRESET: Record<string, number[]> = { B03: [9, 8, 9, 8] };

// ---------- analytics ----------
export const KPIS = [
  { label: "Registered", value: "612", note: "+18% on 2025" },
  { label: "Attended", value: "438", note: "72% turnout" },
  { label: "Peak in hall", value: "211", note: "at 13:30" },
  { label: "Avg. time in hall", value: "47 min", note: "6.2 booths each" },
];
export const ATTENDANCE = [32, 48, 66, 74, 70, 58, 80, 100, 92, 76, 54, 30];
export const VISITS: [string, number][] = [["A07", 188], ["C05", 164], ["A01", 151], ["B03", 127], ["C08", 119]];
export const RESULTS = [
  { rank: 1, title: "Sign-language gesture recognition on edge devices", booth: "A07", score: 8.9, judges: 5 },
  { rank: 2, title: "Adaptive prosthetic grip with tactile feedback", booth: "C02", score: 8.6, judges: 5 },
  { rank: 3, title: "Mapping heat islands in Lagos", booth: "A01", score: 8.4, judges: 4 },
  { rank: 4, title: "Bridge strain sensing with fibre optics", booth: "C08", score: 8.1, judges: 5 },
  { rank: 5, title: "Speech-to-text tutoring", booth: "C05", score: 7.9, judges: 4 },
  { rank: 6, title: "Low-cost soil moisture network", booth: "B03", score: 7.7, judges: 5 },
];

// ---------- landing ----------
export const LANDING = {
  roles: [
    { who: "Visitors", title: "Walk the hall", body: "Move your avatar between booths and join the conversation at any project that catches your eye.", cta: "Find an event", href: `/e/${EVENT.slug}` },
    { who: "Presenters", title: "Run your booth", body: "Upload your poster, go live when you are ready, and talk to whoever walks up.", cta: "Presenter guide", href: "/signup?role=presenter" },
    { who: "Organizers", title: "Host the day", body: "Lay out the hall, assign judges and get attendance and scores once it closes.", cta: "Host a showcase", href: "/signup?role=staff" },
  ],
  events: [
    { date: "Today · until 16:00", live: true, people: 211, title: "Senior Design Showcase 2026", host: "Faculty of Engineering", booths: 42, cta: "Enter hall", href: `/e/${EVENT.slug}/hall` },
    { date: "Today · until 18:00", live: true, people: 86, title: "HCI Poster Session", host: "School of Computing", booths: 24, cta: "Enter hall", href: `/e/${EVENT.slug}/hall` },
    { date: "Fri 21 Nov", live: false, people: 0, title: "Capstone Demo Day", host: "Business & Design School", booths: 30, cta: "Register", href: "/signup" },
  ],
  steps: [
    { n: 1, img: "/assets/step-1.png", bg: "#e6dcfb", title: "Create your event", body: "Pick a date, lay out the booths and invite student teams." },
    { n: 2, img: "/assets/step-2.png", bg: "#fde2d4", title: "Share the link", body: "Visitors register in one step and enter the hall on the day." },
    { n: 3, img: "/assets/step-3.png", bg: "#dcf0e0", title: "Review the results", body: "See who visited which booth and publish the judges’ scores." },
  ],
  features: [
    { title: "Live booths", body: "Audio and chat switch on as you walk up to a booth, so conversations feel like a real poster session." },
    { title: "Judging built in", body: "Judges score against your rubric from inside the hall. Results tally as they submit." },
    { title: "Post-event analytics", body: "Attendance over time, booth visits and dwell time, ready to export the moment the hall closes." },
    { title: "Showcase archive", body: "Every project stays online with its poster and video after the event ends." },
  ],
};
