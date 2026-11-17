"use client";

/* eslint-disable @next/next/no-img-element */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "./use-reduced-motion";

export type HeroSlide = { id: string; title: string; src: string; light?: string };

/** Bottom to top. */
const LAYERS = [{ id: "infrastructure" }, { id: "service" }, { id: "interface" }] as const;

const REST = { rx: 60, rz: -25 };
const SLIDE_MS = 4600;
/** Matches `scroll-margin-top` on anchored sections. */
const HEADER_OFFSET = 96;
/** Matches `perspective` on `.stage`. */
const PERSPECTIVE = 1800;
const CORNERS = [[0, 0], [100, 0], [100, 100], [0, 100]];
const PACKETS = [
  { x: 24, y: 34, duration: 3.4, delay: 0 },
  { x: 58, y: 62, duration: 4.2, delay: -1.6, down: true },
  { x: 80, y: 28, duration: 3.8, delay: -2.4 },
];

/* The ground the stack stands on, measured in cells: a cell is an eighth of the stack's width,
   so the stack covers x -4..4 and y -2..2. */
const REACH = 26;
/** Other parts of the system, standing on the ground around the stack: position, footprint, height. */
const BLOCKS = [
  { x: -10, y: -4, w: 2, d: 2, h: 1.3 },
  { x: 7, y: -7, w: 3, d: 1, h: 0.7 },
  { x: 10, y: 0, w: 2, d: 2, h: 1.7 },
  { x: -8, y: 4, w: 2, d: 1, h: 0.9 },
  { x: -15, y: 1, w: 1, d: 3, h: 0.6 },
  { x: 1, y: -11, w: 2, d: 2, h: 1.1 },
  { x: -5, y: -9, w: 1, d: 1, h: 2 },
  { x: 5, y: 6, w: 2, d: 2, h: 0.8 },
  { x: 15, y: -6, w: 2, d: 1, h: 1.2 },
  { x: -14, y: -11, w: 2, d: 2, h: 0.8 },
  { x: -2, y: 8, w: 1, d: 2, h: 0.5 },
  { x: 12, y: -14, w: 1, d: 1, h: 1.5 },
];
const PULSES = 16;

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const smooth = (from: number, to: number, value: number) => {
  const amount = clamp((value - from) / (to - from));
  return amount * amount * (3 - 2 * amount);
};
/** A repeatable pseudo-random number in 0..1. */
const noise = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** Reads a CSS colour as `r, g, b` for use in rgba(). */
function rgb(value: string) {
  const probe = document.createElement("span");
  probe.style.color = value;
  document.body.appendChild(probe);
  const out = window.getComputedStyle(probe).color.match(/[\d.]+/g)?.slice(0, 3).join(", ") ?? "128, 128, 128";
  probe.remove();
  return out;
}

/** The route a block's traffic takes to the stack: along the ground lines, one turn at most. */
const routeOf = (block: (typeof BLOCKS)[number]) => {
  const startX = Math.round(block.x + block.w / 2);
  const startY = Math.round(block.y + block.d / 2);
  const toX = clamp(startX, -4, 4);
  const toY = clamp(startY, -2, 2);
  return [[startX, startY], [toX, startY], [toX, toY]] as Array<[number, number]>;
};

/**
 * The hero: a product pulled apart into the three layers the work spans,
 * standing in the middle of the system around it. The stack is CSS 3D, so the
 * project screens on its top layer stay sharp; the ground it stands on, the
 * other parts of the system and the traffic between them are drawn on a canvas
 * through the same camera, edge to edge across the first screen.
 *
 * - The top layer plays through the four projects.
 * - The whole scene leans toward the cursor; the ground lights up under it and
 *   the parts near it rise.
 * - On wide screens, scrolling flattens the top layer and carries it down the
 *   page until it lands exactly on the first project's main image; scrolling
 *   back up reverses it. That pose is a pure function of the scroll position.
 *
 * With reduced motion, or when paused, it holds a still pose.
 */
