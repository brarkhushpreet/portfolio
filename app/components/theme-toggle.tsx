"use client";

import type { MouseEvent } from "react";

const THEME_COLORS = { dark: "#0c0d0f", light: "#edece8" };

/** Fraction of an animation's duration at which a cubic-bezier easing reaches `progress` (0–1). */
function timeForProgress(easing: string, progress: number) {
  const match = easing.match(/cubic-bezier\(([^)]+)\)/);
  const [x1, y1, x2, y2] = match ? match[1].split(",").map(Number) : [0, 0, 1, 1];
  const curve = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  let low = 0;
  let high = 1;
  for (let step = 0; step < 32; step += 1) {
    const mid = (low + high) / 2;
    if (curve(y1, y2, mid) < progress) low = mid;
    else high = mid;
  }
  return curve(x1, x2, (low + high) / 2);
}

/**
 * Flips the page between dark and light. The theme lives on <html data-theme>,
 * so everything that depends on it, including screenshots captured in both
 * themes, follows from CSS alone. Where the browser supports view transitions
 * light opens as a circle from the button and dark closes in toward it.
 */
export function ThemeToggle() {
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[next]);
      // Kept for this visit only: every new visit opens in dark, the default.
      try { window.sessionStorage.setItem("portfolio-theme", next); } catch { /* The theme still applies to this page. */ }
    };
    const bounds = event.currentTarget.getBoundingClientRect();
    const originX = bounds.left + bounds.width / 2;
    const originY = bounds.top + bounds.height / 2;
    root.style.setProperty("--vt-x", `${originX}px`);
    root.style.setProperty("--vt-y", `${originY}px`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("startViewTransition" in document)) {
      apply();
      return;
    }

    // The scrollbar is not in the transition's snapshot, so it would change colour at once. It keeps the old scheme
    // until the circle's edge crosses the middle of its thumb (light reaching it, or dark passing over it).
    const barWidth = window.innerWidth - root.clientWidth;
    const thumbY = ((window.scrollY + window.innerHeight / 2) / root.scrollHeight) * window.innerHeight;
    const reach = Math.hypot(root.clientWidth + barWidth / 2 - originX, thumbY - originY);
    const release = () => { delete root.dataset.vtHold; };
    if (barWidth > 0) root.dataset.vtHold = next === "dark" ? "light" : "dark";

    // Going dark, the light page closes in on the button instead of the dark one opening from it.
    if (next === "dark") root.dataset.vt = "close";
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      if (!root.dataset.vtHold) return;
      const circle = root.getAnimations({ subtree: true }).find((animation) => (animation as CSSAnimation).animationName === "theme-open");
      const effect = circle?.effect as KeyframeEffect | null | undefined;
      if (!circle || !effect) return release();
      const duration = Number(effect.getComputedTiming().duration) || 0;
      // Keyframes run from radius 0 to 150vmax; closing plays them in reverse.
      const radius = 1.5 * Math.max(window.innerWidth, window.innerHeight);
      const share = timeForProgress(effect.getKeyframes()[0]?.easing ?? "linear", Math.min(1, reach / radius));
      const at = duration * (next === "dark" ? 1 - share : share);
      // Release on whichever frame lands nearest the crossing: within half a frame of it, not the frame after.
      let previous = Number(circle.currentTime ?? 0);
      let frame = 16;
      const watch = () => {
        if (!root.dataset.vtHold) return;
        const now = Number(circle.currentTime ?? 0);
        if (now > previous) frame = now - previous;
        previous = now;
        if (circle.playState === "finished" || now + frame / 2 >= at) release();
        else window.requestAnimationFrame(watch);
      };
      watch();
    }, release);
    transition.finished.finally(() => {
      release();
      delete root.dataset.vt;
    });
  };

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label="Switch between dark and light theme">
      <span aria-hidden="true" />
    </button>
  );
}
