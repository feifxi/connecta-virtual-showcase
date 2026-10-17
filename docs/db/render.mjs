// Render one ER diagram (SVG) per TableGroup of connecta.dbml → docs/images/db-<group>.svg
// Tables from other groups appear as a stub with only `id` so the relationship lines still show.
// run from the repo root: node docs/db/render.mjs   (needs network once for npx @softwaretechnik/dbml-renderer)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, "connecta.dbml"), "utf8");
const out = join(here, "..", "images");
const tmp = mkdtempSync(join(tmpdir(), "dbml-"));

const tables = new Map([...src.matchAll(/^Table (\w+) \{\n[\s\S]*?\n\}/gm)].map((m) => [m[1], m[0]]));
const groups = [...src.matchAll(/^TableGroup (\w+) \{([^}]*)\}/gm)].map((m) => ({ name: m[1], tables: m[2].trim().split(/\s+/) }));

for (const g of groups) {
  const body = g.tables.map((t) => tables.get(t)).join("\n\n");
  const refs = new Set([...body.matchAll(/ref: [<>-] (\w+)\./g)].map((m) => m[1]).filter((t) => !g.tables.includes(t)));
  const stubs = [...refs].map((t) => `Table ${t} {\n  id uuid [pk]\n}`).join("\n\n");
  const file = join(tmp, `${g.name}.dbml`);
  writeFileSync(file, [body, stubs].join("\n\n")); // enums left out: the column already shows its enum type
  execFileSync("npx", ["-y", "@softwaretechnik/dbml-renderer", "-i", file, "-o", join(out, `db-${g.name}.svg`)], { stdio: "inherit" });
  console.log(`docs/images/db-${g.name}.svg · ${g.tables.length} tables · stubs: ${[...refs].join(", ") || "-"}`);
}
