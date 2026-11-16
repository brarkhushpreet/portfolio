"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Snap from "lenis/snap";
import { useEffect } from "react";

/** Shortest time the opening curtain stays down, measured from navigation start. */
const CURTAIN_MS = 850;
/** Where a scroll that comes to rest nearby settles: each project, Experience and Contact. */
const SNAP_TARGETS = ".project, #experience, #contact";

/**
 * The page's motion layer. Markup opts in through data attributes, so every
 * section stays readable, server-rendered HTML:
 *
 *   data-rise   words rise out of a mask when the element enters
 *   data-fade   element fades up when it enters
 *   data-scrub  words light up in step with the scroll position
 *   data-intro  hero elements that enter once the curtain lifts
 *
 * Initial (hidden) states are only ever set here, never in CSS. Under
 * prefers-reduced-motion nothing is hidden and native scrolling is kept.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let curtain = 0;

    media.add("(prefers-reduced-motion: reduce)", () => {
      root.classList.add("is-ready");
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ anchors: true, lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Gentle snapping, only with a mouse or trackpad: a scroll that stops close to a section
      // start glides onto it, resting where its anchor link would (under the fixed header).
      const snap = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        ? new Snap(lenis, { type: "proximity", distanceThreshold: "28%", debounce: 260, duration: 0.85, easing: (t) => 1 - Math.pow(1 - t, 4) })
        : null;
      let snaps: Array<() => void> = [];
      const placeSnaps = () => {
        if (!snap) return;
        snaps.forEach((remove) => remove());
        snaps = gsap.utils.toArray<HTMLElement>(SNAP_TARGETS).map((element) => {
          const offset = Number.parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0;
          const top = element.getBoundingClientRect().top + window.scrollY - offset;
          return snap.add(Math.round(Math.min(top, lenis.limit)));
        });
      };
      placeSnaps();

      // Opening: wait for the curtain, then bring the hero in.
      const alreadyOpen = root.classList.contains("is-ready") || window.scrollY > 40;
      if (alreadyOpen) {
        root.classList.add("is-ready");
      } else {
        gsap.set(".name-char", { yPercent: 112 });
        gsap.set("[data-intro]", { opacity: 0, y: 22 });
        gsap.set(".top > *", { opacity: 0, y: -14 });
        const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        intro
          .to(".name-char", { yPercent: 0, duration: 1.25, stagger: 0.032, clearProps: "transform" }, 0.18)
          .to("[data-intro]", { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, clearProps: "transform,opacity" }, 0.55)
          .to(".top > *", { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, clearProps: "transform,opacity" }, 0.7);
        curtain = window.setTimeout(() => {
          root.classList.add("is-ready");
          intro.play();
        }, Math.max(0, CURTAIN_MS - performance.now()));
      }

      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((element) => {
        gsap.from(element.querySelectorAll(".wi"), {
          yPercent: 118,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
      });

      gsap.set("[data-fade]", { opacity: 0, y: 36 });
      ScrollTrigger.batch("[data-fade]", {
        start: "top 92%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.05, ease: "power3.out", stagger: 0.09, overwrite: true, clearProps: "transform,opacity" }),
      });

      gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((element) => {
        gsap.fromTo(element.querySelectorAll(".wi"), { opacity: 0.14 }, {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: element, start: "top 82%", end: "bottom 48%", scrub: true },
        });
      });

      // Layout below can shift as media and fonts settle.
      let refresh = 0;
      const observer = new ResizeObserver(() => {
        window.clearTimeout(refresh);
        refresh = window.setTimeout(() => {
          ScrollTrigger.refresh();
          placeSnaps();
        }, 150);
      });
      observer.observe(document.body);

      return () => {
        window.clearTimeout(curtain);
        window.clearTimeout(refresh);
        observer.disconnect();
        gsap.ticker.remove(tick);
        snap?.destroy();
        lenis.destroy();
        root.classList.add("is-ready");
      };
    });

    return () => media.revert();
  }, []);

  return null;
}
