# Connecta — Technical

> stack · architecture · deployment · spike · reference ด้านเทคนิค · อิง `connecta-v3.md` และ `features.md`

## Stack

| ชั้น | เลือก | เหตุผลหลัก |
|---|---|---|
| Language | **TypeScript** ทั้งระบบ | ชั้น realtime อยู่บน Node อยู่แล้ว ถ้า API ใช้ภาษาอื่นต้องดูแลเครื่องมือและประกาศโครงสร้างข้อมูลซ้ำสองชุด |
| Rendering | **Phaser 4** | tilemap · collision · camera · sprite animation ครบในตัว · เริ่มจาก template ทางการ `phaserjs/template-nextjs` |
| Map | **Tiled** → export JSON | ไม่ต้องเขียน map editor เอง · template ฮอลล์มี "ช่องบูธ" ให้ระบบเติมผลงานอัตโนมัติ |
| Web | **Next.js (App Router)** | หน้า public (หน้างาน · แกลเลอรีหลังงาน) ได้ SEO/OG ใน codebase เดียว |
| Realtime | **Colyseus** | room lifecycle · delta state sync · client SDK สำเร็จรูป · 1 room ต่อ 1 ฮอลล์ · `StateView` แยกข้อมูลตามโซน |
| API | **NestJS** | โครงสร้างบังคับ เหมาะทีมหลายคน · guard เป็นที่ของ permission · แยก service จาก Colyseus |
| Media | **LiveKit** (self-host) | SFU + TURN/TLS ในตัวเดียว · เปลี่ยนสิทธิ์ publish ฝั่ง server ได้ (โหมดนำเสนอ · Pass the Mic) |
| DB | **PostgreSQL + Prisma + pgvector** | ข้อมูลเชิง relation + vector สำหรับ RAG ในที่เดียว |
| Cache | **Redis** | MVP ยังไม่ใช้จริง แต่วาง interface ไว้ |
| Storage | **MinIO** (S3-compatible) | โปสเตอร์ · สไลด์ · โมเดล 3D · serve ด้วย signed URL |
| Auth | **OAuth (Google/Microsoft) + magic link · JWT** | บังคับ login ทุกคน ไม่มี guest · ⚠️ เช็คว่าบัญชี @kmutt.ac.th เป็น Microsoft หรือ Google |
| AI | **LLM API + pgvector** | AI ผู้ช่วยตอบเรื่องผลงาน (RAG) · AI สรุป feedback |
| 3D | **`<model-viewer>`** | ดูโมเดล `.glb` ในบูธ ไม่ต้องเขียน three.js เอง (Could) |
| Poster | PDF → รูปตอนอัปโหลด (server) | ซูม/ชี้ sync ผ่าน Colyseus |
| Infra | **Docker Compose + nginx** บน VM ของมหาวิทยาลัย | ฟรี · ย้ายขึ้น cloud ได้โดยไม่ต้องแก้โค้ด · nginx เพราะทีมมีประสบการณ์ |

**ขนาดงานเป้าหมาย**: 150 คนพร้อมกันต่อ 1 ฮอลล์ (ประมาณจาก D-Day 600+ คนทั้งวัน · 39 ผลงาน) · ยืนยันด้วย loadtest ใน S2

**Phaser 4**
- ⚠️ AI มักเขียน API ของ v3 (`setTintFill()` · `Geom.Point` · custom pipeline · Mesh) → ตรวจกับ docs v4 / migration guide ก่อน
- ตัวอย่างโค้ด v3 (เช่น SkyOffice) ใช้เป็นแนวทางได้แต่ต้องแปลง
- plugin ของ community (เช่น rexUI) ต้องเช็คว่ารองรับ v4 · UI ทำด้วย React
- ⚠️ ห้ามใช้ `Graphics.generateTexture()` — ถือ scene และ WebGL context ของทุก game ที่ถูก destroy ไว้ผ่าน `Graphics.TargetCamera` (memory leak) · ใช้ไฟล์รูปแทน
- Phaser ต้องโหลดฝั่ง client เท่านั้น (`next/dynamic` + `ssr: false`) · ตอน unmount ต้อง `game.destroy(true)`

**3D viewer (Could)**
1. รับ `.glb` / `.gltf` ≤20 MB · ตรวจ MIME/magic bytes ที่ server · เก็บ MinIO · ไฟล์ CAD/STL/OBJ ผู้นำเสนอแปลงเอง (Blender)
2. บีบอัดด้วย `gltf-transform` (Draco/Meshopt) ตอนอัปโหลดถ้าจำเป็น
3. `<model-viewer src camera-controls>` ในแผงบูธ · โหลด lazy ตอนเปิดแผง
4. Sync: ผู้นำเสนอฟัง `camera-change` → ส่ง `getCameraOrbit()` + `getCameraTarget()` + `getFieldOfView()` ผ่าน Colyseus (throttle ~10/วินาที · เฉพาะคนในบูธ) → ผู้ชมตั้ง `cameraOrbit` / `cameraTarget` · กด "ดูเอง" เพื่อหลุด sync
5. ถ้า model-viewer ไม่พอ (scene หลายวัตถุ · ชี้ตำแหน่งละเอียด) → three.js / React Three Fiber

