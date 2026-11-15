import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { Fragment } from "react";
import { ContactForm } from "./contact-form";
import { experience, links, tools } from "./content";
import { HeroName } from "./components/hero-name";
import { HeroStack } from "./components/hero-stack";
import { LocalTime } from "./components/local-time";
import { Motion } from "./components/motion";
import { SiteHeader } from "./components/site-header";
import { Words } from "./components/words";
import { Work } from "./components/work";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="curtain" aria-hidden="true">
        <span className="mono">Khushpreet Singh</span>
        <span className="mono">Portfolio — {year}</span>
        <span className="curtain-count" />
      </div>
      <Motion />
      <SiteHeader />

      <main id="top">
        <section className="hero wrap" aria-labelledby="hero-name">
          <div className="hero-meta mono" data-intro>
            <span>SDE II at Zyvka HR Tech</span>
            <span>Sirsa, Haryana</span>
            <LocalTime />
          </div>
          <HeroName />
          <div className="hero-lower">
            <div className="hero-copy">
              <p className="hero-lead" data-intro>
                <strong>Full-stack software engineer.</strong> I build AI products, realtime systems, and cloud infrastructure.
              </p>
              <div className="hero-actions" data-intro>
                <a className="pill pill--solid" href="#work">Selected work <ArrowDown size={16} aria-hidden="true" /></a>
                <a className="pill" href={links.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16} aria-hidden="true" /></a>
                <a className="pill" href={links.resume} download>Résumé <Download size={15} aria-hidden="true" /></a>
              </div>
            </div>
            <div className="hero-scene" data-intro>
              <HeroStack video="/projects/echopass-method-motion.mp4" poster="/projects/echopass-method-motion.webp" />
            </div>
          </div>
        </section>

        <section className="about wrap" id="about" aria-labelledby="about-title">
          <p className="mono section-tag" id="about-title"><span>(01)</span> About the way I work</p>
          <p className="statement" data-scrub>
            <Words text="I like the whole thing — the interface people touch, the service behind it, and the infrastructure that keeps it alive." />
          </p>
          <div className="about-row">
            <p className="about-note" data-fade>
              My best work sits between product thinking and systems engineering: clear enough for a person, sturdy enough for production.
            </p>
            <div className="toolkit" data-fade>
              <p className="mono">Tools I work with</p>
              <p className="toolkit-list">
                {tools.map((tool, index) => (
                  <Fragment key={tool}>
                    {tool}<span>{index < tools.length - 1 ? ", " : "."}</span>
                  </Fragment>
                ))}
              </p>
            </div>
          </div>
        </section>

        <section className="work wrap" id="work" aria-labelledby="work-title">
          <header className="section-head">
            <p className="mono section-tag"><span>(02)</span> From interface to infrastructure</p>
            <h2 className="display" id="work-title" data-rise><Words text="Selected work" /></h2>
          </header>
          <Work />
        </section>

        <section className="experience wrap" id="experience" aria-labelledby="experience-title">
          <header className="section-head">
            <p className="mono section-tag"><span>(03)</span> Zyvka HR Tech, 2024 — Present</p>
            <h2 className="display" id="experience-title" data-rise><Words text="Experience" /></h2>
          </header>
          <p className="experience-intro" data-fade>
            Building and operating AI products across interfaces, services, realtime systems, and AWS infrastructure.
          </p>
          <ol className="xp">
            {experience.map((item) => (
              <li className="xp-row" key={item.date} data-fade>
                <time className="mono">{item.date}</time>
                <h3>{item.role}</h3>
                <div className="xp-copy">
                  <p>{item.copy}</p>
                  <ul className="tags" aria-label={`${item.role} technologies`}>
                    {item.tech.map((tech) => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="contact wrap" id="contact" aria-labelledby="contact-title">
          <header className="section-head">
            <p className="mono section-tag"><span>(04)</span> Contact</p>
            <h2 className="display display--xl" id="contact-title" data-rise><Words text="Get in touch." /></h2>
          </header>
          <div className="contact-row">
            <p className="contact-note" data-fade>Have a question or an idea to share? Send me a message.</p>
            <div data-fade><ContactForm /></div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-row mono">
          <span>© {year} Khushpreet Singh</span>
          <span>Sirsa, Haryana — <LocalTime /></span>
          <nav aria-label="Elsewhere">
            <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={links.resume} download>Résumé</a>
            <a href="#top">Back to top ↑</a>
          </nav>
        </div>
        <p className="foot-mark" aria-hidden="true">Khushpreet</p>
      </footer>
    </>
  );
}
