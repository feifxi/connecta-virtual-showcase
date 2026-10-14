# POC

ของทดลองทั้งหมดก่อน implement จริง · คำถามและค่าตั้งต้นของแต่ละ spike อยู่ใน `docs/technical.md` หัวข้อ Spike

| โฟลเดอร์ | |
|---|---|
| `demo-app/` | POC app เดียว ต่อยอดทีละ spike S1–S6 |
| `demo-app/web/` | Next.js + Phaser 4 · LiveKit client · token API route |
| `demo-app/realtime/` | Colyseus (เริ่มใช้ตั้งแต่ S2) |

โฟลเดอร์อื่นใน `poc/` ใช้เก็บของทดลองที่ไม่ใช่ spike เช่น UI mockup · แมป 2D · S7 (NAT + TURN) ทดสอบบน VM แยก

## กติกา (`demo-app/`)

- ทำทีละ spike ตามลำดับ · **จบแต่ละ spike ต้องหยุด รายงานผล แล้วรอเจ้าของ POC อนุมัติก่อนไปต่อ**
- อนุมัติแล้ว → git tag `s<N>-done` (ใช้ย้อนกลับไปเดโมได้ถ้า spike ถัดไปพัง)
- S3 ทำในหน้าแยก (route `/s3`) ขนานกับ S1–S2 ได้ แล้วรวมใน S4
- loadtest ของ S2 วัดตอนยังไม่มี media
- POC ไม่ต้องมี auth / NestJS / DB · ส่วนที่ใช้ได้ค่อยย้ายเข้า `apps/` ตอน implement

## รัน

```
cd poc/demo-app/web
npm install
npm run gen:map   # สร้างแมป + tileset + sprite (เปิดแก้ hall.json ใน Tiled ได้)
npm run dev       # http://localhost:3000/s1
```

## ผล

| Spike | สถานะ | Tag | ผล / ตัวเลข |
|---|---|---|---|
| S1 Phaser 4 + Tiled + Next.js | ✅ ผ่าน | `s1-done` | Phaser 4.2.1 · Next 16.4 · WebGL 58 fps · เดิน 197 px/s (ทแยง 199 = normalize ถูก) · ชนกำแพง/โต๊ะบูธ · คลิกเพื่อเดิน · เข้า/ออกบูธส่ง event ถึง React · mount/unmount 100 รอบ heap คงที่ ~18 MB · ⚠️ ห้ามใช้ `Graphics.generateTexture()` (Phaser 4 ถือ scene + WebGL context ไว้ตลอดผ่าน `Graphics.TargetCamera`) ใช้ไฟล์รูปแทน |
| S2 Movement sync + loadtest | ยังไม่เริ่ม | — | |
| S3 LiveKit: เสียง · กล้อง · แชร์จอ | ยังไม่เริ่ม | — | |
| S4 Proximity media | ยังไม่เริ่ม | — | |
| S5 โหมดนำเสนอในบูธ + Pass the Mic | ยังไม่เริ่ม | — | |
| S6 Poster / 3D viewer sync | ยังไม่เริ่ม | — | |
| S7 NAT + TURN (แยก) | ยังไม่เริ่ม | — | |

**Exam 2 เดโม S1–S4**
