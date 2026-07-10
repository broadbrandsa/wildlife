"use client";

/** Round arrow button overlaid on a carousel frame. */
export function CarouselArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={dir === "left" ? "Previous" : "Next"}
            style={{
                position: "absolute",
                top: "50%",
                left: dir === "left" ? 10 : undefined,
                right: dir === "right" ? 10 : undefined,
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: "rgba(250,246,236,0.92)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-primary)",
            }}
        >
            <i className={`ph-bold ph-caret-${dir}`} style={{ fontSize: 20 }} />
        </button>
    );
}

/** Dot indicators for the carousel position. */
export function CarouselDots({ index, total }: { index: number; total: number }) {
    return (
        <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
            {Array.from({ length: total }).map((_, i) => (
                <span
                    key={i}
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: i === index ? "var(--accent)" : "var(--border-default)",
                        transition: "all var(--dur-base) var(--ease-out)",
                    }}
                />
            ))}
        </div>
    );
}
