"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, MoveHorizontal, Pause, Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSurfaceMotion } from "./use-surface-motion";
import { ContactForm } from "./contact-form";
import { GalleryMotion } from "./gallery-motion";
import { OpeningLoader } from "./opening-loader";
import { projectStories, type PreviewId } from "./project-stories";
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
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
} from "react";

type Project = {
  id: PreviewId;
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
  screenshots: { src: string; video?: string; alt: string; label: string; format?: "desktop" | "mobile" }[];
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
      { src: "/projects/echopass-theme-motion.webp", video: "/projects/echopass-theme-motion.mp4", alt: "Switching the EchoPass teacher workspace from light to dark mode", label: "Light → dark" },
      { src: "/projects/echopass-classrooms-dark.jpg", alt: "EchoPass classroom directory and attendance summaries in dark mode", label: "Classroom directory · dark" },
      { src: "/projects/echopass-filter-motion.webp", video: "/projects/echopass-filter-motion.mp4", alt: "Filtering EchoPass attendance by verification method", label: "Filter attendance" },
      { src: "/projects/echopass-method-motion.webp", video: "/projects/echopass-method-motion.mp4", alt: "Switching between location and ultrasound classroom controls", label: "Choose a presence check" },
      { src: "/projects/echopass-current-mobile-light.jpg", alt: "Updated EchoPass teacher dashboard on mobile in light mode", label: "Mobile · light", format: "mobile" },
      { src: "/projects/echopass-classrooms-mobile.jpg", alt: "EchoPass classroom directory on a phone in dark mode", label: "Mobile classrooms · dark", format: "mobile" },
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
      { src: "/projects/chat-theme-motion.webp", video: "/projects/chat-theme-motion.mp4", alt: "Switching the Nexus conversation workspace from light to dark mode", label: "Light → dark" },
      { src: "/projects/chat-people-dark.jpg", alt: "Nexus people directory in dark mode with fictional demo members", label: "People directory · dark" },
      { src: "/projects/chat-compose-motion.webp", video: "/projects/chat-compose-motion.mp4", alt: "Composing a draft in the updated Nexus light workspace", label: "Compose in context" },
      { src: "/projects/chat-search-motion.webp", video: "/projects/chat-search-motion.mp4", alt: "Searching rooms in Nexus’s dark-mode command palette", label: "Quick navigation" },
      { src: "/projects/chat-current-mobile-light.jpg", alt: "Updated Nexus conversation on mobile in light mode", label: "Mobile · light", format: "mobile" },
      { src: "/projects/chat-navigation-mobile.jpg", alt: "Nexus mobile navigation showing rooms and direct messages in dark mode", label: "Mobile navigation · dark", format: "mobile" },
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
      { src: "/projects/movie-discover-motion.webp", video: "/projects/movie-discover-motion.mp4", alt: "Opening Inception from Vanta’s discovery screen", label: "Discover a title" },
      { src: "/projects/movie-save-motion.webp", video: "/projects/movie-save-motion.mp4", alt: "Saving Inception and opening My List in Vanta", label: "Save to My List" },
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
      { src: "/projects/blog-filter-motion.webp", video: "/projects/blog-filter-motion.mp4", alt: "Filtering the developer blog archive by React", label: "Filter the archive" },
      { src: "/projects/blog-read-motion.webp", video: "/projects/blog-read-motion.mp4", alt: "Opening a React article from the filtered archive", label: "Open an article" },
      { src: "/projects/blog-about.png", alt: "Developer blog about page", label: "About the publication" },
      { src: "/projects/blog-search.png", alt: "Developer blog search results for WebSocket articles", label: "Search and filters" },
      { src: "/projects/blog-mobile.png", alt: "Developer blog home page on a mobile viewport", label: "Responsive reading", format: "mobile" },
    ],
  },
];

