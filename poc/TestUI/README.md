# Connecta · HTML UI preview

ต้นแบบ UI ครบ 14 หน้า พร้อม animation และข้อมูลจำลอง ทำก่อนลงมือพัฒนาระบบจริง

## เปิดดู

ดับเบิลคลิก `index.html` ได้โดยตรง หรือเปิดผ่าน local server:

```powershell
cd D:\A_SIT04\SIT4-TERM1\a_M_CapStone\POC-Phaser\DemoFinal\TestUI
npm start
```

เข้า `http://localhost:4173` และกด **All screens 14** มุมล่างซ้ายเพื่อดูทุกหน้า ใน Hall ปุ่มนี้อยู่ด้านขวาบน

เปิด `overview.html` หรือ `http://localhost:4173/overview.html` เพื่อดูภาพรวมทุกหน้าพร้อมกัน แล้วคลิกภาพเพื่อเข้าหน้า interactive

## ทดลองอะไรได้บ้าง

- Landing: ดูแอนิเมชันตัวละครและ section ที่ค่อย ๆ ปรากฏ ดู tour 3 ขั้น
- Events / Event: ค้นหา กรองงาน/โครงการ เปิดรายละเอียด และบันทึกโครงการ
- Sign up / Sign in: ตรวจฟอร์ม ใช้ข้อมูลตัวอย่างใดก็ได้ อีเมลรหัสผ่านไม่ส่งออกไปที่ใด และไม่เก็บรหัสผ่าน
- Avatar lobby: เลือกตัวละครครบ 14 รายการจากทั้งสองโฟลเดอร์ เปลี่ยนทิศ ดู walk/idle และตั้งชื่อ
- Hall: ใช้ WASD/ลูกศรเดิน คลิก 3 บูธ เวที ห้องประชุม เปิด chat, people, agenda, saved projects, settings, map และยกมือ/โบกมือ
- Judge: เลือกคะแนนครบ 4 เกณฑ์ คำนวณค่าเฉลี่ย และ submit ไว้ใน localStorage
- Agenda: ดู session และบันทึกกิจกรรม
- Presenter: แก้ชื่อ/รายละเอียด/สถานะบูธ และดู lead ตัวอย่าง
- Organizer / Create event: ดูบทบาท สลับ module เก็บ draft และ review งาน
- Analytics: ดู chart/ผลกรรมการ และดาวน์โหลด CSV ตัวอย่าง
- Profile: แก้โปรไฟล์ ตั้งค่าข้อมูลสาธารณะ/ส่วนตัว และดาวน์โหลด vCard ตัวอย่าง
- ปุ่ม Motion on ใช้หยุด animation มี reduced-motion และหยุดเมื่อแท็บถูกซ่อน

## ขอบเขต

หน้า Hall ใช้รูปแผนที่แนบเดิม ขนาด 1536×855 เป็น backdrop พร้อม DOM sprites overlay ยังไม่ได้สร้าง Tiled map หรือใช้ Phaser จริง การชนเป็นขอบเขตคร่าว ๆ สำหรับลอง UI บนภาพอ้างอิง การนำทางบนมือถือใช้การเลื่อนดูแผนที่และคลิกจุดหมายบน Map

Mic, camera, SSO, proximity calls, invitations, publishing, resource upload และรายงานเป็น UI จำลอง ไม่มี backend, WebRTC, การส่งอีเมล หรือการเผยแพร่จริง ตัวเลือก role ในหน้าสมัครใช้พรีวิวบริบทเท่านั้น สิทธิ์จริงต้องมาจาก organizer ตามเอกสาร capstone ข้อมูลตัวอย่างอาจอยู่ใน localStorage ของ browser จนกว่าจะล้าง

ไฟล์ `.txt`, CSV และ vCard ที่ดาวน์โหลดสร้างจาก sample data ใน browser รูปแบบ PDF ใน UI เป็นตัวอย่างรายการเอกสาร ปุ่มจะดาวน์โหลดข้อความสรุป sample ชื่อชัดเจน

ใช้ asset เดิมแบบไม่แก้ต้นฉบับ พร้อม atlas สำหรับต้นแบบที่ `assets/characters/` และบันทึก source ของทุกตัวใน `manifest.json` ชุด Example02 มี idle sheet จริง 6 ตัว ส่วน Example01 ทั้ง 8 รายการใช้เฟรมพักและ breathing animation

อ่านทิศทางการออกแบบและ source ที่ใช้ใน `DESIGN.md` รายละเอียดทดสอบอยู่ใน `VERIFICATION.md`

## ตรวจ JavaScript

```powershell
npm run check
```

ไม่มี dependencies ที่ต้องติดตั้ง สำหรับการสร้าง atlas ใหม่ให้ใช้ Python ที่มี Pillow แล้วเรียก `scripts/prepare-assets.py` ฟอนต์มีสำเนา local ใน `assets/fonts` เพื่อเปิดดูได้โดยไม่ต้องพึ่งเครือข่าย
