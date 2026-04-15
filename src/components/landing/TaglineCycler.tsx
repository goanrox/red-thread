"use client";

import { useState, useEffect } from "react";

const TAGLINES = [
  "Every suspect has a secret.",
  "Only the truth ends it.",
  "Every clue tells a story.",
  "Some cases never stay buried.",
  "The truth hides in plain sight.",
  "Every alibi leaves a trace.",
];

export function TaglineCycler() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % TAGLINES.length);
        setFading(false);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className="font-serif italic text-2xl md:text-3xl leading-relaxed"
      style={{
        opacity: fading ? 0 : 1,
        transform: fading ? "translateY(-6px)" : "translateY(0)",
        transition: "opacity 500ms ease, transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        color: "rgba(245, 245, 240, 0.78)",
      }}
    >
      {TAGLINES[index]}
    </p>
  );
}
