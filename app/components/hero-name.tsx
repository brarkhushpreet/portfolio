"use client";

import { Fragment, useEffect, useRef } from "react";

const WORDS = ["Khushpreet", "Singh"];
const BASE_WEIGHT = 540;
const NEAR_WEIGHT = 160;

/**
 * The name, set as large as the viewport allows. On a fine pointer the letters
 * thin out around the cursor. Each letter's box is locked at its resting width
 * first, so the weight change never reflows the line.
 */
export function HeroName() {
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = root.current;
    if (!heading) return;
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const chars = Array.from(heading.querySelectorAll<HTMLElement>(".name-char"));
    const weights = chars.map(() => BASE_WEIGHT);
    let frame = 0;
    let x = 0;
    let y = 0;
    let active = false;

    const lockWidths = () => {
      chars.forEach((char) => { char.style.width = ""; char.style.fontWeight = ""; });
      const size = Number.parseFloat(window.getComputedStyle(heading).fontSize) || 1;
      const widths = chars.map((char) => char.getBoundingClientRect().width);
      chars.forEach((char, index) => { char.style.width = `${widths[index] / size}em`; });
      weights.fill(BASE_WEIGHT);
    };

    const render = () => {
      frame = 0;
      const rects = chars.map((char) => char.getBoundingClientRect());
      const radius = Math.max(200, window.innerWidth * 0.2);
      let moving = false;
      chars.forEach((char, index) => {
        const rect = rects[index];
        const distance = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
        const near = active ? Math.max(0, 1 - distance / radius) : 0;
        const eased = near * near * (3 - 2 * near);
        const goal = BASE_WEIGHT + (NEAR_WEIGHT - BASE_WEIGHT) * eased;
        weights[index] += (goal - weights[index]) * 0.16;
        if (Math.abs(goal - weights[index]) > 0.6) moving = true;
        char.style.fontWeight = weights[index].toFixed(0);
      });
      if (moving) frame = window.requestAnimationFrame(render);
    };

    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(render); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      active = true;
      schedule();
    };
    const leave = () => { active = false; schedule(); };

    let enabled = false;
    const sync = () => {
      if (pointer.matches === enabled) return;
      enabled = pointer.matches;
      if (enabled) {
        lockWidths();
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", leave);
      } else {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
        window.cancelAnimationFrame(frame);
        frame = 0;
        chars.forEach((char) => { char.style.width = ""; char.style.fontWeight = ""; });
      }
    };

    sync();
    pointer.addEventListener("change", sync);
    void document.fonts.ready.then(() => { if (enabled) lockWidths(); });

    return () => {
      pointer.removeEventListener("change", sync);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <h1 className="name" id="hero-name" ref={root}>
      <span className="sr-only">Khushpreet Singh</span>
      <span className="name-line" aria-hidden="true">
        {WORDS.map((word, wordIndex) => (
          <Fragment key={word}>
            {wordIndex > 0 ? " " : null}
            <span className="name-word">
              {Array.from(word).map((char, index) => (
                <span className="name-char" key={`${char}-${index}`}>{char}</span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </h1>
  );
}
