"use client";

import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { ZONES } from "@/data";
import type { ZoneId } from "@/data";
import { clampWalk, distanceKm } from "@/lib/game";
import { CAMPS, formatLatLng, K9_BASE, LANDMARKS, MAP_H, MAP_W, PARK_PATH, PROJ, RIVER_PATHS } from "./map-geometry";

const VW = MAP_W;
const VH = MAP_H;

/**
 * The frame is a real projection, so the full map width maps to a real ground
 * distance. The scale bar reads this live against the current zoom, so the
 * distance it shows shrinks as you zoom in. Derived from PROJ so it tracks the
 * geometry.
 */
const KM_PER_DEG_LNG = 111.32 * Math.cos(((PROJ.lat0 - PROJ.latSpan / 2) * Math.PI) / 180);
const MAP_WIDTH_KM = PROJ.lngSpan * KM_PER_DEG_LNG;
/** Rounded km values the dynamic scale bar snaps to. */
const SCALE_STEPS = [1, 2, 5, 10, 25, 50, 100, 200];
/** Target on-screen length of the scale bar, in px. */
const SCALE_TARGET_PX = 68;

/**
 * Game zone fills, in viewBox px. Band edges follow the real rivers that
 * bound each zone (Luvuvhu, Letaba, Olifants, the Tshokwane line) and MUST
 * stay in step with ZONE_BANDS + zoneAtPoint in src/lib/game.ts.
 */
const BANDS: { id: ZoneId; y: number; h: number; fill: string }[] = [
    { id: "far-north", y: 0, h: 73.7, fill: "#9DBDB8" },
    { id: "punda-sandveld", y: 73.7, h: 92, fill: "#EAD3A6" },
    { id: "mopane-shingwedzi", y: 165.7, h: 194.5, fill: "#E3B79F" },
    { id: "letaba-olifants", y: 360.2, h: 50.2, fill: "#A9C0A5" },
    { id: "central-basalt", y: 410.4, h: 158.8, fill: "#E8C98A" },
];
/** The southern block splits east/west at this x (see zoneAtPoint). */
const SOUTH_Y = 569.2;
const SOUTH_SPLIT_X = 187.2;
/** Lebombo ridge overlay along the Mozambique border. */
const LEBOMBO = { x: 309.6, y0: 380, y1: 653.6 };

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
    /** Distance from the top of the map to the legend card, clearing any overlay above it. */
    legendTop?: number;
    /** Today's walking range in km: draws a dashed ring around the pin. */
    walkRangeKm?: number | null;
    /** Bakkie mode: the drag preview goes anywhere, no walking clamp or ring. */
    freeDrag?: boolean;
    /** Breadcrumb trail of every position held, oldest first, ending at the pin. */
    trail?: { x: number; y: number; day: number; via: "walk" | "truck" }[];
}

