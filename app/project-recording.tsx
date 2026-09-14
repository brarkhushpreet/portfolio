"use client";

import { useEffect, useRef } from "react";
import type { PreviewId } from "./project-stories";

export const recordings: Partial<Record<PreviewId, { title: string; description: string; width: number; height: number }>> = {
  echopass: {
    title: "Room signal → location verification",
    description: "Recorded from ClassPulse’s public product preview, switching between its two verification methods. The preview uses sample attendance data.",
    width: 592, height: 530,
  },
  movies: {
    title: "Discover → inspect → save → My List",
    description: "Recorded in Vanta’s local demo profile: opening Inception, saving it, and finding it in My List.",
    width: 1264, height: 710,
  },
  blog: {
    title: "Archive → topic filter → article",
    description: "Recorded in the running blog: filtering the archive to React and opening an article about rendering performance.",
    width: 1264, height: 710,
  },
};

export function ProjectRecording({ id, active }: { id: PreviewId; active: boolean }) {
  const player = useRef<HTMLVideoElement>(null);
  const recording = recordings[id];

  useEffect(() => {
    if (!active) player.current?.pause();
    const pauseWhenHidden = () => { if (document.hidden) player.current?.pause(); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, [active]);

  if (!recording) return null;
  return (
    <figure className={`project-recording recording-${id}`}>
      <div className="recording-label"><span>Recorded in the app</span><span>Play to explore</span></div>
      <video ref={player} controls playsInline preload="none" width={recording.width} height={recording.height} poster={`/projects/${id}-poster.webp`} aria-label={recording.title} aria-describedby={`${id}-recording-description`}>
        <source src={`/projects/${id}-flow.mp4`} type="video/mp4" />
        <track kind="captions" src={`/projects/${id}-flow.vtt`} srcLang="en" label="English — walkthrough steps" default />
        Your browser cannot play this clip. You can explore the interactive preview or screenshots below.
      </video>
      <figcaption><strong>{recording.title}</strong><p id={`${id}-recording-description`}>{recording.description}</p></figcaption>
    </figure>
  );
}
