import React from "react";

/**
 * Kruger Wild — PhotoPlate
 * Branded imagery placeholder. Warm duotone wash + a faint Phosphor glyph,
 * standing in for real wildlife/landscape photography. Replace `src` with a
 * real image in production; the plate then renders the photo with a subtle
 * warm overlay to keep it on-palette.
 */
const WASHES = {
  bushveld: "linear-gradient(150deg, #2C4A39 0%, #182D23 70%)",
  savanna:  "linear-gradient(150deg, #D6A25A 0%, #A87727 75%)",
  clay:     "linear-gradient(150deg, #C66A47 0%, #813620 80%)",
  dawn:     "linear-gradient(150deg, #4C7572 0%, #2C4C4A 80%)",
  sand:     "linear-gradient(150deg, #EEE7D7 0%, #CCC2AE 85%)",
};

export function PhotoPlate({
  src, alt = "", icon = "image", label, wash = "bushveld", radius, style, children, ...rest
}) {
  const dark = wash !== "sand";
  return (
    <div
      style={{
        position: "relative", width: "100%", height: "100%", minHeight: 120,
        background: WASHES[wash] || WASHES.bushveld, overflow: "hidden",
        borderRadius: radius || 0, display: "flex", alignItems: "center", justifyContent: "center",
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <>
          <img src={src} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <span style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, rgba(24,45,35,0.10), rgba(24,45,35,0.22))", mixBlendMode: "multiply" }} />
        </>
      ) : (
        <>
          <i className={`ph ph-${icon}`} style={{ fontSize: 44, color: dark ? "rgba(245,239,226,0.34)" : "rgba(33,28,20,0.28)" }} />
          {label ? (
            <span style={{
              position: "absolute", bottom: 12, left: 14,
              fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.12em",
              textTransform: "uppercase", color: dark ? "rgba(245,239,226,0.6)" : "rgba(33,28,20,0.5)",
            }}>{label}</span>
          ) : null}
        </>
      )}
      {children}
    </div>
  );
}
