# Handoff — Connecta (CP26SSI3)

> สรุปสิ่งที่อยู่แค่ใน session เดิม (poc-connecta) สำหรับ session ใหม่ · อ่านคู่กับ `connecta-capstone-deprecated.md` (context หลัก) และ `ExternalCommittee_connecta.md` (ผลสอบกรรมการ)
> สถานะ (13 ต.ค. 2026): ทีมกลับมาทำ Connecta · ไอเดียเว็บเจน ("หน้าร้าน") พักไว้ · ขั้นตอนย้าย repo และงานถัดไปอยู่ในส่วน 11

## ⭐ Direction ปัจจุบัน

- **โฟกัสงานนำเสนอแบบ poster/booth**: ผู้นำเสนอยืนประจำผลงาน ผู้ชมเดินชมและเข้าไปคุย · ทำส่วนนี้ให้ดีที่สุด (ไม่ใช่ event ทุกแบบ)
- **ผู้ใช้กลุ่มแรก (ทดสอบ)**: งานนำเสนอของนักศึกษา เช่น งานแสดงโปรเจคจบ (IT BANGMOD D-Day) · งานโปสเตอร์ในรายวิชา · ใกล้ตัว ทดสอบได้จริง
- **กลุ่มที่จะขยายไป**: poster session ของงานประชุมวิชาการแบบ hybrid (pain ชัดที่สุด มีผู้จ่ายชัด)
- **ตำแหน่ง**: รวม "ประสบการณ์เดินงาน" แบบ Gather + "เครื่องมือจัดงานนำเสนอ" แบบ Symposium ไว้ในที่เดียว
- **3D**: ใส่ในเนื้อหาของบูธ (Shared 3D viewer) ไม่ทำโลกเป็น 3D
- **Business model**: ปรับจาก Symposium · Free (งานในวิชา) · Per event · Annual (คณะ) · Enterprise · judging + analytics เป็นตัวแบ่ง tier (ส่วน 7.8)
- ⚠️ `connecta-capstone-deprecated.md` ยังเขียนแบบ event ทั่วไป ต้องปรับ pain point · target · use case · feature ให้ตรง direction นี้ (รายละเอียดในส่วน 7)
- **ชื่อแบรนด์: Connecta** (ยืนยัน 12 ต.ค.) · repo `cp26ssi3/connecta-virtual-showcase` (ส่วน 8)
- **ไม่ไปทาง marketplace** (ส่วน 9) · **Survey** พร้อมแจก (ส่วน 10)

---

## 1. วิธีทำงานที่ผู้ใช้ต้องการ

- ตอบและเขียนเอกสารเป็น**ภาษาไทย** · ใช้คำทับศัพท์อังกฤษ (Speaker, Booth, Session) แทนคำแปล
- **อย่าเดา ให้ research** และบอกแหล่งที่มา · ตอบตรงๆ ไม่อวย
- เอกสาร**กระชับ** อ่านได้ทั้งคนและ agent · ไม่อธิบายเกินจำเป็น
- **Pain → Solution ก่อน แล้วค่อยชูจุดแข็ง** · ห้ามเอาจุดแข็งไปเปลี่ยนตัวตนของ product
- **ไม่เขียนออกตัว/ลดค่าตัวเอง** (เช่น "ไม่ได้แข่งเรื่อง X เพราะเจ้าใหญ่ทำแล้ว") · ชูข้อดี แต่ไม่เคลมเกินจริง
- **ห้ามแก้นิยามหลักที่ผู้ใช้เขียนเอง** (แนวคิด · pain point · problem statement) · แก้ใหญ่ต้องให้ดูก่อน · ย่อเอกสารห้ามตัดของผู้ใช้ทิ้งเงียบๆ ต้องบอกว่าตัดอะไร
- เนื้อหา proposal **ส่งในแชท** ไม่แก้ไฟล์ เว้นแต่สั่ง · ถ้าจะแปะลง Word: ห้าม code block · ห้าม `<br>` · ตารางไม่เกิน 4 คอลัมน์
- โปรเจคนักศึกษา **ไม่ต้องชนะคู่แข่ง** แต่ต้องบอกได้ว่าต่างยังไง · เรียนรู้ pattern จากเจ้าใหญ่ได้

## 2. เกณฑ์ของวิชา (INT365/371)

| Exam | กำหนด (ต้องยืนยันกับอาจารย์) | สิ่งที่ประเมิน |
|---|---|---|
| Exam 2 Pre-Game | 19–20 ต.ค. | **POC 12** · **Architecture 10** · Revised IT Solution 6 (เน้นส่วนที่เปลี่ยน) · Roadmap 2 |
| Exam 3 Release 1 | 30 พ.ย.–1 ธ.ค. | เดโม core feature **บน server จริง ไม่ใช่ localhost** · test case ปกติ + กรณีผิดพลาด · ความเข้าใจระบบ · หลักฐานการใช้ AI ช่วยพัฒนา |

**แนวที่อาจารย์เน้น**: Pain → Challenge → Solution → Outcome · วัดผลที่ **Outcome** (ผู้ใช้ได้ผลจริง) ไม่ใช่ Output (มีระบบ) · Challenge ต้องเป็นพฤติกรรม/ข้อจำกัดของผู้ใช้ ไม่ใช่ "ยังไม่มีระบบ" (ตัวอย่างอาจารย์: ทำระบบรีวิวไม่ยาก แต่ทำให้คนเขียนรีวิวยาก)

## 3. บทเรียนจากการสอบกรรมการภายนอก (26 ก.ย.)

