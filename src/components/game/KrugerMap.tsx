"use client";

import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

import { CAMP_REACH_KM, REST_CAMPS, ZONES } from "@/data";
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

// ---------------------------------------------------------------------------
// Cartography. Everything below is survey-map dressing derived from the real
// projection: a graticule with degree labels, neighbouring territory, contour
// rings around the park and named rivers. Decorative only; never interactive.

/** ViewBox x for a longitude, y for a latitude (same projection as the pins). */
const lngX = (lng: number) => ((lng - PROJ.lng0) / PROJ.lngSpan) * VW;
const latY = (lat: number) => ((PROJ.lat0 - lat) / PROJ.latSpan) * VH;

const GRID_LNGS = [31.0, 31.5, 32.0];
const GRID_LATS = [-22.5, -23, -23.5, -24, -24.5, -25];

/** Main rivers, labelled in the water's own voice. Positions hand-set. */
const RIVER_LABELS = [
    { name: "Luvuvhu", x: 200, y: 38, rot: -8 },
    { name: "Shingwedzi", x: 122, y: 220, rot: -10 },
    { name: "Letaba", x: 168, y: 350, rot: -6 },
    { name: "Olifants", x: 196, y: 402, rot: -4 },
    { name: "Sabie", x: 286, y: 612, rot: -8 },
];

/** Little hill glyphs along the Lebombo rhyolite ridge. */
const LEBOMBO_HILLS = Array.from({ length: 8 }, (_, i) => ({
    x: i % 2 === 0 ? 323 : 337,
    y: LEBOMBO.y0 + 22 + i * 32,
}));

/**
 * The main tourist roads, drawn camp to camp along the real routes: the H1
 * tar spine from Pafuri down to Skukuza, the Sabie and Crocodile roads in the
 * south, and the H7 to Orpen. Approximate but true to the network.
 */
const MAIN_ROADS = [
    // Pafuri > Punda Maria > Shingwedzi > Mopani > Letaba > Olifants > Satara > Skukuza
    "M 106.4 33.7 Q 68 58 55.6 95 Q 112 146 172.3 190.9 Q 176 240 161.1 286.1 Q 176 330 212.2 363 Q 240 379 258.1 397.9 Q 273 440 269.2 486.9 Q 262 562 218.2 625.6",
    // Skukuza > Lower Sabie > Crocodile Bridge
    "M 218.2 625.6 Q 264 638 307.5 654.3 Q 311 684 301.3 709.4",
];
const SIDE_ROADS = [
    "M 218.2 625.6 Q 170 642 126.2 666.1", // Skukuza > Pretoriuskop
    "M 126.2 666.1 Q 144 700 176.2 725.1", // Pretoriuskop > Berg-en-Dal
    "M 176.2 725.1 Q 240 736 301.3 709.4", // Berg-en-Dal > Crocodile Bridge
    "M 159.6 506.1 Q 215 496 269.2 486.9", // Orpen > Satara
];

/** Waterholes and dams, small and true to their rivers. */
const WATERHOLES = [
    { x: 182, y: 206 }, // Kanniedood, Shingwedzi
    { x: 172, y: 296 }, // Pioneer, Mopani
    { x: 243, y: 492 }, // Nsemani, west of Satara
    { x: 292, y: 662 }, // Sunset Dam, Lower Sabie
];

/** Deterministic tree scatter: a breath of veld texture, never random at render. */
const VEG = (() => {
    let s = 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const pts: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 64; i++) {
        pts.push({ x: 12 + rnd() * (VW - 24), y: 12 + rnd() * (VH - 24), r: 1.1 + rnd() * 1.3 });
    }
    return pts;
})();

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
    /** Today's walking range in km: draws a dashed ring around the pin. */
    walkRangeKm?: number | null;
    /** Bakkie mode: the drag preview goes anywhere, no walking clamp or ring. */
    freeDrag?: boolean;
    /** Breadcrumb trail of every position held, oldest first, ending at the pin. */
    trail?: { x: number; y: number; day: number; via: "walk" | "truck" }[];
    /** Live species markers: fade onto the map near the ranger; tap one to spot it. */
    markers?: { id: string; x: number; y: number; ttlMs: number; icon: string; gold: boolean }[];
    /** Called with a marker id when the player taps it. */
    onSpotMarker?: (id: string) => void;
    /** Bumping this number zooms the map in on the pin (the ranger's Move action). */
    focusSignal?: number;
    /** Night: the ranger has made camp, so the pin shows a campfire. */
    camped?: boolean;
    /** The pin has snapped onto a rest camp, so it shows the rest-camp marker. */
    atCamp?: boolean;
    /** Called with a rest-camp id when its info icon is tapped. */
    onCampInfo?: (id: string) => void;
    /** Camp name shown in a small bubble above the pin when the ranger is at one. */
    campLabel?: string | null;
    /** An unclaimed camp reward: shows a claim box above the pin. */
    campClaim?: { label: string; onClaim: () => void } | null;
    /** The ranger and dog images: the pin becomes a photo of them together
     *  (except when locked, camped at night, or standing on a rest camp). */
    pinRangerSrc?: string;
    pinDogSrc?: string;
    /** On mount, zoom in on the pin until the scale bar reads about this many km. */
    startKm?: number | null;
    /** Food supply, drawn as a segmented ring around the pin marker. */
    foodDays?: number;
    foodTotal?: number;
    foodColor?: string;
    /** Low on food: the pin marker gets a warning border. */
    foodDanger?: boolean;
    /** Status captions shown to the right of the pin (walk time, track cue, warnings). */
    pinChips?: { icon: string; label: string; tone: string; onClick?: () => void; warn?: boolean }[];
    /** Tapping the pin (as opposed to dragging it) opens the ranger status sheet. */
    onPinTap?: () => void;
}

