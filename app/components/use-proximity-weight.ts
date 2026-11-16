"use client";

import { useEffect, type RefObject } from "react";

/**
 * Makes the letters inside `root` change weight around the cursor: `base` at
 * rest, `near` under the pointer. Each letter's box is locked at its resting
 * width first, so the change never reflows the line. Only runs for a fine
 * pointer with motion allowed, and costs nothing while the pointer is still.
 */
export function useProximityWeight(root: RefObject<HTMLElement | null>, selector: string, base: number, near: number) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const chars = Array.from(element.querySelectorAll<HTMLElement>(selector));
    const weights = chars.map(() => base);
    let frame = 0;
    let x = 0;
    let y = 0;
    let active = false;

    const lockWidths = () => {
      chars.forEach((char) => { char.style.width = ""; char.style.fontWeight = ""; });
      const size = Number.parseFloat(window.getComputedStyle(element).fontSize) || 1;
      const widths = chars.map((char) => char.getBoundingClientRect().width);
      chars.forEach((char, index) => { char.style.width = `${widths[index] / size}em`; });
      weights.fill(base);
    };

    const render = () => {
      frame = 0;
      const rects = chars.map((char) => char.getBoundingClientRect());
      const radius = Math.max(200, window.innerWidth * 0.2);
      let moving = false;
      chars.forEach((char, index) => {
        const rect = rects[index];
        const distance = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
        const closeness = active ? Math.max(0, 1 - distance / radius) : 0;
        const eased = closeness * closeness * (3 - 2 * closeness);
        const goal = base + (near - base) * eased;
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
  }, [root, selector, base, near]);
}
