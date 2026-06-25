import React from "react";

/**
 * Kruger Wild — Badge
 * Status indicator with a leading dot. Built around IUCN conservation
 * statuses but supports generic tones too.
 */
const STATUS = {
  lc: { label: "Least Concern",        dot: "#3C7A4E", bg: "var(--green-100)",  fg: "var(--green-800)" },
  nt: { label: "Near Threatened",      dot: "#7A8C2E", bg: "var(--green-50)",   fg: "var(--green-800)" },
  vu: { label: "Vulnerable",           dot: "var(--ochre-600)", bg: "var(--ochre-100)", fg: "var(--ochre-900)" },
  en: { label: "Endangered",           dot: "var(--clay-500)",  bg: "var(--clay-100)",  fg: "var(--clay-900)" },
  cr: { label: "Critically Endangered", dot: "#8C1F12", bg: "var(--clay-100)",  fg: "var(--clay-900)" },
  info:    { dot: "var(--info)",    bg: "var(--info-soft)",    fg: "var(--teal-700)" },
  neutral: { dot: "var(--sand-500)", bg: "var(--surface-sunken)", fg: "var(--text-secondary)" },
};

export function Badge({ children, status = "neutral", solid = false, style, ...rest }) {
  const s = STATUS[status] || STATUS.neutral;
  const label = children || s.label;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.45rem",
        fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)",
        fontSize: "0.75rem", letterSpacing: "0.01em", lineHeight: 1.2,
        padding: "0.28rem 0.7rem 0.28rem 0.6rem", borderRadius: "var(--radius-sm)",
        background: solid ? s.dot : s.bg,
        color: solid ? "#fff" : s.fg,
        ...style,
      }}
      {...rest}
    >
      {!solid && (
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, flex: "none" }} />
      )}
      {label}
    </span>
  );
}
