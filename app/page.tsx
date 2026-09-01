"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, MoveHorizontal } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
        character.style.setProperty("--char-rotation", `${rotation}deg`);
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
    dragging.current = true;
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
    if ((event.target as HTMLElement).closest(".signal-field")) return;
    field.current?.querySelectorAll<HTMLElement>(".signal-char").forEach((character) => {
      const bounds = character.getBoundingClientRect();
      character.style.setProperty("--char-spot-x", `${event.clientX - bounds.left}px`);
      character.style.setProperty("--char-spot-y", `${event.clientY - bounds.top}px`);
    });
  };

  const clearSpotlight = () => {
    field.current?.querySelectorAll<HTMLElement>(".signal-char").forEach((character) => {
      character.style.setProperty("--char-spot-x", "-999px");
      character.style.setProperty("--char-spot-y", "-999px");
    });
  };

  useLayoutEffect(() => {
    applyValue(50, 50);
    return () => {
      if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <div className="signal-name" ref={field} onPointerMove={moveSpotlight} onPointerLeave={clearSpotlight}>
      <span className="signal-kicker">KS / BUILD 04 · DRAG + RELEASE</span>
      <div className="signal-title-wrap">
        <h1 className="signal-title-base" aria-label="Khushpreet Singh">
          <span className="signal-word signal-word-primary">
            {Array.from("khushpreet").map((character, index) => <span className="signal-char" key={`${character}-${index}`}>{character}</span>)}
          </span>
          <span className="signal-word signal-word-secondary">
            {Array.from("singh").map((character, index) => <span className="signal-char" key={`${character}-${index}`}>{character}</span>)}
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

  const active = project.screenshots[current] ?? project.screenshots[0];

  return (
    <div className="case-slider">
      <div className="case-slider-bar">
        <span>Screen archive</span>
        <span><MoveHorizontal size={12} /> drag / swipe</span>
        <span>{String(current + 1).padStart(2, "0")} / {String(project.screenshots.length).padStart(2, "0")}</span>
      </div>
      <Carousel
        className="case-carousel"
        opts={{ loop: false, align: "start", containScroll: "trimSnaps", duration: 30 }}
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
            <p>{active.label}</p>
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
  return (
    <article className={`project-item ${open ? "is-open" : ""}`}>
      <button className="project-trigger" onClick={onToggle} aria-expanded={open} aria-controls={`${project.id}-detail`}>
        <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="project-title">{project.shortTitle}</span>
        <span className="project-subtitle">{project.subtitle}</span>
        <span className="project-arrow" aria-hidden="true">↗</span>
        <time>{project.year}</time>
      </button>
      <div className="project-reveal" id={`${project.id}-detail`}>
        <div className="project-reveal-inner">
          <div className="case-head">
            <h3>{project.title}</h3>
            <button onClick={onToggle} type="button">close <span>×</span></button>
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
            <a href={project.link} target="_blank" rel="noreferrer">{project.linkLabel} <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const loaderCount = useRef<HTMLSpanElement>(null);
  const [activeProject, setActiveProject] = useState<number | null>(0);
  const [time, setTime] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-theme");
    const next = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    // Theme preferences are browser-only and must be synchronized after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setActiveProject(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reduced) {
        gsap.set(".site-loader", { display: "none" });
        gsap.set(".intro-enter, .reveal", { opacity: 1, y: 0 });
        return;
      }

      document.body.classList.add("is-loading");
      const counter = { value: 0 };
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => document.body.classList.remove("is-loading"),
      });
      gsap.set(".intro-enter", { opacity: 0, y: 16 });
      gsap.set(".signal-title-base", { opacity: 0, y: 24 });
      intro
        .to(counter, {
          value: 100,
          duration: 1.15,
          ease: "power2.inOut",
          onUpdate: () => {
            if (loaderCount.current) loaderCount.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        })
        .to(".loader-track i", { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 0)
        .to(".loader-pip", { opacity: 1, stagger: 0.08, duration: 0.15 }, 0.1)
        .to(".site-loader", { yPercent: -100, duration: 0.72, ease: "power4.inOut" }, ">+.08")
        .to(".signal-title-base", { opacity: 1, y: 0, duration: 0.72, clearProps: "transform,opacity" }, "-=.25")
        .to(".intro-enter", { opacity: 1, y: 0, stagger: 0.07, duration: 0.52 }, "-=.52");

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 22 }, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
    }, root);
    return () => context.revert();
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("khushbrar@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
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
        <button className="theme-switch" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
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
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <a href="#experience">Experience</a>
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
            <article key={number}>
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
            <article key={item.date}>
              <time>{item.date}</time>
              <div><h3>{item.role}</h3><p>{item.company}</p><span>{item.copy}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="toolbox reveal">
        <header className="section-head"><p><span>STACK / 04</span>Working set</p><small>tools change, principles don’t</small></header>
        <div className="tool-lines">
          <p><span>interface</span>Next.js · React · TypeScript · CSS · GSAP</p>
          <p><span>server</span>Node.js · Express · Python · WebSockets</p>
          <p><span>data</span>PostgreSQL · Prisma · Redis · BullMQ</p>
          <p><span>delivery</span>AWS · EC2 · RDS · S3 · PM2 · GitHub Actions</p>
        </div>
      </section>

      <section className="contact reveal" id="contact">
        <div>
          <i />
          <p>Available for thoughtful engineering work.</p>
        </div>
        <h2>Have a useful problem<br />worth solving?</h2>
        <div className="contact-links">
          <a href="mailto:khushbrar@gmail.com">Let’s talk <ArrowUpRight size={17} /></a>
          <button onClick={copyEmail}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "copied" : "copy email"}</button>
        </div>
      </section>

      <footer>
        <span>made by hand in Punjab · © {new Date().getFullYear()}</span>
        <div><a href="https://github.com/brarkhushpreet/" target="_blank" rel="noreferrer">GitHub</a><a href="#top">back to top ↑</a></div>
      </footer>

      <div className={`copy-toast ${copied ? "show" : ""}`} role="status">email copied to clipboard</div>
    </main>
  );
}
