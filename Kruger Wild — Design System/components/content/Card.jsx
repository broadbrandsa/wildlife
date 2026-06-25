import React from "react";

/**
 * Kruger Wild — Card
 * Editorial content card. Two modes:
 *  - default: media plate on top, content below (species, articles, trails)
 *  - overlay: content sits over a full-bleed media with a protection gradient
 */
export function Card({
  media, mediaHeight = 200, eyebrow, title, description, meta, footer,
  overlay = false, hoverLift = true, children, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);

  const shell = {
    position: "relative", display: "flex", flexDirection: "column",
    background: "var(--surface-card)", borderRadius: "var(--radius-card)",
    overflow: "hidden", border: "1px solid var(--border-subtle)",
    boxShadow: hover && hoverLift ? "var(--shadow-lg)" : "var(--shadow-sm)",
    transform: hover && hoverLift ? "translateY(-3px)" : "none",
    transition: "box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
    ...style,
  };

  if (overlay) {
    return (
      <div
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ ...shell, minHeight: mediaHeight, justifyContent: "flex-end" }}
        {...rest}
      >
        <div style={{ position: "absolute", inset: 0 }}>{media}</div>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(17,32,26,0) 30%, rgba(17,32,26,0.82) 100%)",
        }} />
        <div style={{ position: "relative", padding: "var(--space-5)", color: "var(--sand-50)" }}>
          {eyebrow ? <div style={{ marginBottom: "0.5rem" }}>{eyebrow}</div> : null}
          {title ? <h3 style={{ margin: 0, color: "#fff", fontSize: "var(--text-h4)" }}>{title}</h3> : null}
          {description ? <p style={{ margin: "0.4rem 0 0", color: "rgba(245,239,226,0.82)", fontSize: "var(--text-sm)" }}>{description}</p> : null}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={shell}
      {...rest}
    >
      {media ? (
        <div style={{ height: mediaHeight, overflow: "hidden", position: "relative" }}>{media}</div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", padding: "var(--space-5)" }}>
        {eyebrow ? <div>{eyebrow}</div> : null}
        {title ? <h3 style={{ margin: 0, fontSize: "var(--text-h4)", lineHeight: 1.2 }}>{title}</h3> : null}
        {meta ? <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{meta}</div> : null}
        {description ? <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}>{description}</p> : null}
        {children}
        {footer ? <div style={{ marginTop: "0.5rem", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>{footer}</div> : null}
      </div>
    </div>
  );
}
