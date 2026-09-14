"use client";

import { useEffect, useRef, useState } from "react";

export function OpeningLoader({ onComplete }: { onComplete: () => void }) {
  const surface = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let exitTimer: number | undefined;
    let fontTimer: number | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const align = () => {
      const mark = document.querySelector(".utility-bar .brand-mark strong")?.getBoundingClientRect();
      const header = document.querySelector(".utility-bar")?.getBoundingClientRect();
      if (!mark || !header || !surface.current) return;
      const style = surface.current.style;
      style.setProperty("--mark-x", `${mark.left}px`);
      style.setProperty("--mark-y", `${mark.top}px`);
      style.setProperty("--rule-x", `${header.left}px`);
      style.setProperty("--rule-y", `${header.bottom - 1}px`);
      style.setProperty("--rule-width", `${header.width}px`);
    };
    align();
    window.addEventListener("resize", align);
    const minimum = window.setTimeout(() => {
      void Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => { fontTimer = window.setTimeout(resolve, 1000); }),
      ]).then(() => {
        if (cancelled) return;
        align();
        setLeaving(true);
        exitTimer = window.setTimeout(onComplete, reduced ? 0 : 650);
      });
    }, reduced ? 0 : 800);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onComplete(); };
    window.addEventListener("keydown", escape);
    return () => {
      cancelled = true;
      window.clearTimeout(minimum);
      window.clearTimeout(fontTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("resize", align);
      window.removeEventListener("keydown", escape);
    };
  }, [onComplete]);

  return <div ref={surface} className={`opening-loader${leaving ? " is-leaving" : ""}`} role="status" aria-label="Loading portfolio">
    <strong className="opening-wordmark" aria-hidden="true">KS<span>.</span></strong>
    <div className="opening-rule" aria-hidden="true"><i /></div>
    <span className="sr-only">Loading portfolio</span>
  </div>;
}
