import React from "react";

/**
 * Kruger Wild — IconButton
 * Circular icon-only control. Pass a Phosphor <i className="ph ph-…" /> as children.
 */
const SIZES = { sm: 32, md: 40, lg: 48 };
const FONT = { sm: 16, md: 20, lg: 24 };

const VARIANTS = {
  solid:   { background: "var(--brand)", color: "var(--text-inverse)", border: "1px solid transparent", "--hover-bg": "var(--brand-hover)" },
  soft:    { background: "var(--surface-sunken)", color: "var(--text-primary)", border: "1px solid transparent", "--hover-bg": "var(--sand-200)" },
  outline: { background: "var(--surface-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)", "--hover-bg": "var(--surface-sunken)" },
  ghost:   { background: "transparent", color: "var(--text-secondary)", border: "1px solid transparent", "--hover-bg": "var(--surface-sunken)" },
};

export function IconButton({
  children, label, variant = "soft", size = "md", disabled = false, style, ...rest
}) {
  const dim = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.soft;
  const [hover, setHover] = React.useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: dim, height: dim, borderRadius: "var(--radius-pill)",
        fontSize: FONT[size] || FONT.md,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
        ...v, background: hover && !disabled && v["--hover-bg"] ? v["--hover-bg"] : v.background,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
