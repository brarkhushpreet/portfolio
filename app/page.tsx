"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, MoveHorizontal } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSurfaceMotion } from "./use-surface-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
} from "react";

type Project = {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  year: string;
  status: string;
  discipline: string;
  description: string;
  story: string;
  highlights: string[];
  stack: string[];
  link: string;
  linkLabel: string;
  screenshots: { src: string; alt: string; label: string; format?: "desktop" | "mobile" }[];
};

const projects: Project[] = [
  {
    id: "echopass",
    title: "EchoPass / ClassPulse",
    shortTitle: "EchoPass",
    subtitle: "Verifiable classroom presence, without roll-call friction",
    year: "2025—26",
    status: "Capstone",
    discipline: "Full-stack · Audio systems",
    description:
      "A teacher-owned attendance platform that verifies the room through rotating ultrasound or fresh geolocation evidence.",
    story:
      "EchoPass turns the room into a temporary credential. Teachers open a short check-in window, students prove presence through a live signal, and the product turns every session into useful classroom and student-level analytics.",
    highlights: ["Rotating acoustic challenges", "Live classroom analytics", "Signed attendance evidence"],
    stack: ["Next.js", "Web Audio", "PostgreSQL", "Prisma", "Redis", "WebSockets"],
    link: "https://github.com/brarkhushpreet/AMS",
    linkLabel: "View repository",
    screenshots: [
      { src: "/projects/echopass-product.png", alt: "EchoPass product capabilities overview", label: "Product overview" },
      { src: "/projects/echopass-dashboard.png", alt: "EchoPass teacher analytics dashboard", label: "Teacher dashboard" },
      { src: "/projects/echopass-classroom.png", alt: "EchoPass classroom session controls", label: "Classroom controls" },
      { src: "/projects/echopass-attendance.png", alt: "EchoPass attendance analytics screen", label: "Attendance analytics" },
      { src: "/projects/echopass-security.png", alt: "EchoPass passkey and device security screen", label: "Device security" },
      { src: "/projects/echopass-mobile.png", alt: "EchoPass teacher dashboard on a mobile viewport", label: "Responsive dashboard", format: "mobile" },
    ],
  },
  {
    id: "chat",
    title: "Nexus Realtime Chat",
    shortTitle: "Nexus Chat",
    subtitle: "Persistent conversations and lightweight team huddles",
    year: "2024—26",
    status: "Built",
    discipline: "Realtime · Collaboration",
    description:
      "A realtime collaboration workspace with authenticated rooms, persistent messages, presence, and browser-native huddles.",
    story:
      "Nexus grew from a messaging experiment into a complete product surface: spaces, conversations, secure membership, resilient history, realtime state, and native WebRTC calls backed by a persistent Node server.",
    highlights: ["Authenticated Socket.IO rooms", "Persistent message history", "Native WebRTC huddles"],
    stack: ["Next.js", "Socket.IO", "WebRTC", "PostgreSQL", "Prisma", "Auth.js"],
    link: "https://github.com/brarkhushpreet/Chat-Application-nextjs",
    linkLabel: "View repository",
    screenshots: [
      { src: "/projects/chat-workspace.png", alt: "Nexus realtime chat workspace in dark mode", label: "Realtime workspace" },
      { src: "/projects/chat-workspace-light.png", alt: "Nexus realtime chat workspace in light mode", label: "Light interface" },
      { src: "/projects/chat-space-menu.png", alt: "Nexus space management menu", label: "Space controls" },
      { src: "/projects/chat-signin.png", alt: "Nexus secure sign-in screen", label: "Authentication" },
      { src: "/projects/chat-command-palette.png", alt: "Nexus command palette over the realtime workspace", label: "Quick navigation" },
      { src: "/projects/chat-mobile.png", alt: "Nexus spaces and conversations on a mobile viewport", label: "Responsive workspace", format: "mobile" },
    ],
  },
  {
    id: "movies",
    title: "Vanta Movie Explorer",
    shortTitle: "Movie Explorer",
    subtitle: "A cinematic, profile-aware streaming discovery experience",
    year: "2024—26",
    status: "Live",
    discipline: "Product · Discovery",
    description:
      "A polished streaming-discovery product with member accounts, profiles, search, watchlists, title details, and trailer flows.",
    story:
      "The experience makes a large catalogue feel immediate through confident visual hierarchy, responsive content rails, useful title context, and profile-aware personalization. TMDB powers live metadata with a curated fallback for dependable demos.",
    highlights: ["Profile-aware discovery", "Live TMDB metadata", "Persistent My List"],
    stack: ["Next.js", "React", "TMDB", "PostgreSQL", "Tailwind CSS"],
    link: "https://movie-website-gules.vercel.app",
    linkLabel: "Visit live site",
    screenshots: [
      { src: "/projects/movie-browse.png", alt: "Vanta movie discovery home screen", label: "Discovery home" },
      { src: "/projects/movie-details.png", alt: "Vanta Inception title details screen", label: "Title details" },
      { src: "/projects/movie-catalog.png", alt: "Vanta movie catalog screen", label: "Movie catalog" },
      { src: "/projects/movie-profiles.png", alt: "Vanta profile selection screen", label: "Profile selection" },
      { src: "/projects/movie-profile-menu.png", alt: "Vanta profile controls over the cinematic home screen", label: "Profile controls" },
      { src: "/projects/movie-mobile.png", alt: "Vanta cinematic discovery home on a mobile viewport", label: "Responsive discovery", format: "mobile" },
    ],
  },
  {
    id: "blog",
    title: "Developer Blog",
    shortTitle: "Developer Blog",
    subtitle: "First-principles notes on software systems",
    year: "2024—26",
    status: "Published",
    discipline: "Publishing · Full-stack",
    description:
      "A focused technical publication covering JavaScript, React, Node.js, realtime systems, Docker, AWS, and architecture.",
    story:
      "The product keeps reading ahead of interface chrome. A separate Express API serves structured Markdown articles, while the Next.js frontend handles search, topic filters, responsive typography, dark mode, and article-level metadata.",
    highlights: ["Ten technical deep dives", "Search and topic filters", "Independent content API"],
    stack: ["Next.js", "Express", "MongoDB", "Markdown", "Cloudflare"],
    link: "https://github.com/brarkhushpreet/blog",
    linkLabel: "View repository",
    screenshots: [
      { src: "/projects/blog-home.png", alt: "Developer blog home page", label: "Publication home" },
      { src: "/projects/blog-articles.png", alt: "Developer blog article archive", label: "Article archive" },
      { src: "/projects/blog-article.png", alt: "Developer blog article reading view", label: "Reading experience" },
      { src: "/projects/blog-about.png", alt: "Developer blog about page", label: "About the publication" },
      { src: "/projects/blog-search.png", alt: "Developer blog search results for WebSocket articles", label: "Search and filters" },
      { src: "/projects/blog-mobile.png", alt: "Developer blog home page on a mobile viewport", label: "Responsive reading", format: "mobile" },
    ],
  },
];

