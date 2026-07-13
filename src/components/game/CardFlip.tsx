"use client";

import { useState } from "react";

import { Overlay } from "@/components/game/Overlay";

/** True when the device asks for reduced motion; dealt cards skip the flip. */
export function prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A trading-card flip: children render the front, the back is the branded
 * plate. The front's natural height sizes the card; the back covers it.
 *
 * Pass `backImage` (a PNG in /public) to use custom back artwork: it is scaled
 * to cover the card and clipped to the rounded corners, so deliver it full
 * bleed with square corners. If the image fails to load the woven fallback
 * (gradient, emblem, "tap to reveal") shows instead.
 */
export function CardFlip({
    flipped,
    onFlip,
    backIcon,
    backEyebrow,
    backLine,
    backImage,
    children,
}: {
    flipped: boolean;
    onFlip: () => void;
    backIcon: string;
    backEyebrow: string;
    backLine: string;
    backImage?: string;
    children: React.ReactNode;
}) {
    const [imgFailed, setImgFailed] = useState(false);
    const showArt = Boolean(backImage) && !imgFailed;
    return (
        <div style={{ perspective: 1400 }}>
            <div
                onClick={() => {
                    if (!flipped) onFlip();
                }}
                style={{
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 620ms var(--ease-out)",
                    transform: flipped ? "none" : "rotateY(180deg)",
                }}
            >
                <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>{children}</div>
                <div
                    role="button"
                    aria-label="Reveal"
                    style={{
                        position: "absolute",
                        inset: 0,
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        borderRadius: "var(--radius-2xl)",
                        overflow: "hidden",
                        border: "1px solid var(--border-subtle)",
                        boxShadow: "var(--shadow-xl)",
                        background: "linear-gradient(160deg, var(--green-800) 0%, var(--sand-900) 135%)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {showArt && (
                        // Custom back artwork: fills the card, clipped to the rounded frame.
                        <img
                            src={backImage}
                            alt=""
                            aria-hidden="true"
                            onError={() => setImgFailed(true)}
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    )}
                    {!showArt && (
                        <>
                            <span
                                aria-hidden="true"
                                style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, rgba(245,239,226,0.05) 0 2px, transparent 2px 14px)" }}
                            />
                            <span aria-hidden="true" style={{ position: "absolute", inset: 10, border: "1px solid rgba(245,239,226,0.22)", borderRadius: "var(--radius-xl)" }} />
                            <span style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center", padding: "0 var(--space-6)" }}>
                                <span style={{ width: 64, height: 64, borderRadius: "50%", border: "1.5px solid rgba(245,239,226,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className={`ph-fill ph-${backIcon}`} style={{ fontSize: 30, color: "var(--ochre-400)" }} />
                                </span>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(245,239,226,0.6)" }}>
                                    {backEyebrow}
                                </span>
                                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.1rem", color: "var(--sand-50)", lineHeight: 1.4 }}>
                                    {backLine}
                                </span>
                                <span style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ochre-300)", fontWeight: 700 }}>
                                    Tap to reveal
                                </span>
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * A card dealt onto the screen: full-bleed backdrop, the card pops in
 * face-down and a tap flips the reveal. Tapping the backdrop flips first,
 * then dismisses. Species spots, clues and field guides all deal this way.
 */
export function DealtCard({
    flipped,
    onFlip,
    onDismiss,
    backIcon,
    backEyebrow,
    backLine,
    backImage,
    zIndex = 70,
    maxWidth = 400,
    children,
}: {
    flipped: boolean;
    onFlip: () => void;
    onDismiss: () => void;
    backIcon: string;
    backEyebrow: string;
    backLine: string;
    backImage?: string;
    zIndex?: number;
    maxWidth?: number;
    children: React.ReactNode;
}) {
    return (
        <Overlay>
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "var(--gutter)",
                    background: "var(--bg-overlay, rgba(17,32,26,0.6))",
                }}
                onClick={() => (flipped ? onDismiss() : onFlip())}
            >
                <div className="kw-card-pop" onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth }}>
                    <CardFlip flipped={flipped} onFlip={onFlip} backIcon={backIcon} backEyebrow={backEyebrow} backLine={backLine} backImage={backImage}>
                        {children}
                    </CardFlip>
                </div>
            </div>
        </Overlay>
    );
}
