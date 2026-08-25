"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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
  private?: boolean;
  visual: "agent" | "voice" | "sonar" | "chat" | "movie" | "blog";
};

const projects: Project[] = [
  {
    id: "zyastra",
    title: "Zyastra Agent Platform",
    shortTitle: "Zyastra",
    subtitle: "AI agents, from dashboard to deployment",
    year: "2025—Now",
    status: "In production",
    discipline: "Full-stack · AI · Cloud",
    description:
      "A production AI-agent platform spanning a Next.js product surface, Express APIs, PostgreSQL, background workers, secure embeds, and AWS releases.",
    story:
      "I work across the whole system: shaping complex operator interfaces, designing APIs and data flows, orchestrating long-running jobs, and making releases repeatable. The result is software that feels considered on screen and remains dependable after it leaves the browser.",
    highlights: ["73% faster key workflows", "30% lower API latency", "40% fewer release issues"],
    stack: ["Next.js", "Express", "Prisma", "PostgreSQL", "BullMQ", "Redis", "AWS"],
    link: "https://zyvka.com/Zy-VMS",
    linkLabel: "View product ecosystem",
    private: true,
    visual: "agent",
  },
  {
    id: "astrasar",
    title: "AstraSAR Voice Runtime",
    shortTitle: "AstraSAR",
    subtitle: "Realtime voice infrastructure at production scale",
    year: "2025—Now",
    status: "In production",
    discipline: "Realtime AI · Backend",
    description:
      "A voice-agent runtime joining telephony, LiveKit, Sarvam, Node.js, and Python across multiple production servers.",
    story:
      "The runtime coordinates calls, streaming audio, AI responses, and worker lifecycles without losing the conversational beat. I built deployment automation and PM2 process topology across four runtimes, giving the team sixteen concurrent voice workers with a predictable release path.",
    highlights: ["16 concurrent workers", "4 isolated runtimes", "Automated multi-server delivery"],
    stack: ["Node.js", "Python", "LiveKit", "WebSockets", "PM2", "GitHub Actions"],
    link: "https://zyvka.com/Zy-VMS",
    linkLabel: "View product ecosystem",
    private: true,
    visual: "voice",
  },
  {
    id: "echopass",
    title: "EchoPass / AMS",
    shortTitle: "EchoPass",
    subtitle: "Attendance verified through ultrasonic presence",
    year: "2025",
    status: "Capstone",
    discipline: "Product · Audio systems",
    description:
      "A proof-of-presence attendance system that generates randomized ultrasonic tokens and verifies them through realtime browser audio analysis.",
    story:
      "EchoPass turns the room itself into a temporary credential. A teacher broadcasts a short-lived inaudible signature, student devices analyse the signal locally, and the platform validates time, session, and identity before recording attendance.",
    highlights: ["Short-lived audio tokens", "Browser-side signal analysis", "Role-based session control"],
    stack: ["Next.js", "Web Audio", "PostgreSQL", "NextAuth"],
    link: "https://github.com/brarkhushpreet/AMS",
    linkLabel: "View repository",
    visual: "sonar",
  },
  {
    id: "chat",
    title: "Realtime Chat",
    shortTitle: "Realtime Chat",
    subtitle: "Fast conversations with persistent context",
    year: "2024",
    status: "Shipped",
    discipline: "Realtime product",
    description:
      "A high-concurrency messaging application with bidirectional events, secure sessions, persistent conversations, and optimized database access.",
    story:
      "Designed as a full product rather than a Socket.IO demo: authenticated rooms, resilient message history, responsive layouts, presence state, and a backend data model built for fast conversation retrieval.",
    highlights: ["Bidirectional events", "Persistent history", "Secure authenticated rooms"],
    stack: ["Next.js", "Socket.IO", "PostgreSQL", "Prisma"],
    link: "https://github.com/brarkhushpreet/Chat-Application-nextjs",
    linkLabel: "View repository",
    visual: "chat",
  },
  {
    id: "movies",
    title: "Movie Explorer",
    shortTitle: "Movie Explorer",
    subtitle: "Discovery shaped by data and AI",
    year: "2024",
    status: "Live",
    discipline: "Discovery · AI",
    description:
      "A responsive movie-discovery product combining TMDB data with Gemini-powered recommendations and a fast browsing experience.",
    story:
      "The interface makes a large catalogue feel calm: visual browsing, useful details, quick search, and AI-assisted suggestions that help people move from an idea to something worth watching.",
    highlights: ["Live TMDB catalogue", "AI recommendations", "Responsive discovery flows"],
    stack: ["Next.js", "TMDB", "Gemini AI", "Tailwind CSS"],
    link: "https://movie-website-gules.vercel.app",
    linkLabel: "Visit live site",
    visual: "movie",
  },
  {
    id: "blog",
    title: "Developer Blog",
    shortTitle: "Developer Blog",
    subtitle: "A focused place for technical notes",
    year: "2024",
    status: "Archive",
    discipline: "Publishing",
    description:
      "A minimal publishing experience for technical notes, experiments, and lessons gathered while building real products.",
    story:
      "Built to keep the reading experience ahead of the interface. The content system, responsive rhythm, and small details make it easy to publish and comfortable to spend time with.",
    highlights: ["Content-first layout", "Responsive typography", "Simple publishing workflow"],
    stack: ["JavaScript", "Content", "Responsive UI"],
    link: "https://github.com/brarkhushpreet/blog",
    linkLabel: "View repository",
    visual: "blog",
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
    copy: "Building and operating AI products across frontend, backend, realtime workers, databases, and AWS infrastructure.",
  },
  {
    date: "Jul 2024 — Apr 2025",
    role: "Software Development Engineer Intern",
    company: "Zyvka HR Tech",
    copy: "Migrated a legacy product to React 19, shipped realtime chat, and automated production deployment workflows.",
  },
  {
    date: "Jun 2023 — Jul 2023",
    role: "Summer Internship Trainee",
    company: "Solitaire Infosys",
    copy: "Built a practical MERN foundation through full-stack applications and API-driven product work.",
  },
];

