"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

export type ReelItem = { id: string; title: string; subtitle: string; label: string; src: string; poster: string; alt: string };

/**
 * The hero reel: one real recording from each project, played back to back.
 * The playlist beside it doubles as the progress indicator and as a jump list.
 */
export function Reel({ items }: { items: ReelItem[] }) {
  const video = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<boolean | null>(null);
  const paused = choice ?? reduced;
  const current = items[index];

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    let visible = false;
    const sync = () => {
      if (visible && !paused && !document.hidden) void player.play().catch(() => {});
      else player.pause();
    };
    const progress = () => {
      const ratio = player.duration ? player.currentTime / player.duration : 0;
      root.current?.style.setProperty("--reel-progress", ratio.toFixed(4));
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.2 });
    observer.observe(player);
    player.addEventListener("timeupdate", progress);
    document.addEventListener("visibilitychange", sync);
    progress();
    return () => {
      observer.disconnect();
      player.removeEventListener("timeupdate", progress);
      document.removeEventListener("visibilitychange", sync);
      player.pause();
    };
  }, [index, paused]);

  return (
    <div className="reel" ref={root}>
      <div className="reel-list">
        <p className="mono reel-label"><span className="dot" aria-hidden="true" />Reel — recorded in the real apps</p>
        <ol>
          {items.map((item, itemIndex) => (
            <li key={item.id}>
              <button type="button" className={itemIndex === index ? "is-current" : ""} aria-current={itemIndex === index ? "true" : undefined} onClick={() => { setIndex(itemIndex); setChoice(false); }}>
                <span className="mono">{String(itemIndex + 1).padStart(2, "0")}</span>
                <span className="reel-title">{item.title}</span>
                <span className="reel-sub">{item.label}</span>
                <i aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      </div>
      <figure className="reel-stage">
        <div className="frame">
          <video
            key={current.src}
            ref={video}
            src={current.src}
            poster={current.poster}
            aria-label={current.alt}
            muted
            playsInline
            preload="metadata"
            onEnded={() => setIndex((value) => (value + 1) % items.length)}
          />
          <button className="clip-toggle" type="button" onClick={() => setChoice(!paused)} aria-label={paused ? "Play reel" : "Pause reel"}>
            {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          </button>
        </div>
        <figcaption className="mono">
          <span>{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <span>{current.title} — {current.label}</span>
          <a href={`#project-${current.id}`}>View project ↓</a>
        </figcaption>
      </figure>
    </div>
  );
}
