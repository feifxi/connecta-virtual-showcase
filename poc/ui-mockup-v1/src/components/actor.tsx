"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { characters } from "@/lib/mock";

// 2D character sprite (TestUI sheets) · walking cycles 4 frames at 7 fps, otherwise a gentle breathing loop
export function Actor({ index, size, direction = 0, walk = false, name, you = false, className, style }: {
  index: number; size?: number; direction?: number; walk?: boolean; name?: string; you?: boolean; className?: string; style?: CSSProperties;
}) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!walk || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % 4), 1000 / 7);
    return () => clearInterval(t);
  }, [walk]);
  const c = characters[index % characters.length];
  return (
    <span className={cn("relative inline-block size-16 shrink-0", className)} style={{ ...(size ? { width: size, height: size } : {}), ...style }} {...(name ? { role: "img", "aria-label": name } : { "aria-hidden": true })}>
      <span
        className={cn("absolute inset-0 [image-rendering:pixelated]", !walk && "animate-[breathe_2.5s_ease-in-out_infinite]")}
        style={{ backgroundImage: `url(${c.walk})`, backgroundSize: "400% 400%", backgroundPosition: `${(walk ? frame : 0) * 33.333}% ${direction * 33.333}%`, transformOrigin: "50% 90%" }}
      />
      {name && <span className={cn("absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-1.5 text-[10px] font-semibold leading-relaxed text-white", you ? "bg-primary" : "bg-foreground/85")}>{name}</span>}
    </span>
  );
}

export function Portrait({ index, size = 40, className }: { index: number; size?: number; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={characters[index % characters.length].portrait} width={size} height={size} alt="" className={cn("shrink-0 rounded-xl bg-secondary object-contain [image-rendering:pixelated]", className)} style={{ width: size, height: size }} />;
}
