"use client";

import React from "react";

/**
 * Kruger Wild — Button
 * Pill-shaped action. Calm, confident; warm shadow on raised variants.
 */
const SIZES = {
  sm: { fontSize: "0.8125rem", padding: "0.5rem 1rem",   gap: "0.4rem",  iconSize: 16 },
  md: { fontSize: "0.9375rem", padding: "0.7rem 1.4rem", gap: "0.5rem",  iconSize: 18 },
  lg: { fontSize: "1.0625rem", padding: "0.9rem 1.9rem", gap: "0.6rem",  iconSize: 20 },
};

const VARIANTS = {
  primary: {
    background: "var(--brand)", color: "var(--text-inverse)",
    border: "1px solid transparent", boxShadow: "var(--shadow-sm)",
    "--hover-bg": "var(--brand-hover)", "--active-bg": "var(--brand-active)",
  },
  accent: {
    background: "var(--accent)", color: "var(--sand-900)",
    border: "1px solid transparent", boxShadow: "var(--shadow-sm)",
    "--hover-bg": "var(--accent-hover)", "--active-bg": "var(--ochre-700)",
  },
  secondary: {
    background: "transparent", color: "var(--text-brand)",
    border: "1.5px solid var(--green-700)", boxShadow: "none",
    "--hover-bg": "var(--green-50)", "--active-bg": "var(--green-100)",
  },
  ghost: {
    background: "transparent", color: "var(--text-primary)",
    border: "1px solid transparent", boxShadow: "none",
    "--hover-bg": "var(--surface-sunken)", "--active-bg": "var(--sand-200)",
  },
  ondark: {
    background: "var(--sand-50)", color: "var(--green-900)",
    border: "1px solid transparent", boxShadow: "var(--shadow-md)",
    "--hover-bg": "var(--white)", "--active-bg": "var(--sand-150)",
  },
};

export function Button({
  children, variant = "primary", size = "md", iconLeft, iconRight,
  fullWidth = false, disabled = false, type = "button", style, ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const bg = disabled ? v.background
    : active && v["--active-bg"] ? v["--active-bg"]
    : hover && v["--hover-bg"] ? v["--hover-bg"]
    : v.background;

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: fullWidth ? "flex" : "inline-flex",
        width: fullWidth ? "100%" : "auto",
        alignItems: "center", justifyContent: "center", gap: s.gap,
        fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)",
        fontSize: s.fontSize, lineHeight: 1, letterSpacing: "0.01em",
        padding: s.padding, borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transform: active && !disabled ? "translateY(0.5px)" : "none",
        transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        ...v, background: bg, ...style,
      }}
      {...rest}
    >
      {iconLeft ? <span style={{ display: "inline-flex", fontSize: s.iconSize }}>{iconLeft}</span> : null}
      {children}
      {iconRight ? <span style={{ display: "inline-flex", fontSize: s.iconSize }}>{iconRight}</span> : null}
    </button>
  );
}
