"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  GitBranch,
  Mail,
  MapPin,
  Moon,
  Sun,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const experience = [
  {
    period: "May 2025 — Now",
    role: "Software Development Engineer I",
    company: "Zyvka HR Tech",
    summary:
      "Designing a scalable AI-agent platform and building fast, responsive product experiences with Next.js, React, and Shadcn UI.",
    wins: ["73% smaller initial bundle", "30% faster interactions"],
  },
  {
    period: "Jul 2024 — Apr 2025",
    role: "Software Development Engineer Intern",
    company: "Zyvka HR Tech",
    summary:
      "Migrated a legacy product to React 19, shipped real-time chat, and automated AWS deployments with GitHub Actions.",
    wins: ["40% less technical debt", "React 19 migration"],
  },
  {
    period: "Jun 2023 — Jul 2023",
    role: "Summer Internship Trainee",
    company: "Solitaire Infosys",
    summary:
      "Built a practical foundation in the MERN stack through introductory full-stack applications.",
    wins: ["MERN stack", "Full-stack foundations"],
  },
];

const secondaryProjects = [
  {
    number: "02",
    title: "Real-Time Chat",
    label: "Communication",
    description:
      "A high-concurrency messaging experience with bidirectional Socket.IO events, secure sessions, and optimized Prisma queries.",
    stack: ["Next.js", "Socket.IO", "PostgreSQL"],
    visual: "chat",
  },
  {
    number: "03",
    title: "Movie Explorer",
    label: "Discovery",
    description:
      "A responsive film discovery platform powered by TMDB and Gemini AI for more personal recommendations.",
    stack: ["Next.js", "TMDB API", "Gemini AI"],
    visual: "movie",
  },
  {
    number: "04",
    title: "Developer Blog",
    label: "Publishing",
    description:
      "A focused reading experience for documenting technical learnings, ideas, and the details behind the build.",
    stack: ["Writing", "Web", "Product"],
    visual: "blog",
  },
];

const skillGroups = [
  ["React", "Next.js", "TypeScript", "HTML5", "CSS3"],
  ["Node.js", "Express", "REST APIs", "NextAuth"],
  ["PostgreSQL", "MongoDB", "Prisma ORM"],
  ["AWS EC2 / RDS", "CI/CD", "GitHub Actions"],
];