export function HeroScene({ slides, children }: { slides: HeroSlide[]; children: ReactNode }) {
  const field = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const space = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const locked = useRef(false);
  const beat = useRef(0);
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

  // Each change of project sends a ring out across the ground.
  useEffect(() => {
    if (show.previous !== null && !show.snap) beat.current = performance.now();
  }, [show]);

  useEffect(() => {
    const canvas = field.current;
    const root = scene.current;
    const frameBox = stage.current;
    const object = space.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !root || !frameBox || !object || !context) return;

    gsap.registerPlugin(ScrollTrigger);
    const html = document.documentElement;
    const hero = canvas.parentElement ?? canvas;
    const wide = window.matchMedia("(min-width: 1021px)");
    const properties = ["--rx", "--rz", "--spread", "--tx", "--ty", "--s", "--amb", "--veil", "--pr", "--bw"];
    const routes = BLOCKS.map(routeOf);
    const pulses = Array.from({ length: PULSES }, (_, index) => ({
      along: index % 2,
      line: Math.round((noise(index + 1) * 2 - 1) * REACH * 0.8),
      at: (noise(index + 40) * 2 - 1) * REACH,
      speed: (4 + noise(index + 80) * 7) * (noise(index + 120) > 0.5 ? 1 : -1),
    }));
    const raised = BLOCKS.map(() => 0);
    let landing: HTMLElement | null = null;
    let frame = 0;
    let inView = true;
    let pointerX = 0;
    let pointerY = 0;
    let leanX = 0;
    let leanY = 0;
    let open = paused ? 1 : 0;
    let last = performance.now();
    let clock = 0;
    let progress = 0;
    // The cursor, in canvas pixels, and how present it is.
    let mouseX = 0;
    let mouseY = 0;
    let mouseIn = 0;
    let mouseOn = false;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let colour = { fg: "240, 239, 234", accent: "255, 90, 54", bg: "12, 13, 15" };

    const readColours = () => {
      const style = window.getComputedStyle(html);
      colour = { fg: rgb(style.getPropertyValue("--fg")), accent: rgb(style.getPropertyValue("--accent")), bg: rgb(style.getPropertyValue("--bg")) };
    };
    const resize = () => {
      ratio = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    };
    const findLanding = () => {
      if (!wide.matches) return null;
      if (!landing?.isConnected) landing = document.querySelector<HTMLElement>(`#project-${first.id} .project-lead .frame`);
      return landing;
    };

    /**
     * The ground and everything on it, seen through the stack's own camera:
     * the same tilt, turn and perspective the CSS applies to the stack.
     */
    const drawWorld = (tilt: number, turn: number, grown: number, fade: number, advance: number) => {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      if (fade <= 0.002 || width === 0) return;

      const canvasRect = canvas.getBoundingClientRect();
      const stageRect = frameBox.getBoundingClientRect();
      const plane = object.offsetWidth;
      const cell = plane / 8;
      const originX = stageRect.left - canvasRect.left + object.offsetLeft + plane / 2;
      const originY = stageRect.top - canvasRect.top + object.offsetTop + plane / 4;
      const sinX = Math.sin((tilt * Math.PI) / 180);
      const cosX = Math.cos((tilt * Math.PI) / 180);
      const sinZ = Math.sin((turn * Math.PI) / 180);
      const cosZ = Math.cos((turn * Math.PI) / 180);
      // Just under the bottom layer.
      const floor = -cell * 0.5;

      /** Ground coordinates (cells, with a height in pixels) to canvas pixels. Null when behind the camera. */
      const project = (x: number, y: number, z = floor): [number, number] | null => {
        const px = x * cell;
        const py = y * cell;
        const x1 = px * cosZ - py * sinZ;
        const y1 = px * sinZ + py * cosZ;
        const y2 = y1 * cosX - z * sinX;
        const z2 = y1 * sinX + z * cosX;
        const depth = PERSPECTIVE - z2;
        if (depth < PERSPECTIVE * 0.16) return null;
        const scale = PERSPECTIVE / depth;
        return [originX + x1 * scale, originY + y2 * scale];
      };
      /** A straight run on the ground, clipped where it would pass behind the camera. */
      const segment = (ax: number, ay: number, bx: number, by: number) => {
        let from = project(ax, ay);
        let to = project(bx, by);
        if (!from && !to) return;
        if (!from || !to) {
          // Walk the hidden end back until it shows.
          let low = 0;
          let high = 1;
          for (let step = 0; step < 12; step += 1) {
            const middle = (low + high) / 2;
            const point = from ? project(mix(ax, bx, middle), mix(ay, by, middle)) : project(mix(bx, ax, middle), mix(by, ay, middle));
            if (point) low = middle;
            else high = middle;
          }
          if (from) to = project(mix(ax, bx, low), mix(ay, by, low));
          else from = project(mix(bx, ax, low), mix(by, ay, low));
          if (!from || !to) return;
        }
        context.moveTo(from[0], from[1]);
        context.lineTo(to[0], to[1]);
      };

      // Where the cursor meets the ground.
      let cursorX = 1e4;
      let cursorY = 1e4;
      const sx = mouseX - originX;
      const sy = mouseY - originY;
      const bottom = PERSPECTIVE * cosX + sy * sinX;
      if (bottom > 1) {
        const y1 = (sy * PERSPECTIVE - sy * floor * cosX + PERSPECTIVE * floor * sinX) / bottom;
        const x1 = (sx * (PERSPECTIVE - y1 * sinX - floor * cosX)) / PERSPECTIVE;
        cursorX = (x1 * cosZ + y1 * sinZ) / cell;
        cursorY = (-x1 * sinZ + y1 * cosZ) / cell;
      }

      const reach = REACH * (0.35 + 0.65 * grown);
      const far = (x: number, y: number) => 1 - smooth(reach * 0.45, reach, Math.hypot(x, y));

      // The ground: a lattice out to the edges of the screen.
      context.lineWidth = 1;
      context.beginPath();
      for (let line = -REACH; line <= REACH; line += 1) {
        const span = Math.sqrt(Math.max(0, reach * reach - line * line));
        if (span <= 0) continue;
        segment(-span, line, span, line);
        segment(line, -span, line, span);
      }
      context.strokeStyle = `rgba(${colour.fg}, 0.16)`;
      context.stroke();

      // Lit under the cursor.
      context.globalCompositeOperation = "source-atop";
      if (mouseIn > 0.01) {
        const spot = context.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, plane * 0.6);
        spot.addColorStop(0, `rgba(${colour.fg}, ${0.85 * mouseIn})`);
        spot.addColorStop(1, `rgba(${colour.fg}, 0)`);
        context.fillStyle = spot;
        context.fillRect(0, 0, width, height);
      }
      // Warm where the stack stands.
      const warm = context.createRadialGradient(originX, originY, 0, originX, originY, plane * 0.95);
      warm.addColorStop(0, `rgba(${colour.accent}, 0.8)`);
      warm.addColorStop(1, `rgba(${colour.accent}, 0)`);
      context.fillStyle = warm;
      context.fillRect(0, 0, width, height);

      // The lattice thins out toward its rim instead of ending.
      context.globalCompositeOperation = "destination-in";
      const rim = context.createRadialGradient(originX, originY, plane * 0.5, originX, originY, Math.max(width, height) * 0.78);
      rim.addColorStop(0, `rgba(0, 0, 0, ${fade})`);
      rim.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = rim;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";

      // Rings spreading from under the stack: a slow heartbeat, and a stronger one when the project changes.
      const ring = (age: number, life: number, strength: number) => {
        if (age < 0 || age > life || strength <= 0) return;
        const radius = 2 + (age / life) * reach * 0.8;
        context.beginPath();
        let drawing = false;
        for (let step = 0; step <= 72; step += 1) {
          const angle = (step / 72) * Math.PI * 2;
          const point = project(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.62);
          if (!point) {
            drawing = false;
            continue;
          }
          if (drawing) context.lineTo(point[0], point[1]);
          else context.moveTo(point[0], point[1]);
          drawing = true;
        }
        context.strokeStyle = `rgba(${colour.accent}, ${(strength * (1 - age / life) ** 1.6 * fade).toFixed(3)})`;
        context.stroke();
      };
      ring(clock % 5, 5, 0.5);
      ring((clock + 2.5) % 5, 5, 0.5);
      context.lineWidth = 1.5;
      ring((performance.now() - beat.current) / 1000, 2.6, beat.current ? 1 : 0);
      context.lineWidth = 1;

      // Traffic running along the ground lines.
      for (const pulse of pulses) {
        pulse.at += pulse.speed * advance;
        if (pulse.at > REACH) pulse.at = -REACH;
        if (pulse.at < -REACH) pulse.at = REACH;
        const tail = Math.sign(pulse.speed) * -2.4;
        const headX = pulse.along ? pulse.line : pulse.at;
        const headY = pulse.along ? pulse.at : pulse.line;
        const head = project(headX, headY);
        const end = project(pulse.along ? pulse.line : pulse.at + tail, pulse.along ? pulse.at + tail : pulse.line);
        const strength = far(headX, headY) * fade;
        if (!head || !end || strength < 0.02) continue;
        const trail = context.createLinearGradient(end[0], end[1], head[0], head[1]);
        trail.addColorStop(0, `rgba(${colour.fg}, 0)`);
        trail.addColorStop(1, `rgba(${colour.fg}, ${(0.75 * strength).toFixed(3)})`);
        context.beginPath();
        context.moveTo(end[0], end[1]);
        context.lineTo(head[0], head[1]);
        context.strokeStyle = trail;
        context.stroke();
      }

      // The rest of the system: blocks standing on the ground, wired to the stack.
      BLOCKS.forEach((block, index) => {
        const centreX = block.x + block.w / 2;
        const centreY = block.y + block.d / 2;
        const seen = far(centreX, centreY) * fade * smooth(0.25 + index * 0.04, 0.7 + index * 0.02, grown);
        if (seen < 0.02) return;
        const close = mouseIn * (1 - smooth(1.5, 7, Math.hypot(cursorX - centreX, cursorY - centreY)));
        raised[index] += (close - raised[index]) * (advance ? Math.min(1, advance * 6) : 1);
        const lift = raised[index];
        const tall = block.h * cell * 1.15 * (1 + 0.06 * Math.sin(clock * 0.8 + index * 1.7)) * (1 + lift * 0.75) * smooth(0, 1, grown);

        // Its line to the stack, and what is travelling on it.
        const route = routes[index];
        context.beginPath();
        segment(route[0][0], route[0][1], route[1][0], route[1][1]);
        segment(route[1][0], route[1][1], route[2][0], route[2][1]);
        context.setLineDash([3, 5]);
        context.strokeStyle = `rgba(${colour.fg}, ${((0.3 + lift * 0.4) * seen).toFixed(3)})`;
        context.stroke();
        context.setLineDash([]);
        const legA = Math.abs(route[1][0] - route[0][0]);
        const legB = Math.abs(route[2][1] - route[1][1]);
        const total = legA + legB;
        if (total > 0) {
          const cycle = (clock * (0.16 + noise(index + 7) * 0.12) + noise(index + 3)) % 1;
          const travelled = (index % 3 === 0 ? 1 - cycle : cycle) * total;
          const onA = travelled <= legA;
          const dotX = onA ? mix(route[0][0], route[1][0], legA ? travelled / legA : 0) : route[1][0];
          const dotY = onA ? route[0][1] : mix(route[1][1], route[2][1], legB ? (travelled - legA) / legB : 0);
          const dot = project(dotX, dotY);
          if (dot) {
            context.beginPath();
            context.arc(dot[0], dot[1], Math.max(1.6, plane * 0.0055), 0, Math.PI * 2);
            context.fillStyle = `rgba(${colour.accent}, ${seen.toFixed(3)})`;
            context.fill();
          }
        }

        // The block itself: a wire box, its faces filled with the page colour so the ground does not show through.
        const corners = [[block.x, block.y], [block.x + block.w, block.y], [block.x + block.w, block.y + block.d], [block.x, block.y + block.d]];
        const base = corners.map(([x, y]) => project(x, y));
        const top = corners.map(([x, y]) => project(x, y, floor + tall));
        if (base.some((point) => !point) || top.some((point) => !point)) return;
        const low = base as Array<[number, number]>;
        const high = top as Array<[number, number]>;
        context.strokeStyle = `rgba(${colour.fg}, ${((0.42 + lift * 0.5) * seen).toFixed(3)})`;
        context.fillStyle = `rgba(${colour.bg}, ${(0.86 * seen).toFixed(3)})`;
        for (let side = 0; side < 4; side += 1) {
          const next = (side + 1) % 4;
          context.beginPath();
          context.moveTo(low[side][0], low[side][1]);
          context.lineTo(low[next][0], low[next][1]);
          context.lineTo(high[next][0], high[next][1]);
          context.lineTo(high[side][0], high[side][1]);
          context.closePath();
          context.fill();
          context.stroke();
        }
        context.beginPath();
        high.forEach((point, corner) => (corner ? context.lineTo(point[0], point[1]) : context.moveTo(point[0], point[1])));
        context.closePath();
        context.fillStyle = `rgba(${colour.bg}, ${(0.92 * seen).toFixed(3)})`;
        context.fill();
        context.fillStyle = `rgba(${lift > 0.02 ? colour.accent : colour.fg}, ${((0.07 + lift * 0.5) * seen).toFixed(3)})`;
        context.fill();
        context.stroke();
      });
    };

    /** Writes the pose and draws the ground. `advance` moves the time-based parts forward. */
    const render = (advance: boolean) => {
      const now = performance.now();
      let delta = 0;
      if (advance) {
        delta = Math.min(0.1, (now - last) / 1000);
        last = now;
        const ease = (rate: number) => 1 - Math.exp(-delta * rate);
        open += ((html.classList.contains("is-ready") ? 1 : 0) - open) * ease(2.2);
        leanX += (pointerX - leanX) * ease(3.4);
        leanY += (pointerY - leanY) * ease(3.4);
        mouseIn += ((mouseOn ? 1 : 0) - mouseIn) * ease(4);
        // Held during a theme switch: the old theme is a still image, and a moving scene would break along its edge.
        if (html.dataset.vt !== undefined) delta = 0;
        clock += delta;
      }

      // Used values, not the rounded offset* ones: the landing is matched to a fraction of a pixel.
      // The box is centred on its left and top by negative margins.
      const used = window.getComputedStyle(object);
      const plane = Number.parseFloat(used.width) || object.offsetWidth;
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
      let corner = plane * 0.022;
      const centreX = Number.parseFloat(used.left) || object.offsetLeft + plane / 2;
      const centreY = Number.parseFloat(used.top) || object.offsetTop + plane / 4;
      if (target && targetRect && flying) {
        const box = frameBox.getBoundingClientRect();
        const restX = box.left + centreX;
        const restY = box.top + centreY;
        const go = smooth(0, 1, progress);
        const endScale = targetRect.width / plane;
        scale = mix(1, endScale, go);
        shiftX = mix(restX, targetRect.left + targetRect.width / 2, go) - restX;
        // `restY + scrollY` is where the object sits with the page at the very top.
        shiftY = mix(restY + window.scrollY, arriveTop + targetRect.height / 2, go) - restY;
        corner = mix(corner, (Number.parseFloat(window.getComputedStyle(target).borderTopLeftRadius) || 0) / endScale, go);
      }

      const turn = REST.rz * (1 - flat) + (leanX * 12 + Math.sin(clock * 0.45) * 1.8 - (1 - open) * 38) * calm + drift * 16;
      const tilt = REST.rx * (1 - flat) + (-leanY * 5 + Math.cos(clock * 0.38) * 0.9) * calm - drift * 5;
      root.style.setProperty("--rz", `${turn.toFixed(3)}deg`);
      root.style.setProperty("--rx", `${tilt.toFixed(3)}deg`);
      root.style.setProperty("--spread", (open * (1 - smooth(0.02, 0.6, progress)) * (1 + drift * 0.85)).toFixed(4));
      root.style.setProperty("--tx", `${shiftX.toFixed(2)}px`);
      root.style.setProperty("--ty", `${shiftY.toFixed(2)}px`);
      root.style.setProperty("--s", scale.toFixed(5));
      root.style.setProperty("--amb", (ambient * open).toFixed(3));
      // The plane passes behind the section's type on the way down: hold it back while it does, then bring it up as it lands.
      root.style.setProperty("--veil", (0.5 * smooth(0.2, 0.42, progress) * (1 - smooth(0.84, 1, progress))).toFixed(3));
      root.style.setProperty("--pr", `${corner.toFixed(2)}px`);
      root.style.setProperty("--bw", `${(1 / scale).toFixed(3)}px`);
      // Keep the vanishing point on the object so it does not skew as it travels.
      frameBox.style.perspectiveOrigin = `${(centreX + shiftX).toFixed(1)}px ${(centreY + shiftY).toFixed(1)}px`;

      root.classList.toggle("is-flying", flying && !landed);
      root.classList.toggle("is-landed", landed);
      target?.classList.toggle("is-landing", flying && !landed);

      // Drawn once a frame, from the loop: scroll only moves the stack.
      if (inView && advance) drawWorld(tilt, turn, open, open * (1 - smooth(0, 0.3, progress)) * (1 - drift * 0.7), delta);

      if (flying !== locked.current) {
        locked.current = flying;
        if (flying) {
          setActive(null);
          // The plane must be showing the first project before it flattens.
          setShow((value) => (value.index === 0 ? value : { index: 0, previous: null, snap: true }));
        }
      }
    };

    const release = () => {
      landing?.classList.remove("is-landing");
      properties.forEach((name) => root.style.removeProperty(name));
      frameBox.style.removeProperty("perspective-origin");
      root.classList.remove("is-flying", "is-landed");
      locked.current = false;
    };

    readColours();
    resize();

    // Paused, or with reduced motion: the still pose, drawn once.
    if (paused) {
      release();
      const still = () => {
        readColours();
        resize();
        drawWorld(REST.rx, REST.rz, 1, 1, 0);
      };
      still();
      const themeWatch = new MutationObserver(still);
      themeWatch.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
      const sized = new ResizeObserver(still);
      sized.observe(canvas);
      return () => {
        themeWatch.disconnect();
        sized.disconnect();
      };
    }

    const shouldRun = () => !document.hidden && (inView || (findLanding() !== null && progress < 1));
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
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
      mouseOn = mouseY >= 0 && mouseY <= rect.height;
    };
    const leave = () => { mouseOn = false; };
    // Scroll positions arrive here in the same frame they are applied, so the travelling plane never trails the page.
    const onScroll = () => {
      render(false);
      run();
    };
    const sized = new ResizeObserver(() => {
      resize();
      onScroll();
    });
    const themeWatch = new MutationObserver(readColours);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      run();
    }, { threshold: 0 });

    observer.observe(hero);
    sized.observe(canvas);
    themeWatch.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: onScroll });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", move, { passive: true });
    html.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", run);
    render(false);
    run();

    return () => {
      observer.disconnect();
      sized.disconnect();
      themeWatch.disconnect();
      trigger.kill();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", move);
      html.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", run);
      window.cancelAnimationFrame(frame);
      release();
    };
  }, [paused, first.id]);

  const current = slides[show.index];

  return (
    <>
      <canvas className="hero-field" ref={field} aria-hidden="true" />
      {children}
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
        <div className="stage-ui">
          <a className="sr-only" ref={link} href={`#project-${current.id}`}>{current.title}: view project</a>
          <button className="scene-toggle" type="button" onClick={() => setChoice(!paused)} aria-label={paused ? "Play the animation" : "Pause the animation"}>
            {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </>
  );
}
