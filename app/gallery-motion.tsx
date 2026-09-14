"use client";

import { useEffect, useRef } from "react";

export function GalleryMotion({ src, poster, label, enabled, controls = false }: {
  src: string; poster: string; label: string; enabled: boolean; controls?: boolean;
}) {
  const player = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = player.current;
    if (!video) return;
    let visible = false;
    const sync = () => {
      if (enabled && visible && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .15;
      sync();
    }, { threshold: [0, .15] });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [enabled, src]);

  return <video ref={player} className="gallery-video" src={src} poster={poster} aria-label={label} muted loop playsInline preload="none" controls={controls} draggable={false} />;
}
