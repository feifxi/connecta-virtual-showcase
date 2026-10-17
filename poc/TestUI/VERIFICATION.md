# Verification · 16 October 2026

## Checks completed

- `npm run check` passes for `app.js`, `motion.js` and `server.cjs`.
- Browser automation inspected all 14 routes at 1440×1000 and 390×844. No broken image or page-level horizontal overflow remains. The hall itself deliberately allows horizontal map scrolling on mobile.
- Browser runtime error capture returned no JavaScript errors. Resources load locally, including fonts. An initial missing font stylesheet during setup was resolved before final verification.
- Screenshots captured for all 14 desktop routes, mobile samples, the hall booth panel, the page selector, and a sprite contact sheet. Landing was scrolled through before full-page capture to exercise scroll reveals.

## Interactions exercised

| Flow | Result |
|---|---|
| Computing project filter | Shows 2 relevant projects |
| No-match search | Displays an explanatory empty state |
| Project details and save | Modal opens and collection updates |
| Choose character 14 | Lobby and hall use the selected Dr. May character |
| Name and event registration | Separate confirmation before entering hall |
| Player movement | Holding D moves the player to the right |
| NPC movement | All 14 NPCs present, with 8 moving in the sampled interval and others resting |
| Walk and idle | Frame progression observed; dedicated idle sheets and breathing fallback render |
| Booth panel and chat | Pixel Path details open and the submitted sample message appears |
| Wave | Transient emote appears above the player |
| Judge scoring | Scores 9, 8, 9, 8 produce mean 8.5 / 10 |
| Score submission | Locks controls and remains submitted after reload |
| CSV export | Produces `connecta-event-report-sample.csv` |
| Profile | Organisation persists after reload |
| Booth editing | Updated project title persists locally |
| Event setup | Draft persists and review dialog uses the entered title |
| Motion pause | Character positions and sprite frames remain unchanged while paused |
| Reduced motion | NPC coordinates remain unchanged under `prefers-reduced-motion: reduce` |
| Page selector | Links to all 14 screens |

## Scope of verification

Verified in the available Chromium browser automation session. This is a local HTML design prototype. No production Phaser/Tiled runtime, pixel-perfect map collision, multiplayer, authentication, permission enforcement, upload pipeline, audio/video hardware, LiveKit, billing or real analytics backend was tested or implemented. Mobile Hall is a horizontally scrollable design preview; navigation is available through map destinations and hotspots.

Original handoff and character source files were not modified. The normalized sheets are preview derivatives and have not been certified against the Editor32-v1 import contract.
