"use client";

import { Fragment, useRef } from "react";
import { useProximityWeight } from "./use-proximity-weight";

const WORDS = ["Khushpreet", "Singh"];

/** The name, set as large as the viewport allows. The letters thin out around the cursor. */
export function HeroName() {
  const root = useRef<HTMLHeadingElement>(null);
  useProximityWeight(root, ".name-char", 540, 160);

  return (
    <h1 className="name" id="hero-name" ref={root}>
      <span className="sr-only">Khushpreet Singh</span>
      <span className="name-line" aria-hidden="true">
        {WORDS.map((word, wordIndex) => (
          <Fragment key={word}>
            {wordIndex > 0 ? " " : null}
            <span className="name-word">
              {Array.from(word).map((char, index) => (
                <span className="name-char" key={`${char}-${index}`}>{char}</span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </h1>
  );
}

/** The footer wordmark, with the same cursor response as the hero name. */
export function FootMark() {
  const root = useRef<HTMLParagraphElement>(null);
  useProximityWeight(root, ".mark-char", 560, 180);

  return (
    <p className="foot-mark" aria-hidden="true" ref={root}>
      {Array.from("Khushpreet").map((char, index) => (
        <span className="mark-char" key={`${char}-${index}`}>{char}</span>
      ))}
    </p>
  );
}
