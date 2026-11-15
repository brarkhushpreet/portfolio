"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { projects, type Project, type Shot } from "../content";
import { Clip } from "./clip";
import { ThemeToggle } from "./theme-toggle";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * A still screenshot. When the screen was captured in both themes, both images
 * are in the document and CSS shows the one matching the page theme, so the
 * swap needs no script and the hidden one is never downloaded until needed.
 */
function ShotMedia({ shot, lazy = true }: { shot: Shot; lazy?: boolean }) {
  const image = (src: string, className?: string) => (
    <img
      className={className}
      src={src}
      alt={shot.alt}
      width={shot.format === "mobile" ? 375 : 1264}
      height={shot.format === "mobile" ? 731 : 632}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      draggable={false}
    />
  );
  if (!shot.light) return image(shot.src);
  return <>{image(shot.src, "only-dark")}{image(shot.light, "only-light")}</>;
}

function OpenButton({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <button type="button" className="frame-open" onClick={onOpen} aria-label={`Enlarge: ${label}`}>
      <span aria-hidden="true"><Maximize2 size={14} /></span>
    </button>
  );
}

/** A drag-scrollable strip of the remaining screenshots and recordings. */
function Gallery({ project, onOpen }: { project: Project; onOpen: (shot: number) => void }) {
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });

  const down = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !strip.current) return;
    drag.current = { active: true, moved: false, startX: event.clientX, startLeft: strip.current.scrollLeft };
  };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state.active || !strip.current) return;
    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 4) {
      state.moved = true;
      strip.current.classList.add("is-dragging");
    }
    if (state.moved) strip.current.scrollLeft = state.startLeft - delta;
  };
  const up = () => {
    drag.current.active = false;
    strip.current?.classList.remove("is-dragging");
  };

  return (
    <div className="gallery">
      <p className="mono gallery-hint"><span>More from {project.shortTitle}</span><span aria-hidden="true">Drag →</span></p>
      <div
        className="gallery-strip"
        ref={strip}
        data-lenis-prevent-horizontal
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        onClickCapture={(event) => {
          if (!drag.current.moved) return;
          drag.current.moved = false;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        {project.shots.map((shot, index) => index === project.lead ? null : (
          <figure className={`shot${shot.format === "mobile" ? " shot--mobile" : ""}`} key={shot.src}>
            <div className="frame">
              {shot.video ? <Clip src={shot.video} poster={shot.src} alt={shot.alt} /> : <ShotMedia shot={shot} />}
              {shot.video ? <span className="mono shot-badge">Motion</span> : null}
              <OpenButton label={shot.label} onOpen={() => onOpen(index)} />
            </div>
            <figcaption>
              <span className="mono">{shot.label}</span>
              <span className="shot-caption">{shot.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function ProjectPanel({ project, index, onOpen }: { project: Project; index: number; onOpen: (shot: number) => void }) {
  const lead = project.shots[project.lead];
  return (
    <article className="project" id={`project-${project.id}`} data-project={index} aria-labelledby={`project-${project.id}-title`}>
      <header className="project-head">
        <span className="mono project-no">{pad(index + 1)} / {pad(projects.length)}</span>
        <h3 id={`project-${project.id}-title`}>{project.title}</h3>
        <p>{project.subtitle}</p>
      </header>

      <figure className="project-lead" data-fade>
        <div className="frame">
          {lead.video ? <Clip src={lead.video} poster={lead.src} alt={lead.alt} /> : <ShotMedia shot={lead} />}
          <OpenButton label={lead.label} onOpen={() => onOpen(project.lead)} />
        </div>
        <figcaption><span className="mono">{lead.label}</span><span className="shot-caption">{lead.caption}</span></figcaption>
      </figure>

      <div className="project-body">
        <div className="project-copy" data-fade>
          <p className="project-desc">{project.description}</p>
          <div className="project-pair">
            <div><h4 className="mono">What I built</h4><p>{project.built}</p></div>
            <div><h4 className="mono">Behind the interface</h4><p>{project.decision}</p></div>
          </div>
        </div>
        <dl className="meta" data-fade>
          <div><dt className="mono">Discipline</dt><dd>{project.discipline}</dd></div>
          <div><dt className="mono">Year</dt><dd>{project.year}</dd></div>
          <div><dt className="mono">Status</dt><dd>{project.status}</dd></div>
          <div><dt className="mono">Highlights</dt><dd>{project.highlights.map((item) => <span key={item}>{item}</span>)}</dd></div>
          <div><dt className="mono">Stack</dt><dd className="meta-stack">{project.stack.join(" · ")}</dd></div>
          <div className="meta-links">
            <a className="pill pill--solid" href={project.liveUrl} target="_blank" rel="noreferrer">Visit live site <ArrowUpRight size={16} aria-hidden="true" /></a>
            {project.repoUrl ? <a className="pill" href={project.repoUrl} target="_blank" rel="noreferrer">View repository <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
          </div>
        </dl>
      </div>

      <Gallery project={project} onOpen={onOpen} />
    </article>
  );
}

export function Work() {
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState<{ project: number; shot: number } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panels = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-project]") ?? []);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.project));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  const open = (project: number, shot: number) => {
    setViewer({ project, shot });
    if (!dialog.current?.open) dialog.current?.showModal();
  };
  const step = (direction: number) => setViewer((value) => {
    if (!value) return value;
    const count = projects[value.project].shots.length;
    return { project: value.project, shot: (value.shot + direction + count) % count };
  });

  const viewed = viewer ? projects[viewer.project] : null;
  const shot = viewer && viewed ? viewed.shots[viewer.shot] : null;

  return (
    <div className="work-grid">
      <aside className="work-index" aria-label="Project index">
        <div className="counter" aria-hidden="true">
          <span className="counter-now" key={active}>{pad(active + 1)}</span>
          <span className="mono">/ {pad(projects.length)}</span>
        </div>
        <ol>
          {projects.map((project, index) => (
            <li key={project.id}>
              <a href={`#project-${project.id}`} className={index === active ? "is-current" : ""} aria-current={index === active ? "true" : undefined}>
                <span className="mono">{pad(index + 1)}</span>{project.shortTitle}
              </a>
            </li>
          ))}
        </ol>
        <p className="mono work-index-note">{projects[active].discipline}</p>
      </aside>

      <div className="work-list" ref={list}>
        {projects.map((project, index) => (
          <ProjectPanel key={project.id} project={project} index={index} onOpen={(shotIndex) => open(index, shotIndex)} />
        ))}
      </div>

      <dialog
        className="viewer"
        ref={dialog}
        data-lenis-prevent
        aria-label={shot ? shot.label : "Screenshot viewer"}
        onClose={() => setViewer(null)}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          else if (event.key === "ArrowLeft") step(-1);
        }}
      >
        {viewer && viewed && shot ? (
          <div className="viewer-inner">
            <div className="viewer-head mono">
              <span>{viewed.shortTitle} — {pad(viewer.shot + 1)} / {pad(viewed.shots.length)}</span>
              <div className="viewer-tools">
                <ThemeToggle />
                <button type="button" className="icon-button" onClick={() => dialog.current?.close()} aria-label="Close viewer"><X size={18} aria-hidden="true" /></button>
              </div>
            </div>
            <div className={`viewer-stage${shot.format === "mobile" ? " viewer-stage--mobile" : ""}`}>
              <div className="frame" key={shot.src}>
                {shot.video
                  ? <video src={shot.video} poster={shot.src} aria-label={shot.alt} muted loop playsInline autoPlay controls />
                  : <ShotMedia shot={shot} lazy={false} />}
              </div>
            </div>
            <div className="viewer-foot">
              <p><strong>{shot.label}.</strong> {shot.caption}</p>
              <div>
                <button type="button" className="icon-button" onClick={() => step(-1)} aria-label="Previous"><ArrowLeft size={18} aria-hidden="true" /></button>
                <button type="button" className="icon-button" onClick={() => step(1)} aria-label="Next"><ArrowRight size={18} aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
