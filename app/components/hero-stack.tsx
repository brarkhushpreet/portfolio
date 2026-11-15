"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/** Bottom to top. The lines come from the "About" statement on this page. */
const LAYERS = [
  { id: "infrastructure", label: "Infrastructure", line: "the part that keeps it alive" },
  { id: "service", label: "Service", line: "the part behind it" },
  { id: "interface", label: "Interface", line: "the part people touch" },
] as const;

const REST = { rx: 57, rz: -35 };
const CORNERS = [[0, 0], [100, 0], [100, 100], [0, 100]];
const PACKETS = [
  { x: 24, y: 34, duration: 3.4, delay: 0 },
  { x: 58, y: 62, duration: 4.2, delay: -1.6, down: true },
  { x: 80, y: 28, duration: 3.8, delay: -2.4 },
];

/**
 * The hero object: one product pulled apart into the three layers the work
 * spans. It is plain CSS 3D, so it stays sharp and follows the page theme.
 * The stack leans toward the cursor, a hovered layer lifts, and the layers
 * spread as the page scrolls. With reduced motion, or when paused, it holds a
 * still pose.
 */
export function HeroStack({ video, poster }: { video: string; poster: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const space = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const paused = choice ?? reduced;

  useEffect(() => {
    const scene = stage.current;
    const target = space.current;
    const clip = player.current;
    if (!scene || !target) return;

    if (paused) {
      clip?.pause();
      ["--rx", "--rz", "--spread"].forEach((name) => target.style.removeProperty(name));
      return;
    }

    const root = document.documentElement;
    const started = performance.now();
    let frame = 0;
    let visible = false;
    let pointerX = 0;
    let pointerY = 0;
    let leanX = 0;
    let leanY = 0;
    let open = 0;
    let last = started;

    const render = (now: number) => {
      frame = 0;
      if (!visible) return;
      const time = (now - started) / 1000;
      // Ease by elapsed time, not by frame, so it settles the same at any frame rate.
      const delta = Math.min(0.25, (now - last) / 1000);
      last = now;
      const ease = (rate: number) => 1 - Math.exp(-delta * rate);
      const scroll = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
      open += ((root.classList.contains("is-ready") ? 1 : 0) - open) * ease(2.6);
      leanX += (pointerX - leanX) * ease(3.4);
      leanY += (pointerY - leanY) * ease(3.4);
      const rz = REST.rz + leanX * 11 + Math.sin(time * 0.45) * 1.6 + scroll * 16;
      const rx = REST.rx - leanY * 5 + Math.cos(time * 0.38) * 0.9 - scroll * 5;
      target.style.setProperty("--rz", `${rz.toFixed(2)}deg`);
      target.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      target.style.setProperty("--spread", (open * (1 + scroll * 0.85)).toFixed(3));
      frame = window.requestAnimationFrame(render);
    };
    const run = () => { if (!frame && visible) frame = window.requestAnimationFrame(render); };
    const sync = () => {
      if (visible && !document.hidden) void clip?.play().catch(() => {});
      else clip?.pause();
      run();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 });
    observer.observe(scene);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", sync);
      window.cancelAnimationFrame(frame);
      clip?.pause();
    };
  }, [paused]);

  const focus = active === null ? null : LAYERS[active];

  return (
    <div className={`scene${paused ? " is-paused" : ""}`}>
      <div className="stage" ref={stage} role="img" aria-label="A product pulled apart into three layers: interface, service and infrastructure.">
        <div className="stage-space" ref={space}>
          {LAYERS.map((layer, index) => (
            <div
              key={layer.id}
              className={`layer layer--${layer.id}${active === index ? " is-active" : ""}${active !== null && active !== index ? " is-dim" : ""}`}
              style={{ "--i": index } as CSSProperties}
              onPointerEnter={() => setActive(index)}
              onPointerLeave={() => setActive(null)}
            >
              <div className="layer-body" style={layer.id === "interface" ? { backgroundImage: `url(${poster})` } : undefined}>
                {layer.id === "interface" ? (
                  <video ref={player} src={video} poster={poster} muted loop playsInline preload="metadata" />
                ) : null}
                {layer.id === "service" ? (
                  <svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
                    <path className="grid" d="M40 0V200M80 0V200M120 0V200M160 0V200M200 0V200M240 0V200M280 0V200M320 0V200M360 0V200M0 40H400M0 80H400M0 120H400M0 160H400" />
                    <path className="route" d="M70 60H170V130H250M250 130H330V70M170 60H250V40" />
                    <rect x="46" y="44" width="48" height="32" rx="6" />
                    <rect x="146" y="114" width="48" height="32" rx="6" />
                    <rect x="226" y="24" width="48" height="32" rx="6" />
                    <rect x="306" y="54" width="48" height="32" rx="6" />
                    <rect x="226" y="114" width="48" height="32" rx="6" />
                  </svg>
                ) : null}
                {layer.id === "infrastructure" ? (
                  <>
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
                  </>
                ) : null}
              </div>
              <div className="layer-tag mono"><i /><span>{layer.label}</span></div>
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
      <p className="scene-caption mono" aria-hidden="true">
        {focus ? <><span>{focus.label}</span> — {focus.line}</> : (
          <>
            <span className="for-mouse">Move the cursor · hover a layer · scroll to pull it apart</span>
            <span className="for-touch">Tap a layer · scroll to pull it apart</span>
          </>
        )}
      </p>
      <button className="scene-toggle" type="button" onClick={() => setChoice(!paused)} aria-label={paused ? "Play the animation" : "Pause the animation"}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
      </button>
    </div>
  );
}