- Connecta ถูกเลือกจาก passion ก่อน pain · กรรมการถามซ้ำ: **value คืออะไร · ใครใช้/ใครจ่าย · ทำไมไม่ใช้ Zoom / MS365 / Google Workspace / Gather**
- ตอบ "ใครก็จัดได้" → โดนว่ากว้างเกิน · ตอบโมเดลธุรกิจกำกวม (ฟังเหมือนทีมรัน operation ให้ ทั้งที่ proposal เป็น self-service)
- **ข้อเสนอของกรรมการที่ยังไม่ได้ทำ**
  - ชู **analytics หลังงาน** เป็นจุดขาย (กรรมการมองว่าเป็นของมีค่าที่สุด)
  - **consent สองฝั่ง**: ผู้เข้าร่วมเลือกได้ว่าจะให้ใครเข้ามาคุย · PDPA ของข้อมูลโปรไฟล์
  - คุยกลุ่มส่วนตัวแบบเลือกคน (เช่น โต๊ะ 4 คน)
  - ทำ **mock-up** · ไปคุยกับผู้จัดจริง (คณะ) ให้จัดลำดับฟีเจอร์
  - **โฟกัสงานนำเสนอผลงาน** (ทีมเสนอเอง กรรมการเห็นด้วย)
  - แยก core / cut feature ให้ชัด
- ทุกทีมในห้องโดนคำถามเดียวกัน: ใครใช้ · ใช้ทำอะไร · ปลายทางหน้าตาเป็นยังไง

## 4. หลักฐานจาก research

