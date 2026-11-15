"use client";

import { useEffect, useRef, useState } from "react";
import { links } from "../content";
import { ThemeToggle } from "./theme-toggle";

const sections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function SiteHeader() {
  const [current, setCurrent] = useState("");
  const percent = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      if (percent.current) percent.current.textContent = `${String(Math.min(100, Math.max(0, value))).padStart(2, "0")}%`;
      if (window.scrollY < window.innerHeight * 0.4) setCurrent("");
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className="top">
      <a className="top-mark" href="#top" aria-label="Khushpreet Singh — back to top">
        <span aria-hidden="true">ks</span><i aria-hidden="true" />
      </a>
      <nav className="dock" aria-label="Sections">
        {sections.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className={current === id ? "is-current" : ""} aria-current={current === id ? "true" : undefined}>{label}</a>
        ))}
      </nav>
      <div className="top-end">
        <span className="mono top-percent" ref={percent} aria-hidden="true">00%</span>
        <ThemeToggle />
        <a className="pill pill--small top-resume" href={links.resume} download>Résumé</a>
      </div>
    </header>
  );
}