## Architecture

```
Browser (Next.js + Phaser 4)
 ├─ TCP 443 ──→ nginx (TLS) ──┬──→ api        (NestJS   :3000)  งาน · ผลงาน · rubric · คะแนน · feedback · analytics · AI
 │                             ├──→ realtime   (Colyseus :2567)  1 room ต่อ 1 ฮอลล์ · ตำแหน่ง · สถานะบูธ · viewer sync
 │                             └──→ livekit    (signaling :7880)
 └─ UDP 50000-60000 ─────────────→ livekit    (media ตรง ไม่ผ่าน nginx)
    (fallback: TURN over TLS 443)

api      → postgres :5432 · redis :6379 · livekit :7880 (ออก token / เปลี่ยนสิทธิ์) · minio :9000 · LLM API
realtime → postgres :5432 · redis :6379 · api (ตรวจสิทธิ์ · เขียน analytics event)
```

⭐ **media เป็น UDP ผ่าน reverse proxy ไม่ได้ → browser ต้องต่อ LiveKit ตรง** ข้อนี้กำหนดการเลือก infra ทั้งหมด

**Media ในฮอลล์ (ออกแบบ)**
- 1 ฮอลล์ = 1 LiveKit room · ทุกคน publish ไมค์ได้ (ปกติ) · **client subscribe เฉพาะคนในรัศมี** (proximity + hysteresis)
- จอแชร์ + กล้องผู้นำเสนอ: publish ได้เฉพาะ PRESENTER (ตรวจตอนออก token) · subscribe เฉพาะคนในโซนบูธ · simulcast
- **โหมดนำเสนอในบูธ**: server ปิดสิทธิ์ publish ของผู้ชมในโซนบูธ · ทุกคนในโซน subscribe ผู้นำเสนอ · Pass the Mic = server เปิดสิทธิ์ publish ให้ผู้รับชั่วคราว
- สิทธิ์ทุกอย่างเปลี่ยนที่ **server** (LiveKit server API / token) ไม่ใช่แค่ปิดไมค์ฝั่ง client

**สิ่งที่ nginx ต้องตั้งเอง**
- **cert**: certbot + ต่ออายุอัตโนมัติ
- **WebSocket**: ใส่ header `Upgrade` / `Connection` ให้ realtime (Colyseus) และ livekit signaling ไม่งั้นต่อไม่ติด
- **TURN over TLS บน 443**: ใช้ `stream` module + `ssl_preread` แยกตามชื่อโดเมน ให้ HTTPS กับ TURN ใช้พอร์ต 443 ร่วมกัน — ⚠️ ถ้าย้าย TURN ไปพอร์ตอื่น คนบนเน็ตองค์กรที่เปิดแค่ 443 จะเข้าไม่ได้

## Deployment

- **พัฒนาบน localhost ได้เลย ไม่ต้องรอ VM** — ยกเว้นเรื่อง NAT/TURN ที่ localhost ผ่านเสมอ ต้องทดสอบจากเน็ตจริง
- **Exam 3 ต้องเดโมบน server จริง** → เช็ค VM ให้เร็วที่สุด
- **VM มหาลัย ต้องเช็คก่อน**: public IP · เปิด UDP 50000–60000 inbound · domain + TLS cert จริง · WebSocket upgrade ผ่าน proxy ของมหาลัยได้
  - ทดสอบเร็วสุด: รัน LiveKit บน VM แล้วเข้าจาก**มือถือ 4G** (ห้ามใช้ wifi มหาลัย) ได้ยินเสียง = ผ่านทุกข้อ
- **ถ้า VM ไม่ผ่าน**: แยก LiveKit ไป VPS สิงคโปร์ หรือใช้ LiveKit Cloud

## Spike

S1–S6 เป็น POC app เดียวใน `poc/demo-app/` ต่อยอดทีละ spike ตามลำดับ · S7 ทดสอบ infra แยก · ต้องได้รับอนุมัติก่อนไป spike ถัดไป · สถานะและผลอยู่ใน `poc/README.md`

ลำดับ: S1 ∥ S3 → S2 → S4 → S5 → S6 · S7 ทำได้ทันทีที่มี VM