const capabilities = [
  ["01", "Product interfaces", "Responsive dashboards, accessible interactions, and performance work that users can feel."],
  ["02", "Backends & APIs", "Express services, auth, PostgreSQL, Prisma, WebSockets, jobs, and third-party integrations."],
  ["03", "AI & realtime", "Voice agents, worker orchestration, queues, audio pipelines, evaluations, and live state."],
  ["04", "Cloud & delivery", "AWS EC2, RDS, S3, PM2, migrations, environment wiring, and repeatable releases."],
];

const experience = [
  {
    date: "May 2025 — Present",
    role: "Software Development Engineer I",
    company: "Zyvka HR Tech",
    copy: "Building and operating company AI products across product interfaces, backend services, realtime workers, data, and AWS. Details stay intentionally high-level because the work is production-specific.",
  },
  {
    date: "Jul 2024 — Apr 2025",
    role: "Software Development Engineer Intern",
    company: "Zyvka HR Tech",
    copy: "Worked across a production platform migration, realtime product features, and repeatable delivery workflows while keeping company implementation details private.",
  },
  {
    date: "Jun 2023 — Jul 2023",
    role: "Summer Internship Trainee",
    company: "Solitaire Infosys",
    copy: "Built a practical MERN foundation through full-stack applications and API-driven product work.",
  },
];