const experience = [
  {
    date: "Jun 2026 — Present",
    role: "Software Development Engineer II",
    company: "Zyvka HR Tech",
    copy: "Building and operating AI products across interfaces, backend services, realtime systems, and AWS infrastructure.",
  },
  {
    date: "May 2025 — May 2026",
    role: "Software Development Engineer I",
    company: "Zyvka HR Tech",
    copy: "Developed product features, APIs, and realtime workers, with responsibility for deployments and production reliability.",
  },
  {
    date: "Jul 2024 — Apr 2025",
    role: "Software Development Engineer Intern",
    company: "Zyvka HR Tech",
    copy: "Contributed to a platform migration, realtime product features, and deployment workflows.",
  },
];

function SignalName() {
  const field = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const thumb = useRef<HTMLButtonElement>(null);
  const dragging = useRef(false);
  const value = useRef(50);
  const animationFrame = useRef<number | null>(null);
  const spotlightFrame = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  const applyValue = (nextValue: number) => {
    const next = Math.max(0, Math.min(100, nextValue));
    value.current = next;
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
      animationFrame.current = null;
    });
  };

  const updateFromPointer = (clientX: number) => {
    if (!rail.current) return;
    const bounds = rail.current.getBoundingClientRect();
    applyValue(((clientX - bounds.left) / bounds.width) * 100);
  };

  const start = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragging.current = true;
    thumb.current?.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    field.current?.classList.add("is-dragging");
    updateFromPointer(event.clientX);
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromPointer(event.clientX);
  };

  const end = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    updateFromPointer(event.clientX);
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
      applyValue(value.current);
      if (preference.matches) clearSpotlight();
    };
    syncMotion();
    preference.addEventListener("change", syncMotion);
    applyValue(50);
    return () => {
      if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
      if (spotlightFrame.current !== null) window.cancelAnimationFrame(spotlightFrame.current);
      preference.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <div className="signal-name" ref={field} onPointerMove={moveSpotlight} onPointerLeave={clearSpotlight}>
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
          <button ref={thumb} className="signal-thumb" type="button" role="slider" aria-label="Adjust letter tilt" aria-describedby="signal-hint" aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} onKeyDown={keyboardMove} />
        </span>
        <small id="signal-hint">Drag to tilt</small>
      </div>
    </div>
  );
}

function ProjectSlider({ project, open }: { project: Project; open: boolean }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const imageDialog = useRef<HTMLDialogElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const hasMotion = project.screenshots.some((shot) => shot.video);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionEnabled(!preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

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
        <span>Project gallery</span>
        <span><MoveHorizontal size={12} /> Swipe or drag</span>
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
                  {screenshot.video ? <GalleryMotion src={screenshot.video} poster={screenshot.src} label={screenshot.alt} enabled={open && motionEnabled && !enlarged} /> : <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={screenshot.format === "mobile" ? 390 : 1264}
                    height={screenshot.format === "mobile" ? 844 : 720}
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />}
                  {screenshot.video && <span className="case-motion-badge">Motion</span>}
                  {index === current && <button className="case-image-expand" type="button" aria-label={`Enlarge ${screenshot.label}`} onClick={() => { setEnlarged(true); imageDialog.current?.showModal(); }}><Expand size={16} /></button>}
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
            {hasMotion && <button type="button" className="gallery-motion-toggle" aria-label={motionEnabled ? "Pause gallery motion" : "Play gallery motion"} aria-pressed={motionEnabled} onClick={() => setMotionEnabled((enabled) => !enabled)}>{motionEnabled ? <Pause size={14} /> : <Play size={14} />}</button>}
            <CarouselPrevious aria-label="Previous screenshot"><ArrowLeft size={14} /><span>Prev</span></CarouselPrevious>
            <CarouselNext aria-label="Next screenshot"><span>Next</span><ArrowRight size={14} /></CarouselNext>
          </div>
        </div>
      </Carousel>
      <p className="case-caption-detail" key={active.src}>{projectStories[project.id].captions[current]}</p>
      <dialog className="image-viewer" ref={imageDialog} aria-label={active.label} onClose={() => setEnlarged(false)} onClick={(event) => { if (event.target === event.currentTarget) imageDialog.current?.close(); }}>
        <div className="image-viewer-head"><p>{active.label}</p><button type="button" className="case-close" aria-label="Close enlarged screenshot" onClick={() => imageDialog.current?.close()}><span aria-hidden="true">×</span></button></div>
        {active.video ? <GalleryMotion src={active.video} poster={active.src} label={active.alt} enabled={enlarged && motionEnabled} controls /> : <img src={active.src} alt={active.alt} width={active.format === "mobile" ? 390 : 1264} height={active.format === "mobile" ? 844 : 720} />}
      </dialog>
    </div>
  );
}