export function KrugerMap({ pin, onPlace, revealZones = [], showLabels = true, target = null, maxScale = 4, showThirds = false, legendTop = 12, walkRangeKm = null, freeDrag = false, trail = [] }: KrugerMapProps) {
    const down = useRef<{ x: number; y: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const barRef = useRef<HTMLSpanElement>(null);
    const barLabelRef = useRef<HTMLSpanElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const zoomRef = useRef(1);

    // Recompute the scale bar against the SVG's on-screen width, which already
    // folds in the current pan/zoom. Written imperatively (refs, not state) so
    // it can update every zoom frame without re-rendering the whole map.
    const updateScale = () => {
        const svg = svgRef.current;
        const bar = barRef.current;
        const label = barLabelRef.current;
        if (!svg || !bar || !label) return;
        // ctm.a is on-screen px per viewBox unit, folding in the letterboxing
        // (preserveAspectRatio meet) and the current pan/zoom. This is the same
        // matrix used to place the pin, so the bar tracks the ground exactly.
        const ctm = svg.getScreenCTM();
        if (!ctm || !ctm.a) return;
        const kmPerPx = MAP_WIDTH_KM / VW / ctm.a;
        const raw = kmPerPx * SCALE_TARGET_PX;
        let km = SCALE_STEPS[0];
        for (const step of SCALE_STEPS) if (step <= raw) km = step;
        bar.style.width = `${Math.round(km / kmPerPx)}px`;
        label.textContent = `${km} KM`;
        // Counter-scale the pin markers so they keep a steady on-screen size:
        // the deeper the zoom, the smaller the pin sits on the ground.
        rootRef.current?.style.setProperty("--kw-pin-scale", String(1 / zoomRef.current));
    };

    useEffect(() => {
        const raf = requestAnimationFrame(updateScale);
        window.addEventListener("resize", updateScale);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", updateScale);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Convert a client point through the SVG's own coordinate matrix so it stays
    // accurate under any pan/zoom (getScreenCTM folds in the transform and the
    // preserveAspectRatio letterboxing). Fractions are of the viewBox.
    const clientToFraction = (clientX: number, clientY: number): { x: number; y: number } | null => {
        const svg = svgRef.current;
        if (!svg) return null;
        const ctm = svg.getScreenCTM();
        if (!ctm) return null;
        const local = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
        return { x: Math.min(Math.max(local.x / VW, 0), 1), y: Math.min(Math.max(local.y / VH, 0), 1) };
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        down.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!onPlace || !down.current) return;
        const moved = Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y);
        down.current = null;
        if (moved > 10) return; // it was a pan, not a tap (fingers wobble more than mice)
        const f = clientToFraction(e.clientX, e.clientY);
        if (f) onPlace(f.x, f.y);
    };

    // Drag-to-move: pick the pin up and walk it. The drag is clamped to the
    // day's range along the same bearing, a tether line runs back to the start
    // and a chip reads out the distance being walked.
    const draggable = Boolean(onPlace && pin && !pin.locked && (walkRangeKm != null || freeDrag));
    const [drag, setDrag] = useState<{ x: number; y: number; km: number } | null>(null);

    // react-zoom-pan-pinch listens to NATIVE touch events on its wrapper, which
    // fire before React's root-delegated handlers, so stopping propagation in
    // JSX props is too late: the map still pans under a touch drag. Native
    // listeners on the pin handle itself run first in the bubble path and stop
    // the pan before the wrapper ever hears the touch.
    const draggableRef = useRef(draggable);
    draggableRef.current = draggable;
    const pinHandleRef = (el: HTMLSpanElement | null) => {
        if (!el || el.dataset.touchGuard) return;
        el.dataset.touchGuard = "1";
        const guard = (e: TouchEvent) => {
            if (draggableRef.current) e.stopPropagation();
        };
        el.addEventListener("touchstart", guard, { passive: false });
        el.addEventListener("touchmove", guard, { passive: false });
    };

    const onPinPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
        if (!draggable || !pin) return;
        e.stopPropagation(); // keep the map from panning under the drag
        e.preventDefault();
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // capture is best-effort; the move handler still tracks the pointer
        }
        setDrag({ x: pin.x, y: pin.y, km: 0 });
    };

    const onPinPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
        if (!drag || !pin) return;
        const f = clientToFraction(e.clientX, e.clientY);
        if (!f) return;
        // On a bakkie ride the drag goes anywhere; on foot it clamps to range.
        const t = freeDrag || walkRangeKm == null ? f : clampWalk(pin, f, walkRangeKm);
        setDrag({ x: t.x, y: t.y, km: distanceKm(pin, t) });
    };

    const onPinPointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
        if (!drag) return;
        e.stopPropagation();
        if (onPlace && drag.km > 0.3) onPlace(drag.x, drag.y);
        setDrag(null);
    };

    const dimmed = (id: ZoneId) => revealZones.length > 0 && !revealZones.includes(id);

    // Live coordinates for the map key: the player's pin, or the revealed camp on debrief.
    const coordText = pin ? formatLatLng(pin.x, pin.y) : target ? formatLatLng(target.x, target.y) : null;
    const coordLabel = pin ? "YOUR PIN" : target ? "SUSPECT" : "";

    return (
        <div ref={rootRef} style={{ position: "relative", width: "100%", height: "100%" }}>
        <TransformWrapper
            minScale={1}
            maxScale={maxScale}
            doubleClick={{ mode: "zoomIn" }}
            centerOnInit
            onTransformed={(ref) => {
                zoomRef.current = ref.state.scale || 1;
                updateScale();
            }}
        >
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
                    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <clipPath id="park-clip">
                                <path d={PARK_PATH} />
                            </clipPath>
                        </defs>

                        {/* soft halo behind the park so it reads as land in the veld */}
                        <path d={PARK_PATH} fill="#11201A" transform="translate(2,5)" opacity={0.5} />

                        {/* park body */}
                        <g clipPath="url(#park-clip)">
                            {BANDS.map((b) => (
                                <rect key={b.id} x="0" y={b.y} width={VW} height={b.h} fill={b.fill} opacity={dimmed(b.id) ? 0.4 : 1} />
                            ))}
                            {/* southern block: granite south-west and the Sabie corridor east */}
                            <rect x="0" y={SOUTH_Y} width={SOUTH_SPLIT_X} height={VH - SOUTH_Y} fill="#D2C7B2" opacity={dimmed("sw-granite") ? 0.4 : 1} />
                            <rect x={SOUTH_SPLIT_X} y={SOUTH_Y} width={VW - SOUTH_SPLIT_X} height={VH - SOUTH_Y} fill="#BBCBA9" opacity={dimmed("southern-sabie") ? 0.4 : 1} />

                            {/* Lebombo rhyolite ridge along the Mozambique border */}
                            <rect
                                x={LEBOMBO.x}
                                y={LEBOMBO.y0}
                                width={VW - LEBOMBO.x}
                                height={LEBOMBO.y1 - LEBOMBO.y0}
                                fill="#C66A47"
                                opacity={dimmed("lebombo") ? 0.4 : 0.9}
                            />

                            {/* koppie texture in the granite south-west */}
                            {[
                                [104, 640],
                                [128, 652],
                                [96, 664],
                                [140, 676],
                                [116, 690],
                            ].map(([cx, cy], i) => (
                                <circle key={i} cx={cx} cy={cy} r="4.5" fill="#B7AB92" opacity={0.75} />
                            ))}

                            {/* rivers: soft riverine corridor under the main channels */}
                            {RIVER_PATHS.filter((r) => r.tier === 1).map((r, i) => (
                                <path key={`u${i}`} d={r.d} stroke="#7FA08C" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
                            ))}
                            {RIVER_PATHS.map((r, i) => (
                                <path
                                    key={i}
                                    d={r.d}
                                    stroke="#4C7572"
                                    strokeWidth={r.tier === 1 ? 2.4 : 1.2}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    opacity={r.tier === 1 ? 0.95 : 0.6}
                                />
                            ))}

                            {/* three thirds: faint dividers */}
                            {showThirds && (
                                <g>
                                    <line x1="0" y1={VH / 3} x2={VW} y2={VH / 3} stroke="rgba(33,28,20,0.3)" strokeWidth="1.2" strokeDasharray="5 5" />
                                    <line x1="0" y1={(VH * 2) / 3} x2={VW} y2={(VH * 2) / 3} stroke="rgba(33,28,20,0.3)" strokeWidth="1.2" strokeDasharray="5 5" />
                                </g>
                            )}
                        </g>

                        {/* third labels sit in the west, clear of the Lebombo */}
                        {showThirds &&
                            [
                                { label: "NORTH", y: VH / 6 },
                                { label: "CENTRAL", y: VH / 2 },
                                { label: "SOUTH", y: (VH * 5) / 6 },
                            ].map((t) => (
                                <text
                                    key={t.label}
                                    x={10}
                                    y={t.y}
                                    textAnchor="start"
                                    style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.18em", fill: "rgba(245,239,226,0.45)" }}
                                >
                                    {t.label}
                                </text>
                            ))}

                        {/* park hairline */}
                        <path d={PARK_PATH} fill="none" stroke="rgba(33,28,20,0.4)" strokeWidth="1.4" />

                        {/* camp dots + labels */}
                        {CAMPS.map((c) => (
                            <g key={c.label}>
                                <circle cx={c.x} cy={c.y} r="2.4" fill="#211C14" opacity={0.6} />
                                {showLabels && (
                                    <text
                                        x={c.x + 5}
                                        y={c.y + 3}
                                        style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: "0.05em", fill: "rgba(33,28,20,0.62)" }}
                                    >
                                        {c.label}
                                    </text>
                                )}
                            </g>
                        ))}

                        {/* named landmarks (small diamonds) */}
                        {showLabels &&
                            LANDMARKS.map((l) => (
                                <g key={l.label}>
                                    <rect x={l.x - 2.4} y={l.y - 2.4} width="4.8" height="4.8" transform={`rotate(45 ${l.x} ${l.y})`} fill="#9A3F26" opacity={0.8} />
                                    <text
                                        x={l.x + 5}
                                        y={l.y + 3}
                                        style={{ fontFamily: "var(--font-mono)", fontSize: 6.5, letterSpacing: "0.05em", fill: "rgba(33,28,20,0.5)" }}
                                    >
                                        {l.label}
                                    </text>
                                </g>
                            ))}

                        {/* zone numbers */}
                        {showLabels &&
                            ZONES.map((z) => (
                                <text
                                    key={z.id}
                                    x={z.centroid.x * VW}
                                    y={z.centroid.y * VH}
                                    textAnchor="middle"
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 9,
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        fill: "rgba(33,28,20,0.45)",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {z.number}
                                </text>
                            ))}

                        {/* SAWC K9 base, west of Orpen outside the boundary */}
                        <g>
                            <circle cx={K9_BASE.x} cy={K9_BASE.y} r="4.5" fill="#395C47" stroke="#fff" strokeWidth="1.4" />
                            <text
                                x={K9_BASE.x}
                                y={K9_BASE.y + 14}
                                textAnchor="middle"
                                style={{ fontFamily: "var(--font-mono)", fontSize: 6.5, letterSpacing: "0.1em", fill: "var(--sand-50)" }}
                            >
                                K9 BASE
                            </text>
                        </g>

                        {/* breadcrumb trail: every position held, ending at the pin.
                            Walk legs read tight and dashed; truck legs long and sparse. */}
                        {trail.length >= 2 && (
                            <g pointerEvents="none">
                                {trail.slice(1).map((p, i) => {
                                    const a = trail[i];
                                    const truck = p.via === "truck";
                                    return (
                                        <line
                                            key={i}
                                            x1={a.x * VW}
                                            y1={a.y * VH}
                                            x2={p.x * VW}
                                            y2={p.y * VH}
                                            stroke="var(--clay-500)"
                                            strokeWidth={1.5}
                                            strokeDasharray={truck ? "9 8" : "3 3"}
                                            opacity={truck ? 0.35 : 0.55}
                                        />
                                    );
                                })}
                            </g>
                        )}

                        {/* today's walking range: how far the ranger can move from here.
                            Radii use the same km scales as distanceKm (130 E-W, 366 N-S). */}
                        {walkRangeKm != null && pin && (
                            <ellipse
                                cx={pin.x * VW}
                                cy={pin.y * VH}
                                rx={(walkRangeKm / 130) * VW}
                                ry={(walkRangeKm / 366) * VH}
                                fill="var(--clay-500)"
                                fillOpacity={0.08}
                                stroke="var(--clay-500)"
                                strokeWidth={1.2}
                                strokeDasharray="4 3"
                                opacity={0.9}
                                pointerEvents="none"
                            />
                        )}

                        {/* drag tether: from where the ranger stands to where the pin is being walked */}
                        {drag && pin && drag.km > 0.1 && (
                            <g pointerEvents="none">
                                <line
                                    x1={pin.x * VW}
                                    y1={pin.y * VH}
                                    x2={drag.x * VW}
                                    y2={drag.y * VH}
                                    stroke="var(--clay-500)"
                                    strokeWidth={1.6}
                                    strokeDasharray="5 3"
                                />
                                <circle
                                    cx={pin.x * VW}
                                    cy={pin.y * VH}
                                    r={4}
                                    fill="var(--sand-50)"
                                    stroke="var(--clay-500)"
                                    strokeWidth={1.6}
                                />
                            </g>
                        )}
                    </svg>

                    {/* the revealed poacher camp (debrief only) */}
                    {target && (
                        <span
                            className="kw-pin-drop"
                            style={{
                                position: "absolute",
                                left: `${target.x * 100}%`,
                                top: `${target.y * 100}%`,
                                transform: "translate(-50%, -50%) scale(var(--kw-pin-scale, 1))",
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

                    {/* the player's pin (HTML overlay so it can animate crisply).
                        When movable it is a drag handle: pick it up and walk it.
                        Touch propagation is stopped so react-zoom-pan-pinch (which
                        listens to raw touch events on its wrapper) never starts a
                        pan underneath the drag. */}
                    {pin && (
                        <span
                            ref={pinHandleRef}
                            className={drag ? undefined : "kw-pin-drop"}
                            onPointerDown={onPinPointerDown}
                            onPointerMove={onPinPointerMove}
                            onPointerUp={onPinPointerUp}
                            onPointerCancel={() => setDrag(null)}
                            style={{
                                position: "absolute",
                                left: `${(drag ?? pin).x * 100}%`,
                                top: `${(drag ?? pin).y * 100}%`,
                                // the tip of the rotated square pokes 2px shy of the
                                // padded box bottom, so nudge down to keep it exact.
                                // The counter-scale keeps the pin a steady screen
                                // size, so it sits smaller on the ground when zoomed.
                                transform: "translate(-50%, calc(-100% + 2px)) scale(var(--kw-pin-scale, 1))",
                                transformOrigin: "50% 100%",
                                pointerEvents: draggable ? "auto" : "none",
                                touchAction: "none",
                                cursor: draggable ? (drag ? "grabbing" : "grab") : undefined,
                                padding: 8, // a 46px finger target around the 30px pin
                            }}
                        >
                            {/* teardrop: the sharp corner (bottom-left) swings to the BOTTOM
                                with rotate(-45deg), so the tip points at the ground it marks */}
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50% 50% 50% 2px",
                                    background: pin.locked ? "var(--green-700)" : "var(--clay-500)",
                                    transform: "rotate(-45deg)",
                                    boxShadow: "var(--shadow-md)",
                                    border: "2px solid #fff",
                                }}
                            >
                                <i
                                    className={`ph-fill ph-${pin.locked ? "lock-simple" : "paw-print"}`}
                                    style={{ transform: "rotate(45deg)", color: "#fff", fontSize: 14 }}
                                />
                            </span>
                        </span>
                    )}

                    {/* distance chip: how far the pin is being walked */}
                    {drag && drag.km > 0.1 && (
                        <span
                            style={{
                                position: "absolute",
                                left: `${drag.x * 100}%`,
                                top: `${drag.y * 100}%`,
                                transform: "translate(-50%, calc(-100% - 46px))",
                                pointerEvents: "none",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                whiteSpace: "nowrap",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "var(--radius-pill)",
                                background: "var(--sand-50)",
                                color: "var(--clay-600)",
                                border: "1px solid var(--clay-500)",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            {drag.km.toFixed(1)} KM
                        </span>
                    )}
                </div>
            </TransformComponent>
        </TransformWrapper>

            {/* compass, top-right: the map is a north-up projection, so north is always up */}
            <div
                style={{
                    position: "absolute",
                    top: 12,
                    right: "var(--gutter)",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    background: "rgba(250,246,236,0.9)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--shadow-sm)",
                    pointerEvents: "none",
                }}
                aria-label="Compass, north is up"
            >
                <i className="ph-fill ph-caret-up" style={{ fontSize: 12, color: "var(--clay-500)", lineHeight: 1 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 1 }}>N</span>
            </div>

            {/* legend: vertical key, top-left, tucked under the ranger pill (does not pan or zoom) */}
            <div
                style={{
                    position: "absolute",
                    top: legendTop,
                    left: "var(--gutter)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: "0.45rem 0.6rem",
                    background: "rgba(250,246,236,0.9)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-sm)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.56rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                }}
            >
                <LegendKey label="You">
                    <i className="ph-fill ph-paw-print" style={{ color: "var(--clay-500)", fontSize: 11 }} />
                </LegendKey>
                <LegendKey label="Camp">
                    <i className="ph-fill ph-circle" style={{ color: "var(--sand-900)", fontSize: 7 }} />
                </LegendKey>
                <LegendKey label="River">
                    <span style={{ width: 12, height: 0, borderTop: "2px solid var(--teal-500)", display: "inline-block" }} />
                </LegendKey>
                {walkRangeKm != null && (
                    <LegendKey label="Day's walk">
                        <span style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px dashed var(--clay-500)", display: "inline-block" }} />
                    </LegendKey>
                )}
                {showThirds && (
                    <LegendKey label="Thirds">
                        <span style={{ width: 12, height: 0, borderTop: "1.5px dashed var(--sand-600)", display: "inline-block" }} />
                    </LegendKey>
                )}
            </div>

            {/* dynamic scale bar, bottom-left: the km read shrinks as you zoom in */}
            <div
                style={{
                    position: "absolute",
                    left: "var(--gutter)",
                    bottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    padding: "0.35rem 0.5rem",
                    background: "rgba(250,246,236,0.9)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    boxShadow: "var(--shadow-sm)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.56rem",
                    letterSpacing: "0.12em",
                    color: "var(--text-secondary)",
                    pointerEvents: "none",
                }}
            >
                <span ref={barLabelRef}>25 KM</span>
                <span
                    ref={barRef}
                    style={{
                        display: "block",
                        height: 5,
                        width: 60,
                        borderBottom: "2px solid var(--text-primary)",
                        borderLeft: "2px solid var(--text-primary)",
                        borderRight: "2px solid var(--text-primary)",
                    }}
                />
            </div>

            {/* live coordinates, bottom-right */}
            {coordText && (
                <div
                    style={{
                        position: "absolute",
                        right: "var(--gutter)",
                        bottom: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "0.35rem 0.5rem",
                        background: "rgba(250,246,236,0.9)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        boxShadow: "var(--shadow-sm)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.56rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                    }}
                >
                    <i className="ph ph-crosshair" style={{ color: "var(--text-accent)", fontSize: 11 }} />
                    {coordLabel} {coordText}
                </div>
            )}
        </div>
    );
}

function LegendKey({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ display: "inline-flex", width: 13, justifyContent: "center" }}>{children}</span>
            {label}
        </span>
    );
}