function NamePlate() {
  const plate = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const [dragging, setDragging] = useState(false);
  const [measure, setMeasure] = useState("534 × 96");

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging || !plate.current) return;
    const dx = event.clientX - dragStart.current.px;
    const dy = event.clientY - dragStart.current.py;
    const x = Math.max(-14, Math.min(14, dragStart.current.x + dx * 0.085));
    const y = Math.max(-10, Math.min(10, dragStart.current.y + dy * 0.07));
    const stretch = Math.max(0.92, Math.min(1.08, 1 + dx * 0.0008));
    plate.current.style.setProperty("--warp-x", `${x}deg`);
    plate.current.style.setProperty("--warp-y", `${y}px`);
    plate.current.style.setProperty("--stretch", String(stretch));
    plate.current.dataset.x = String(x);
    plate.current.dataset.y = String(y);
    plate.current.dataset.stretch = String(stretch);
    setMeasure(`${Math.round(534 * stretch)} × ${Math.round(96 + Math.abs(y))}`);
  };

  const start = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    dragStart.current = {
      x: Number(plate.current?.dataset.x ?? 0),
      y: Number(plate.current?.dataset.y ?? 0),
      px: event.clientX,
      py: event.clientY,
    };
  };

  const end = () => setDragging(false);

  const reset = () => {
    if (!plate.current) return;
    plate.current.style.setProperty("--warp-x", "0deg");
    plate.current.style.setProperty("--warp-y", "0px");
    plate.current.style.setProperty("--stretch", "1");
    plate.current.dataset.x = "0";
    plate.current.dataset.y = "0";
    plate.current.dataset.stretch = "1";
    setMeasure("534 × 96");
  };

  return (
    <div className="name-plate" ref={plate} onDoubleClick={reset}>
      <h1 aria-label="Khushpreet Singh">
        <span className="name-line">khushpreet</span>
        <span className="name-line">singh</span>
      </h1>
      <span className="plate-hint">drag the points · double-click to reset</span>
      <span className="plate-measure">{measure}</span>
      {["a", "b", "c", "d"].map((handle) => (
        <button
          key={handle}
          className={`plate-handle handle-${handle}`}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          aria-label="Drag to reshape the name"
        />
      ))}
    </div>
  );
}