| หลักฐาน | ตัวเลข | แหล่ง |
|---|---|---|
| NeurIPS 2020 ใช้ Gather จัด poster session | 18,000+ คน · โปสเตอร์ ~2,000 · 75% ชอบ 8% ไม่ชอบ · ⚠️ ใช้ Zoom คู่เมื่อคนรอบโปสเตอร์เกิน 4–5 คน · คนพร้อมกันจริงไม่เกิน 2,000 | [NeurIPS Blog](https://blog.neurips.cc/2021/02/12/neurips-2020-online-experiments-gather-town-poster-sessions-and-mementor/) |
| ICML/ICLR poster ใน Zoom | ผู้นำเสนอนั่งคนเดียว 2 ชม. เพราะคนไม่กล้ากดเข้าห้อง | NeurIPS Blog (ลิงก์เดียวกัน) |
| Virtual career fair (NACE) | ค่ามัธยฐานผู้เข้าร่วมลด 295 → 93 · on-site เพิ่ม 419 → 700 · มหาลัย 93.9% จัด on-site | [NACE](https://www.naceweb.org/career-development/trends-and-predictions/employers-students-favor-in-person-career-fairs) |
| การคุยตามทางเดิน/เจอกันโดยบังเอิญ | งานวิจัยสรุปว่าใช้ไม่ได้ผลเมื่อย้ายมาออนไลน์ | [arXiv](https://arxiv.org/pdf/2212.11619) |
| networking ในงาน event | 61% มางานเพื่อ networking · 68.8% ของนักการตลาดต้องการตัวช่วย networking ออนไลน์ · 67.7% รักษาความสนใจออนไลน์ยาก · ⚠️ เป็นบริษัทขายแพลตฟอร์ม อาจเอนเอียง | [Markletic](https://markletic.com/blog/virtual-event-statistics/) |
| One Stop Open House 2026 (อว.) | ผู้เข้าร่วมออนไซต์ + ออนไลน์ 200,000+ คน | [Nation Thailand](https://www.nationthailand.com/news/general/40063393) |

## 5. การตัดสินใจทางเทคนิคล่าสุด

- **nginx** แทน Caddy (ทีมมีประสบการณ์) · ต้องตั้งเอง: certbot · header WebSocket (`Upgrade`/`Connection`) · TURN over TLS บน 443 ด้วย `stream` + `ssl_preread` (ถ้าย้าย TURN ไปพอร์ตอื่น เน็ตองค์กรที่เปิดแค่ 443 จะเข้าไม่ได้)
- spike ในเอกสารเปลี่ยนเลขเป็น **S1–S6** (S1 Phaser+Tiled · S2 Movement sync · S3 LiveKit hello · S4 Proximity audio · S5 Speaker streaming · S6 NAT+TURN) · โค้ดใน git ยังใช้ชื่อเดิม `a0-livekit-audio`, `a1-movement-sync`, `b1-phaser-tilemap` (ถูกลบจาก working tree แต่ยังอยู่ใน git history ของ poc-connecta)

## 6. บริบทอื่น

- **ทีม**: CP26SSI3 · อ.สนิท ศิริสวัสดิ์วัฒนา · สมาชิก: กิตติกัญ วิวเมฆ · ณัฐชนน เจริญเสริมสิริ · สุชัย ชลชัยไพศาล · ตอนสอบแบ่งบทบาท UX/UI · front end · back end
- **หัวข้อในรุ่นที่ทับกับ Connecta**: KMUTT Event Discovery and Management System · ระบบจัดการเข้าชมและประเมินโครงงานปี 4 · แพลตฟอร์มนำเสนอแบบมีปฏิสัมพันธ์สำหรับห้องเรียน มจธ.
- ในรุ่นมีอีก 2 ทีมที่เปลี่ยนหัวข้อ ("เปลี่ยนมือ" และ "PromtRian")
- **ไอเดียเว็บเจน ("หน้าร้าน")** พักไว้ที่ `poc-connecta/docs/capstone-webgen-draft.md` · ถ้ากลับมาใช้: ในรุ่นมีทีมทำ "ระบบบริหารจัดการหน้าร้านสำหรับธุรกิจร้านอาหารขนาดย่อม" ชื่อและกลุ่มเป้าหมายทับกัน

## 7. Research: งานนำเสนอแบบ poster/booth (12 ต.ค.)

### 7.1 ทำไมเลือกงานแบบนี้

| งาน | หลักฐาน | สรุป |
|---|---|---|
| Poster session งานประชุมวิชาการ (hybrid) | ปี 2025 คนออนไลน์ได้แค่แกลเลอรี e-poster ([Optica](https://www.optica.org/events/speakers/poster_guidelines/), [ACG](https://acgmeetings.gi.org/wp-content/uploads/2025/04/25ACG-Conference-Preview-web.pdf)) · CHI ใช้วิดีโออัดล่วงหน้า + QR ([CHI 2025](https://chi2025.acm.org/for-attendees/hybrid-experience/)) · ARM/ASR ไม่มี poster session ออนไลน์ ([ASR](https://asr.science.energy.gov/news/program-news/post/18542)) · MPSA ให้เฉพาะคนออนไซต์ ([MPSA](https://www.mpsanet.org/conference/presenter-resources/instructions-for-virtual-attendees/)) | ⭐ pain ชัดที่สุด ยังไม่มีใครแก้ |
| งานแสดงโปรเจคจบ | IT BANGMOD D-Day 2026: ที่ LX · 600+ คน · 39 ผลงาน · มี Popular Vote ([SIT](https://www.sit.kmutt.ac.th/it-d-day-2026/)) | ✅ ใช้ทดสอบ · รูปแบบเดียวกับ poster session |
| Hackathon expo | Devpost ให้คะแนนแบบถ่วงน้ำหนักไม่ได้ ต้องใช้ spreadsheet ([Devpost](https://help.devpost.team/article/63-judging-on-devpost-for-teams)) | 🟡 จัดไม่บ่อย |
| Science fair | ผู้ปกครองและนักเรียนบ่นเรื่อง feedback จากกรรมการน้อยที่สุด ([NSTA](https://www.nsta.org/science-scope/science-scope-januaryfebruary-2022/planning-virtual-science-fairs)) | 🟡 target เป็นนักเรียน |
| Degree show สายออกแบบ | ส่วนใหญ่เป็นเว็บแกลเลอรี ไม่ต้องคุยสด ([Aesthetica](https://aestheticamagazine.com/top-10-virtual-degree-shows/)) | ❌ |
| Showcase ในบริษัท · Trade show · Job fair | หลักฐาน pain น้อย / vFairs, Airmeet, Remo ครองตลาด / NACE คนลด 295 → 93 | ❌ |

### 7.2 Pain

| ฝั่ง | Pain | หลักฐาน |
|---|---|---|
| ผู้นำเสนอ | ใน Zoom นั่งรอคนเดียวหลายชั่วโมง ไม่เห็นผู้นำเสนอคนอื่น | [NeurIPS](https://neuripsconf.medium.com/neurips-2020-online-experiments-gather-town-poster-sessions-and-mementor-ac1573d61c8a), [ASM](https://journals.asm.org/doi/10.1128/jmbe.00237-21) |
| | ได้ feedback น้อย งานจบก็จบ · ออนไลน์มีแค่ PDF + Q&A ไม่สด | [NCBI](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11906109/), NSTA |
| | บูธมุมลับมีคนแวะน้อย | [Springer](https://link.springer.com/article/10.1007/s44217-025-00462-1) |
| ผู้ชม | ไม่กล้ากดเข้าห้อง Zoom ของคนแปลกหน้า | NeurIPS |
| | ผลงานเยอะ ไม่รู้จะดูอะไร · ดูแล้วจำได้น้อย | Springer |
| | มาออนไซต์ไม่ได้ = ได้แค่แกลเลอรี/วิดีโอ คุยสดไม่ได้ | Optica, CHI, MPSA |
| ผู้จัด/กรรมการ | ให้คะแนนยาก เดินตามบูธแล้วกรอก spreadsheet แยก | Devpost, NSTA |
| | ไม่รู้ว่างานได้ผลไหม ไม่มีข้อมูลการแวะบูธ | กรรมการสอบชี้ว่า analytics มีค่าที่สุด |
| | Gather คุมคนเข้ายาก หลุดบ่อย อัปโหลดโปสเตอร์ลำบาก | [arXiv](https://arxiv.org/pdf/2012.01191) |

### 7.3 รูปแบบปัจจุบันและสิ่งที่ยังแก้ไม่ได้

| รูปแบบ | ทำได้ดี | ยังแก้ไม่ได้ |
|---|---|---|
| แกลเลอรี e-poster + comment (Optica, ACG, Symposium) | ดูเมื่อไหร่ก็ได้ | ไม่มีคุยสด ไม่มีบรรยากาศงาน |
| Zoom 1 ห้องต่อ 1 โปสเตอร์ (ICML, ICLR) | เสถียร คนคุ้นเคย | ผู้นำเสนอนั่งรอคนเดียว · ผู้ชมไม่กล้าเข้า · ไม่เห็นว่าบูธไหนมีคน |
| Gather (NeurIPS) | รู้สึกเหมือนเดินงานจริง | หลุดบ่อย · เกิน 4–5 คนต้องย้ายไป Zoom · ไม่มี rubric/โหวต/analytics · ผู้จัดสร้างแผนที่เอง |
| Symposium by ForagerOne | ครบด้านเครื่องมือจัดงาน | ไลฟ์เป็นห้องวิดีโอ ≤8 คน/โต๊ะ · ไม่มีการเดินชมหรือเจอกันโดยบังเอิญ |

**ช่องว่าง**: เดินชม + คุยสด (แบบ Gather) และเครื่องมือของงานนำเสนอ (แบบ Symposium) ในที่เดียว

### 7.4 Solution

| Pain | Solution |
|---|---|
| ผู้นำเสนอนั่งรอคนเดียว · ผู้ชมไม่กล้าเข้า | เดินเข้าใกล้บูธแล้วได้ยินเลย ไม่ต้องกดเข้าห้อง · เห็นจากด้านนอกว่ามีคนคุยอยู่ |
| บูธคนเกิน 4–5 คนคุยไม่รู้เรื่อง | โหมดนำเสนอในบูธ: ผู้นำเสนอพูดให้ทั้งบูธ ผู้ชมปิดเสียงอัตโนมัติ ยกมือ + Pass the Mic · คิวเมื่อบูธเต็ม |
| ผลงานเยอะ ไม่รู้จะดูอะไร | ค้นหา/กรองตามหมวด แล้วไปบูธได้ทันที · minimap แสดงบูธที่กำลังนำเสนอ · ตารางนำเสนอ + ป้าย "กำลังนำเสนอ" |
| บูธมุมลับไม่มีคนแวะ | สร้างฮอลล์อัตโนมัติจาก CSV + template ผัง · แนะนำบูธที่มีคนแวะน้อย |
| ให้คะแนนยาก | กรรมการให้คะแนนตาม rubric ในบูธ มีน้ำหนักเกณฑ์ รวมผลอัตโนมัติ |
| feedback น้อย | ผู้ชมฝาก feedback + Popular Vote · ผู้นำเสนอได้สรุปหลังงาน |
| ไม่รู้ว่างานได้ผลไหม | analytics: คนแวะ · เวลาในบูธ · คะแนน · feedback |
| มางานไม่ได้ / งานจบแล้วหายไป | ออนไลน์ทั้งหมดหรือเป็นส่วน hybrid · บูธเปิดเป็นแกลเลอรีต่อหลังงาน |

**Core ที่ต้องทำให้ดีที่สุดก่อน**: เดินชม + คุยในบูธ · โหมดนำเสนอ · rubric + feedback · analytics หลังงาน

### 7.5 ข้อจำกัดของ 2D แบบปัจจุบัน (Gather) และวิธีทำให้ดีกว่า

| ข้อจำกัด | หลักฐาน | เราทำให้ดีกว่ายังไง |
|---|---|---|
| บูธคนเยอะคุยไม่รู้เรื่อง ต้องย้ายไป Zoom | NeurIPS | โหมดนำเสนอในบูธ + Pass the Mic + คิว |
| โปสเตอร์อ่านยาก ต้องเปิดแยก · NeurIPS ต้องอัปโหลดใหม่ ~10% | [NeurIPS Blog](https://blog.neurips.cc/2021/02/12/neurips-2020-online-experiments-gather-town-poster-sessions-and-mementor/) | Poster viewer sync กับผู้นำเสนอ (ซูม/ชี้ตาม) · ตรวจไฟล์ + preview ตอนอัปโหลด |
| เข้าไม่ได้หรือหลุด ทั้งที่ยังไม่เต็ม | arXiv, NeurIPS | แบ่งห้องตามโซน · reconnect อัตโนมัติ · load test (มี loadtest จาก S2) |
| ไม่มีโครงสร้าง · บางงานคนเข้าน้อยเพราะรู้สึกเหมือนเกม | NeurIPS Blog, [SNE ChemBio](https://sne-chembio.ch/blog/gather-town-virtual-poster-session-lessons-learned/) | ตารางนำเสนอ + ป้าย "กำลังนำเสนอ" · art style แบบงานวิชาการ |
| หาบูธที่อยากดูไม่เจอ | ไม่มีค้นหาในตัว | ค้นหา/กรอง + ไปบูธทันที · minimap |
| ผู้จัดเตรียมงานยาก ต้องวาดแผนที่เอง | SNE ChemBio | สร้างฮอลล์อัตโนมัติจาก CSV + template |
| คนใหม่ใช้ยาก ต้องทำ tutorial · แนะนำ Chrome · ไม่แนะนำมือถือ | [UMich](https://internship.its.umich.edu/node/265) | คลิกเพื่อเดิน · มือถือใช้โหมดรายการบูธ |
| ไม่มีเครื่องมือของงานนำเสนอ | — | rubric · โหวต · feedback · analytics |
| งานจบแล้วหายไป | NCBI | บูธเปิดเป็นแกลเลอรีต่อหลังงาน |

### 7.6 3D

- **ใส่ในบูธ: Shared 3D viewer** ผู้นำเสนอเปิดโมเดล 3D ของผลงาน (prototype, หุ่นยนต์, งานออกแบบ) หมุน/ซูมแล้วจอผู้ชมในบูธขยับตาม เหมือนถือชิ้นงานจริงให้ดู · แก้ pain "ออนไลน์ดูชิ้นงานจริงไม่ได้" · Symposium อัปโหลด 3D ได้แต่ดูคนเดียว (เท่าที่หาเจอยังไม่มีแบบดูพร้อมผู้นำเสนอ) · ทำด้วย Three.js หรือ `<model-viewer>` sync มุมกล้องผ่านช่องทางเดียวกับการเดิน
- **ไม่ทำโลกเป็น 3D**: ทีมมี Phaser 2D + movement sync + proximity audio แล้ว เปลี่ยนต้อง spike ใหม่ก่อน Exam 2 · เครื่องสเปกต่ำ/มือถือช้า · ผู้จัดสร้างแผนที่ยากขึ้น · หลักฐานข้อดีน้อย ([IEEE VR 2025](http://ieeevr.org/2025/program/posters/): รู้สึกอยู่ในงานมากขึ้น แต่ภาระใช้งานไม่ต่าง · poster ชิ้นเดียว)
- ถ้าอยากให้ดูมีมิติ ใช้ isometric (2.5D) ใน Phaser ได้

### 7.7 คู่แข่ง: Symposium by ForagerOne

- เว็บจัดงานนำเสนอผลงานวิจัยของมหาลัย · ForagerOne เริ่มที่ Johns Hopkins ปี 2017 (จับคู่นักศึกษากับงานวิจัย) แล้วต่อยอดเป็น Symposium
- ทำได้: หน้างาน · แกลเลอรี (โปสเตอร์ สไลด์ 3D) · comment · ไลฟ์เป็นห้องวิดีโอ ≤8 คน/โต๊ะ ([ForagerOne](https://support.foragerone.com/support/solutions/articles/69000723282-creating-and-coordinating-live-sessions))
- ลูกค้า: KU, Northwestern ฯลฯ ([KU](https://symposium.foragerone.com/kufurs))
- ราคาสถาบันการศึกษา: $2,499/ปี (3 งาน) · $3,999/ปี (5 งาน) · Enterprise ตกลงเอง ([Pricing](https://symposium.foragerone.com/pricing/education))

| | Symposium | Connecta |
|---|---|---|
| รูปแบบ | เว็บแกลเลอรี กดเข้าทีละผลงาน | โลก 2D เดินชมทั้งงาน |
| การคุยสด | กดเข้าห้องวิดีโอ | เดินเข้าใกล้บูธแล้วคุยได้เลย |
| บรรยากาศงาน | ไม่มี | เห็นคนเดิน เห็นบูธที่มีคนคุย |
| เครื่องมือจัดงาน | ครบ | ต้องทำเพิ่ม (rubric, feedback, analytics) |

- Symposium = คู่แข่งด้านเครื่องมือจัดงาน · Gather = คู่แข่งด้านประสบการณ์เดินงาน
- **ใช้ตอบ business model ได้**: มหาลัยจ่ายรายปีจริงสำหรับเครื่องมือแบบนี้ → รายละเอียดที่นำมาปรับใช้ใน 7.8

### 7.8 เรียนจาก Symposium: ฟีเจอร์และ business model ที่นำมาปรับใช้

**ฟีเจอร์ของ Symposium** (จาก [knowledge base](https://support.foragerone.com/support/solutions/69000406537))

| ส่วน | สิ่งที่มี |
|---|---|
| ตั้งค่างาน | หน้า welcome (วิดีโอ/ข้อความ) · access setting (public / private เฉพาะอีเมลที่อนุญาต) · ปรับธีมสี · duplicate งานเก่ามาใช้ซ้ำ · co-organizer |
| รับผลงาน | ฟอร์มส่งผลงานปรับแต่งได้ · ผู้จัดแก้ผลงานได้ · สร้าง Abstract Booklet อัตโนมัติ · สร้าง filter ตามหมวด |
| Abstract Management | คัดเลือกผลงานก่อนงาน: หา reviewer → มอบหมายผลงาน → ฟอร์มประเมิน → ติดตามผล · หลายรอบ (stage) |
| Judging | หา judge → มอบหมายผลงาน → ฟอร์มประเมิน → ติดตามผล → **ส่ง feedback ของกรรมการให้ผู้นำเสนอทางอีเมล** · ผู้จัดแก้/กลั่นกรอง feedback ได้ ([Judging](https://support.foragerone.com/support/solutions/articles/69000727134-setting-up-judging-in-your-event)) |
| ผู้ชม | ค้นหาตาม keyword/ผู้เขียน + filter · **ลำดับผลงานสุ่มต่อคน ทุกผลงานได้ visibility เท่ากัน** · preview โดยไม่ออกจากหน้า · comment + แจ้งเตือนอีเมลเมื่อมีคนตอบ ([Attendee](https://support.foragerone.com/support/solutions/articles/69000721875-the-attendee-experience)) |
| Live Sessions | ตาราง session + ลิงก์ Zoom/WebEx/Meet · Meetings / Webinars / Live Streams · โต๊ะเสมือน 2–8 คน สลับโต๊ะได้ |
| อื่นๆ | ระบบรับบริจาค (Donations) · Event Analytics (ข้อมูลผู้นำเสนอ ผู้เข้าร่วม และ interaction) · export ข้อมูลผลงาน · เก็บงานไว้ดูหลังจบ |

**Business model ของ Symposium** ([Pricing](https://symposium.foragerone.com/pricing/education))

| แพ็กเกจ | ราคา | จำนวนงาน | คนต่องานฟรี | Judging / Abstract |
|---|---|---|---|---|
| Single Lite / Single Plus | ต่องาน (ไม่เปิดเผยราคา) | 1 | — | ❌ |
| Single Premium | ต่องาน (ไม่เปิดเผยราคา) | 1 | — | ✅ |
| Lite Subscription | $2,499/ปี | 3 | 500 | ❌ |
| Plus Subscription | $3,999/ปี | 5 | 2,000 | ✅ |
| Enterprise | ตกลงเอง | ไม่จำกัด | 2,000 | ✅ + SSO + admin ระดับมหาลัย |

- งานที่เก็บค่าเข้า: +$3.99/ผู้ลงทะเบียน + ค่าธรรมเนียม ~3%
- **หลักคิด**: ฟีเจอร์ประเมินผล (judging) เป็นตัวแบ่ง tier · ขายรายปีให้หน่วยงาน · คิดเงินตามจำนวนงานและขนาดงาน · คณะซื้อเองได้ ไม่ต้องรอมหาลัย

**นำมาปรับใช้กับเรา**

| เรื่อง | Symposium | Connecta (ปรับใช้) |
|---|---|---|
| รับผลงาน | ฟอร์มส่งผลงาน + filter | ฟอร์มส่งผลงาน → **สร้างบูธในฮอลล์อัตโนมัติ** ตามหมวด |
| Visibility | สุ่มลำดับต่อคน | **สุ่ม/หมุนตำแหน่งบูธหรือลำดับในรายการ** + แนะนำบูธที่มีคนแวะน้อย |
| Judging | ฟอร์มประเมินแยก ทำผ่านเว็บ | **มอบหมายกรรมการ → กรรมการเดินไปบูธ ให้คะแนนตาม rubric ในบูธ** (เห็นและคุยกับผู้นำเสนอสด) · ส่ง feedback ให้ผู้นำเสนอหลังงาน · ผู้จัดกลั่นกรองได้ |
| Comment | comment ใต้ผลงาน | comment/feedback ในบูธ + Popular Vote · ใช้ได้ทั้งตอนงานสดและหลังงาน |
| Live | ลิงก์ Zoom/Meet + โต๊ะ 2–8 คน | **ในตัว ไม่ต้องออกไปแอปอื่น**: proximity voice + โหมดนำเสนอในบูธ + Pass the Mic · โต๊ะคุยกลุ่มเล็กในแผนที่ |
| Analytics | interaction ระดับงาน | **ข้อมูลเชิงพื้นที่**: คนแวะบูธ · เวลาในบูธ · heatmap ฮอลล์ · บูธที่คนเดินผ่านแต่ไม่แวะ |
| ใช้ซ้ำ | duplicate งานเก่า | duplicate งาน + template ฮอลล์ |
| Access | public / private ตามอีเมล | public / private ตามอีเมล (เช่น เฉพาะ @kmutt.ac.th) |
| หลังงาน | เก็บไว้ดูได้ | บูธเปิดเป็นแกลเลอรีต่อ + Abstract Booklet / สรุปผลงาน |
| ไม่เอา (ตอนนี้) | Donations · Abstract Management หลายรอบ | ไว้ Nice to have |

**Business model ที่เสนอ (ปรับจาก Symposium)**

| แพ็กเกจ | สำหรับ | สิ่งที่ได้ |
|---|---|---|
| **Free** | งานในรายวิชา / งานเล็ก (ให้นักศึกษาและอาจารย์ลองใช้) | 1 งาน · คนจำกัด · เดินชม + คุยในบูธ + comment |
| **Per event** | งานเดี่ยว เช่น งานโปรเจคจบ hackathon | 1 งาน · + rubric/judging · feedback ถึงผู้นำเสนอ · analytics |
| **Annual (คณะ)** | คณะที่จัดหลายงานต่อปี | หลายงาน · ทุกฟีเจอร์ · duplicate/template |
| **Enterprise (มหาลัย / งานประชุมวิชาการ)** | ทั้งมหาลัย หรือผู้จัดงานประชุม | ไม่จำกัดงาน · SSO · admin กลาง · คนเยอะ |

- เหมือน Symposium: **judging + analytics เป็นตัวแบ่ง tier** (เป็นสิ่งที่ผู้จัดยอมจ่าย และกรรมการสอบมองว่ามีค่าที่สุด)
- ต่างจาก Symposium: **มี Free tier** ให้ใช้กับงานในรายวิชา → เป็นช่องทางให้อาจารย์และนักศึกษาได้ลองก่อนคณะซื้อ (Symposium ไม่มี free tier เท่าที่หาเจอ)
- รายได้เสริมที่เป็นไปได้ (ยังเป็นไอเดีย ต้องถามก่อน): บริษัทเปิดบูธรับสมัครงานในงานโปรเจคจบ
- ราคาเป็นเงินบาทยังไม่กำหนด ต้องคุยกับผู้จัดจริง (คณะ) ก่อน

### 7.9 ความเสี่ยงที่ต้องตอบ

- **ทำไมต้องออนไลน์**: D-Day จัดออนไซต์ไปได้ดี · ยังหาไม่เจอว่ามหาลัยไทยจัดงานโปรเจคออนไลน์ · คำตอบที่เป็นไปได้: คนมาไม่ได้ (ผู้ปกครอง ศิษย์เก่า บริษัท ต่างวิทยาเขต) แบบ hybrid · งานในรายวิชาที่จัดบ่อยแต่ไม่คุ้มจองสถานที่ → **ต้องคุยกับผู้จัด D-Day และอาจารย์ที่ให้นำเสนอโปสเตอร์ในวิชา**
- **ทับกับทีมอื่นในรุ่น**: "ระบบจัดการเข้าชมและประเมินโครงงานปี 4" · "แพลตฟอร์มนำเสนอแบบมีปฏิสัมพันธ์สำหรับห้องเรียน มจธ." → จุดต่างคือ งานออนไลน์ที่เดินชมและคุยสดได้

## 8. ชื่อแบรนด์และ repo

- **ใช้ Connecta ต่อ** (ยืนยัน 12 ต.ค.): ทีมชอบ ฟังเท่ · อาจารย์/กรรมการรู้จักแล้ว เล่าได้ว่า "Connecta ปรับโฟกัสมาที่งานนำเสนอ"
- tagline ที่เสนอ: **"Connecta — Connect with every project"**
- ข้อควรรู้: มี Connecta Negocios (event B2B, [Capterra](https://www.capterra.com/p/267031/Connecta-Negocios/)) และแอป Connecto: Event Networking ([App Store](https://apps.apple.com/ag/app/connecto-event-networking/id6743438733)) ชื่อใกล้กัน
- ชื่อที่เคยพิจารณา: DemoDay (ทีมชอบความน่ารัก แต่เป็นคำทั่วไป) · ShowNTell · PeekaBooth · Hallo · Quad · Hallway · Wanderfair · ExpoTown · ชื่อที่ชนแล้ว: ShowFloor · PixelExpo · Projecta
- **GitHub**: org `cp26ssi3` (เช็ค 12 ต.ค. ยังว่าง) · repo `connecta-virtual-showcase` · **Private** · description: "Connecta — Virtual showcase platform where visitors walk between booths and talk live with presenters. KMUTT Capstone CP26SSI3"

## 9. ไม่ไปทาง marketplace / งานแฟร์ขายของ

- ผู้ออกบูธในงานแสดงสินค้าออนไลน์ได้ lead น้อยและคุณภาพต่ำ ([Wikipedia](https://en.wikipedia.org/wiki/Virtual_tradeshow), [Cvent](https://www.cvent.com/en/blog/events/trade-show-statistics)) · ไทยเคยทำ Online Virtual Exhibition ช่วงโควิดแต่ไม่มีรายงานผล ([ประชาชาติ](https://www.prachachat.net/economy/news-455433)) · คนซื้อของใช้ Shopee/Lazada/TikTok Shop อยู่แล้ว · ตลาด virtual expo มี vFairs, Airmeet, Remo
- งานนำเสนอ: หัวใจคือการคุยสด (ตรงจุดแข็ง) และมีคนจ่ายจริง (Symposium)
- commercial ได้โดยไม่เปลี่ยนทิศ: ขายรายปี/ต่องานให้คณะ มหาลัย ผู้จัดงานประชุม · ไอเดีย: บริษัทเปิดบูธรับสมัครงานในงานโปรเจคจบ (ต้องถามก่อน)

## 10. Survey (แจกใน Facebook)

**หลัก**: 10 ข้อ ≤3 นาที · ถามจากสิ่งที่เคยเจอจริง · ไม่บอกว่าทำแอปอะไรจนข้อสุดท้าย · คำถามละเอียด (การให้คะแนน ความถี่ งบ) เก็บไว้สัมภาษณ์ผู้จัด/อาจารย์

**ส่วนที่ 0**: แนะนำว่าเป็นโครงงานนักศึกษา IT มจธ. เรื่องประสบการณ์งานนำเสนอผลงาน · ~3 นาที · ไม่เก็บข้อมูลระบุตัวตน ยกเว้นสมัครใจให้ช่องทางติดต่อ · ☐ ยินยอมให้ใช้ข้อมูลเพื่อการศึกษา (บังคับ)

**ส่วนที่ 1: เกี่ยวกับคุณ**
1. สถานะ: นักเรียน · ป.ตรี · ป.โท/เอก · อาจารย์/นักวิจัย · คนทำงาน
2. เคยเข้าร่วมงานนำเสนอผลงานแบบไหน (หลายข้อ): โปรเจคจบ · โปสเตอร์ในวิชา · งานประชุมวิชาการ · hackathon/pitching · ไม่เคย
3. บทบาท (หลายข้อ): ผู้นำเสนอ · ผู้เข้าชม · ผู้จัด/อาจารย์/กรรมการ

**ส่วนที่ 2: ปัญหาที่เคยเจอ**
4. ในงานนำเสนอผลงาน คุณเคยเจอเรื่องไหนบ้าง (หลายข้อ)
   - ตอนนำเสนอ มีช่วงที่ต้องรอโดยไม่มีใครมาคุย
   - ได้ feedback ที่เอาไปใช้ได้จริงน้อย
   - ผลงานเยอะ ไม่รู้จะดูอะไร
   - ไม่กล้าเข้าไปถามผู้นำเสนอ
   - งานออนไลน์ได้แค่ดูไฟล์/วิดีโอ ไม่ได้คุยกับผู้นำเสนอ
   - ไม่กล้ากดเข้าห้อง Zoom ของผลงานที่ไม่รู้จัก
   - อยากไปแต่ไปไม่ได้ และไม่มีช่องทางออนไลน์
   - (ผู้จัด/กรรมการ) รวมคะแนนและส่ง feedback ยุ่งยาก
   - (ผู้จัด) ไม่รู้ว่าผลงานไหนมีคนสนใจแค่ไหน
   - ไม่เคยเจอปัญหาเหล่านี้
5. จากข้อที่เลือก เรื่องไหนหนักที่สุด (1 ข้อ)
6. ปลายเปิด (ไม่บังคับ): เล่าเหตุการณ์ที่เจอปัญหานั้นสั้นๆ

**ส่วนที่ 3: ถ้ามีงานนำเสนอแบบออนไลน์** (แนบภาพ/GIF โลก 2D)
7. ถ้าต้องเข้าร่วมแบบออนไลน์ อยากได้แบบไหน: ดูไฟล์/วิดีโอเมื่อไหร่ก็ได้ · ห้องวิดีโอคอลแยกต่อผลงาน · พื้นที่เสมือนที่เดินไปตามบูธแล้วคุยได้เลย (แบบในภาพ) · ไม่อยากเข้าร่วมแบบออนไลน์
8. ถ้ามีพื้นที่เสมือนแบบในภาพ อยากใช้กับงานแบบไหน (หลายข้อ): โปรเจคจบ · โปสเตอร์ในวิชา · งานประชุมวิชาการ · hackathon/demo day · open house มหาลัย · job fair · สัมมนา/meetup · อื่นๆ
9. อยากได้อะไรมากที่สุด (ไม่เกิน 3): คุยสดกับผู้นำเสนอ · ค้นหาผลงานง่าย · feedback/คะแนนจากกรรมการ · โหวตผลงาน · ดูย้อนหลังได้ · ดูโมเดล 3D ของผลงานพร้อมผู้นำเสนอ · สถิติคนดูผลงาน · ใช้บนมือถือได้

**ส่วนที่ 4**
10. ข้อความ: "ขอบคุณที่ตอบครับ 🙏 ทีมเราเป็นนักศึกษา IT มจธ. กำลังทำ Connecta แพลตฟอร์มงานนำเสนอผลงานออนไลน์ ที่ผู้ชมเดินไปตามบูธในโลก 2D แล้วคุยกับผู้นำเสนอได้ทันที (โครงงานจบ)" · อยากช่วยหรือติดตามโปรเจคนี้ไหม (หลายข้อ ไม่บังคับ): ยินดีให้สัมภาษณ์ ~15 นาที · อยากลองใช้ตอนเปิดทดสอบ · เป็น dev/designer ยินดีให้คำแนะนำทีม · เป็นผู้จัดงาน/อาจารย์ สนใจนำไปใช้กับงานจริง · ช่องทางติดต่อ (อีเมล/LINE) พร้อมหมายเหตุ "ใช้ติดต่อเรื่องโครงงานนี้เท่านั้น" (PDPA)

**ข้อควรระวัง**
- คนนอกช่วยได้ในรูปคำแนะนำ/feedback ไม่ใช่เขียนโค้ด (งานใช้ให้คะแนน) · ถามอาจารย์ก่อน
- ข้อ 8–9 วัดความสนใจ ไม่ใช่หลักฐาน pain · ถ้าคนเลือก job fair/meetup มาก อย่าเพิ่งเปลี่ยนทิศ ดูข้อ 4–5 ประกอบ
- คนตอบใน FB ส่วนใหญ่เป็นนักศึกษา → แยกผลตามบทบาท อย่าสรุปแทนผู้จัด
- แจก: กลุ่มนักศึกษา มจธ./มหาลัยอื่น · กลุ่ม ป.โท/เอก · กลุ่ม hackathon/dev · กลุ่มอาจารย์ · ส่งตรงถึงทีมจัด IT BANGMOD D-Day
- เป้า: ผู้นำเสนอ+ผู้เข้าชม ≥50 · ผู้จัด/อาจารย์ 5–10 · ยินดีสัมภาษณ์ ≥5
- ใช้ตอบกรรมการ: ข้อ 4–5 ยืนยัน pain · ตัวเลือก "อยากลองใช้" / "ผู้จัดสนใจนำไปใช้" เป็นหลักฐานความต้องการ

## 11. ย้ายไป repo ใหม่

**โครง folder ที่เสนอ (monorepo)**
- `CLAUDE.md` วิธีทำงาน (ส่วนที่ 1) + ลิงก์เอกสารหลัก · `README.md` · `.gitignore`
- `apps/web` (Next.js + Phaser) · `apps/server` (game server + API) · `packages/` (type ที่ใช้ร่วม เมื่อจำเป็น) · `infra/` (docker-compose, nginx, TURN, LiveKit, deploy)
- `poc/` spike แยกจากโค้ดจริง: `s1-phaser-tiled` · `s2-movement-sync` · `s3-livekit-hello` · ...
- `docs/project/` ความจริงล่าสุด: `context.md` · `research.md` (ส่วน 7–10) · `features.md`
- `docs/architecture/` · `docs/decisions/` (1 เรื่อง 1 ไฟล์ เช่น `001-nginx-over-caddy.md`) · `docs/spikes/` · `docs/exams/exam1/` (ของที่ส่งแล้ว ห้ามแก้) · `docs/meetings/` · `docs/references/`
- `.claude/` commands/agents ที่ทีมใช้ร่วม (ถ้ามี)

**กติกา**: ห้าม commit `.env`/key (ใช้ `.env.example`) · ไฟล์ใหญ่ (วิดีโอ สไลด์หนัก) เก็บ Drive แล้ววางลิงก์ หรือ Git LFS · repo private

**ไฟล์ที่พกไป**: `handoff.md` · `connecta-capstone-deprecated.md` · `ExternalCommittee_connecta.md` · `CP26SSI3_InitialProposal.pdf` · (ถ้าต้องการ) `ExternalCommittee_other_teams.md` · `archive/exam1-presentation.md` + `slide-images/` · `archive/architecture.drawio`
- โค้ด spike: `git checkout HEAD -- a0-livekit-audio a1-movement-sync b1-phaser-tilemap` ใน poc-connecta แล้ว copy ไป `poc/`
- ทิ้งไว้: `capstone-webgen-draft.md` · `archive/connecta-context.md` · `temp-booth-ref.md` · transcript .docx · ตารางสอบ PDF

**งานถัดไป (ตามลำดับ)**
1. ขอบเขต Exam 2 (19–20 ต.ค.): เลือก POC ที่จะเดโม (เช่น โหมดนำเสนอในบูธ · ให้คะแนนในบูธ) + อัปเดต architecture
2. ผู้ใช้เขียน one-liner · pain · problem statement ใหม่เอง แล้วปรับ `context.md`
3. ทำ survey (ส่วน 10) + นัดคุยผู้จัด D-Day / อาจารย์
4. แตก `handoff.md` ไปเป็น `CLAUDE.md` · `context.md` · `research.md` แล้วย้าย handoff ไปเก็บเป็นประวัติ