function SignalName() {
  const field = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const thumb = useRef<HTMLButtonElement>(null);
  const readout = useRef<HTMLElement>(null);
  const dragging = useRef(false);
  const value = useRef(50);
  const verticalValue = useRef(50);
  const animationFrame = useRef<number | null>(null);
  const spotlightFrame = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  const applyValue = (nextValue: number, nextVertical = verticalValue.current) => {
    const next = Math.max(0, Math.min(100, nextValue));
    const vertical = Math.max(0, Math.min(100, nextVertical));
    value.current = next;
    verticalValue.current = vertical;
    if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
    animationFrame.current = window.requestAnimationFrame(() => {
      const horizontalOffset = next - 50;
      const rotationProgress = horizontalOffset / 50;
      field.current?.querySelectorAll<HTMLElement>(".signal-char").forEach((character, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const rotation = rotationProgress * direction * (2.4 + (index % 3) * 0.36);
        character.style.setProperty("--char-rotation", `${reducedMotion.current ? 0 : rotation}deg`);
      });
      field.current?.style.setProperty("--signal-pos", `${next}%`);
      thumb.current?.setAttribute("aria-valuenow", String(Math.round(next)));
      if (readout.current) readout.current.textContent = `X ${String(Math.round(next)).padStart(3, "0")} · Y ${String(Math.round(vertical)).padStart(3, "0")}`;
      animationFrame.current = null;
    });
  };

  const updateFromPointer = (clientX: number, clientY: number) => {
    if (!rail.current) return;
    const bounds = rail.current.getBoundingClientRect();
    applyValue(
      ((clientX - bounds.left) / bounds.width) * 100,
      (clientY / window.innerHeight) * 100,
    );
  };

  const start = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragging.current = true;
    thumb.current?.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    field.current?.classList.add("is-dragging");
    updateFromPointer(event.clientX, event.clientY);
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromPointer(event.clientX, event.clientY);
  };

  const end = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    updateFromPointer(event.clientX, event.clientY);
    dragging.current = false;
    field.current?.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const keyboardMove = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 10 : 4;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") applyValue(value.current - step);
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") applyValue(value.current + step);
    else if (event.key === "Home") applyValue(0);
    else if (event.key === "End") applyValue(100);
    else return;
    event.preventDefault();
  };

  const moveSpotlight = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion.current || (event.target as HTMLElement).closest(".signal-field")) return;
    const { clientX, clientY } = event;
    if (spotlightFrame.current !== null) window.cancelAnimationFrame(spotlightFrame.current);
    spotlightFrame.current = window.requestAnimationFrame(() => {
      const characters = Array.from(field.current?.querySelectorAll<HTMLElement>(".signal-char") ?? []);
      const bounds = characters.map((character) => character.getBoundingClientRect());
      characters.forEach((character, index) => {
        character.style.setProperty("--char-spot-x", `${clientX - bounds[index].left}px`);
        character.style.setProperty("--char-spot-y", `${clientY - bounds[index].top}px`);
      });
      spotlightFrame.current = null;
    });
  };

  const clearSpotlight = () => {
    if (spotlightFrame.current !== null) window.cancelAnimationFrame(spotlightFrame.current);
    spotlightFrame.current = null;
    field.current?.querySelectorAll<HTMLElement>(".signal-char").forEach((character) => {
      character.style.setProperty("--char-spot-x", "-999px");
      character.style.setProperty("--char-spot-y", "-999px");
    });
  };

  useLayoutEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      reducedMotion.current = preference.matches;
      applyValue(value.current, verticalValue.current);
      if (preference.matches) clearSpotlight();
    };
    syncMotion();
    preference.addEventListener("change", syncMotion);
    applyValue(50, 50);
    return () => {
      if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
      if (spotlightFrame.current !== null) window.cancelAnimationFrame(spotlightFrame.current);
      preference.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <div className="signal-name" ref={field} onPointerMove={moveSpotlight} onPointerLeave={clearSpotlight}>
      <span className="signal-kicker">KS / BUILD 04 · DRAG + RELEASE</span>
      <div className="signal-title-wrap">
        <h1 className="signal-title-base" aria-label="Khushpreet Singh">
          <span className="signal-word signal-word-primary">
            {Array.from("khushpreet").map((character, index) => <span className="signal-glyph" key={`${character}-${index}`}><span className="signal-char">{character}</span></span>)}
          </span>
          <span className="signal-word signal-word-secondary">
            {Array.from("singh").map((character, index) => <span className="signal-glyph" key={`${character}-${index}`}><span className="signal-char">{character}</span></span>)}
          </span>
        </h1>
      </div>
      <div className="signal-field" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        <span className="signal-axis" ref={rail}>
          {Array.from({ length: 21 }).map((_, index) => <i key={index} />)}
          <button ref={thumb} className="signal-thumb" type="button" role="slider" aria-label="Adjust name signal" aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} onKeyDown={keyboardMove} />
        </span>
        <small ref={readout}>X 050 · Y 050</small>
      </div>
    </div>
  );
}

