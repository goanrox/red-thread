"use client";

import { useState, useEffect } from "react";

const TAGLINES = [
  "Every clue tells a story.",
  "Every suspect has a secret.",
  "Only the truth ends it.",
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
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className="font-serif italic text-2xl md:text-3xl text-mist leading-relaxed"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 400ms ease",
      }}
    >
      {TAGLINES[index]}
    </p>
  );
}
