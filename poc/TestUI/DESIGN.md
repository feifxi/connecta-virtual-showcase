# Connecta HTML design preview

## Direction

Keep the handoff's university showcase identity: blue `#1d5cf5`, ink `#0f1a3a`, app background `#f6f7fb`, white `#ffffff`, lavender `#e6dcfb`, orange `#ff6a1a`. Plus Jakarta Sans carries the English UI, with Noto Sans Thai as the Thai fallback. Use the handoff's type hierarchy and radii, with CSS custom properties as the token source for this static preview.

The landing composition pairs a left-aligned headline with a large illustrated hall. A small live booth card connects the marketing page to the product. Content is real showcase subject matter, rather than abstract platform promises. The original long landing HTML contains several sections despite the README describing a non-scrolling hero; preserve its hero as the first viewport and include the supplied lower sections for review.

The game view uses the exact attached map as a static background. Its top stage, three left booths, top-right meeting room, center seating and right-side cafe remain in their supplied positions. Lightweight edge controls and on-demand drawers keep the map readable. This is a DOM preview for later Phaser implementation, not a replacement tilemap or a production collision model.

## Screens

| Hash | Screen | Main interaction |
|---|---|---|
| `#home` | Landing | Illustrated hall with animated characters and tour |
| `#events` | Event discovery | Search and live/upcoming/archive filters |
| `#signup` | Create account | Form validation and role-context preview |
| `#signin` | Sign in | Sample sign-in form |
| `#event` | Event & projects | Department filters, search, project details |
| `#avatar` | Choose character & device lobby | Every supplied character, walk/idle preview |
| `#hall` | Visitor hall | All 14 NPCs, walking, hotspots, booth/chat/meeting UI |
| `#judge` | Judge hall | Rubric, totals and local score submission |
| `#schedule` | Agenda | Session details, save, enter stage |
| `#presenter` | Exhibitor workspace | Booth editing, availability, resources and leads |
| `#organizer` | Organizer overview | Attendees, roles and event modules |
| `#create-event` | Event setup | Details, map presets and module switches |
| `#analytics` | Event report | Charts, ranked scores and working sample CSV export |
| `#profile` | Profile & contacts | Public/private details and contact consent settings |

The preview page switcher exposes every role for design review. Real event roles must be assigned or invited by the organizer, not granted by a sign-up selector. Account creation and event registration are separate actions, following the current capstone requirements. No audio/video, login, payment, analytics collection, AI bot or backend integration runs in this preview.

## Motion

- Coordinated hero entrance and modest scroll reveals, as requested.
- Page changes 260 ms; panel/modal changes 220 ms; button feedback 120 ms.
- Shared rAF sprite controller at 7 walk frames/sec. NPCs alternate walking and pausing; dedicated idle sheets for Example02. Example01 uses a resting walk frame and a subtle breathing transform.
- Normalize existing source sheets into preview atlases, preserving one shared scale per character and bottom-center foot anchors. Original files remain untouched. These preview atlases are not certified for the Editor32-v1 runtime.
- Pause control, tab-hidden suspension, reduced-motion alternative, keyboard focus and modal focus management.

## Improvements over reference

- Replace the seven contaminated handoff sprite crops with all eight Example01 sheets and all six paired Example02 characters.
- Use the attached 1536×855 map directly and preserve its aspect ratio. Retain the high-resolution handoff lobby artwork where appropriate.
- Use resolution-independent SVG project posters and UI icons for clean small text and details.
- Standardize controls, whitespace, empty states, keyboard feedback, panel disclosure and mobile stacking.
- Use a consistent sample date, Friday 16 October 2026. The handoff's Friday 14 November 2026 label has a weekday/date mismatch.

## Sources inspected

- `D:/Downloads/UI mockups request/design_handoff_connecta/README.md`, `AGENTS.md`, `STEPS.md`, both reference HTML files and artwork.
- `BussinessMd/capstone-cp26ssi3.md`, especially account/profile, organizer, registration, agenda, booth, meeting and post-event requirements.
- `BussinessMd/MyMdTool/ImageGenerate/Standard/MapStandard.md`, `ReferenceImageGuide.md`, `CharacterGenerate/CharacterAssetGuide.md`, `ObjectGenerate/ObjectAssetGuide.md`, `MapComponentGuide.md`.
- Both requested character directories. All top-level PNG sheets are represented in `assets/characters/manifest.json`.

The immediate user request for standalone HTML and a supplied map image overrides the handoff's production Next.js/PixiJS stack. The handoff's viewer runtime and inline-style markup are not reused. No additional map prop is required for this image-backed design pass.
