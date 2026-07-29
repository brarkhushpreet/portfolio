"use client";

import {
  ArrowDown,
  ArrowUpRight,
  Cloud,
  Code2,
  Download,
  GitBranch,
  Mail,
  Moon,
  ServerCog,
  Sparkles,
  Sun,
  Workflow,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Project = {
  index: string;
  title: string;
  type: string;
  year: string;
  description: string;
  stack: string[];
  link: string;
  linkLabel: string;
  confidential?: boolean;
};

const projects: Project[] = [
  {
    index: "01",
    title: "Zyastra Agent Platform",
    type: "AI product / full-stack / infrastructure",
    year: "2025—Now",
    description:
      "A production AI-agent platform spanning a Next.js product surface, Express APIs, Prisma/PostgreSQL, Redis queues, S3, secure embeds, and automated AWS releases.",
    stack: ["Next.js", "Express", "Prisma", "BullMQ", "Redis", "AWS"],
    link: "https://zyvka.com/Zy-VMS",
    linkLabel: "View ecosystem",
    confidential: true,
  },
  {
    index: "02",
    title: "AstraSAR Voice Runtime",
    type: "Realtime AI / backend / deployment",
    year: "2025—Now",
    description:
      "A realtime voice-agent runtime joining telephony, LiveKit, Sarvam, Node.js and Python, deployed as a multi-worker production system with repeatable CI/CD.",
    stack: ["Node.js", "Python", "LiveKit", "WebSockets", "PM2", "CI/CD"],
    link: "https://zyvka.com/Zy-VMS",
    linkLabel: "View product",
    confidential: true,
  },
  {
    index: "03",
    title: "EchoPass / AMS",
    type: "Product / audio systems",
    year: "2025",
    description:
      "A proof-of-presence attendance system that generates randomized ultrasonic tokens and verifies them through realtime browser audio analysis.",
    stack: ["Next.js", "Web Audio", "PostgreSQL", "NextAuth"],
    link: "https://github.com/brarkhushpreet/AMS",
    linkLabel: "View repository",
  },
  {
    index: "04",
    title: "Realtime Chat",
    type: "Realtime product",
    year: "2024",
    description:
      "A high-concurrency messaging application with bidirectional events, secure sessions, persistent conversations, and optimized database access.",
    stack: ["Next.js", "Socket.IO", "PostgreSQL", "Prisma"],
    link: "https://github.com/brarkhushpreet/Chat-Application-nextjs",
    linkLabel: "View repository",
  },
  {
    index: "05",
    title: "Movie Explorer",
    type: "Discovery / AI",
    year: "2024",
    description:
      "A responsive movie-discovery product combining TMDB data with Gemini-powered recommendations and a fast browsing experience.",
    stack: ["Next.js", "TMDB", "Gemini AI", "Tailwind"],
    link: "https://movie-website-gules.vercel.app",
    linkLabel: "Visit live site",
  },
  {
    index: "06",
    title: "Developer Blog",
    type: "Publishing",
    year: "2024",
    description:
      "A focused publishing experience for technical notes, experiments, and lessons gathered while building real products.",
    stack: ["JavaScript", "Content", "Responsive UI"],
    link: "https://github.com/brarkhushpreet/blog",
    linkLabel: "View repository",
  },
];

const capabilities = [
  {
    icon: Code2,
    title: "Product interfaces",
    copy: "Responsive systems, complex dashboards, accessible interactions, and performance work that users can feel.",
  },
  {
    icon: ServerCog,
    title: "Backends & APIs",
    copy: "Express services, auth, PostgreSQL, Prisma, WebSockets, background jobs, and third-party integrations.",
  },
  {
    icon: Workflow,
    title: "AI & realtime systems",
    copy: "Voice agents, queues, worker orchestration, audio pipelines, embeddings, evaluations, and live state.",
  },
  {
    icon: Cloud,
    title: "Cloud & delivery",
    copy: "AWS EC2, RDS, S3, PM2, GitHub Actions, migrations, environment wiring, and repeatable deployments.",
  },
];

const experience = [
  {
    date: "May 2025 — Present",
    role: "Software Development Engineer I",
    company: "Zyvka HR Tech",
    description:
      "Building and operating AI products across frontend, backend, realtime workers, databases, and AWS infrastructure.",
  },
  {
    date: "Jul 2024 — Apr 2025",
    role: "Software Development Engineer Intern",
    company: "Zyvka HR Tech",
    description:
      "Migrated a legacy product to React 19, shipped realtime chat, and automated production deployment workflows.",
  },
  {
    date: "Jun 2023 — Jul 2023",
    role: "Summer Internship Trainee",
    company: "Solitaire Infosys",
    description:
      "Built a practical MERN foundation through full-stack applications and API-driven product work.",
  },
];

const loaderPhases = [
  "WAKING THE INTERFACE",
  "CHECKING THE WORKERS",
  "CONNECTING THE CLOUD",
  "READY TO SHIP",
];

const scrambleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const loaderNumber = useRef<HTMLSpanElement>(null);
  const loaderPhase = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const scrambleTimers = useRef<Record<string, number>>({});
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme =
      storedTheme === "light" || (!storedTheme && prefersLight) ? "light" : "dark";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(".site-loader", { display: "none" });
        gsap.set(".hero-word", { yPercent: 0 });
        gsap.set(".hero-enter", { opacity: 1, y: 0 });
      } else {
        document.body.classList.add("is-loading");
        const counter = { value: 0 };
        const intro = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => document.body.classList.remove("is-loading"),
        });

        gsap.set(".hero-word", { yPercent: 115 });
        gsap.set(".hero-enter", { opacity: 0, y: 18 });
        gsap.set(".hero-grid-line", { scale: 0 });
        gsap.set(".boot-cell", { scaleY: 0, transformOrigin: "bottom" });

        intro
          .to(".boot-cell", {
            scaleY: 1,
            duration: 0.42,
            stagger: { each: 0.025, from: "random" },
            ease: "power2.out",
          })
          .to(
            counter,
            {
              value: 100,
              duration: 1.45,
              ease: "power2.inOut",
              onUpdate: () => {
                const value = Math.round(counter.value);
                if (loaderNumber.current) {
                  loaderNumber.current.textContent = String(value).padStart(3, "0");
                }
                if (loaderPhase.current) {
                  const phaseIndex = Math.min(
                    loaderPhases.length - 1,
                    Math.floor(value / 26),
                  );
                  loaderPhase.current.textContent = loaderPhases[phaseIndex];
                }
              },
            },
            0.1,
          )
          .to(".loader-progress-fill", { scaleX: 1, duration: 1.45 }, 0.1)
          .to(".loader-log span", {
            opacity: 1,
            x: 0,
            stagger: 0.12,
            duration: 0.35,
          }, 0.2)
          .to(".site-loader", {
            yPercent: -100,
            duration: 0.85,
            ease: "power4.inOut",
          })
          .to(".hero-grid-line", {
            scale: 1,
            duration: 0.7,
            stagger: 0.025,
            ease: "power2.out",
          }, "-=0.55")
          .to(".hero-word", {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.07,
            ease: "power4.out",
          }, "-=0.62")
          .to(".hero-enter", {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.055,
          }, "-=0.58");
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        const line = element.querySelector<HTMLElement>(".reveal-line");
        gsap.fromTo(
          element,
          {
            opacity: reducedMotion ? 1 : 0,
            y: reducedMotion ? 0 : 42,
            clipPath: reducedMotion ? "inset(0)" : "inset(0 0 24% 0)",
          },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );

        if (line && !reducedMotion) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.85,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            },
          );
        }
      });

      if (!reducedMotion) {
        gsap.to(".hero-orb", {
          y: -18,
          x: 10,
          rotation: 6,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".status-strip-track", {
          xPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        });
      }

      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.15,
        },
      });

      const magneticItems = gsap.utils.toArray<HTMLElement>("[data-magnetic]");
      const magneticCleanups = magneticItems.map((item) => {
        const onMove = (event: PointerEvent) => {
          const bounds = item.getBoundingClientRect();
          const x = event.clientX - bounds.left - bounds.width / 2;
          const y = event.clientY - bounds.top - bounds.height / 2;
          gsap.to(item, {
            x: x * 0.18,
            y: y * 0.18,
            duration: 0.35,
            ease: "power3.out",
          });
        };
        const onLeave = () =>
          gsap.to(item, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.35)" });

        item.addEventListener("pointermove", onMove);
        item.addEventListener("pointerleave", onLeave);
        return () => {
          item.removeEventListener("pointermove", onMove);
          item.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => magneticCleanups.forEach((cleanup) => cleanup());
    }, root);

    return () => {
      context.revert();
      document.body.classList.remove("is-loading");
    };
  }, []);

  useEffect(() => {
    if (!cursor.current || window.matchMedia("(pointer: coarse)").matches) return;
    const xTo = gsap.quickTo(cursor.current, "x", {
      duration: 0.22,
      ease: "power3",
    });
    const yTo = gsap.quickTo(cursor.current, "y", {
      duration: 0.22,
      ease: "power3",
    });
    const moveCursor = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };
    window.addEventListener("pointermove", moveCursor);
    return () => window.removeEventListener("pointermove", moveCursor);
  }, []);

  const scramble = (event: ReactPointerEvent<HTMLElement>, key: string) => {
    const target = event.currentTarget;
    const original = target.dataset.label ?? target.textContent ?? "";
    target.dataset.label = original;
    window.clearInterval(scrambleTimers.current[key]);
    let iteration = 0;

    scrambleTimers.current[key] = window.setInterval(() => {
      target.textContent = original
        .split("")
        .map((character, index) => {
          if (character === " " || index < iteration) return original[index];
          return scrambleCharacters[
            Math.floor(Math.random() * scrambleCharacters.length)
          ];
        })
        .join("");

      if (iteration >= original.length) {
        window.clearInterval(scrambleTimers.current[key]);
        target.textContent = original;
      }
      iteration += 0.55;
    }, 28);
  };

  const setCursorProjectState = (active: boolean) => {
    cursor.current?.classList.toggle("is-project", active);
  };

  return (
    <main ref={root}>
      <div className="site-loader" aria-hidden="true">
        <div className="loader-top">
          <span>KHUSHPREET.SYS</span>
          <span>PORTFOLIO / V2</span>
        </div>
        <div className="boot-grid">
          {Array.from({ length: 48 }).map((_, index) => (
            <i className="boot-cell" key={index} />
          ))}
        </div>
        <div className="loader-console">
          <div className="loader-console-head">
            <span>BOOT SEQUENCE</span>
            <strong ref={loaderNumber}>000</strong>
          </div>
          <div className="loader-progress">
            <div className="loader-progress-fill" />
          </div>
          <div className="loader-console-foot">
            <span ref={loaderPhase}>WAKING THE INTERFACE</span>
            <div className="loader-log">
              <span>UI_OK</span>
              <span>API_OK</span>
              <span>DEPLOY_OK</span>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-progress" aria-hidden="true" />
      <div className="project-cursor" ref={cursor} aria-hidden="true">
        <span>OPEN ↗</span>
      </div>

      <header className="site-header page-width">
        <a href="#top" className="brand" data-magnetic>
          <span>khush.dev</span>
          <i />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
        </nav>
        <div className="header-tools">
          <span className="available"><i /> Available for good problems</span>
          <button
            className="theme-button"
            type="button"
            data-magnetic
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      <section className="hero page-width" id="top">
        <div className="hero-grid" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <i className="hero-grid-line hero-grid-line-v" key={`v-${index}`} />
          ))}
          {Array.from({ length: 9 }).map((_, index) => (
            <i className="hero-grid-line hero-grid-line-h" key={`h-${index}`} />
          ))}
          <div className="hero-orb">
            <span>KS</span>
            <i />
          </div>
        </div>

        <div className="hero-kicker hero-enter">
          <span>FULL-STACK SOFTWARE ENGINEER</span>
          <span>@ ZYVKA HR TECH</span>
        </div>

        <h1 aria-label="I build software from interface to infrastructure.">
          <span className="hero-line">
            <span className="hero-word">I build <em>software</em></span>
          </span>
          <span className="hero-line">
            <span className="hero-word">from interface to</span>
          </span>
          <span className="hero-line">
            <span className="hero-word hero-word-last">infrastructure.<b>✳</b></span>
          </span>
        </h1>

        <div className="hero-copy hero-enter">
          <p>
            I&apos;m Khushpreet Singh. I build the screen, the API behind it,
            the workers around it, and the pipeline that ships it.
          </p>
          <a href="#work" className="text-link" data-magnetic>
            See what I&apos;ve shipped <ArrowDown size={16} />
          </a>
        </div>

        <div className="hero-status hero-enter">
          <div className="status-card">
            <span>BASED IN</span>
            <strong>Gurugram, IN</strong>
          </div>
          <div className="status-card">
            <span>BUILDING NOW</span>
            <strong>AI voice systems</strong>
          </div>
          <div className="status-card status-card-live">
            <span>PRODUCTION</span>
            <strong><i /> All systems operational</strong>
          </div>
          <div className="status-card">
            <span>LOCAL TIME</span>
            <strong>UTC +05:30</strong>
          </div>
        </div>
      </section>

      <div className="status-strip" aria-hidden="true">
        <div className="status-strip-track">
          {Array.from({ length: 2 }).map((_, group) => (
            <div className="status-strip-group" key={group}>
              <span>NEXT.JS</span><i>✳</i>
              <span>NODE.JS</span><i>✳</i>
              <span>POSTGRESQL</span><i>✳</i>
              <span>REDIS / BULLMQ</span><i>✳</i>
              <span>AWS</span><i>✳</i>
              <span>REALTIME AI</span><i>✳</i>
            </div>
          ))}
        </div>
      </div>

      <section className="intro page-width" id="about">
        <div className="section-label" data-reveal>
          <span>01 / HELLO</span>
          <span className="reveal-line" />
        </div>
        <div className="intro-grid">
          <h2 data-reveal>
            A software engineer at heart, working across the whole product.
          </h2>
          <div className="intro-copy" data-reveal>
            <p>
              Some days I&apos;m profiling a React render. Other days I&apos;m
              tracing a queue worker, shaping an API, wiring a voice agent, or
              watching a release move through AWS.
            </p>
            <p>
              I like the point where a complex system becomes simple for the
              person using it — and I&apos;m comfortable owning everything it
              takes to get there.
            </p>
            <div className="intro-links">
              <a href="mailto:khushbrar@gmail.com">Email me <ArrowUpRight size={14} /></a>
              <a href="https://github.com/brarkhushpreet/" target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="capability-list">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <article className="capability-row" data-reveal key={capability.title}>
                <span className="capability-index">0{index + 1}</span>
                <div className="capability-icon"><Icon size={18} /></div>
                <h3>{capability.title}</h3>
                <p>{capability.copy}</p>
                <span className="capability-plus">+</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="work page-width" id="work">
        <div className="section-label" data-reveal>
          <span>02 / SELECTED WORK</span>
          <span className="reveal-line" />
        </div>
        <div className="work-heading" data-reveal>
          <h2>A few things I&apos;ve shipped.</h2>
          <p>Hover a project. The rest know when to get out of the way.</p>
        </div>

        <div className="project-stack">
          {projects.map((project) => (
            <a
              className="project-row"
              href={project.link}
              target="_blank"
              rel="noreferrer"
              key={project.title}
              data-reveal
              onPointerEnter={() => setCursorProjectState(true)}
              onPointerLeave={() => setCursorProjectState(false)}
            >
              <span className="project-index">{project.index}</span>
              <div className="project-main">
                <div className="project-title-row">
                  <h3>{project.title}</h3>
                  {project.confidential && <span className="private-tag">PRODUCTION / PRIVATE</span>}
                </div>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
              <div className="project-side">
                <span>{project.type}</span>
                <strong>{project.year}</strong>
              </div>
              <div className="project-action">
                <span>{project.linkLabel}</span>
                <ArrowUpRight size={22} />
              </div>
              <div className="project-scan" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="impact page-width">
        <div className="section-label" data-reveal>
          <span>03 / PROOF, NOT VIBES</span>
          <span className="reveal-line" />
        </div>
        <div className="impact-grid">
          <div className="impact-copy" data-reveal>
            <h2>Performance is part of the product.</h2>
            <p>
              The quiet engineering work matters: smaller bundles, fewer wasted
              renders, safer deploys, and systems that keep moving under load.
            </p>
          </div>
          <div className="metric-board" data-reveal>
            <div><strong>73%</strong><span>smaller initial bundle</span></div>
            <div><strong>30%</strong><span>faster interactions</span></div>
            <div><strong>40%</strong><span>less technical debt</span></div>
            <div><strong>16</strong><span>voice workers across 4 runtimes</span></div>
          </div>
        </div>
      </section>

      <section className="experience page-width" id="experience">
        <div className="section-label" data-reveal>
          <span>04 / EXPERIENCE</span>
          <span className="reveal-line" />
        </div>
        <div className="experience-layout">
          <div className="experience-heading" data-reveal>
            <h2>Work so far.</h2>
            <p>
              From learning the stack to owning production systems end to end.
            </p>
          </div>
          <div className="experience-list">
            {experience.map((item, index) => (
              <article className="experience-item" data-reveal key={item.date}>
                <span>0{index + 1}</span>
                <div>
                  <time>{item.date}</time>
                  <h3>{item.role}</h3>
                  <strong>{item.company}</strong>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stack page-width">
        <div className="section-label" data-reveal>
          <span>05 / CURRENT STACK</span>
          <span className="reveal-line" />
        </div>
        <div className="stack-console" data-reveal>
          <div className="console-top">
            <div><i /><i /><i /></div>
            <span>khushpreet@portfolio: ~/stack</span>
            <span>LIVE</span>
          </div>
          <div className="console-body">
            <p><span>01</span><strong>interface</strong><em>React · Next.js · TypeScript · Tailwind · Shadcn</em></p>
            <p><span>02</span><strong>server</strong><em>Node.js · Express · REST · WebSockets · Auth</em></p>
            <p><span>03</span><strong>data</strong><em>PostgreSQL · MongoDB · Prisma · Redis · BullMQ</em></p>
            <p><span>04</span><strong>ai / realtime</strong><em>OpenAI · LiveKit · Sarvam · Voice · Audio</em></p>
            <p><span>05</span><strong>ship</strong><em>AWS EC2 · RDS · S3 · PM2 · GitHub Actions</em></p>
          </div>
          <div className="console-command">
            <span>→</span>
            <strong>ready_to_build_something_good</strong>
            <i />
          </div>
        </div>
      </section>

      <section className="contact page-width">
        <div className="contact-star" aria-hidden="true"><Sparkles size={40} /></div>
        <div className="contact-copy" data-reveal>
          <span>06 / CONTACT</span>
          <h2>Have a hard problem?</h2>
          <p>Good. Those are usually the interesting ones.</p>
        </div>
        <a className="contact-button" href="mailto:khushbrar@gmail.com" data-magnetic>
          <Mail size={20} />
          <span
            onPointerEnter={(event) => scramble(event, "contact")}
            data-label="START A CONVERSATION"
          >
            START A CONVERSATION
          </span>
          <ArrowUpRight size={20} />
        </a>
      </section>

      <footer className="site-footer page-width">
        <div>
          <span>© 2026 KHUSHPREET SINGH</span>
          <span>GURUGRAM / INDIA</span>
        </div>
        <div className="footer-links">
          <a href="https://github.com/brarkhushpreet/" target="_blank" rel="noreferrer">
            <GitBranch size={14} /> GitHub
          </a>
          <a href="/Khushpreet_Singh_Resume.pdf" download>
            <Download size={14} /> Résumé
          </a>
          <a href="#top">Top ↑</a>
        </div>
      </footer>
    </main>
  );
}