function ProjectShowcase({ project, open }: { project: Project; open: boolean }) {
  const story = projectStories[project.id];
  return (
    <div className="project-showcase">
      <div className="showcase-intro"><h4>{story.title}</h4><p>{story.summary}</p></div>
      <ProjectSlider project={project} open={open} />
      <div className="case-engineering"><div><h4>What I built</h4><p>{story.built}</p></div><div><h4>Behind the interface</h4><p>{story.decision}</p></div></div>
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

      target.scrollIntoView({ block: "start", behavior: "instant" });
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
    <article className={`project-item ${index === 0 ? "project-item--featured" : ""} ${open ? "is-open" : ""}`}>
      <button ref={trigger} type="button" className="project-trigger" data-surface onClick={onToggle} aria-expanded={open} aria-controls={`${project.id}-detail`}>
        <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="project-thumbnail">
          <img src={index === 0 ? "/projects/echopass-current-dark.jpg" : project.screenshots[0].src} alt="" width={1264} height={720} loading="lazy" />
          {index === 0 && <span className="project-cover-label">Featured project</span>}
        </span>
        <span className="project-summary">
          <span className="project-title">{project.shortTitle}</span>
          <span className="project-subtitle">{project.subtitle}</span>
          <span className="project-preview-meta">{project.discipline}<span>Explore project</span></span>
        </span>
        <span className="project-arrow" aria-hidden="true">↗</span>
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
          <ProjectShowcase project={project} open={open} />
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
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [time, setTime] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [introReady, setIntroReady] = useState(false);
  const finishLoading = useCallback(() => setIntroReady(true), []);

  useLayoutEffect(() => {
    const main = root.current;
    if (introReady || !main) return;
    const previousOverflow = document.documentElement.style.overflow;
    main.inert = true;
    document.documentElement.style.overflow = "hidden";
    return () => {
      main.inert = false;
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [introReady]);

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
      if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
      root.current?.querySelector<HTMLButtonElement>(".project-item.is-open > .project-trigger")?.focus({ preventScroll: true });
      setActiveProject(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useLayoutEffect(() => {
    if (!introReady) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let entered = false;
    media.add({ reduced: "(prefers-reduced-motion: reduce)", animated: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (context.conditions?.reduced) {
        entered = true;
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (!entered) {
        gsap.set(".intro-enter", { opacity: 0, y: 12 });
        gsap.set(".signal-glyph", { opacity: 0, yPercent: 65, rotation: 5 });
        intro
        .to(".signal-glyph", { opacity: 1, yPercent: 0, rotation: 0, stagger: .028, duration: .85, clearProps: "transform,opacity" }, .08)
        .fromTo(".signal-axis", { scaleX: 0 }, { scaleX: 1, duration: .8, clearProps: "transform" }, "<+.1")
        .to(".intro-enter", { opacity: 1, y: 0, stagger: .065, duration: .6, clearProps: "transform,opacity" }, "<+.08");
        entered = true;
      }

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        const rows = element.querySelectorAll(".capability-list > article, .project-item, .experience-list > article, .tool-lines > p");
        const timeline = gsap.timeline({ scrollTrigger: { trigger: element, start: "top 91%", once: true } });
        timeline.fromTo(element, { "--rule-scale": 0 }, { "--rule-scale": 1, duration: 1, ease: "power3.inOut" }, 0);
        timeline.fromTo(element.querySelectorAll(":scope > .section-head, :scope > .about-copy, :scope.contact > .contact-heading, :scope.contact > .contact-form"),
          { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .085, duration: .7, ease: "power3.out", clearProps: "transform,opacity" }, .08);
        if (rows.length) timeline.fromTo(rows, { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: .065, duration: .6, ease: "power3.out", clearProps: "transform,opacity" }, .16);
      });

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
    };
  }, [introReady]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try { window.localStorage.setItem("portfolio-theme", next); } catch { /* Theme still works for the current visit. */ }
  };

  return (
    <>
    {!introReady && <OpeningLoader onComplete={finishLoading} />}
    <noscript><style>{`.opening-loader { display: none !important; } .is-loading .utility-bar, .is-loading .intro-enter, .is-loading .signal-glyph, .is-loading .signal-axis { visibility: visible; }`}</style></noscript>
    <main className={`shell${introReady ? "" : " is-loading"}`} id="top" ref={root}>
      <header className="utility-bar">
        <a href="#top" className="brand-mark" aria-label="Khushpreet Singh — back to top"><strong>KS<span aria-hidden="true">.</span></strong></a>
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
            <p>SDE II at <mark>Zyvka</mark></p>
            <a className="explore-work motion-link" href="#projects">Explore my work <span aria-hidden="true">↓</span></a>
          </div>
          <aside>
            <nav aria-label="Site">
              <a href="#projects" aria-label="Projects"><span data-label="Projects">Projects</span></a>
              <a href="#experience" aria-label="Experience"><span data-label="Experience">Experience</span></a>
              <a href="#about" aria-label="About"><span data-label="About">About</span></a>
            </nav>
            <p>Sirsa, Haryana</p>
            <time>{time || "--:--:--"} IST</time>
          </aside>
        </div>
        <div className="now-panel intro-enter">
          <div className="now-entry"><span>Focus</span><p>AI products, realtime systems, and cloud infrastructure.</p></div>
          <p className="find-line"><a href="https://github.com/brarkhushpreet/" target="_blank" rel="noreferrer">GitHub</a> · <a href="#contact">Contact</a> · <a href="/Khushpreet_Singh_Resume.pdf" download>Résumé ↓</a></p>
        </div>
      </section>

      <section className="projects reveal" id="projects" aria-label="Projects">
        <header className="section-head"><h2>Selected projects</h2><span className="section-note">From interface to infrastructure</span></header>
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
        <header className="section-head"><h2>Experience</h2></header>
        <div className="experience-company"><h3>Zyvka HR Tech</h3><p>Building and operating AI products across interfaces, services, realtime systems, and AWS infrastructure.</p></div>
        <div className="experience-list experience-progression">
          {experience.map((item) => (
            <article key={item.date} data-surface>
              <time>{item.date}</time>
              <div><h3>{item.role}</h3></div>
            </article>
          ))}
        </div>
      </section>

      <section className="about reveal" id="about">
        <header className="section-head"><h2>About the way I work</h2></header>
        <div className="about-copy">
          <p>I like the whole thing — the interface people touch, the service behind it, and the infrastructure that keeps it alive.</p>
          <p>My best work sits between product thinking and systems engineering: clear enough for a person, sturdy enough for production.</p>
        </div>
        <div className="working-stack"><span>Tools I work with</span><p>React · Next.js · TypeScript · Node.js · Python · PostgreSQL · Redis · AWS</p></div>
      </section>

      <section className="contact reveal" id="contact" aria-labelledby="contact-title">
        <div className="contact-heading">
          <h2 id="contact-title">Get in touch<span>.</span></h2>
          <p>Have a question or an idea to share? Send me a message.</p>
        </div>
        <ContactForm />
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Khushpreet Singh</span>
        <div><a href="https://github.com/brarkhushpreet/" target="_blank" rel="noreferrer">GitHub</a><a href="#top">Back to top ↑</a></div>
      </footer>

    </main>
    </>
  );
}
