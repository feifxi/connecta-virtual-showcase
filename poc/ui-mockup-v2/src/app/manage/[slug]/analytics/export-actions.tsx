"use client";

import { Icon } from "@/components/ui";
import { PROJECTS } from "@/lib/data";

export function ExportActions() {
  const exportCsv = () => {
    const rows = [["booth", "title", "visits", "votes", "weighted_score"], ...PROJECTS.map((p) => [p.code, `"${p.title}"`, p.visits, p.votes, p.score])];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "connecta-event-report-sample.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex">
      <button type="button" className="btn secondary small" onClick={exportCsv}><Icon name="download" />Export CSV</button>
      <button type="button" className="btn secondary small"><Icon name="file" />Export PDF</button>
    </div>
  );
}
