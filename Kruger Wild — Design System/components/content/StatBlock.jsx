import React from "react";

/**
 * Kruger Wild — StatBlock
 * Field-guide figure: a large serif value with a mono uppercase label.
 * Use in stat strips, species vitals, park facts.
 */
export function StatBlock({ value, label, sub, align = "left", divider = false, inverse = false, style, ...rest }) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", gap: "0.35rem",
        textAlign: align,
        paddingLeft: divider ? "var(--space-5)" : 0,
        borderLeft: divider ? `1px solid ${inverse ? "rgba(255,255,255,0.2)" : "var(--border-default)"}` : "none",
        ...style,
      }}
      {...rest}
    >
      <span style={{
        fontFamily: "var(--font-serif)", fontWeight: "var(--fw-semibold)",
        fontSize: "clamp(2rem, 1.2rem + 2vw, 2.9rem)", lineHeight: 1,
        letterSpacing: "var(--tracking-tight)", color: inverse ? "var(--sand-50)" : "var(--text-primary)",
      }}>{value}</span>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: "0.72rem",
        letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
        color: inverse ? "var(--ochre-300)" : "var(--text-accent)",
      }}>{label}</span>
      {sub ? (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: inverse ? "rgba(245,239,226,0.7)" : "var(--text-muted)" }}>{sub}</span>
      ) : null}
    </div>
  );
}