function ProjectVisual({ variant, title }: { variant: Project["visual"]; title: string }) {
  return (
    <div className={`project-visual visual-${variant}`} aria-label={`${title} system illustration`} role="img">
      <div className="visual-chrome"><span /><span>{title}</span><span>live</span></div>
      {variant === "agent" && (
        <div className="agent-board">
          <div className="agent-main"><span>agent / outbound-04</span><strong>Planning the next best action</strong><i /></div>
          <div className="agent-rail">
            {[["calls", "148"], ["queue", "06"], ["success", "92%"]].map(([label, value]) => <p key={label}><span>{label}</span><strong>{value}</strong></p>)}
          </div>
          <div className="agent-flow"><i /><i /><i /><i /><i /></div>
        </div>
      )}
      {variant === "voice" && (
        <div className="voice-board">
          <div className="waveform">{Array.from({ length: 34 }).map((_, index) => <i key={index} style={{ "--bar": `${22 + ((index * 37) % 70)}%` } as React.CSSProperties} />)}</div>
          <div className="voice-meta"><span>caller connected</span><strong>00:02:18</strong><span>latency 184ms</span></div>
          <div className="worker-grid">{Array.from({ length: 16 }).map((_, index) => <i key={index} className={index < 11 ? "busy" : ""}>{String(index + 1).padStart(2, "0")}</i>)}</div>
        </div>
      )}
      {variant === "sonar" && (
        <div className="sonar-board">
          <div className="sonar-ring"><i /><i /><i /><i /></div>
          <div className="sonar-readout"><span>19.2 kHz</span><strong>PRESENCE VERIFIED</strong><span>token expires / 00:08</span></div>
        </div>
      )}
      {variant === "chat" && (
        <div className="chat-board">
          <div className="contact-list">{["KS", "AR", "DS", "MK"].map((name, index) => <p key={name} className={index === 0 ? "selected" : ""}><i>{name}</i><span>conversation {index + 1}</span></p>)}</div>
          <div className="conversation"><span>Shipped the new worker flow.</span><span>Nice — checking the deployment now.</span><span>Production is healthy ✓</span></div>
        </div>
      )}
      {variant === "movie" && (
        <div className="movie-board">
          <p><small>Recommended tonight</small><strong>Find something<br />worth watching.</strong></p>
          <div className="poster-stack"><i>01</i><i>02</i><i>03</i></div>
          <span className="movie-score">AI MATCH · 94%</span>
        </div>
      )}
      {variant === "blog" && (
        <div className="blog-board">
          <small>FIELD NOTES / 04</small>
          <h4>Building systems<br />that keep their promises.</h4>
          <div>{Array.from({ length: 7 }).map((_, index) => <i key={index} />)}</div>
          <span>8 MIN READ →</span>
        </div>
      )}
    </div>
  );
}

function ProjectEntry({ project, open, onToggle }: { project: Project; open: boolean; onToggle: () => void }) {
  return (
    <article className={`project-item ${open ? "is-open" : ""}`}>
      <button className="project-trigger" onClick={onToggle} aria-expanded={open} aria-controls={`${project.id}-detail`}>
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
          <ProjectVisual variant={project.visual} title={project.shortTitle} />
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
          {project.private && <p className="private-note">Selected details only — production company work.</p>}
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
    const next = stored === "dark" ? "dark" : "light";
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
      gsap.set(".name-line", { yPercent: 115 });
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
        .to(".name-line", { yPercent: 0, stagger: 0.07, duration: 0.72 }, "-=.25")
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

      <section className="intro" aria-labelledby="intro-title">
        <NamePlate />
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
            <p>Punjab, India</p>
            <time>{time || "--:--:--"} IST</time>
            <button className="mode-button" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? "ink mode" : "paper mode"}
            </button>
          </aside>
        </div>
        <div className="presence intro-enter">
          <p><i />Currently: making AI systems survive the real world.</p>
          <p>Find me on <a href="https://github.com/brarkhushpreet/" target="_blank" rel="noreferrer">GitHub</a>, <button onClick={copyEmail}>email me</button>, or <a href="/Khushpreet_Singh_Resume.pdf" download>download my résumé ↓</a></p>
        </div>
      </section>

      <section className="about reveal" id="about">
        <p className="section-label"><span>⌁</span>About</p>
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
        <header className="section-head"><p><span aria-hidden="true">📁</span>Selected projects</p><small>click to open · esc to close</small></header>
        <div className="project-list">
          {projects.map((project, index) => (
            <ProjectEntry
              key={project.id}
              project={project}
              open={activeProject === index}
              onToggle={() => setActiveProject(activeProject === index ? null : index)}
            />
          ))}
        </div>
      </section>

      <section className="experience reveal" id="experience">
        <header className="section-head"><p><span aria-hidden="true">🗂️</span>Experience</p><small>the path so far</small></header>
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
        <header className="section-head"><p><span aria-hidden="true">🧰</span>Working set</p><small>tools change, principles don’t</small></header>
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
