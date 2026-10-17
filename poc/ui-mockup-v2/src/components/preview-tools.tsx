"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SCREENS } from "@/lib/data";
import { Icon } from "./ui";

// Floating "All screens" picker from TestUI · mockup only
export function PreviewTools() {
  const dialog = useRef<HTMLDialogElement>(null);
  const path = usePathname();
  const inHall = path.endsWith("/hall");
  useEffect(() => { dialog.current?.close(); }, [path]);
  return (
    <>
      <div className="preview-tools" aria-label="Design preview controls" style={inHall ? { bottom: 25, left: 20 } : undefined}>
        <button type="button" onClick={() => dialog.current?.showModal()}><Icon name="grid" />All screens <span style={{ color: "var(--faint)" }}>{SCREENS.length}</span></button>
        {!inHall && <span className="preview-label">Interactive UI preview</span>}
      </div>
      <dialog ref={dialog} className="modal page-picker" aria-labelledby="pages-title" onClick={(e) => { if (e.target === dialog.current) dialog.current.close(); }}>
        <button type="button" className="icon-btn modal-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}><Icon name="close" /></button>
        <h2 id="pages-title">Take a look around.</h2>
        <p>Every screen of the current spec in one interactive preview. In the hall, switch roles with “Preview as”.</p>
        <div className="page-links">
          {SCREENS.map(([href, name, desc, icon]) => (
            <Link key={href} href={href} className={`page-link ${path === href ? "current" : ""}`}><Icon name={icon} /><div>{name}<small>{desc}</small></div></Link>
          ))}
        </div>
      </dialog>
    </>
  );
}