function ProjectVisual({ type }: { type: string }) {
  if (type === "chat") {
    return (
      <div className="project-visual chat-visual" aria-hidden="true">
        <div className="chat-topline">
          <span />
          <i />
        </div>
        <div className="chat-message chat-message-left">Hey, is the build live?</div>
        <div className="chat-message chat-message-right">Shipping it now.</div>
        <div className="chat-message chat-message-left chat-message-small">
          That was fast.
        </div>
        <div className="chat-composer">
          <span>Write a message</span>
          <b>↗</b>
        </div>
      </div>
    );
  }

  if (type === "movie") {
    return (
      <div className="project-visual movie-visual" aria-hidden="true">
        <div className="movie-heading">
          <span>Tonight</span>
          <i>FOR YOU</i>
        </div>
        <div className="poster-row">
          <div className="poster poster-one"><span>01</span></div>
          <div className="poster poster-two"><span>02</span></div>
          <div className="poster poster-three"><span>03</span></div>
        </div>
        <div className="movie-score">
          <span>AI MATCH</span>
          <strong>94%</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="project-visual blog-visual" aria-hidden="true">
      <span className="blog-kicker">FIELD NOTES / 2026</span>
      <div className="blog-entry">
        <strong>Making interfaces feel inevitable</strong>
        <span>08 min</span>
      </div>
      <div className="blog-entry">
        <strong>Performance is a design feature</strong>
        <span>06 min</span>
      </div>
      <div className="blog-entry">
        <strong>Notes from building with Next.js</strong>
        <span>04 min</span>
      </div>
    </div>
  );
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const loaderNumber = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-theme");
    const preferredLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initial = stored === "light" || (!stored && preferredLight) ? "light" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".site-loader", { display: "none" });
        gsap.set(".hero-reveal", { yPercent: 0 });
      } else {
        document.body.classList.add("is-loading");
        const counter = { value: 0 };
        const intro = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => document.body.classList.remove("is-loading"),
        });

        gsap.set(".hero-reveal", { yPercent: 112 });
        gsap.set(".hero-fade", { opacity: 0, y: 22 });

        intro
          .to(counter, {
            value: 100,
            duration: 1.05,
            ease: "power2.inOut",
            onUpdate: () => {
              if (loaderNumber.current) {
                loaderNumber.current.textContent = String(
                  Math.round(counter.value),
                ).padStart(3, "0");
              }
            },
          })
          .to(".loader-rule", { scaleX: 1, duration: 0.8 }, 0.12)
          .to(".loader-word span", { yPercent: 0, duration: 0.7 }, 0.38)
          .to(".site-loader", {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
          })
          .to(
            ".hero-reveal",
            { yPercent: 0, duration: 1, stagger: 0.08 },
            "-=0.42",
          )
          .to(
            ".hero-fade",
            { opacity: 1, y: 0, duration: 0.75, stagger: 0.07 },
            "-=0.72",
          );
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: prefersReducedMotion ? 0 : 70, opacity: prefersReducedMotion ? 1 : 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        const visual = card.querySelector(".project-visual");
        if (visual && !prefersReducedMotion) {
          gsap.fromTo(
            visual,
            { y: 45 },
            {
              y: -18,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        }
      });

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
    }, root);

    return () => {
      context.revert();
      document.body.classList.remove("is-loading");
    };
  }, []);

  useEffect(() => {
    if (!cursor.current || window.matchMedia("(pointer: coarse)").matches) return;
    const cursorElement = cursor.current;
    const xTo = gsap.quickTo(cursorElement, "x", {
      duration: 0.28,
      ease: "power3",
    });
    const yTo = gsap.quickTo(cursorElement, "y", {
      duration: 0.28,
      ease: "power3",
    });

    const move = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const updateSpotlight = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };

  return (
    <main ref={root}>
      <div className="site-loader" aria-hidden="true">
        <div className="loader-corner">KS® / PORTFOLIO</div>
        <div className="loader-center">
          <div className="loader-word"><span>BUILDING</span></div>
          <div className="loader-rule" />
          <div className="loader-meta">
            <span>INTERFACES WITH INTENT</span>
            <span ref={loaderNumber}>000</span>
          </div>
        </div>
      </div>

      <div className="scroll-progress" aria-hidden="true" />
      <div ref={cursor} className="cursor-dot" aria-hidden="true" />

      <header className="site-header">
        <a className="wordmark magnetic" href="#top" aria-label="Back to top">
          <span>KS</span><i>®</i>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <a className="header-contact" href="mailto:khushbrar@gmail.com">
            Let&apos;s talk <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <section
        className="hero section-shell"
        id="top"
        onPointerMove={updateSpotlight}
      >
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-eyebrow hero-fade">
          <span className="status-dot" />
          Software Engineer · Gurugram, India
        </div>

        <div className="hero-title" aria-label="Frontend engineer. Interface obsessive.">
          <div className="title-line"><span className="hero-reveal">Frontend engineer.</span></div>
          <div className="title-line title-line-indent">
            <span className="hero-reveal serif">Interface</span>
          </div>
          <div className="title-line title-line-last">
            <span className="hero-reveal">
              <em className="asterisk">✳</em> obsessive.
            </span>
          </div>
        </div>

        <div className="hero-bottom hero-fade">
          <p>
            I&apos;m Khushpreet Singh — a product-minded software engineer turning
            complex systems into fast, thoughtful interfaces.
          </p>
          <a href="#work" className="round-link" aria-label="Explore selected work">
            <span>Explore work</span>
            <ArrowDown size={20} />
          </a>
        </div>

        <div className="hero-index hero-fade" aria-hidden="true">
          <span>SELECTED WORK</span>
          <span>2023—26</span>
        </div>
      </section>

      <div className="ticker" aria-label="Core technologies">
        <div className="ticker-track">
          {["NEXT.JS", "REACT", "TYPESCRIPT", "NODE.JS", "POSTGRESQL", "GSAP", "AWS", "NEXT.JS", "REACT", "TYPESCRIPT", "NODE.JS", "POSTGRESQL", "GSAP", "AWS"].map((item, index) => (
            <span key={`${item}-${index}`}>{item}<i>✳</i></span>
          ))}
        </div>
      </div>

      <section className="work section-shell" id="work">
        <div className="section-heading" data-reveal>
          <div>
            <span className="section-number">01 / WORK</span>
            <h2>Selected builds</h2>
          </div>
          <p>
            Practical products shaped by performance, clear interaction, and
            the belief that technical depth should still feel effortless.
          </p>
        </div>

        <article className="featured-project project-card" data-reveal>
          <div className="featured-copy">
            <div className="project-meta">
              <span>01</span>
              <span>FLAGSHIP · 2025</span>
            </div>
            <div>
              <p className="project-label">PROOF OF PRESENCE</p>
              <h3>EchoPass <em>/ AMS</em></h3>
              <p className="project-description">
                An ultrasonic attendance system that verifies physical presence
                using randomized, high-frequency audio — no QR-code forwarding,
                no location spoofing.
              </p>
            </div>
            <ul className="project-points">
              <li>Generates secure audio tokens above 19kHz</li>
              <li>Detects active frequencies in real time</li>
              <li>Includes analytics and user management</li>
            </ul>
            <div className="project-footer">
              <div className="tags">
                {["Next.js", "PostgreSQL", "NextAuth", "Web Audio"].map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a
                className="project-link"
                href="https://github.com/brarkhushpreet/"
                target="_blank"
                rel="noreferrer"
              >
                Explore code <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <div className="ams-visual" aria-hidden="true">
            <div className="ams-ui">
              <div className="ams-topbar">
                <span>ECHOPASS / LIVE</span>
                <i>SESSION 042</i>
              </div>
              <div className="frequency-stage">
                <div className="frequency-rings">
                  <span /><span /><span /><span />
                  <div className="frequency-core">19.4<small>kHz</small></div>
                </div>
                <div className="signal-bars">
                  {[34, 52, 77, 44, 88, 62, 96, 72, 48, 84, 59, 38].map((height, index) => (
                    <i key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="ams-readout">
                <div><span>STATUS</span><strong>Signal verified</strong></div>
                <div><span>RANGE</span><strong>4.8 M</strong></div>
                <div><span>PRESENT</span><strong>46 / 48</strong></div>
              </div>
            </div>
            <span className="visual-note visual-note-top">REAL-TIME SIGNAL</span>
            <span className="visual-note visual-note-bottom">SECURE / SCALABLE</span>
          </div>
        </article>

        <div className="project-list">
          {secondaryProjects.map((project) => (
            <article className="project-card secondary-project" key={project.title} data-reveal>
              <div className="secondary-topline">
                <span>{project.number}</span>
                <span>{project.label}</span>
              </div>
              <ProjectVisual type={project.visual} />
              <div className="secondary-copy">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags">
                  {project.stack.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="impact section-shell" aria-label="Selected impact">
        <div className="impact-label" data-reveal>
          <span className="section-number">IMPACT / IN NUMBERS</span>
          <p>Measured improvements, not decorative claims.</p>
        </div>
        <div className="impact-grid">
          <div className="impact-item" data-reveal>
            <strong>73<sup>%</sup></strong>
            <span>smaller initial bundle</span>
          </div>
          <div className="impact-item" data-reveal>
            <strong>30<sup>%</sup></strong>
            <span>faster interactions</span>
          </div>
          <div className="impact-item" data-reveal>
            <strong>40<sup>%</sup></strong>
            <span>less technical debt</span>
          </div>
          <div className="impact-item" data-reveal>
            <strong>9.12</strong>
            <span>engineering CGPA</span>
          </div>
        </div>
      </section>

      <section className="experience section-shell" id="experience">
        <div className="section-heading" data-reveal>
          <div>
            <span className="section-number">02 / EXPERIENCE</span>
            <h2>Where I&apos;ve shipped</h2>
          </div>
          <p>
            From learning the full stack to owning product performance and
            scalable frontend architecture.
          </p>
        </div>

        <div className="experience-list">
          {experience.map((item, index) => (
            <article className="experience-row" key={item.period} data-reveal>
              <span className="experience-index">0{index + 1}</span>
              <div className="experience-period">{item.period}</div>
              <div className="experience-title">
                <h3>{item.role}</h3>
                <p>{item.company}</p>
              </div>
              <p className="experience-summary">{item.summary}</p>
              <div className="experience-wins">
                {item.wins.map((win) => <span key={win}>{win}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about section-shell" id="about">
        <div className="about-intro" data-reveal>
          <span className="section-number">03 / ABOUT</span>
          <h2>
            Engineer by training.<br />
            <em>Detail-obsessed</em> by nature.
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-note" data-reveal>
            <div className="availability-badge">
              <span>OPEN TO INTERESTING WORK</span>
              <i>✳</i>
            </div>
            <p className="location"><MapPin size={16} /> Sirsa, Haryana · Working in Gurugram</p>
          </div>

          <div className="about-copy" data-reveal>
            <p className="about-lead">
              I work where product thinking, visual craft, and engineering
              discipline meet.
            </p>
            <p>
              Today I&apos;m building AI-powered software at Zyvka. I care about
              the parts users notice — clear states, satisfying motion, responsive
              layouts — and the parts they don&apos;t: clean composition, efficient
              rendering, and resilient data flows.
            </p>
            <p>
              I earned my Computer Science degree from SLIET with a 9.12 CGPA,
              and I&apos;m happiest when a difficult technical problem ends in a
              simple interaction.
            </p>
          </div>
        </div>

        <div className="skills-board" data-reveal>
          <div className="skills-heading">
            <span>THE TOOLBOX</span>
            <span>04 GROUPS / 20+ TOOLS</span>
          </div>
          {skillGroups.map((group, index) => (
            <div className="skill-row" key={group[0]}>
              <span>0{index + 1}</span>
              <div>
                {group.map((skill) => <strong key={skill}>{skill}</strong>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact section-shell" id="contact">
        <div className="contact-orbit" aria-hidden="true">
          <span>LET&apos;S BUILD SOMETHING GOOD · LET&apos;S BUILD SOMETHING GOOD · </span>
        </div>
        <span className="section-number" data-reveal>04 / CONTACT</span>
        <div className="contact-title" data-reveal>
          <h2>Have a hard problem?</h2>
          <h2 className="serif">I&apos;d like to hear it.</h2>
        </div>
        <div className="contact-bottom" data-reveal>
          <a className="email-link" href="mailto:khushbrar@gmail.com">
            <Mail size={22} />
            khushbrar@gmail.com
            <ArrowUpRight size={22} />
          </a>
          <div className="contact-links">
            <a href="https://github.com/brarkhushpreet/" target="_blank" rel="noreferrer">
              <GitBranch size={17} /> GitHub
            </a>
            <a href="/Khushpreet_Singh_Resume.pdf" download>
              <Download size={17} /> Résumé
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <span>© 2026 Khushpreet Singh</span>
        <span>DESIGNED &amp; BUILT WITH INTENT</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
