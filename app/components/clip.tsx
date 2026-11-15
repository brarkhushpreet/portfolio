"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * A silent, looping screen recording. It plays only while it is on screen and
 * the tab is visible, stays paused under reduced motion, and always offers a
 * pause control.
 */
export function Clip({ src, poster, alt, eager = false }: { src: string; poster: string; alt: string; eager?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const paused = choice ?? reduced;

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    let visible = false;
    const sync = () => {
      if (visible && !paused && !document.hidden) void player.play().catch(() => {});
      else player.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.3 });
    observer.observe(player);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      player.pause();
    };
  }, [paused, src]);

  return (
    <div className="clip">
      <video ref={video} src={src} poster={poster} aria-label={alt} muted loop playsInline preload={eager ? "metadata" : "none"} />
      <button className="clip-toggle" type="button" onClick={() => setChoice(!paused)} aria-label={paused ? "Play recording" : "Pause recording"}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
      </button>
    </div>
  );
}
