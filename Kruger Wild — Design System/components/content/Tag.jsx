import React from "react";

/**
 * Kruger Wild — Tag
 * Soft pill for categories, habitats, trail difficulty, filters.
 * Optional leading icon (Phosphor <i/>). Set `interactive` for filter chips.
 */
const TONES = {
  neutral: { bg: "var(--surface-sunken)", fg: "var(--text-secondary)", bd: "var(--border-subtle)" },
  green:   { bg: "var(--green-100)",  fg: "var(--green-800)", bd: "var(--green-200)" },
  ochre:   { bg: "var(--ochre-100)",  fg: "var(--ochre-900)", bd: "var(--ochre-200)" },
  clay:    { bg: "var(--clay-100)",   fg: "var(--clay-900)",  bd: "var(--clay-200)" },
  teal:    { bg: "var(--teal-100)",   fg: "var(--teal-700)",  bd: "var(--teal-300)" },
};

export function Tag({
  children, tone = "neutral", icon, interactive = false, selected = false, size = "md", style, ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  const pad = size === "sm" ? "0.2rem 0.6rem" : "0.32rem 0.78rem";
  const fs = size === "sm" ? "0.72rem" : "0.8125rem";
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        fontFamily: "var(--font-sans)", fontWeight: "var(--fw-medium)",
        fontSize: fs, lineHeight: 1.2, padding: pad,
        borderRadius: "var(--radius-pill)",
        background: selected ? "var(--brand)" : t.bg,
        color: selected ? "var(--text-inverse)" : t.fg,
        border: `1px solid ${selected ? "transparent" : t.bd}`,
        cursor: interactive ? "pointer" : "default",
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      {icon ? <span style={{ display: "inline-flex", fontSize: "1.05em" }}>{icon}</span> : null}
      {children}
    </span>
  );
}
