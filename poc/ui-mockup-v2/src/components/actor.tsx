"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { CHARACTERS } from "@/lib/data";

// TestUI sprite: 4×4 sheet, rows = down, up, left, right · walking cycles the 4 columns at 7 fps, otherwise breathes
export function Actor({ index, direction = 0, walk = false, name, you = false, style, className = "" }: {
  index: number; direction?: number; walk?: boolean; name?: string; you?: boolean; style?: CSSProperties; className?: string;
}) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!walk || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % 4), 1000 / 7);
    return () => clearInterval(t);
  }, [walk]);
  const c = CHARACTERS[index % CHARACTERS.length];
  const col = walk ? frame : 0;
  return (
    <div className={`sprite-actor ${walk ? "" : "breathing"} ${className}`} style={style} {...(name ? { role: "img", "aria-label": name } : { "aria-hidden": true })}>
      <div className="sprite-body" style={{ backgroundImage: `url(${c.walk})`, backgroundPosition: `${col * 33.333}% ${direction * 33.333}%` }} />
      {name && <span className={`name-tag ${you ? "you" : ""}`}>{name}</span>}
    </div>
  );
}