function ProjectSlider({ project }: { project: Project }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const sync = () => setCurrent(api.selectedScrollSnap());
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => api.reInit({ duration: preference.matches ? 0 : 30 });
    syncMotion();
    preference.addEventListener("change", syncMotion);
    return () => preference.removeEventListener("change", syncMotion);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const viewport = api.rootNode();
    let wheelGestureActive = false;
    let wheelRelease: number | undefined;

    const handleWheel = (event: WheelEvent) => {
      const horizontalDelta = Math.abs(event.deltaX) >= Math.abs(event.deltaY)
        ? event.deltaX
        : event.shiftKey
          ? event.deltaY
          : 0;

      if (Math.abs(horizontalDelta) < 6) return;

      event.preventDefault();
      window.clearTimeout(wheelRelease);
      wheelRelease = window.setTimeout(() => {
        wheelGestureActive = false;
      }, 180);

      if (wheelGestureActive) return;
      wheelGestureActive = true;

      if (horizontalDelta > 0) api.scrollNext();
      else api.scrollPrev();
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.clearTimeout(wheelRelease);
      viewport.removeEventListener("wheel", handleWheel);
    };
  }, [api]);

  const active = project.screenshots[current] ?? project.screenshots[0];

  return (
    <div className="case-slider">
      <div className="case-slider-bar">
        <span>Screen archive</span>
        <span><MoveHorizontal size={12} /> scroll / drag</span>
        <span><b className="gallery-count" key={current}>{String(current + 1).padStart(2, "0")}</b> / {String(project.screenshots.length).padStart(2, "0")}</span>
      </div>
      <Carousel
        className="case-carousel"
        opts={{ loop: false, align: "center", containScroll: false, duration: 30 }}
        setApi={setApi}
        aria-label={`${project.shortTitle} screenshot gallery`}
      >
        <CarouselContent>
          {project.screenshots.map((screenshot, index) => (
            <CarouselItem
              key={screenshot.src}
              className={index === current ? "is-active" : ""}
              aria-label={`${index + 1} of ${project.screenshots.length}`}
            >
              <figure className="case-slide">
                <div className={`case-shot case-shot--${screenshot.format ?? "desktop"}`}>
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={screenshot.format === "mobile" ? 390 : 1264}
                    height={screenshot.format === "mobile" ? 844 : 720}
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{screenshot.label}</p>
                  <small>{screenshot.format === "mobile" ? "Mobile / responsive" : "Desktop"}</small>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="case-slider-rail">
          <div className="case-slider-copy" aria-live="polite">
            <span>Viewing</span>
            <p key={active.src}>{active.label}</p>
          </div>
          <div className="case-slider-dots" aria-label="Choose screenshot">
            {project.screenshots.map((screenshot, index) => (
              <button
                type="button"
                key={screenshot.src}
                className={index === current ? "active" : ""}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Show ${screenshot.label}`}
                aria-current={index === current ? "true" : undefined}
              ><i /></button>
            ))}
          </div>
          <div className="case-slider-actions">
            <CarouselPrevious aria-label="Previous screenshot"><ArrowLeft size={14} /><span>Prev</span></CarouselPrevious>
            <CarouselNext aria-label="Next screenshot"><span>Next</span><ArrowRight size={14} /></CarouselNext>
          </div>
        </div>
      </Carousel>
    </div>
  );
}

function ProjectEntry({ project, index, open, onToggle }: { project: Project; index: number; open: boolean; onToggle: () => void }) {
  const caseHeading = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open && trigger.current?.nextElementSibling?.contains(document.activeElement)) {
      trigger.current.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open || !caseHeading.current) return;

    const target = caseHeading.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startY = window.scrollY;
    const startedAt = performance.now();
    const duration = reducedMotion ? 0 : 720;
    let animationFrame = 0;
    let cancelled = false;

    document.documentElement.classList.add("is-aligning-project");

    const stop = () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      document.documentElement.classList.remove("is-aligning-project");
    };

    const align = (now: number) => {
      if (cancelled) return;

      const scrollMargin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - scrollMargin;
      const progress = duration === 0 ? 1 : Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      window.scrollTo({ top: startY + (targetY - startY) * eased, behavior: "auto" });

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(align);
        return;
      }

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - scrollMargin,
        behavior: "auto",
      });
      document.documentElement.classList.remove("is-aligning-project");
    };

    animationFrame = window.requestAnimationFrame(align);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });

    return () => {
      stop();
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
    };
  }, [open]);

  return (
    <article className={`project-item ${open ? "is-open" : ""}`}>
      <button ref={trigger} type="button" className="project-trigger" data-surface onClick={onToggle} aria-expanded={open} aria-controls={`${project.id}-detail`}>
        <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="project-title">{project.shortTitle}</span>
        <span className="project-subtitle">{project.subtitle}</span>
        <span className="project-arrow" aria-hidden="true">↗</span>
        <time>{project.year}</time>
      </button>
      <div className="project-reveal" id={`${project.id}-detail`} inert={!open} aria-hidden={!open}>
        <div className="project-reveal-inner">
          <div className="case-head" ref={caseHeading}>
            <h3>{project.title}</h3>
            <button className="case-close" onClick={() => { trigger.current?.focus({ preventScroll: true }); onToggle(); }} type="button" aria-label={`Close ${project.shortTitle} project`}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="case-meta"><span>{project.discipline}</span><span>{project.year}</span><span>{project.status}</span></div>
          <ProjectSlider project={project} />
          <div className="case-copy">
            <h4>{project.description}</h4>
            <p>{project.story}</p>
          </div>
          <div className="case-facts">
            {project.highlights.map((highlight, index) => <p key={highlight}><span>0{index + 1}</span>{highlight}</p>)}
          </div>
          <div className="case-bottom">
            <div className="case-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
            <a className="motion-link" href={project.link} target="_blank" rel="noreferrer">{project.linkLabel} <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const loaderCount = useRef<HTMLSpanElement>(null);
  const copyTimeout = useRef<number | undefined>(undefined);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [time, setTime] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useSurfaceMotion(root);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = window.localStorage.getItem("portfolio-theme"); } catch { /* System theme remains available when storage is blocked. */ }
    const next = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    // Theme preferences are browser-only and must be synchronized after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      root.current?.querySelector<HTMLButtonElement>(".project-item.is-open > .project-trigger")?.focus({ preventScroll: true });
      setActiveProject(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let entered = false;
    media.add({ reduced: "(prefers-reduced-motion: reduce)", animated: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (context.conditions?.reduced) {
        entered = true;
        document.body.classList.remove("is-loading");
        return;
      }

      if (!entered) document.body.classList.add("is-loading");
      const counter = { value: 0 };
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => document.body.classList.remove("is-loading"),
      });
      if (!entered) {
        gsap.set(".intro-enter", { opacity: 0, y: 12 });
        gsap.set(".signal-glyph", { opacity: 0, yPercent: 65, rotation: 5 });
        intro
        .to(counter, {
          value: 100,
          duration: .65,
          ease: "power2.inOut",
          onUpdate: () => {
            if (loaderCount.current) loaderCount.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        })
        .to(".loader-track i", { scaleX: 1, duration: .65, ease: "power2.inOut" }, 0)
        .to(".loader-pip", { opacity: 1, stagger: 0.08, duration: 0.15 }, 0.1)
        .to(".site-loader", { yPercent: -100, duration: .55, ease: "power4.inOut" }, ">+.04")
        .to(".signal-glyph", { opacity: 1, yPercent: 0, rotation: 0, stagger: .028, duration: .85, clearProps: "transform,opacity" }, "-=.25")
        .fromTo(".signal-axis", { scaleX: 0 }, { scaleX: 1, duration: .8, clearProps: "transform" }, "<+.1")
        .to(".intro-enter", { opacity: 1, y: 0, stagger: .065, duration: .6, clearProps: "transform,opacity" }, "<+.08");
        entered = true;
      }

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        const rows = element.querySelectorAll(".capability-list > article, .project-item, .experience-list > article, .tool-lines > p");
        const timeline = gsap.timeline({ scrollTrigger: { trigger: element, start: "top 91%", once: true } });
        timeline.fromTo(element, { "--rule-scale": 0 }, { "--rule-scale": 1, duration: 1, ease: "power3.inOut" }, 0);
        timeline.fromTo(element.querySelectorAll(":scope > .section-head, :scope > .about-copy, :scope.contact > div, :scope.contact > h2"),
          { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .085, duration: .7, ease: "power3.out", clearProps: "transform,opacity" }, .08);
        if (rows.length) timeline.fromTo(rows, { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: .065, duration: .6, ease: "power3.out", clearProps: "transform,opacity" }, .16);
      });

      return () => document.body.classList.remove("is-loading");
    }, root);
    // Expanding a case study changes every section's scroll position below it.
    let refreshTimeout: number | undefined;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(refreshTimeout);
      refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    });
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      window.clearTimeout(refreshTimeout);
      media.revert();
      document.body.classList.remove("is-loading");
    };
  }, []);

  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try { window.localStorage.setItem("portfolio-theme", next); } catch { /* Theme still works for the current visit. */ }
  };

  const copyEmail = async () => {
    window.clearTimeout(copyTimeout.current);
    try {
      await navigator.clipboard.writeText("khushbrar@gmail.com");
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
    copyTimeout.current = window.setTimeout(() => { setCopied(false); setCopyFailed(false); }, 2600);
  };

  return (
    <main className="shell" id="top" ref={root}>
      <div className="site-loader" aria-hidden="true">
        <div className="loader-inner">
          <p><span>KS</span><span ref={loaderCount}>000</span></p>
          <div className="loader-track"><i /></div>
          <div className="loader-status"><span className="loader-pip">interface</span><span className="loader-pip">systems</span><span className="loader-pip">cloud</span></div>
        </div>
      </div>

      <header className="utility-bar intro-enter">
        <a href="#top" aria-label="Back to top"><strong>KS</strong><span>portfolio / 2026</span></a>
        <button className="theme-switch" type="button" onClick={toggleTheme} aria-pressed={theme === "dark"} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
          <span className={theme === "light" ? "active" : ""}>Light</span>
          <i aria-hidden="true"><b /></i>
          <span className={theme === "dark" ? "active" : ""}>Dark</span>
        </button>
      </header>

      <section className="intro" aria-labelledby="intro-title">
        <SignalName />
        <div className="intro-grid intro-enter">
          <div className="intro-copy">
            <p id="intro-title">Full-stack software engineer.</p>
            <p>Building AI products at <mark>Zyvka</mark></p>
            <small>v4.0 / 2026</small>
          </div>
          <aside>
            <nav aria-label="Site">
              <a href="#about" aria-label="About"><span data-label="About">About</span></a>
              <a href="#projects" aria-label="Projects"><span data-label="Projects">Projects</span></a>
              <a href="#experience" aria-label="Experience"><span data-label="Experience">Experience</span></a>
            </nav>
            <p>Sirsa, Haryana</p>
            <time>{time || "--:--:--"} IST</time>
            <span className="system-health"><i />systems nominal</span>
          </aside>
        </div>
        <div className="now-panel intro-enter">
          <div className="now-entry"><span>NOW / 01</span><p>Making AI systems survive the real world.</p><em><i />open to useful problems</em></div>
          <p className="find-line">Elsewhere: <a href="https://github.com/brarkhushpreet/" target="_blank" rel="noreferrer">GitHub</a> · <button onClick={copyEmail}>email</button> · <a href="/Khushpreet_Singh_Resume.pdf" download>résumé ↓</a></p>
        </div>
      </section>

      <section className="about reveal" id="about">
        <header className="section-head"><p><span>PROFILE / 01</span>About the work</p><small>built end to end</small></header>
        <div className="about-copy">
          <p>I like the whole thing — the interface people touch, the service behind it, and the infrastructure that keeps it alive.</p>
          <p>My best work sits between product thinking and systems engineering: clear enough for a person, sturdy enough for production.</p>
        </div>
        <div className="capability-list">
          {capabilities.map(([number, title, copy]) => (
            <article key={number} data-surface>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="projects reveal" id="projects" aria-label="Projects">
        <header className="section-head"><p><span>INDEX / 04</span>Selected systems</p><small>open a project ↓</small></header>
        <div className="project-list">
          {projects.map((project, index) => (
            <ProjectEntry
              key={project.id}
              project={project}
              index={index}
              open={activeProject === index}
              onToggle={() => setActiveProject(activeProject === index ? null : index)}
            />
          ))}
        </div>
      </section>

      <section className="experience reveal" id="experience">
        <header className="section-head"><p><span>PATH / 03</span>Experience</p><small>work in motion</small></header>
        <div className="experience-list">
          {experience.map((item) => (
            <article key={item.date} data-surface>
              <time>{item.date}</time>
              <div><h3>{item.role}</h3><p>{item.company}</p><span>{item.copy}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="toolbox reveal">
        <header className="section-head"><p><span>STACK / 04</span>Working set</p><small>tools change, principles don’t</small></header>
        <div className="tool-lines">
          <p data-surface><span>interface</span>Next.js · React · TypeScript · CSS · GSAP</p>
          <p data-surface><span>server</span>Node.js · Express · Python · WebSockets</p>
          <p data-surface><span>data</span>PostgreSQL · Prisma · Redis · BullMQ</p>
          <p data-surface><span>delivery</span>AWS · EC2 · RDS · S3 · PM2 · GitHub Actions</p>
        </div>
      </section>

      <section className="contact reveal" id="contact">
        <div>
          <i />
          <p>Available for thoughtful engineering work.</p>
        </div>
        <h2>Have a useful problem<br />worth solving?</h2>
        <div className="contact-links">
          <a className="motion-link" data-magnetic href="mailto:khushbrar@gmail.com"><span className="magnetic-content">Let’s talk <ArrowUpRight size={17} /></span></a>
          <button type="button" className={copied ? "is-copied" : ""} onClick={copyEmail}><span key={copied ? "copied" : "copy"} className="copy-icon">{copied ? <Check size={14} /> : <Copy size={14} />}</span>{copied ? "copied" : "copy email"}</button>
        </div>
      </section>

      <footer>
        <span>made by hand in Punjab · © {new Date().getFullYear()}</span>
        <div><a href="https://github.com/brarkhushpreet/" target="_blank" rel="noreferrer">GitHub</a><a href="#top">back to top ↑</a></div>
      </footer>

      <div className={`copy-toast ${copied || copyFailed ? "show" : ""}`} role="status">{copied ? <><Check size={14} />Email copied to clipboard</> : copyFailed ? "Copy unavailable — khushbrar@gmail.com" : ""}</div>
    </main>
  );
}
