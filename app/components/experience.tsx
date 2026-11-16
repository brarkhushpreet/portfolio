"use client";

import { useState, type CSSProperties } from "react";
import { experience } from "../content";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The roles as a selector: point at, focus or tap a role and the panel beside
 * it switches to that role, with a marker sliding down the list. Every role's
 * text is in the server HTML; inactive panels are only hidden once scripting
 * is available, and on narrow screens all of them are simply listed.
 */
export function Experience() {
  const [active, setActive] = useState(0);

  return (
    <div className="xp" style={{ "--active": active, "--roles": experience.length } as CSSProperties}>
      <ol className="xp-roles">
        {experience.map((item, index) => (
          <li key={item.date}>
            <button
              type="button"
              className={`xp-role${index === active ? " is-current" : ""}`}
              aria-expanded={index === active}
              aria-controls={`xp-detail-${index}`}
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index); }}
            >
              <span className="mono">{pad(index + 1)}</span>
              <span className="xp-title">{item.role}</span>
              <time className="mono">{item.date}</time>
            </button>
          </li>
        ))}
        <li className="xp-marker" aria-hidden="true" />
      </ol>

      <div className="xp-details">
        {experience.map((item, index) => (
          <article className={`xp-detail${index === active ? " is-current" : ""}`} id={`xp-detail-${index}`} key={item.date}>
            <header>
              <time className="mono">{item.date}</time>
              <h3>{item.role}</h3>
            </header>
            <p className="mono xp-step">Role {pad(index + 1)} / {pad(experience.length)}</p>
            <p className="xp-copy">{item.copy}</p>
            <ul className="tags" aria-label={`${item.role} technologies`}>
              {item.tech.map((tech) => <li key={tech}>{tech}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