export function KrugerMap({ pin, onPlace, revealZones = [], showLabels = true, target = null, maxScale = 4, showThirds = false, walkRangeKm = null, freeDrag = false, trail = [], markers = [], onSpotMarker, focusSignal = 0, camped = false, atCamp = false, onCampInfo, campLabel = null, campClaim = null, pinRangerSrc, pinDogSrc, startKm = null, foodDays = 0, foodTotal = 0, foodColor = "var(--success)", foodDanger = false, pinChips = [], onPinTap }: KrugerMapProps) {
    const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

    // The ranger's Move action zooms the map in on the pin so the walk radius
    // is easy to read and the drag is comfortable.
    useEffect(() => {
        if (!focusSignal || !pin) return;
        const t = setTimeout(() => {
            // Centre the pin at a comfortable zoom. zoomToElement misjudges the
            // absolutely-positioned pin, so compute the transform from the pin's
            // on-screen rect against the current pan/zoom.
            const api = transformRef.current;
            const wrapper = rootRef.current?.querySelector(".react-transform-wrapper") as HTMLElement | null;
            const pinEl = document.getElementById("kw-pin-focus");
            const cur = api?.instance?.transformState;
            if (!api || !wrapper || !pinEl || !cur) return;
            const wRect = wrapper.getBoundingClientRect();
            const pRect = pinEl.getBoundingClientRect();
            const px = pRect.left + pRect.width / 2 - wRect.left;
            const py = pRect.top + pRect.height / 2 - wRect.top;
            const ux = (px - cur.positionX) / cur.scale;
            const uy = (py - cur.positionY) / cur.scale;
            const newScale = Math.min(maxScale, 3);
            api.setTransform(wRect.width / 2 - ux * newScale, wRect.height / 2 - uy * newScale, newScale, 400);
        }, 60);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusSignal]);

    // On first mount, start the map zoomed in on the pin so the scale bar reads
    // about `startKm` (a closer, walkable view than the whole-park default).
    const didInitZoom = useRef(false);
    useEffect(() => {
        if (didInitZoom.current || !startKm || !pin) return;
        const t = setTimeout(() => {
            const api = transformRef.current;
            const wrapper = rootRef.current?.querySelector(".react-transform-wrapper") as HTMLElement | null;
            const svg = svgRef.current;
            const pinEl = document.getElementById("kw-pin-focus");
            const cur = api?.instance?.transformState;
            if (!api || !wrapper || !svg || !pinEl || !cur) return;
            const rect = svg.getBoundingClientRect();
            if (!rect.width) return;
            // Raw km the scale bar targets at the current zoom, then the scale
            // that lands it mid-step on startKm so the bar snaps to that value.
            const rawNow = (MAP_WIDTH_KM / rect.width) * SCALE_TARGET_PX;
            const idx = SCALE_STEPS.indexOf(startKm);
            const nextStep = idx >= 0 && idx < SCALE_STEPS.length - 1 ? SCALE_STEPS[idx + 1] : startKm * 2;
            const aimRaw = (startKm + nextStep) / 2;
            const target = Math.max(1, Math.min(maxScale, (rawNow * cur.scale) / aimRaw));
            const wRect = wrapper.getBoundingClientRect();
            const pRect = pinEl.getBoundingClientRect();
            const px = pRect.left + pRect.width / 2 - wRect.left;
            const py = pRect.top + pRect.height / 2 - wRect.top;
            const ux = (px - cur.positionX) / cur.scale;
            const uy = (py - cur.positionY) / cur.scale;
            api.setTransform(wRect.width / 2 - ux * target, wRect.height / 2 - uy * target, target, 0);
            didInitZoom.current = true;
        }, 120);
        return () => clearTimeout(t);
        // Depend on `pin` so a first-time player (no pin at mount) still gets the
        // 5 km zoom the first time they drop a pin; the ref keeps it to once.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin]);
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
        // The svg's box matches the viewBox aspect exactly (the parent div pins
        // the ratio), so its on-screen width IS the park's width in pixels.
        // Bounding rects fold in the pan/zoom CSS transform on every browser;
        // getScreenCTM does not on iOS Safari, which froze the bar on phones.
        const rect = svg.getBoundingClientRect();
        if (!rect.width) return;
        const kmPerPx = MAP_WIDTH_KM / rect.width;
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

    // Convert a client point to a fraction of the park artwork. The svg's box
    // matches the viewBox aspect exactly, so the bounding rect maps straight to
    // viewBox space, and rects fold in the pan/zoom transform on every browser
    // (getScreenCTM misses ancestor CSS transforms on iOS Safari).
    const clientToFraction = (clientX: number, clientY: number): { x: number; y: number } | null => {
        const svg = svgRef.current;
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        return {
            x: Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1),
            y: Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1),
        };
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
    const [drag, setDrag] = useState<{ x: number; y: number; km: number; camp: string | null } | null>(null);

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

    // Species markers stop touch propagation the same way, so a tap spots the
    // species instead of panning the map or dropping a pin underneath it.
    const markerGuardRef = (el: HTMLButtonElement | null) => {
        if (!el || el.dataset.touchGuard) return;
        el.dataset.touchGuard = "1";
        const stop = (e: TouchEvent) => e.stopPropagation();
        el.addEventListener("touchstart", stop, { passive: false });
        el.addEventListener("touchmove", stop, { passive: false });
    };

    // Where the finger first touched the pin, so a still tap can be told from a
    // walk (and open the ranger status sheet instead of moving the pin).
    const pinDownRef = useRef<{ x: number; y: number } | null>(null);

    const onPinPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
        if (!pin) return;
        e.stopPropagation(); // keep the map from panning or placing under the pin
        down.current = null; // invalidate any stale map-tap start so a pin press can't place
        pinDownRef.current = { x: e.clientX, y: e.clientY };
        if (!draggable) return;
        e.preventDefault();
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // capture is best-effort; the move handler still tracks the pointer
        }
        setDrag({ x: pin.x, y: pin.y, km: 0, camp: null });
    };

    const onPinPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
        if (!drag || !pin) return;
        const f = clientToFraction(e.clientX, e.clientY);
        if (!f) return;
        // On a bakkie ride the drag goes anywhere; on foot it clamps to range.
        const t = freeDrag || walkRangeKm == null ? f : clampWalk(pin, f, walkRangeKm);
        // Drag near a rest camp and the pin snaps onto it, the same pull the
        // store applies on placement, so you see where you are headed.
        const camp = REST_CAMPS.find((c) => distanceKm(t, { x: c.x, y: c.y }) <= CAMP_REACH_KM);
        const snapped = camp ? { x: camp.x, y: camp.y } : t;
        setDrag({ x: snapped.x, y: snapped.y, km: distanceKm(pin, snapped), camp: camp?.name ?? null });
    };

    const onPinPointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
        if (!pin) return;
        e.stopPropagation();
        const start = pinDownRef.current;
        pinDownRef.current = null;
        const moved = start ? Math.hypot(e.clientX - start.x, e.clientY - start.y) : 0;
        if (drag) {
            // A real relocation walks the pin; anything that stays put is a tap
            // that opens the ranger status sheet. Require both a real ground
            // distance AND a real finger movement: zoomed right in, 0.3 km is
            // only a few px, so a still-tap wobble must not read as a walk.
            if (onPlace && moved > 10 && (drag.km > 0.3 || drag.camp)) onPlace(drag.x, drag.y);
            else onPinTap?.();
            setDrag(null);
            return;
        }
        // Pin held still (locked, walking, camped): a tap opens the status sheet.
        if (moved <= 14) onPinTap?.();
    };

    const dimmed = (id: ZoneId) => revealZones.length > 0 && !revealZones.includes(id);

    // Live coordinates for the map key: the player's pin, or the revealed camp on debrief.
    const coordText = pin ? formatLatLng(pin.x, pin.y) : target ? formatLatLng(target.x, target.y) : null;
    const coordLabel = pin ? "YOUR PIN" : target ? "SUSPECT" : "";

    return (
        <div ref={rootRef} style={{ position: "relative", width: "100%", height: "100%" }}>
        <TransformWrapper
            ref={transformRef}
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
                            {/* paper grain: a whisper of texture over the veld */}
                            <pattern id="kw-grain" width="16" height="16" patternUnits="userSpaceOnUse">
                                <circle cx="3" cy="4" r="0.7" fill="rgba(33,28,20,0.09)" />
                                <circle cx="11" cy="12" r="0.7" fill="rgba(33,28,20,0.06)" />
                                <circle cx="8" cy="7" r="0.5" fill="rgba(245,239,226,0.07)" />
                            </pattern>
                            {/* relief: high western ground shading down toward the Lebombo */}
                            <linearGradient id="kw-relief" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="rgba(33,28,20,0.12)" />
                                <stop offset="0.28" stopColor="rgba(33,28,20,0)" />
                                <stop offset="1" stopColor="rgba(245,239,226,0.05)" />
                            </linearGradient>
                        </defs>

                        {/* graticule: the survey grid behind the park, with degree labels */}
                        <g pointerEvents="none">
                            {GRID_LNGS.map((lng) => (
                                <g key={lng}>
                                    <line x1={lngX(lng)} y1={0} x2={lngX(lng)} y2={VH} stroke="rgba(245,239,226,0.07)" strokeWidth="0.7" />
                                    <text x={lngX(lng) + 3} y={9} style={{ fontFamily: "var(--font-mono)", fontSize: 6, letterSpacing: "0.08em", fill: "rgba(245,239,226,0.30)" }}>
                                        {lng.toFixed(1).replace(".0", "")}° E
                                    </text>
                                </g>
                            ))}
                            {GRID_LATS.map((lat) => (
                                <g key={lat}>
                                    <line x1={0} y1={latY(lat)} x2={VW} y2={latY(lat)} stroke="rgba(245,239,226,0.07)" strokeWidth="0.7" />
                                    <text x={VW - 4} y={latY(lat) - 3} textAnchor="end" style={{ fontFamily: "var(--font-mono)", fontSize: 6, letterSpacing: "0.08em", fill: "rgba(245,239,226,0.30)" }}>
                                        {Math.abs(lat).toFixed(1).replace(".0", "")}° S
                                    </text>
                                </g>
                            ))}
                        </g>

                        {/* neighbouring territory: the park's east boundary is the border */}
                        <g pointerEvents="none">
                            <text
                                x={352}
                                y={190}
                                transform="rotate(90 352 190)"
                                textAnchor="middle"
                                style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: "0.42em", fill: "rgba(245,239,226,0.26)" }}
                            >
                                MOZAMBIQUE
                            </text>
                            <text
                                x={12}
                                y={470}
                                transform="rotate(-90 12 470)"
                                textAnchor="middle"
                                style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: "0.42em", fill: "rgba(245,239,226,0.26)" }}
                            >
                                SOUTH AFRICA
                            </text>
                            {[180, 250, 320, 390, 460, 530, 600].map((y) => (
                                <g key={y} stroke="rgba(245,239,226,0.16)" strokeWidth="0.8">
                                    <line x1={349} y1={y} x2={355} y2={y} />
                                    <line x1={352} y1={y - 3} x2={352} y2={y + 3} />
                                </g>
                            ))}
                        </g>

                        {/* contour rings: the park sits in its ground like a survey plate */}
                        <g pointerEvents="none" fill="none">
                            <path d={PARK_PATH} stroke="rgba(245,239,226,0.04)" strokeWidth="14" />
                            <path d={PARK_PATH} stroke="rgba(245,239,226,0.06)" strokeWidth="7" />
                            <path d={PARK_PATH} stroke="rgba(245,239,226,0.10)" strokeWidth="2.6" />
                        </g>

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

                            {/* zone edges: crisp hairlines where the ground changes */}
                            <g stroke="rgba(33,28,20,0.14)" strokeWidth="0.8">
                                {[...BANDS.slice(1).map((b) => b.y), SOUTH_Y].map((y) => (
                                    <line key={y} x1="0" y1={y} x2={VW} y2={y} />
                                ))}
                                <line x1={SOUTH_SPLIT_X} y1={SOUTH_Y} x2={SOUTH_SPLIT_X} y2={VH} />
                            </g>

                            {/* paper grain across the whole park */}
                            <rect x="0" y="0" width={VW} height={VH} fill="url(#kw-grain)" />

                            {/* relief: the ground rises gently toward the western edge */}
                            <rect x="0" y="0" width={VW} height={VH} fill="url(#kw-relief)" />

                            {/* veld texture: a scatter of trees across the park */}
                            <g pointerEvents="none">
                                {VEG.map((t, i) => (
                                    <g key={i} opacity={0.3}>
                                        <line x1={t.x} y1={t.y} x2={t.x} y2={t.y + 2.6} stroke="rgba(33,28,20,0.7)" strokeWidth="0.5" />
                                        <circle cx={t.x} cy={t.y - 0.6} r={t.r} fill="#41522F" />
                                    </g>
                                ))}
                            </g>

                            {/* hill glyphs along the Lebombo rhyolite ridge */}
                            {LEBOMBO_HILLS.map((h, i) => (
                                <path key={i} d={`M ${h.x} ${h.y} l 5 8 l -10 0 Z`} fill="#8F3B22" opacity={0.4} />
                            ))}

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
                            {[
                                [110, 626],
                                [146, 660],
                                [92, 682],
                            ].map(([x, y], i) => (
                                <path key={`k${i}`} d={`M ${x} ${y} l 5 8 l -10 0 Z`} fill="#9C8F74" opacity={0.7} />
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

                            {/* the tourist roads: tar spine solid, side roads dashed */}
                            <g fill="none" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
                                {MAIN_ROADS.map((d, i) => (
                                    <g key={`m${i}`}>
                                        <path d={d} stroke="rgba(245,239,226,0.5)" strokeWidth="1.8" />
                                        <path d={d} stroke="#A3672F" strokeWidth="0.9" opacity={0.75} />
                                    </g>
                                ))}
                                {SIDE_ROADS.map((d, i) => (
                                    <path key={`s${i}`} d={d} stroke="#8A6B3F" strokeWidth="0.8" strokeDasharray="3 2.4" opacity={0.6} />
                                ))}
                            </g>

                            {/* waterholes and dams */}
                            {WATERHOLES.map((w, i) => (
                                <g key={i} pointerEvents="none">
                                    <circle cx={w.x} cy={w.y} r="2.2" fill="#4C7572" opacity={0.85} />
                                    <circle cx={w.x} cy={w.y} r="3.4" fill="none" stroke="#4C7572" strokeWidth="0.5" opacity={0.4} />
                                </g>
                            ))}

                            {/* the park's name, set into the ground like a plate mark */}
                            <text
                                x={92}
                                y={452}
                                transform="rotate(-90 92 452)"
                                textAnchor="middle"
                                style={{ fontFamily: "var(--font-serif)", fontSize: 11, letterSpacing: "0.5em", fill: "rgba(33,28,20,0.16)", fontWeight: 600 }}
                            >
                                KRUGER NATIONAL PARK
                            </text>

                            {/* the great rivers, named in the water's voice */}
                            {showLabels &&
                                RIVER_LABELS.map((r) => (
                                    <text
                                        key={r.name}
                                        x={r.x}
                                        y={r.y}
                                        transform={`rotate(${r.rot} ${r.x} ${r.y})`}
                                        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 7.5, letterSpacing: "0.06em", fill: "#33585A", opacity: 0.9 }}
                                    >
                                        {r.name}
                                    </text>
                                ))}

                            {/* inner highlight: a light rim just inside the boundary */}
                            <path d={PARK_PATH} fill="none" stroke="rgba(245,239,226,0.35)" strokeWidth="2.2" />

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

                    {/* rest-camp info icons: tap to read about each real KNP camp */}
                    {onCampInfo &&
                        REST_CAMPS.map((c) => (
                            <button
                                key={c.id}
                                ref={markerGuardRef}
                                onPointerDown={(e) => e.stopPropagation()}
                                onPointerUp={(e) => {
                                    e.stopPropagation();
                                    onCampInfo(c.id);
                                }}
                                className="kw-press"
                                aria-label={`${c.name} rest camp, read about it`}
                                style={{
                                    position: "absolute",
                                    left: `${c.x * 100}%`,
                                    top: `${c.y * 100}%`,
                                    transform: "translate(-50%, -50%) scale(var(--kw-pin-scale, 1))",
                                    transformOrigin: "50% 50%",
                                    touchAction: "none",
                                    cursor: "pointer",
                                    padding: 6,
                                    border: "none",
                                    background: "transparent",
                                }}
                            >
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 18,
                                        height: 18,
                                        borderRadius: "50%",
                                        background: "var(--sand-50)",
                                        border: "1.5px solid var(--green-700)",
                                        boxShadow: "var(--shadow-sm)",
                                    }}
                                >
                                    <i className="ph-fill ph-house-line" style={{ fontSize: 10, color: "var(--green-700)" }} />
                                </span>
                            </button>
                        ))}

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

                    {/* live species markers: fade in near the ranger, tap to spot.
                        Common families show a generic family glyph; a rare or once
                        in a lifetime sighting shows a gold star instead. */}
                    {markers.map((m) => (
                        <button
                            key={m.id}
                            ref={markerGuardRef}
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => {
                                e.stopPropagation();
                                onSpotMarker?.(m.id);
                            }}
                            className="kw-press"
                            aria-label={m.gold ? "Spot the rare species here" : "Spot the species here"}
                            style={{
                                position: "absolute",
                                left: `${m.x * 100}%`,
                                top: `${m.y * 100}%`,
                                transform: "translate(-50%, -50%) scale(var(--kw-pin-scale, 1))",
                                transformOrigin: "50% 50%",
                                animation: `kw-marker-life ${m.ttlMs}ms linear forwards`,
                                touchAction: "none",
                                cursor: "pointer",
                                padding: 8, // a comfortable finger target around the token
                                border: "none",
                                background: "transparent",
                            }}
                        >
                            <span
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: m.gold ? "var(--ochre-100)" : "var(--sand-50)",
                                    border: `2px solid ${m.gold ? "var(--ochre-400)" : "#fff"}`,
                                    boxShadow: m.gold ? "var(--shadow-md), 0 0 0 3px var(--ochre-100)" : "var(--shadow-md)",
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    className="kw-marker-ring"
                                    style={{ position: "absolute", inset: -2, borderRadius: "50%", border: `2px solid ${m.gold ? "var(--ochre-500)" : "var(--clay-500)"}` }}
                                />
                                <i className={`ph-fill ph-${m.icon}`} style={{ fontSize: 16, color: m.gold ? "var(--ochre-600)" : "var(--green-800)" }} />
                            </span>
                        </button>
                    ))}

                    {/* the player's pin (HTML overlay so it can animate crisply).
                        When movable it is a drag handle: pick it up and walk it.
                        Touch propagation is stopped so react-zoom-pan-pinch (which
                        listens to raw touch events on its wrapper) never starts a
                        pan underneath the drag. */}
                    {pin && (
                        <span
                            ref={pinHandleRef}
                            id="kw-pin-focus"
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
                                // Promote to its own layer so the browser rasterises the
                                // ranger/dog photo at true screen resolution instead of
                                // baking it small into the zoomed map layer and upscaling
                                // it (which made the marker blur when zoomed in).
                                willChange: "transform",
                                pointerEvents: "auto",
                                touchAction: "none",
                                cursor: draggable ? (drag ? "grabbing" : "grab") : "pointer",
                                padding: 8, // a 46px finger target around the 30px pin
                            }}
                        >
                            {!pin.locked && !camped && !atCamp && pinRangerSrc ? (
                                // A photo marker of the ranger and dog together, ringed
                                // by the food supply, with a small tail so it still
                                // points at the ground.
                                <span style={{ position: "relative", display: "block", width: 48, height: 55 }}>
                                    {foodTotal > 0 && (
                                        <svg
                                            width={62}
                                            height={62}
                                            viewBox="0 0 62 62"
                                            style={{ position: "absolute", top: -7, left: -7, pointerEvents: "none" }}
                                            aria-hidden="true"
                                        >
                                            {Array.from({ length: foodTotal }).map((_, i) => {
                                                const segDeg = 360 / foodTotal;
                                                const gap = 12;
                                                const a1 = i * segDeg + gap / 2;
                                                const a2 = (i + 1) * segDeg - gap / 2;
                                                const r = 28;
                                                const polar = (deg: number) => {
                                                    const rad = ((deg - 90) * Math.PI) / 180;
                                                    return { x: 31 + r * Math.cos(rad), y: 31 + r * Math.sin(rad) };
                                                };
                                                const p1 = polar(a1);
                                                const p2 = polar(a2);
                                                const large = a2 - a1 > 180 ? 1 : 0;
                                                return (
                                                    <path
                                                        key={i}
                                                        d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`}
                                                        fill="none"
                                                        stroke={i < foodDays ? foodColor : "rgba(255,255,255,0.4)"}
                                                        strokeWidth={4}
                                                        strokeLinecap="round"
                                                    />
                                                );
                                            })}
                                        </svg>
                                    )}
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: 48,
                                            height: 48,
                                            borderRadius: "50%",
                                            overflow: "hidden",
                                            border: `2px solid ${foodDanger ? "var(--clay-500)" : "#fff"}`,
                                            boxShadow: foodDanger ? "var(--shadow-md), 0 0 0 2px var(--clay-100)" : "var(--shadow-md)",
                                            background: "var(--sand-100)",
                                        }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={pinRangerSrc} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                        {pinDogSrc && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={pinDogSrc}
                                                alt=""
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                                style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "66%", maxHeight: "52%", objectFit: "contain", objectPosition: "bottom" }}
                                            />
                                        )}
                                    </span>
                                    {/* pointer tail */}
                                    <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "9px solid #fff", filter: "drop-shadow(0 2px 1px rgba(17,32,26,0.3))" }} />
                                </span>
                            ) : (
                                // teardrop: the sharp corner swings to the BOTTOM with
                                // rotate(-45deg), so the tip points at the ground it marks
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50% 50% 50% 2px",
                                        background: pin.locked ? "var(--green-700)" : camped ? "var(--ochre-600)" : atCamp ? "var(--green-700)" : "var(--clay-500)",
                                        transform: "rotate(-45deg)",
                                        boxShadow: "var(--shadow-md)",
                                        border: "2px solid #fff",
                                    }}
                                >
                                    <i
                                        className={`ph-fill ph-${pin.locked ? "lock-simple" : camped ? "campfire" : atCamp ? "house-line" : "paw-print"}`}
                                        style={{ transform: "rotate(45deg)", color: "#fff", fontSize: 14 }}
                                    />
                                </span>
                            )}
                        </span>
                    )}

                    {/* status captions to the right of the pin: the walk time, the
                        dog's track cue and any warning. Counter-scaled so they hold a
                        steady on-screen size as the map zooms. */}
                    {pin && !drag && !campLabel && pinChips.length > 0 && (
                        <span
                            style={{
                                position: "absolute",
                                left: `${pin.x * 100}%`,
                                top: `${pin.y * 100}%`,
                                transform: "translate(calc(28px * var(--kw-pin-scale, 1)), calc(-46px * var(--kw-pin-scale, 1))) scale(var(--kw-pin-scale, 1))",
                                transformOrigin: "0% 0%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: 5,
                                pointerEvents: "none",
                            }}
                        >
                            {pinChips.map((chip, i) => {
                                const warnBg = chip.warn;
                                const inner = (
                                    <>
                                        <i className={`ph-fill ph-${chip.icon}`} style={{ fontSize: 11, color: chip.tone, flex: "none", marginTop: chip.warn ? 1 : 0 }} />
                                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.06em", fontWeight: 700, textTransform: "uppercase", color: chip.tone, lineHeight: 1.3 }}>
                                            {chip.label}
                                        </span>
                                    </>
                                );
                                const style: React.CSSProperties = {
                                    display: "flex",
                                    alignItems: chip.warn ? "flex-start" : "center",
                                    gap: 4,
                                    maxWidth: 150,
                                    padding: "5px 8px",
                                    borderRadius: 10,
                                    background: warnBg ? "var(--clay-100)" : "rgba(250,246,236,0.92)",
                                    backdropFilter: "blur(8px)",
                                    WebkitBackdropFilter: "blur(8px)",
                                    border: `1px solid ${warnBg ? "var(--clay-500)" : "var(--border-subtle)"}`,
                                    boxShadow: "var(--shadow-sm)",
                                    pointerEvents: "auto",
                                };
                                return chip.onClick ? (
                                    <button
                                        key={i}
                                        className="kw-press"
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            chip.onClick?.();
                                        }}
                                        aria-label={chip.label}
                                        style={{ ...style, cursor: "pointer" }}
                                    >
                                        {inner}
                                    </button>
                                ) : (
                                    <span key={i} style={style}>
                                        {inner}
                                    </span>
                                );
                            })}
                        </span>
                    )}

                    {/* move hint: the ranger can move, so nudge the player to drag
                        the pin. Hidden the moment they grab it (drag becomes set),
                        and while at a camp the camp bubble takes the space instead. */}
                    {pin && !drag && !campLabel && draggable && !freeDrag && (
                        <span
                            style={{
                                position: "absolute",
                                left: `${pin.x * 100}%`,
                                top: `${pin.y * 100}%`,
                                transform: "translate(-50%, calc(-100% - 44px * var(--kw-pin-scale, 1))) scale(var(--kw-pin-scale, 1))",
                                transformOrigin: "50% 100%",
                                pointerEvents: "none",
                            }}
                        >
                            <span
                                className="kw-rise"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 5,
                                    padding: "0.28rem 0.6rem",
                                    borderRadius: "var(--radius-pill)",
                                    background: "var(--sand-50)",
                                    border: "1px solid var(--border-subtle)",
                                    boxShadow: "var(--shadow-md)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <i className="ph-fill ph-hand-tap" style={{ fontSize: 13, color: "var(--ochre-600)" }} />
                                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-primary)" }}>Drag to move your pin</span>
                            </span>
                        </span>
                    )}

                    {/* camp bubble: when the pin has snapped onto a rest camp, name
                        it above the pin, with a claim box for its free power-up */}
                    {pin && !drag && campLabel && (
                        <span
                            style={{
                                position: "absolute",
                                left: `${pin.x * 100}%`,
                                top: `${pin.y * 100}%`,
                                transform: "translate(-50%, calc(-100% - 44px * var(--kw-pin-scale, 1))) scale(var(--kw-pin-scale, 1))",
                                transformOrigin: "50% 100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                                pointerEvents: "none",
                            }}
                        >
                            {campClaim ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 7,
                                        width: 156,
                                        padding: "0.5rem 0.6rem 0.55rem",
                                        borderRadius: "var(--radius-lg)",
                                        background: "var(--sand-50)",
                                        border: "1px solid var(--border-subtle)",
                                        boxShadow: "var(--shadow-md)",
                                        textAlign: "center",
                                    }}
                                >
                                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", lineHeight: 1.35, color: "var(--text-secondary)" }}>
                                        <strong style={{ color: "var(--text-primary)" }}>{campClaim.label}</strong> unlocked from {campLabel} rest camp
                                    </span>
                                    <button
                                        ref={markerGuardRef}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onPointerUp={(e) => {
                                            e.stopPropagation();
                                            campClaim.onClaim();
                                        }}
                                        className="kw-press"
                                        aria-label={`Claim the ${campClaim.label} superpower from ${campLabel}`}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 5,
                                            padding: "0.32rem 0.7rem",
                                            borderRadius: "var(--radius-pill)",
                                            background: "var(--ochre-500)",
                                            color: "var(--sand-900)",
                                            border: "none",
                                            boxShadow: "var(--shadow-sm)",
                                            cursor: "pointer",
                                            pointerEvents: "auto",
                                            touchAction: "none",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <i className="ph-fill ph-sparkle" style={{ fontSize: 13 }} />
                                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.74rem", fontWeight: 700 }}>Claim superpower</span>
                                    </button>
                                </div>
                            ) : (
                                <span
                                    style={{
                                        display: "inline-flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 1,
                                        padding: "0.28rem 0.6rem",
                                        borderRadius: "var(--radius-lg)",
                                        background: "var(--sand-50)",
                                        border: "1px solid var(--border-subtle)",
                                        boxShadow: "var(--shadow-sm)",
                                        whiteSpace: "nowrap",
                                        textAlign: "center",
                                    }}
                                >
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Ranger is at</span>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-primary)" }}>
                                        <i className="ph-fill ph-house-line" style={{ fontSize: 11, color: "var(--green-700)" }} />
                                        {campLabel} rest camp
                                    </span>
                                </span>
                            )}
                        </span>
                    )}

                    {/* drag chip: how far the pin is being walked, or a note that it
                        has snapped onto a rest camp and where it is headed */}
                    {drag && (drag.km > 0.1 || drag.camp) && (
                        <span
                            style={{
                                position: "absolute",
                                left: `${drag.x * 100}%`,
                                top: `${drag.y * 100}%`,
                                // counter-scale like the pin, so the chip keeps a
                                // steady on-screen size however far you zoom in
                                transform: "translate(-50%, calc(-100% - 46px * var(--kw-pin-scale, 1))) scale(var(--kw-pin-scale, 1))",
                                transformOrigin: "50% 100%",
                                pointerEvents: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                fontFamily: drag.camp ? "var(--font-sans)" : "var(--font-mono)",
                                fontSize: drag.camp ? "0.72rem" : "0.68rem",
                                fontWeight: 700,
                                letterSpacing: drag.camp ? "0" : "0.06em",
                                whiteSpace: "nowrap",
                                padding: "0.24rem 0.6rem",
                                borderRadius: "var(--radius-pill)",
                                background: drag.camp ? "var(--ochre-500)" : "var(--sand-50)",
                                color: drag.camp ? "var(--sand-900)" : "var(--clay-600)",
                                border: `1px solid ${drag.camp ? "var(--ochre-500)" : "var(--clay-500)"}`,
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            {drag.camp ? (
                                <>
                                    <i className="ph-fill ph-house-line" style={{ fontSize: 13 }} />
                                    Go to {drag.camp} rest camp
                                </>
                            ) : (
                                `${drag.km.toFixed(1)} KM`
                            )}
                        </span>
                    )}
                </div>
            </TransformComponent>
        </TransformWrapper>

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

            {/* bottom-right: the compass (north-up projection) next to the live
                coordinates. The compass moved here from the top of the map. */}
            <div style={{ position: "absolute", right: "var(--gutter)", bottom: 10, display: "flex", alignItems: "center", gap: 6, pointerEvents: "none" }}>
                <div
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0,
                        background: "rgba(250,246,236,0.9)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid var(--border-subtle)",
                        boxShadow: "var(--shadow-sm)",
                    }}
                    aria-label="Compass, north is up"
                >
                    <i className="ph-fill ph-caret-up" style={{ fontSize: 11, color: "var(--clay-500)", lineHeight: 1 }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 1 }}>N</span>
                </div>
                {coordText && (
                    <div
                        style={{
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
                        }}
                    >
                        <i className="ph ph-crosshair" style={{ color: "var(--text-accent)", fontSize: 11 }} />
                        {coordLabel} {coordText}
                    </div>
                )}
            </div>
        </div>
    );
}

