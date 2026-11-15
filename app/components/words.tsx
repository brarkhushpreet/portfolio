import { Fragment } from "react";

/**
 * Splits a line into per-word spans for motion while keeping one unsplit copy
 * in the document for assistive tech, search and the no-JS render.
 */
export function Words({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="words" aria-hidden="true">
        {text.split(" ").map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            {index > 0 ? " " : null}
            <span className="w"><span className="wi">{word}</span></span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
