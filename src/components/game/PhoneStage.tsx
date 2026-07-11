import type { CSSProperties, ReactNode } from "react";

const BACKDROP = "radial-gradient(130% 100% at 50% 0%, #21392C 0%, #16110A 92%)";

/**
 * Constrains the experience to a mobile-width column, centered on a dark
 * veld backdrop. The app is mobile-first; on desktop it reads as a phone on a
 * stage. The column is a fixed-height viewport with its own internal scroll.
 */
export function PhoneStage({
    children,
    columnStyle,
    scroll = true,
}: {
    children: ReactNode;
    columnStyle?: CSSProperties;
    scroll?: boolean;
}) {
    return (
        <div
            style={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
                background: BACKDROP,
            }}
        >
            <div
                className="kw-noscroll"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 460,
                    height: "100dvh",
                    // No -webkit-overflow-scrolling: the legacy property makes iOS
                    // Safari clip position:fixed descendants to this scroll box.
                    overflowY: scroll ? "auto" : "hidden",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--surface-page)",
                    boxShadow: "0 40px 100px -30px rgba(0,0,0,0.6)",
                    ...columnStyle,
                }}
            >
                {children}
            </div>
        </div>
    );
}