| ด้าน | Spike | ใช้อะไร | คำถาม | ความสำคัญ |
|---|---|---|---|---|
| **2D** | **S1** Phaser 4 + Tiled | Phaser 4 + Tiled + Next.js (ไม่มี server) | โหลดแมป · เดินชนกำแพง · Phaser 4 ทำงานร่วมกับ Next ได้โดยไม่ leak | Exam 2 |
| | **S2** Movement sync | S1 + Colyseus | 150 client ต่อฮอลล์ลื่นไหม (loadtest) · tick rate เท่าไร | Exam 2 |
| **Media** | **S3** LiveKit hello | LiveKit + token API route (หน้าแยก `/s3`) | 2 client ได้ยินเสียง · เห็นกล้อง · เห็นจอแชร์ของกัน | Exam 2 |
| | **S4** Proximity media 🔴 | S2 + S3 · ตำแหน่งจาก Colyseus ตัดสินว่าจะ subscribe ใคร | เข้าใกล้ได้ยินเสียง · เข้าโซนบูธเห็นจอ/กล้องผู้นำเสนอ · ออกแล้วหาย · ทดสอบกับ**คนจริง 8–10 คน** · เปลี่ยนเร็วแค่ไหน · browser รับได้กี่ track | Exam 2 |
| | **S5** โหมดนำเสนอในบูธ 🔴 | S4 + LiveKit server API (เปลี่ยนสิทธิ์ publish) | ปิด/เปิดสิทธิ์ publish จาก server เร็วแค่ไหน · Pass the Mic ไม่ต้อง reconnect | core |
| **Viewer** | **S6** Poster / 3D viewer sync | S2 + PDF→รูป + `<model-viewer>` | sync ซูม/มุมกล้องผ่าน Colyseus ลื่นไหม · ไฟล์ใหญ่แค่ไหนยังโหลดทัน | ความเสี่ยงต่ำ |
| **Network** | **S7** NAT + TURN (แยกจาก POC app) | VM จริง + LiveKit + TURN over TLS 443 | เข้าได้จากบ้าน · wifi มหาลัย · 4G · เน็ตบริษัท · VPN | core (ก่อน Exam 3) |

ค่าตั้งต้น (ยืนยันจาก spike):
- tick rate **10–15 Hz**
- proximity **hysteresis**: subscribe ~8 ช่อง · unsubscribe ~12 ช่อง — ⚠️ ห้ามใช้ค่าเดียวกัน
- bitrate เสียง ~40 kbps/คน · วิดีโอ/จอ ~1.5 Mbps

---

## Reference

| Source | License | ใช้ยังไง |
|---|---|---|
| ⭐ **SkyOffice** `kevinshen56714/SkyOffice` | **MIT ✅** | Gather clone ด้วย Phaser 3 + Colyseus + React — **อ้างอิงหลัก** สำหรับ 2D + movement sync · ⚠️ **อย่าลอกชั้น media** (ใช้ PeerJS = mesh) · repo ปี 2021 dependency เก่า ให้ดูโครงสร้าง |
| `livekit/hq` | เช็คใน repo | virtual office ด้วย LiveKit + game server port 2567 (default ของ Colyseus) |
| `livekit-examples/spatial-audio` | เช็คใน repo | เดโม 2D + stereo audio ตามตำแหน่ง มี live demo |
| **LiveKit blog**: Using WebRTC + React + WebAudio to create spatial audio | — | ⭐ อธิบาย `PannerNode` และการ map แกน y ของ 2D ไปเป็น z — ตรงกับ proximity audio |
| **WorkAdventure** | ⚠️ **AGPL v3 + Commons Clause** | production-grade ที่ใกล้ที่สุด · **อ่านได้ ห้ามลอกโค้ด** — license ห้ามขายเป็น SaaS |
| LiveKit server | Apache 2.0 ✅ | ใช้เชิงพาณิชย์ได้ |
| [`<model-viewer>`](https://modelviewer.dev) · [releases](https://github.com/google/model-viewer/releases) (Google) | Apache 2.0 ✅ | ดูโมเดล 3D ในบูธ · event `camera-change` · `getCameraOrbit()` |
| [Colyseus 0.16 — StateView](https://colyseus.io/blog/colyseus-016-is-here/) · [Migrating to 0.17](https://docs.colyseus.io/migrating/0.17) | MIT ✅ | แยกข้อมูลที่ client เห็นตามฮอลล์/โซน |
| [Phaser 4 download](https://phaser.io/download/stable) · [Phaser 3 → 4 migration](https://phaser.io/news/2026/04/migrating-from-phaser-3-to-phaser-4-what-you-need-to-know) · [Phaser v3.90](https://phaser.io/news/2025/05/phaser-v390-released) | MIT ✅ | ⭐ ใช้ตรวจ API ของ v4 · โค้ดตัวอย่างของ v3 ต้องแปลงตาม migration guide |
| [`phaserjs/template-nextjs`](https://github.com/phaserjs/template-nextjs) | MIT ✅ | template ทางการ Phaser 4 + Next.js — จุดเริ่มของ S1 |
| `github.com/topics/virtual-office` | — | หลายตัวใช้ Phaser + Colyseus + LiveKit |

**ลำดับที่แนะนำ**: spatial-audio demo → บทความ Web Audio → livekit/hq → SkyOffice → WorkAdventure

⚠️ **ไม่มี repo ไหนทำชั้นงานนำเสนอเลย** (ผลงาน · rubric · คะแนน · feedback · analytics) — ทุกตัวหยุดที่ "โลก 2D ที่คุยกันได้" → ส่วนที่ยากลอกได้ ส่วนที่ทำให้โปรเจคมีคุณค่าต้องเขียนเอง
