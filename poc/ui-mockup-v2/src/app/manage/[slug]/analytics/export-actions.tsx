"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { RESULTS } from "@/lib/data";

export function ReportActions() {
  const [published, setPublished] = useState(false);
  const exportCsv = () => {
    const rows = [["rank", "booth", "title", "mean_score", "judges"], ...RESULTS.map((r) => [r.rank, r.booth, `"${r.title}"`, r.score, r.judges])];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "judging-results.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex gap-2">
      <Button variant="secondary" className="h-11 px-[18px] text-sm" onClick={exportCsv}>Export CSV</Button>
      <Button className="h-11 px-[18px] text-sm" aria-pressed={published} onClick={() => setPublished(true)} disabled={published}>
        {published ? "Results published ✓" : "Publish results"}
      </Button>
    </div>
  );
}
