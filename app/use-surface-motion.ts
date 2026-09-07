"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

/** Pointer effects stay local to surfaces and never move their hit targets. */
export function useSurfaceMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const cleanups: (() => void)[] = [];

      root.current?.querySelectorAll<HTMLElement>("[data-surface], [data-magnetic]").forEach((element) => {
        const content = element.querySelector<HTMLElement>(".magnetic-content");
        const moveX = content ? gsap.quickTo(content, "x", { duration: .55, ease: "power3.out" }) : null;
        const moveY = content ? gsap.quickTo(content, "y", { duration: .55, ease: "power3.out" }) : null;
        let frame = 0;
        let x = 0;
        let y = 0;

        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          x = event.clientX;
          y = event.clientY;
          if (frame) return;
          frame = window.requestAnimationFrame(() => {
            const bounds = element.getBoundingClientRect();
            element.style.setProperty("--pointer-x", `${x - bounds.left}px`);
            element.style.setProperty("--pointer-y", `${y - bounds.top}px`);
            moveX?.(Math.max(-5, Math.min(5, (x - bounds.left - bounds.width / 2) * .1)));
            moveY?.(Math.max(-3, Math.min(3, (y - bounds.top - bounds.height / 2) * .12)));
            frame = 0;
          });
        };

        const reset = () => {
          window.cancelAnimationFrame(frame);
          frame = 0;
          moveX?.(0);
          moveY?.(0);
        };

        element.addEventListener("pointermove", move, { passive: true });
        element.addEventListener("pointerleave", reset);
        element.addEventListener("pointercancel", reset);
        cleanups.push(() => {
          reset();
          moveX?.tween.kill();
          moveY?.tween.kill();
          if (content) gsap.set(content, { clearProps: "transform" });
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", reset);
          element.removeEventListener("pointercancel", reset);
          element.style.removeProperty("--pointer-x");
          element.style.removeProperty("--pointer-y");
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    });
    return () => media.revert();
  }, [root]);
}
