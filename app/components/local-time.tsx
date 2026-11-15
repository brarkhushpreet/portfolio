"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live clock for Sirsa (IST). Renders a placeholder until it runs in the browser. */
export function LocalTime() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => setTime(format.format(new Date()));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <time className="local-time" suppressHydrationWarning>{time} IST</time>;
}
