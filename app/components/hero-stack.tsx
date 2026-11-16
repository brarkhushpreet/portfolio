"use client";

/* eslint-disable @next/next/no-img-element */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "./use-reduced-motion";

export type HeroSlide = { id: string; title: string; label: string; alt: string; src: string; light?: string };

/** Bottom to top. */
const LAYERS = [{ id: "infrastructure" }, { id: "service" }, { id: "interface" }] as const;

const REST = { rx: 60, rz: -25 };
const SLIDE_MS = 4200;
/** Matches `scroll-margin-top` on anchored sections. */
const HEADER_OFFSET = 96;
const CORNERS = [[0, 0], [100, 0], [100, 100], [0, 100]];
const PACKETS = [
  { x: 24, y: 34, duration: 3.4, delay: 0 },
  { x: 58, y: 62, duration: 4.2, delay: -1.6, down: true },
  { x: 80, y: 28, duration: 3.8, delay: -2.4 },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const smooth = (from: number, to: number, value: number) => {
  const amount = clamp((value - from) / (to - from));
  return amount * amount * (3 - 2 * amount);
};

/**
 * The hero object: one product pulled apart into the three layers the work
 * spans, in plain CSS 3D so it stays sharp and follows the page theme.
 *
 * - The top layer is a slideshow of the four projects.
 * - The stack leans toward the cursor and a hovered layer lifts.
 * - On wide screens, scrolling flattens the top layer and carries it down the
 *   page until it lands exactly on the first project's main image; scrolling
 *   back up reverses it. That pose is a pure function of the scroll position.
 *
 * With reduced motion, or when paused, it holds a still pose and the page
 * behaves as if none of this existed.
 */
export function HeroStack({ slides }: { slides: HeroSlide[] }) {
  const scene = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const space = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const locked = useRef(false);
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [show, setShow] = useState<{ index: number; previous: number | null; snap: boolean }>({ index: 0, previous: null, snap: false });
  const paused = choice ?? reduced;
  const first = slides[0];

  // Slideshow clock. It holds while the plane is travelling, the tab is hidden, or the scene is paused.
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      if (document.hidden || locked.current) return;
      setShow((value) => ({ index: (value.index + 1) % slides.length, previous: value.index, snap: false }));
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  useEffect(() => {
    const root = scene.current;
    const frameBox = stage.current;
    const object = space.current;
    if (!root || !frameBox || !object) return;

    const properties = ["--rx", "--rz", "--spread", "--tx", "--ty", "--s", "--amb", "--ui", "--veil", "--pr", "--bw"];
    let landing: HTMLElement | null = null;
    const release = () => {
      landing?.classList.remove("is-landing");
      properties.forEach((name) => root.style.removeProperty(name));
      frameBox.style.removeProperty("perspective-origin");
      root.classList.remove("is-flying", "is-landed");
      locked.current = false;
    };

    if (paused) {
      release();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const html = document.documentElement;
    const wide = window.matchMedia("(min-width: 1021px)");
    const started = performance.now();
    let frame = 0;
    let inView = true;
    let pointerX = 0;
    let pointerY = 0;
    let leanX = 0;
    let leanY = 0;
    let open = 0;
    let last = started;
    let progress = 0;

    const findLanding = () => {
      if (!wide.matches) return null;
      if (!landing?.isConnected) landing = document.querySelector<HTMLElement>(`#project-${first.id} .project-lead .frame`);
      return landing;
    };

    /** Writes the pose. `advance` moves the time-based parts (opening, cursor lean) forward. */
    const render = (advance: boolean) => {
      const now = performance.now();
      if (advance) {
        const delta = Math.min(0.25, (now - last) / 1000);
        last = now;
        const ease = (rate: number) => 1 - Math.exp(-delta * rate);
        open += ((html.classList.contains("is-ready") ? 1 : 0) - open) * ease(2.6);
        leanX += (pointerX - leanX) * ease(3.4);
        leanY += (pointerY - leanY) * ease(3.4);
      }

      const width = object.offsetWidth;
      const height = width / 2;
      const time = (now - started) / 1000;
      const target = findLanding();
      let targetRect: DOMRect | null = null;
      let arriveTop = 0;
      progress = 0;

      if (target) {
        targetRect = target.getBoundingClientRect();
        const article = target.closest(".project");
        const headRoom = article ? targetRect.top - article.getBoundingClientRect().top : 0;
        // Land where the page rests when a link jumps to this project: its heading just under the
        // fixed header. Counting the last pixel and a half as arrived keeps a smooth scroll that
        // settles a fraction short from leaving the plane hovering over a hidden image.
        arriveTop = HEADER_OFFSET + headRoom;
        const distance = targetRect.top + window.scrollY - arriveTop - 1.5;
        progress = distance > 0 ? clamp(window.scrollY / distance) : 0;
      } else {
        landing?.classList.remove("is-landing");
      }

      const flying = progress > 0.004;
      const landed = progress >= 1;
      const calm = 1 - smooth(0, 0.18, progress);
      const flat = smooth(0.02, 0.86, progress);
      const ambient = 1 - smooth(0.02, 0.34, progress);
      const drift = target ? 0 : clamp(window.scrollY / (window.innerHeight * 0.85));

      let shiftX = 0;
      let shiftY = 0;
      let scale = 1;
      let radius = width * 0.022;
      const centreX = object.offsetLeft + width / 2;
      const centreY = object.offsetTop + height / 2;

      if (target && targetRect && flying) {
        const box = frameBox.getBoundingClientRect();
        const restX = box.left + centreX;
        const restY = box.top + centreY;
        const go = smooth(0, 1, progress);
        const endScale = targetRect.width / width;
        scale = mix(1, endScale, go);
        shiftX = mix(restX, targetRect.left + targetRect.width / 2, go) - restX;
        // `restY + scrollY` is where the object sits with the page at the very top.
        shiftY = mix(restY + window.scrollY, arriveTop + targetRect.height / 2, go) - restY;
        radius = mix(radius, (Number.parseFloat(window.getComputedStyle(target).borderTopLeftRadius) || 0) / endScale, go);
      }

      root.style.setProperty("--rz", `${(REST.rz * (1 - flat) + (leanX * 11 + Math.sin(time * 0.45) * 1.6) * calm + drift * 16).toFixed(3)}deg`);
      root.style.setProperty("--rx", `${(REST.rx * (1 - flat) + (-leanY * 5 + Math.cos(time * 0.38) * 0.9) * calm - drift * 5).toFixed(3)}deg`);
      root.style.setProperty("--spread", (open * (1 - smooth(0.02, 0.6, progress)) * (1 + drift * 0.85)).toFixed(4));
      root.style.setProperty("--tx", `${shiftX.toFixed(2)}px`);
      root.style.setProperty("--ty", `${shiftY.toFixed(2)}px`);
      root.style.setProperty("--s", scale.toFixed(5));
      root.style.setProperty("--amb", ambient.toFixed(3));
      root.style.setProperty("--ui", (1 - smooth(0, 0.07, progress)).toFixed(3));
      // The plane passes behind the section's type on the way down: hold it back while it does, then bring it up as it lands.
      root.style.setProperty("--veil", (0.5 * smooth(0.2, 0.42, progress) * (1 - smooth(0.84, 1, progress))).toFixed(3));
      root.style.setProperty("--pr", `${radius.toFixed(2)}px`);
      root.style.setProperty("--bw", `${(1 / scale).toFixed(3)}px`);
      // Keep the vanishing point on the object so it does not skew as it travels.
      frameBox.style.perspectiveOrigin = `${(centreX + shiftX).toFixed(1)}px ${(centreY + shiftY).toFixed(1)}px`;

      root.classList.toggle("is-flying", flying && !landed);
      root.classList.toggle("is-landed", landed);
      target?.classList.toggle("is-landing", flying && !landed);

      if (flying !== locked.current) {
        locked.current = flying;
        if (flying) {
          setActive(null);
          // The plane must be showing the first project before it flattens.
          setShow((value) => (value.index === 0 ? value : { index: 0, previous: null, snap: true }));
        }
      }
    };

    const shouldRun = () => !document.hidden && (findLanding() ? progress < 1 : inView);
    const loop = () => {
      frame = 0;
      if (!shouldRun()) return;
      render(true);
      frame = window.requestAnimationFrame(loop);
    };
    const run = () => { if (!frame && shouldRun()) frame = window.requestAnimationFrame(loop); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    // Scroll positions arrive here in the same frame they are applied, so the travelling plane never trails the page.
    const onScroll = () => {
      render(false);
      run();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      run();
    }, { threshold: 0.02 });
    observer.observe(root);
    const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: onScroll });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", run);
    render(false);
    run();

    return () => {
      observer.disconnect();
      trigger.kill();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", run);
      window.cancelAnimationFrame(frame);
      release();
    };
  }, [paused, first.id]);

  const current = slides[show.index];

  return (
    <div className={`scene${paused ? " is-paused" : ""}`} ref={scene}>
      <div className="stage" ref={stage} role="img" aria-label="A product pulled apart into three layers: interface, service and infrastructure. The interface layer shows screens from the four projects.">
        <div className="stage-space" ref={space}>
          <span className="ground" />
          {LAYERS.map((layer, index) => (
            <div
              key={layer.id}
              className={`layer layer--${layer.id}${active === index ? " is-active" : ""}${active !== null && active !== index ? " is-dim" : ""}`}
              style={{ "--i": index } as CSSProperties}
              onPointerEnter={() => { if (!locked.current) setActive(index); }}
              onPointerLeave={() => setActive(null)}
              onClick={layer.id === "interface" ? () => link.current?.click() : undefined}
            >
              {layer.id === "interface" ? (
                <div className={`layer-body deck${show.snap ? " is-snapped" : ""}`}>
                  <span className="glow" />
                  <span className="slab" />
                  <span className="slab" />
                  <span className="slab" />
                  {slides.map((slide, slideIndex) => (
                    <div className={`slide${slideIndex === show.index ? " is-current" : ""}${slideIndex === show.previous ? " is-leaving" : ""}`} key={slide.id}>
                      <img className={slide.light ? "only-dark" : undefined} src={slide.src} alt="" width={1264} height={632} decoding="async" draggable={false} />
                      {slide.light ? <img className="only-light" src={slide.light} alt="" width={1264} height={632} decoding="async" draggable={false} /> : null}
                    </div>
                  ))}
                </div>
              ) : null}
              {layer.id === "service" ? (
                <div className="layer-body">
                  <svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
                    <path className="grid" d="M40 0V200M80 0V200M120 0V200M160 0V200M200 0V200M240 0V200M280 0V200M320 0V200M360 0V200M0 40H400M0 80H400M0 120H400M0 160H400" />
                    <path className="route" d="M70 60H170V130H250M250 130H330V70M170 60H250V40" />
                    <rect x="46" y="44" width="48" height="32" rx="6" />
                    <rect x="146" y="114" width="48" height="32" rx="6" />
                    <rect x="226" y="24" width="48" height="32" rx="6" />
                    <rect x="306" y="54" width="48" height="32" rx="6" />
                    <rect x="226" y="114" width="48" height="32" rx="6" />
                  </svg>
                </div>
              ) : null}
              {layer.id === "infrastructure" ? (
                <div className="layer-body">
                  <span className="ring" />
                  <span className="ring" />
                  <span className="ring" />
                  <svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
                    <rect x="60" y="52" width="72" height="96" rx="8" />
                    <path d="M60 84H132M60 116H132" />
                    <rect x="268" y="52" width="72" height="96" rx="8" />
                    <path d="M268 84H340M268 116H340" />
                    <circle cx="200" cy="100" r="10" />
                  </svg>
                </div>
              ) : null}
            </div>
          ))}
          {CORNERS.map(([x, y]) => <span className="wire" key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} />)}
          {PACKETS.map((packet) => (
            <span
              className="packet"
              key={`${packet.x}-${packet.y}`}
              style={{ left: `${packet.x}%`, top: `${packet.y}%`, animationDuration: `${packet.duration}s`, animationDelay: `${packet.delay}s`, animationDirection: packet.down ? "reverse" : "normal" }}
            />
          ))}
        </div>
      </div>

      <div className="scene-ui">
        <a className="scene-link mono" ref={link} href={`#project-${current.id}`}>View project ↓</a>
        <button className="scene-toggle" type="button" onClick={() => setChoice(!paused)} aria-label={paused ? "Play the animation" : "Pause the animation"}>
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
