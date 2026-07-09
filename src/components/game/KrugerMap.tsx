"use client";

import { useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { ROUND, ZONES } from "@/data";
import type { ZoneId } from "@/data";

const VW = 360;
const VH = 760;

// Park outline (stylised oblong, narrower at the poles).
const PARK =
    "M150,16 C120,20 96,42 90,92 C72,150 56,212 62,282 C52,362 56,462 72,542 C82,612 96,680 130,724 C160,748 212,748 246,728 C286,704 300,640 304,560 C312,470 308,380 300,300 C296,230 300,150 280,96 C266,56 230,18 200,16 Z";

// Horizontal zone bands within the park (viewBox coords).
const BANDS: { id: ZoneId; y: number; h: number; fill: string }[] = [
    { id: "far-north", y: 16, h: 96, fill: "#9DBDB8" },
    { id: "punda-sandveld", y: 112, h: 72, fill: "#EAD3A6" },
    { id: "mopane-shingwedzi", y: 184, h: 116, fill: "#E3B79F" },
    { id: "letaba-olifants", y: 300, h: 118, fill: "#A9C0A5" },
    { id: "central-basalt", y: 418, h: 128, fill: "#E8C98A" },
    { id: "southern-sabie", y: 546, h: 118, fill: "#BBCBA9" },
    { id: "sw-granite", y: 664, h: 96, fill: "#D2C7B2" },
];

// East-flowing rivers (west → east edge, drifting south).
const RIVERS = [
    "M86,78 C150,70 220,96 306,96",
    "M70,214 C150,208 230,232 306,236",
    "M66,372 C150,366 232,392 308,392",
    "M86,470 C160,466 232,486 304,486",
    "M92,584 C160,580 232,598 300,600",
];

const CAMPS: { x: number; y: number; label: string }[] = [
    { x: 200, y: 70, label: "Pafuri" },
    { x: 150, y: 150, label: "Punda" },
    { x: 196, y: 250, label: "Shingwedzi" },
    { x: 214, y: 388, label: "Letaba" },
    { x: 168, y: 470, label: "Satara" },
    { x: 186, y: 600, label: "Skukuza" },
    { x: 140, y: 700, label: "Pretoriuskop" },
];

interface KrugerMapProps {
    pin: { x: number; y: number; locked?: boolean } | null;
    onPlace?: (x: number, y: number) => void;
    revealZones?: ZoneId[];
    showLabels?: boolean;
    /** Revealed poacher location (debrief only). */
    target?: { x: number; y: number } | null;
    /** Maximum pinch-zoom. Pro binoculars lift this from 4 to 8. */
    maxScale?: number;
    /** Draw the faint north / central / south third dividers and labels. */
    showThirds?: boolean;
}

export function KrugerMap({ pin, onPlace, revealZones = [], showLabels = true, target = null, maxScale = 4, showThirds = false }: KrugerMapProps) {
    const down = useRef<{ x: number; y: number } | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        down.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!onPlace || !down.current) return;
        const moved = Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y);
        down.current = null;
        if (moved > 6) return; // it was a pan, not a tap
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
        onPlace(x, y);
    };

    return (
        <TransformWrapper minScale={1} maxScale={maxScale} doubleClick={{ mode: "zoomIn" }} centerOnInit>
            <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}
            >
                {/* The interactive layer matches the drawing's aspect ratio exactly, so a
                    normalised tap fraction is a fraction of the PARK ARTWORK. Zone bands,
                    thirds and distance in lib/game.ts all assume this coordinate space. */}
                <div
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    style={{ position: "relative", height: "100%", aspectRatio: `${VW} / ${VH}`, touchAction: "none" }}
                >
                    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <clipPath id="park-clip">
                                <path d={PARK} />
                            </clipPath>
                        </defs>

                        {/* soft halo behind the park so it reads as land in the veld */}
                        <path d={PARK} fill="#11201A" transform="translate(0,6)" opacity={0.55} />

                        {/* park body */}
                        <g clipPath="url(#park-clip)">
                            {BANDS.map((b) => {
                                const dim = revealZones.length > 0 && !revealZones.includes(b.id);
                                return (
                                    <rect
                                        key={b.id}
                                        x="0"
                                        y={b.y}
                                        width={VW}
                                        height={b.h}
                                        fill={b.fill}
                                        opacity={dim ? 0.4 : 1}
                                    />
                                );
                            })}

                            {/* Lebombo rhyolite ridge along the eastern border */}
                            <path
                                d="M286,300 C300,360 304,440 300,520 C298,560 292,600 282,628 L266,624 C276,580 282,520 282,460 C282,400 278,348 270,306 Z"
                                fill="#C66A47"
                                opacity={revealZones.length > 0 && !revealZones.includes("lebombo") ? 0.4 : 0.92}
                            />

                            {/* rivers */}
                            {RIVERS.map((d, i) => (
                                <path key={i} d={d} stroke="#4C7572" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity={0.85} />
                            ))}

                            {/* faint koppie texture in the granite SW */}
                            {[
                                [120, 690],
                                [150, 705],
                                [110, 715],
                            ].map(([cx, cy], i) => (
                                <circle key={i} cx={cx} cy={cy} r="6" fill="#B7AB92" opacity={0.7} />
                            ))}

                            {/* three thirds: faint dividers + labels */}
                            {showThirds && (
                                <g>
                                    <line x1="0" y1={VH / 3} x2={VW} y2={VH / 3} stroke="rgba(33,28,20,0.28)" strokeWidth="1.2" strokeDasharray="5 5" />
                                    <line x1="0" y1={(VH * 2) / 3} x2={VW} y2={(VH * 2) / 3} stroke="rgba(33,28,20,0.28)" strokeWidth="1.2" strokeDasharray="5 5" />
                                    {[
                                        { label: "NORTH", y: VH / 6 },
                                        { label: "CENTRAL", y: VH / 2 },
                                        { label: "SOUTH", y: (VH * 5) / 6 },
                                    ].map((t) => (
                                        <text
                                            key={t.label}
                                            x={296}
                                            y={t.y}
                                            textAnchor="end"
                                            style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.18em", fill: "rgba(33,28,20,0.35)" }}
                                        >
                                            {t.label}
                                        </text>
                                    ))}
                                </g>
                            )}
                        </g>

                        {/* park hairline */}
                        <path d={PARK} fill="none" stroke="rgba(33,28,20,0.25)" strokeWidth="1.5" />

                        {/* camp dots + labels */}
                        {CAMPS.map((c) => (
                            <g key={c.label}>
                                <circle cx={c.x} cy={c.y} r="2.6" fill="#211C14" opacity={0.55} />
                                {showLabels && (
                                    <text
                                        x={c.x + 6}
                                        y={c.y + 3}
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: 8,
                                            letterSpacing: "0.06em",
                                            fill: "rgba(33,28,20,0.6)",
                                        }}
                                    >
                                        {c.label}
                                    </text>
                                )}
                            </g>
                        ))}

                        {/* zone names */}
                        {showLabels &&
                            ZONES.map((z) => (
                                <text
                                    key={z.id}
                                    x={z.centroid.x * VW}
                                    y={z.centroid.y * VH}
                                    textAnchor="middle"
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 7.5,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        fill: "rgba(33,28,20,0.42)",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {z.number}
                                </text>
                            ))}

                        {/* SAWC K9 base marker, west of Orpen */}
                        <g>
                            <circle cx={0.06 * VW} cy={0.55 * VH} r="5" fill="#395C47" stroke="#fff" strokeWidth="1.5" />
                            <text
                                x={0.06 * VW}
                                y={0.55 * VH + 16}
                                textAnchor="middle"
                                style={{ fontFamily: "var(--font-mono)", fontSize: 6.5, letterSpacing: "0.1em", fill: "var(--sand-50)" }}
                            >
                                K9 BASE
                            </text>
                        </g>
                    </svg>

                    {/* the revealed poacher camp (debrief only) */}
                    {target && (
                        <span
                            className="kw-pin-drop"
                            style={{
                                position: "absolute",
                                left: `${target.x * 100}%`,
                                top: `${target.y * 100}%`,
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }}
                        >
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    background: "var(--ochre-500)",
                                    boxShadow: "var(--shadow-md)",
                                    border: "2px solid #fff",
                                }}
                            >
                                <i className="ph-fill ph-campfire" style={{ color: "var(--sand-900)", fontSize: 15 }} />
                            </span>
                        </span>
                    )}

                    {/* the player's pin (HTML overlay so it can animate crisply) */}
                    {pin && (
                        <span
                            className="kw-pin-drop"
                            style={{
                                position: "absolute",
                                left: `${pin.x * 100}%`,
                                top: `${pin.y * 100}%`,
                                transform: "translate(-50%, -100%)",
                                pointerEvents: "none",
                            }}
                        >
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50% 50% 50% 2px",
                                    background: pin.locked ? "var(--green-700)" : "var(--clay-500)",
                                    transform: "rotate(45deg)",
                                    boxShadow: "var(--shadow-md)",
                                    border: "2px solid #fff",
                                }}
                            >
                                <i
                                    className={`ph-fill ph-${pin.locked ? "lock-simple" : "paw-print"}`}
                                    style={{ transform: "rotate(-45deg)", color: "#fff", fontSize: 14 }}
                                />
                            </span>
                        </span>
                    )}
                </div>
            </TransformComponent>
        </TransformWrapper>
    );
}
