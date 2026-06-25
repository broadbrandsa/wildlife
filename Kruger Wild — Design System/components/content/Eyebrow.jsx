import React from "react";

/**
 * Kruger Wild — Eyebrow
 * Mono, uppercase, letter-spaced kicker that sits above headings.
 * Optional leading rule for editorial section openers.
 */
export function Eyebrow({ children, rule = false, color = "var(--text-accent)", style, ...rest }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.6rem",
        fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
        letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
        color, ...style,
      }}
      {...rest}
    >
      {rule ? <span style={{ width: 28, height: 1.5, background: "currentColor", opacity: 0.6 }} /> : null}
      {children}
    </span>
  );
}
