"use client";

import type { MouseEvent } from "react";

const THEME_COLORS = { dark: "#0c0d0f", light: "#edece8" };

/**
 * Flips the page between dark and light. The theme lives on <html data-theme>,
 * so everything that depends on it, including screenshots captured in both
 * themes, follows from CSS alone. Where the browser supports view transitions
 * the new theme opens as a circle from the button.
 */
export function ThemeToggle() {
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[next]);
      try { window.localStorage.setItem("portfolio-theme", next); } catch { /* The theme still applies for this visit. */ }
    };
    const bounds = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${bounds.left + bounds.width / 2}px`);
    root.style.setProperty("--vt-y", `${bounds.top + bounds.height / 2}px`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && "startViewTransition" in document) document.startViewTransition(apply);
    else apply();
  };

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label="Switch between dark and light theme">
      <span aria-hidden="true" />
    </button>
  );
}
