"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import { Button, Eyebrow, Tag } from "@/components/ds";
import { DealtCard, prefersReducedMotion } from "@/components/game/CardFlip";
import { ClueCard } from "@/components/game/ClueCard";
import { GuideCardFront } from "@/components/game/GuideCard";
import { ImpactHighlight, useCampaignTotal } from "@/components/game/impact";
import { KrugerMap } from "@/components/game/KrugerMap";
import { formatLatLng } from "@/components/game/map-geometry";
import { Overlay } from "@/components/game/Overlay";
import { ZoneSheet } from "@/components/game/ZoneSheet";
import { CAMP_REWARD, CLUE_BY_ID, CLUES, DOG_BY_ID, FIVES, FIVE_OF, RANGER_BY_ID, REST_CAMPS, REST_CAMP_BY_ID, ROUND, SPECIES, SPECIES_BY_ID, ZONES, ZONE_BY_ID, speciesActivity, speciesStats } from "@/data";
import type { Clue, Species, Zone } from "@/data";
import {
    SCENT_TEXT,
    THIRD_LABEL,
    availableClueIds,
    dailyWalkKm,
    distanceKm,
    scentDirectionText,
    FOOD_DAYS,
    foodDaysLeft,
    daysRemaining,
    isRested,
    isRoundOver,
    nextClueCountdown,
    nextClueLabel,
    poacherThird,
    restProgress,
    restRemainingLabel,
    scentRead,
    thirdOf,
    tierRank,
    zoneAtPoint,
} from "@/lib/game";
import { RARITY_META, SPOTTER_DOGS, rollSpot } from "@/lib/spotting";
import { FAMILY_ICON, FAMILY_LABEL, makeMarker, spawnDelayMs } from "@/lib/markers";
import type { SpotMarker } from "@/lib/markers";
import type { ScentTier } from "@/lib/game";
import { NEAR_TARGET_KM, rangersHunting, rangersNearTarget } from "@/lib/community";
import { CAMP_HOUR, PHASE_META, PHASE_SKY, formatClock, isDusk, isNight, phaseForHour } from "@/lib/daytime";
import { useClock } from "@/hooks/use-clock";
import { useCurrentDay, useGameStore } from "@/store/game";

const TIER_META: Record<ScentTier, { label: string; tone: "neutral" | "teal" | "ochre" | "clay"; icon: string }> = {
    cold: { label: "Cold ground", tone: "neutral", icon: "thermometer-cold" },
    faint: { label: "Faint trail", tone: "teal", icon: "wind" },
    warm: { label: "Warm trail", tone: "ochre", icon: "footprints" },
    hot: { label: "Fresh sign", tone: "clay", icon: "paw-print" },
};

type SheetId = "status" | "ranger" | "dog" | "clue" | "guides" | "bakkie" | "night" | "spots" | "radio";

/**
 * Ranger power-ups: consumable tools shown as count-badged icons on the map.
 * The bakkie ride's count is the store's truckRidesLeft; the rest live in the
 * powerups map. Reaching a rest camp grants one free (see CAMP_REWARD).
 */
const POWERUPS: { id: string; name: string; icon: string; blurb: string }[] = [
    { id: "ride", name: "Bakkie ride", icon: "truck", blurb: "Drive the ranger to any point on the map, skipping the walk." },
    { id: "scan", name: "Binocular scan", icon: "binoculars", blurb: "Glass the bush and turn up a species right where you stand." },
    { id: "ration", name: "Field rations", icon: "fork-knife", blurb: "Top up your food supply in the field, with no trip to a rest camp." },
    { id: "snack", name: "Trail rations", icon: "cookie", blurb: "Push on and reach your destination now, ending the walk." },
];
const POWERUP_BY_ID = Object.fromEntries(POWERUPS.map((p) => [p.id, p]));

/**
 * Custom card-back artwork. Drop the designer's PNGs at these paths in
 * /public/cards (see the README there for the exact spec). Until a file is
 * present each card falls back to the woven back automatically.
 */
const CARD_BACK = {
    species: "/cards/card-back-species.png",
    clue: "/cards/card-back-clue.png",
    guide: "/cards/card-back-guide.png",
};

// A card read from the log carries found: false when the species is still out
// there; the card then shows its photo in black and white with a Not found pill.
type SpotItem = { species: Species; isNew: boolean; count: number; bonus?: boolean; found?: boolean };

/** Small clay notification dot pinned to a corner of its parent. */
function NDot() {
    return (
        <span
            style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: "var(--clay-500)",
                border: "2px solid var(--sand-50)",
                boxShadow: "var(--shadow-sm)",
            }}
        />
    );
}

/** The team icon: one round badge of the ranger with their dog at their feet
 *  (the dog is a background-removed cutout), wrapped by the food-supply ring.
 *  The border turns green when ready to move and red when food is low. Tapping
 *  opens the ranger profile. */
function TeamIcon({ rangerSrc, dogSrc, alt, ready, danger, foodDays, foodTotal, foodColor, onClick }: { rangerSrc: string; dogSrc?: string; alt: string; ready: boolean; danger: boolean; foodDays: number; foodTotal: number; foodColor: string; onClick: () => void }) {
    const ICON = 104;
    const PAD = 8;
    const WRAP = ICON + PAD * 2;
    const border = danger ? "var(--clay-500)" : ready ? "var(--success)" : "var(--sand-50)";
    return (
        <button
            onClick={onClick}
            aria-label={ready ? `${alt}, ready` : alt}
            className="kw-press"
            style={{ position: "relative", width: WRAP, height: WRAP, border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
        >
            <FoodRing days={foodDays} total={foodTotal} color={foodColor} size={WRAP} />
            <span
                style={{
                    position: "absolute",
                    top: PAD,
                    left: PAD,
                    width: ICON,
                    height: ICON,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `3px solid ${border}`,
                    background: "var(--sand-100)",
                    boxShadow: danger ? "var(--shadow-md), 0 0 0 3px var(--clay-100)" : "var(--shadow-md)",
                    transition: "border-color 200ms var(--ease-out), box-shadow 200ms var(--ease-out)",
                }}
            >
                <Image src={rangerSrc} alt={alt} fill sizes="104px" style={{ objectFit: "cover" }} />
                {dogSrc && (
                    // Background-removed dog cutout, standing at the ranger's feet.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={dogSrc}
                        alt=""
                        aria-hidden="true"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                        style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "64%", maxHeight: "52%", objectFit: "contain", objectPosition: "bottom", filter: "drop-shadow(0 2px 3px rgba(17,32,26,0.4))" }}
                    />
                )}
            </span>
        </button>
    );
}


/**
 * The rucksack fans its contents out in a right-facing half-moon. Five slots,
 * spaced across a 156-degree arc, positioned around the 104px rucksack box.
 */
const RUCKSACK_ARC = [-78, -39, 0, 39, 78].map((deg) => {
    const r = 116;
    const rad = (deg * Math.PI) / 180;
    const size = 46;
    return { left: 52 + r * Math.cos(rad) - size / 2, top: 52 + r * Math.sin(rad) - size / 2 };
});

/** One tool inside the opened rucksack: an icon token with a count badge, greyed
 *  out when empty. Positioned absolutely along the fan. Set showCount false for
 *  items with no tally (the spotting log), which then stay full colour. */
function ArcItem({ icon, count, label, left, top, delay, showCount = true, onClick }: { icon: string; count: number; label: string; left: number; top: number; delay: number; showCount?: boolean; onClick: () => void }) {
    const has = showCount ? count > 0 : true;
    return (
        <button
            onClick={onClick}
            aria-label={showCount ? `${label}, ${count}` : label}
            className="kw-press kw-rise"
            style={{
                position: "absolute",
                left,
                top,
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: "2px solid var(--sand-50)",
                background: "var(--accent-soft)",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 7,
                animationDelay: `${delay}ms`,
                filter: has ? "none" : "grayscale(1)",
                opacity: has ? 1 : 0.7,
            }}
        >
            <i className={`ph-fill ph-${icon}`} style={{ fontSize: 22, color: "var(--ochre-700)" }} />
            {showCount && count > 0 && (
                <span
                    style={{
                        position: "absolute",
                        top: -3,
                        right: -3,
                        minWidth: 16,
                        height: 16,
                        borderRadius: 999,
                        background: "var(--ochre-500)",
                        color: "var(--sand-900)",
                        border: "2px solid var(--sand-50)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.54rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "var(--shadow-sm)",
                    }}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

/** A compact status chip beside a team icon: a small icon and a tinted label.
 *  Pass onClick to make it a tappable prompt (used for the dog's track cue), and
 *  maxWidth to let a longer label wrap instead of running off to one line. */
function MiniChip({ icon, label, tone, maxWidth, onClick }: { icon: string; label: string; tone: string; maxWidth?: number; onClick?: () => void }) {
    const style: React.CSSProperties = {
        display: maxWidth ? "flex" : "inline-flex",
        alignItems: maxWidth ? "flex-start" : "center",
        gap: 4,
        maxWidth,
        padding: "5px 8px",
        borderRadius: 10,
        background: "rgba(250,246,236,0.9)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-sm)",
    };
    const inner = (
        <>
            <i className={`ph-fill ph-${icon}`} style={{ fontSize: 11, color: tone, flex: "none", marginTop: maxWidth ? 1 : 0 }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.06em", fontWeight: 700, textTransform: "uppercase", color: tone, lineHeight: 1.3 }}>
                {label}
            </span>
        </>
    );
    if (onClick) {
        return (
            <button onClick={onClick} aria-label={label} className="kw-press kw-rise" style={{ ...style, cursor: "pointer" }}>
                {inner}
            </button>
        );
    }
    return <div style={style}>{inner}</div>;
}

/** The ranger's food supply as a segmented ring that wraps the team icon: one
 *  arc per day, filled arcs in the food colour, empties in the sunken tone. */
function FoodRing({ days, total, color, size }: { days: number; total: number; color: string; size: number }) {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 4;
    const gapDeg = 12;
    const segDeg = 360 / total;
    const polar = (deg: number) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
            {Array.from({ length: total }).map((_, i) => {
                const a1 = i * segDeg + gapDeg / 2;
                const a2 = (i + 1) * segDeg - gapDeg / 2;
                const p1 = polar(a1);
                const p2 = polar(a2);
                const large = a2 - a1 > 180 ? 1 : 0;
                return (
                    <path
                        key={i}
                        d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`}
                        fill="none"
                        stroke={i < days ? color : "var(--surface-sunken)"}
                        strokeWidth={5}
                        strokeLinecap="round"
                        style={{ transition: "stroke 300ms var(--ease-out)" }}
                    />
                );
            })}
        </svg>
    );
}

/** Custom side-dock tab: a rounded plate hanging off the right edge of the map. */
function DockTab({ icon, label, dot, sub, onClick }: { icon: string; label: string; dot?: boolean; sub?: string | null; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label={sub ? `${label}, next clue in ${sub}` : label}
            className="kw-press"
            style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                width: 58,
                padding: "0.6rem 0 0.5rem",
                background: "rgba(250,246,236,0.94)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 14,
                boxShadow: "var(--shadow-md)",
                cursor: "pointer",
            }}
        >
            {dot && (
                <span style={{ position: "absolute", top: 4, right: 6 }}>
                    <span style={{ position: "relative", display: "block", width: 13, height: 13 }}>
                        <NDot />
                    </span>
                </span>
            )}
            <i className={`ph-fill ph-${icon}`} style={{ fontSize: 21, color: "var(--ochre-700)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                {label}
            </span>
            {sub && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 2, marginTop: 1, fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.04em", fontWeight: 700, color: "var(--ochre-700)", whiteSpace: "nowrap" }}>
                    <i className="ph ph-timer" style={{ fontSize: 9 }} /> {sub}
                </span>
            )}
        </button>
    );
}

/** Bottom sheet shared by every popup on the map. Portalled above the shell. */
function Sheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
    return (
        <Overlay>
            <div
                style={{ position: "fixed", inset: 0, zIndex: 55, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "var(--bg-overlay, rgba(17,32,26,0.55))" }}
                onClick={onClose}
            >
                <div
                    className="kw-rise"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        width: "100%",
                        maxWidth: 480,
                        maxHeight: "82dvh",
                        overflowY: "auto",
                        background: "var(--surface-page)",
                        borderTopLeftRadius: "var(--radius-2xl)",
                        borderTopRightRadius: "var(--radius-2xl)",
                        padding: "var(--space-5) var(--gutter) calc(var(--space-7) + env(safe-area-inset-bottom))",
                        boxShadow: "var(--shadow-xl)",
                    }}
                >
                    <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--border-default)", margin: "0 auto var(--space-5)" }} />
                    {children}
                </div>
            </div>
        </Overlay>
    );
}

function MapInner() {
    const router = useRouter();
    const params = useSearchParams();
    const showWelcome = params.get("welcome") === "1";

    const player = useGameStore((s) => s.player);
    const pin = useGameStore((s) => s.pin);
    const moveRanger = useGameStore((s) => s.moveRanger);
    const lockPin = useGameStore((s) => s.lockPin);
    const grantFieldGuide = useGameStore((s) => s.grantFieldGuide);
    const cluesUnlocked = useGameStore((s) => s.cluesUnlocked);
    const inventory = useGameStore((s) => s.inventory);
    const fieldGuides = useGameStore((s) => s.fieldGuides);
    const scentSeenAt = useGameStore((s) => s.scentSeenAt);
    const cluesSeenDay = useGameStore((s) => s.cluesSeenDay);
    const markScentSeen = useGameStore((s) => s.markScentSeen);
    const markCluesSeen = useGameStore((s) => s.markCluesSeen);
    const truckRidesLeft = useGameStore((s) => s.truckRidesLeft);
    const rideTruck = useGameStore((s) => s.rideTruck);
    const lastMoveAt = useGameStore((s) => s.lastMoveAt);
    const moveTravelMs = useGameStore((s) => s.moveTravelMs);
    const resupplyDay = useGameStore((s) => s.resupplyDay);
    const pickupHoldDay = useGameStore((s) => s.pickupHoldDay);
    const resupply = useGameStore((s) => s.resupply);
    const autoPickup = useGameStore((s) => s.autoPickup);
    const lastRevealKey = useGameStore((s) => s.lastRevealKey);
    const prevRead = useGameStore((s) => s.prevRead);
    const hotStreak = useGameStore((s) => s.hotStreak);
    const recordReveal = useGameStore((s) => s.recordReveal);
    const zoneMarks = useGameStore((s) => s.zoneMarks);
    const ruleOutZone = useGameStore((s) => s.ruleOutZone);
    const trail = useGameStore((s) => s.trail);
    const sightings = useGameStore((s) => s.sightings);
    const recordSighting = useGameStore((s) => s.recordSighting);
    const fivesWon = useGameStore((s) => s.fivesWon);
    const recordFiveWin = useGameStore((s) => s.recordFiveWin);
    const powerups = useGameStore((s) => s.powerups);
    const campsVisited = useGameStore((s) => s.campsVisited);
    const usePowerup = useGameStore((s) => s.usePowerup);
    const visitCamp = useGameStore((s) => s.visitCamp);
    const arriveNow = useGameStore((s) => s.arriveNow);
    const campaignTotal = useCampaignTotal();

    const [dismissed, setDismissed] = useState(false);
    const [guideZone, setGuideZone] = useState<Zone | null>(null);
    const [lockModal, setLockModal] = useState(false);
    const [sheet, setSheet] = useState<SheetId | null>(null);
    // Bakkie mode: pick anywhere on the map, then confirm the ride.
    const [truckMode, setTruckMode] = useState(false);
    const [truckDest, setTruckDest] = useState<{ x: number; y: number } | null>(null);
    // Which elimination clue was just marked on the case board (confirmation line).
    const [markedClueId, setMarkedClueId] = useState<string | null>(null);
    // The species just spotted, or a collection card being read.
    const [spot, setSpot] = useState<SpotItem | null>(null);
    const [spotQueue, setSpotQueue] = useState<SpotItem[]>([]);
    // Fresh spots deal in face-down like a trading card; a tap flips the reveal.
    const [spotFlipped, setSpotFlipped] = useState(true);
    // Live species markers on the map (ephemeral session state). Only one shows
    // at a time, and the gap before the next grows with each one shown.
    const [markers, setMarkers] = useState<SpotMarker[]>([]);
    const markerSeq = useRef(0);
    const shownSinceMove = useRef(0);
    const nextSpawnAt = useRef<number | null>(null);
    // Wall-clock tick that drives the ranger's walk bar and live countdowns.
    const [nowMs, setNowMs] = useState(() => Date.now());
    // Bumped by the ranger's Move action to zoom the map in on the pin.
    const [focusSignal, setFocusSignal] = useState(0);
    // Whether the field radio's HQ report has been opened this session (dock dot).
    const [radioSeen, setRadioSeen] = useState(false);
    // The rest camp whose info card is open (tapped its map icon).
    const [campInfo, setCampInfo] = useState<string | null>(null);
    // A short-lived toast (power-up used, camp reward earned).
    const [toast, setToast] = useState<string | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // The power-up whose info card is open (tapped its icon).
    const [powerupSheet, setPowerupSheet] = useState<string | null>(null);
    // The rucksack: tap to fan the power-ups and spots out in a half-moon.
    const [rucksackOpen, setRucksackOpen] = useState(false);
    // Food resupply popup at a rest camp, and the once-per-arrival guard for it.
    const [foodPrompt, setFoodPrompt] = useState(false);
    const foodPromptRef = useRef<string | null>(null);
    // Camp name shown in the auto-pickup notice after food runs out.
    const [pickupNotice, setPickupNotice] = useState<string | null>(null);
    // New clues deal onto the screen the same way, once per release day.
    const [clueCard, setClueCard] = useState<Clue | null>(null);
    const [clueFlipped, setClueFlipped] = useState(true);
    // A freshly unlocked field guide deals in as a card too.
    const [guideCard, setGuideCard] = useState<Zone | null>(null);
    const [guideFlipped, setGuideFlipped] = useState(true);
    // A completed five: celebrated once the card flow finishes.
    const [pendingFiveWin, setPendingFiveWin] = useState<(typeof FIVES)[number] | null>(null);
    const [fiveWin, setFiveWin] = useState<(typeof FIVES)[number] | null>(null);
    const day = useCurrentDay();
    const roundOver = isRoundOver(day);

    // Day/night cycle, from the device clock (or the demo scrubber).
    const { hour, minute } = useClock();
    const phase = phaseForHour(hour);
    const night = isNight(hour);
    const sky = PHASE_SKY[phase];

    const available = useMemo(() => {
        const ids = availableClueIds(cluesUnlocked, day);
        return CLUES.filter((c) => ids.has(c.id));
    }, [cluesUnlocked, day]);

    // Latest / most specific clue to surface behind the clue dock tab.
    const latest = useMemo(() => {
        const dated = available
            .filter((c) => c.releaseDay != null)
            .sort((a, b) => (b.releaseDay ?? 0) - (a.releaseDay ?? 0));
        return dated[0] ?? available[available.length - 1] ?? CLUE_BY_ID["f01"];
    }, [available]);

    const dog = player ? DOG_BY_ID[player.dogId] : null;
    const ranger = player ? RANGER_BY_ID[player.rangerId] : null;
    const rangerName = player?.displayName ?? "Ranger";
    const dogName = player?.dogName ?? dog?.name ?? "your dog";

    const pinZone = pin ? ZONE_BY_ID[zoneAtPoint(pin)] : null;
    const clueCountdown = nextClueLabel(day);

    // When a move snaps the pin onto a rest camp, name it above the pin and
    // offer its free power-up to claim by hand (once per camp).
    const campAtPin = pin ? REST_CAMPS.find((c) => distanceKm(pin, { x: c.x, y: c.y }) < 0.6) ?? null : null;
    const campReward = campAtPin ? CAMP_REWARD[campAtPin.id] : null;
    const campRewardUnclaimed = Boolean(campAtPin && campReward && !campsVisited.includes(campAtPin.id));

    // How many distinct species are in the spotting log (the rucksack's Spots badge).
    const spottedCount = useMemo(() => new Set(sightings.map((s) => s.speciesId)).size, [sightings]);
    // The rucksack's contents, fanned out in order: the four power-ups then your spots.
    const rucksackItems: { id: string; icon: string; label: string; count: number; showCount?: boolean; onClick: () => void }[] = [
        { id: "ride", icon: "truck", label: "Bakkie ride", count: truckRidesLeft, onClick: () => setSheet("bakkie") },
        { id: "scan", icon: "binoculars", label: "Binocular scan", count: powerups.scan ?? 0, onClick: () => setPowerupSheet("scan") },
        { id: "ration", icon: "fork-knife", label: "Field rations", count: powerups.ration ?? 0, onClick: () => setPowerupSheet("ration") },
        { id: "snack", icon: "cookie", label: "Trail rations", count: powerups.snack ?? 0, onClick: () => setPowerupSheet("snack") },
        { id: "spots", icon: "paw-print", label: "Spots", count: spottedCount, showCount: false, onClick: () => setSheet("spots") },
    ];
    // The rucksack's badge: every power-up you are carrying, added together
    // (the spots are a log, not a power-up, so they are left out of the count).
    const powerupTotal = rucksackItems.filter((it) => it.id !== "spots").reduce((sum, it) => sum + it.count, 0);

    // After a move the ranger is walking to the new location and cannot move
    // again until they arrive; the walk time (moveTravelMs) scales with distance.
    // At night the ranger and dog make camp.
    const rangerArrived = isRested(lastMoveAt, nowMs, moveTravelMs);
    // Food supply: days left before the ranger must resupply at a rest camp.
    const foodLeft = foodDaysLeft(resupplyDay, day);
    const foodOut = Boolean(pin && foodLeft <= 0);
    // The day of an auto-pickup: the ranger holds at the camp and moves out again the next day.
    const heldForResupply = pickupHoldDay != null && pickupHoldDay === day;
    const rangerReady = Boolean(pin && !pin.locked && !night && !roundOver && rangerArrived && !heldForResupply);
    // The ranger can move when arrived; the very first pin drops with no pin yet.
    const canMove = !pin ? true : rangerReady;
    const walkKm = dailyWalkKm(player?.dogId);
    // The ranger's walk bar and live countdown to arrival (seconds for the profile/pill).
    const rangerWalkPct = restProgress(lastMoveAt, nowMs, moveTravelMs);
    const rangerWalkLabelSec = restRemainingLabel(lastMoveAt, nowMs, moveTravelMs, true);
    // The ranger is out on patrol whenever they have not yet reached the new pin.
    const rangerWalking = Boolean(pin && lastMoveAt != null && !rangerArrived && !roundOver);
    // Food gauge colour: green with room to spare, orange at two days, red on
    // the last day. Low: one day or less left (and not just resupplied), which
    // reddens the team icon and shows the resupply warning.
    const foodTone = foodLeft >= 3 ? "var(--success)" : foodLeft === 2 ? "var(--ochre-500)" : "var(--clay-500)";
    const foodLow = Boolean(pin && !heldForResupply && foodLeft <= 1);
    // Dusk nudge: light is going and the ranger is rested and could still move.
    const showDuskPrompt = Boolean(pin && !pin.locked && !roundOver && isDusk(hour) && rangerReady);

    // Ops-room pressure line: the same shared report for every player.
    const near = rangersNearTarget(day);

    // The dog reads the ground wherever the ranger currently stands.
    const read = useMemo(
        () =>
            pin
                ? scentRead(pin, {
                      dogId: player?.dogId,
                      range: inventory.includes("monthly-healthcare"),
                      compass: inventory.includes("ranger-compass"),
                  })
                : null,
        [pin, player?.dogId, inventory],
    );

    const hasRadio = inventory.includes("field-radio");
    const targetThird = poacherThird();

    // The scent read plays as a short reveal exactly once per new position or
    // new day. Once the key is recorded, reopening renders instantly.
    const revealKey = pin ? `${day}:${pin.updatedAt}` : null;
    const [revealing, setRevealing] = useState(false);
    // Whether the dog has already read the ground the ranger is standing on.
    const scentReadHere = Boolean(pin && revealKey && revealKey === lastRevealKey);

    const startReveal = () => {
        if (!revealKey || !read) return;
        if (revealKey === lastRevealKey) return; // already played
        const reduced =
            typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const land = () => {
            setRevealing(false);
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                if (read.tier === "warm") navigator.vibrate(30);
                if (read.tier === "hot") navigator.vibrate([40, 60, 40]);
            }
            recordReveal(revealKey, read.tier, day);
        };
        if (reduced) {
            land();
            return;
        }
        setRevealing(true);
        setTimeout(land, 2200);
    };

    // Warmer / colder, day over day: only ever compares the player's own tiers.
    const delta = read && prevRead ? tierRank(read.tier) - tierRank(prevRead.tier) : null;
    const deltaLine =
        delta == null
            ? null
            : delta > 0
              ? "WARMER THAN YOUR LAST READ"
              : delta < 0
                ? "COLDER THAN YOUR LAST READ"
                : read && read.tier === "cold"
                  ? truckRidesLeft > 0
                      ? "STILL COLD. FRESH GROUND IS A DRIVE AWAY."
                      : "STILL COLD."
                  : "NO CHANGE. THE TRAIL IS PATIENT.";

    // Camp summary: what today added up to, from real state.
    const todayLegs = trail.filter((p) => p.day === day);
    const truckedToday = todayLegs.some((p) => p.via === "truck");
    const kmToday = Math.round(
        trail.reduce((sum, p, i) => (i > 0 && p.day === day && p.via === "walk" ? sum + distanceKm(trail[i - 1], p) : sum), 0),
    );

    const newClueToday = CLUES.some((c) => c.source === "free" && c.releaseDay === day) && cluesSeenDay !== day;
    // Live countdown to the next free clue, shown on the Clue dock chip (nowMs
    // ticks it). The dot signals a fresh clue today; this always counts to the
    // next one, and shows nothing once every clue is out.
    const clueDockSub = nextClueCountdown(day, nowMs);

    // Spotting a species: record it, check the bingo lists, and deal the reveal
    // card face-down for the flip. Shared by tapping a live marker and (until
    // markers exist) any other spot path.
    const commitSpot = (species: Species) => {
        const priorCount = useGameStore.getState().sightings.filter((s) => s.speciesId === species.id).length;
        recordSighting(species.id, day);
        // Bingo: did this sighting complete one of the fives for the first time?
        const collected = new Set(useGameStore.getState().sightings.map((s) => s.speciesId));
        const won = useGameStore.getState().fivesWon;
        const completed = FIVES.find((f) => !won.includes(f.id) && f.members.every((m) => collected.has(m)));
        if (completed) {
            recordFiveWin(completed.id);
            setPendingFiveWin(completed);
        }
        // Deal the card face-down; reduced motion goes straight to the reveal.
        setSpotQueue([]);
        setSpotFlipped(prefersReducedMotion());
        setSpot({ species, isNew: priorCount === 0, count: priorCount + 1 });
    };

    // Tapping a live marker spots that species and removes the marker.
    const spotMarker = (id: string) => {
        const m = markers.find((x) => x.id === id);
        if (!m) return;
        setMarkers((cur) => cur.filter((x) => x.id !== id));
        commitSpot(SPECIES_BY_ID[m.speciesId]);
    };

    // Dismissing a spot card gives way to the bingo celebration if this
    // sighting completed a five.
    const advanceSpotCard = () => {
        setSpot(null);
        if (pendingFiveWin) {
            setFiveWin(pendingFiveWin);
            setPendingFiveWin(null);
        }
    };

    // Closing the guide card lets a queued bingo celebration through.
    const dismissGuideCard = () => {
        setGuideCard(null);
        if (pendingFiveWin) {
            setFiveWin(pendingFiveWin);
            setPendingFiveWin(null);
        }
    };

    // Live spotting runs while a pin is down and the round is open, day and
    // night. The pool follows the clock, so nocturnal species only appear after
    // dark; binoculars widen where markers land, and a spotter dog shortens the
    // waits between them.
    const canSpot = Boolean(pin && !roundOver);
    // Refs so the single spawn controller reads fresh state without re-arming.
    const markersRef = useRef(markers);
    markersRef.current = markers;
    const canSpotRef = useRef(canSpot);
    canSpotRef.current = canSpot;
    const nightRef = useRef(night);
    nightRef.current = night;
    const hasSpotterDog = Boolean(player && SPOTTER_DOGS.has(player.dogId));
    const spotterRef = useRef(hasSpotterDog);
    spotterRef.current = hasSpotterDog;

    // Each move restarts the escalating schedule: the first marker lands 10 s
    // later, then the gap grows with every marker shown.
    useEffect(() => {
        shownSinceMove.current = 0;
        nextSpawnAt.current = null;
        setMarkers([]);
    }, [pin?.updatedAt, roundOver]);

    // When night flips, drop the current marker so the pool switches over.
    useEffect(() => {
        nextSpawnAt.current = null;
        setMarkers([]);
    }, [night]);

    // The spawn controller: one marker at a time. While a marker is showing it
    // waits; once the slot is free it counts the escalating delay, then spawns
    // one and prunes any whose window has closed.
    useEffect(() => {
        const iv = setInterval(() => {
            const now = Date.now();
            // Prune an expired marker; freeing the slot restarts the next wait.
            setMarkers((cur) => {
                const next = cur.filter((m) => now < m.spawnAt + m.ttlMs);
                return next.length === cur.length ? cur : next;
            });
            if (!canSpotRef.current || markersRef.current.length > 0) {
                nextSpawnAt.current = null; // a marker is up (or spotting is off): hold
                return;
            }
            if (nextSpawnAt.current == null) {
                nextSpawnAt.current = now + spawnDelayMs(shownSinceMove.current, spotterRef.current);
                return;
            }
            if (now >= nextSpawnAt.current) {
                const s = useGameStore.getState();
                const p = s.pin;
                if (p) {
                    const base = makeMarker(p, s.inventory.includes("pro-binoculars"), s.sightings.length === 0, nightRef.current);
                    setMarkers([{ ...base, id: `mk${markerSeq.current++}`, spawnAt: now }]);
                    shownSinceMove.current += 1;
                }
                nextSpawnAt.current = null;
            }
        }, 500);
        return () => clearInterval(iv);
    }, []);

    // Tick the wall clock every second so the countdowns (with seconds) run live.
    useEffect(() => {
        const iv = setInterval(() => setNowMs(Date.now()), 1000);
        return () => clearInterval(iv);
    }, []);

    // Start the food clock if a pin exists but was never stamped (older saves
    // from before the food supply, or any state where it drifted to null).
    useEffect(() => {
        if (pin && resupplyDay == null) resupply(day);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin, resupplyDay, day]);

    // Food ran out: the bakkie collects the ranger to the nearest camp and
    // resupplies. Fires once; the pickup sets pickupHoldDay so it cannot repeat.
    useEffect(() => {
        if (!pin || roundOver || !foodOut || heldForResupply) return;
        const p = pin;
        const nearest = REST_CAMPS.reduce(
            (best, c) => (distanceKm(p, { x: c.x, y: c.y }) < distanceKm(p, { x: best.x, y: best.y }) ? c : best),
            REST_CAMPS[0],
        );
        autoPickup(day);
        setPickupNotice(nearest.name);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin, roundOver, foodOut, heldForResupply, day]);

    // Reaching a rest camp with less than a full supply pops the resupply offer,
    // once per arrival at that pin.
    useEffect(() => {
        if (!pin || roundOver || night || !rangerArrived || heldForResupply) return;
        if (campAtPin && foodLeft < FOOD_DAYS && foodPromptRef.current !== pin.updatedAt) {
            foodPromptRef.current = pin.updatedAt;
            setFoodPrompt(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin, roundOver, night, rangerArrived, heldForResupply, campAtPin, foodLeft]);

    const onPlace = (x: number, y: number) => {
        if (!canMove && pin) return; // out of moves today; existing pin stays put
        const firstPin = fieldGuides.length === 0;
        moveRanger(x, y, day);
        // Your first field guide is free: unlock it for the ground you first pin,
        // and deal its card straight away.
        if (firstPin) {
            const zoneId = zoneAtPoint({ x, y });
            grantFieldGuide(zoneId);
            setGuideFlipped(prefersReducedMotion());
            setGuideCard(ZONE_BY_ID[zoneId]);
        }
    };

    const closeGuide = () => setGuideZone(null);

    const confirmLockIn = () => {
        lockPin();
        setLockModal(false);
    };

    // Leaving the welcome sheet deals the first clue onto the screen as a card,
    // so the very first read is the same reveal the rest of the game uses.
    const closeWelcome = () => {
        setDismissed(true);
        router.replace("/map");
        markCluesSeen(day);
        setClueFlipped(prefersReducedMotion());
        setClueCard(CLUE_BY_ID["f01"]);
    };

    const openDogSheet = () => {
        markScentSeen();
        setSheet("dog");
    };

    const openRadioSheet = () => {
        setRadioSeen(true);
        setSheet("radio");
    };

    // Send the dog to track: it reads the ground where the ranger stands. The
    // reveal only plays on this tap, never on opening the sheet.
    const track = () => {
        startReveal();
    };

    // The ranger's Move action: close the profile and zoom the map in on the
    // pin so the walk radius is easy to read and drag along.
    const startMove = () => {
        setSheet(null);
        setFocusSignal((n) => n + 1);
    };

    // The bakkie: only once a pin exists, never on a locked pin, a closed round or at night.
    const canCallBakkie = Boolean(pin && !pin.locked && !roundOver && !night);

    const callBakkie = () => {
        setSheet(null);
        setTruckMode(true);
    };

    const onPickDestination = (x: number, y: number) => setTruckDest({ x, y });

    const confirmRide = () => {
        if (truckDest) {
            rideTruck(truckDest.x, truckDest.y, day);
        }
        setTruckDest(null);
        setTruckMode(false);
    };

    const cancelRide = () => {
        setTruckDest(null);
        setTruckMode(false);
    };

    // A short-lived toast for power-up use and camp rewards.
    const showToast = (msg: string) => {
        setToast(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 4000);
    };

    // Claim the free power-up for the camp the ranger is standing on. Manual, so
    // the player sees the reward before it lands in their power-ups.
    const claimCampReward = () => {
        if (!campAtPin || !campReward) return;
        visitCamp(campAtPin.id, campReward);
        showToast(`Free ${POWERUP_BY_ID[campReward]?.name ?? "power-up"} added to your power-ups.`);
    };

    // Live count for a power-up (the bakkie ride uses truckRidesLeft).
    const powerCount = (id: string) => (id === "ride" ? truckRidesLeft : powerups[id] ?? 0);

    // Whether a power-up can be spent right now, and why not if it cannot.
    const powerupUsable = (id: string): { ok: boolean; reason?: string } => {
        if (powerCount(id) <= 0) return { ok: false, reason: "none" };
        if (id === "scan") return pin ? { ok: true } : { ok: false, reason: "Drop your pin first." };
        if (id === "ration") {
            if (!pin) return { ok: false, reason: "Drop your pin first." };
            return foodLeft < FOOD_DAYS ? { ok: true } : { ok: false, reason: `${rangerName} already has a full food supply.` };
        }
        if (id === "snack") return rangerWalking ? { ok: true } : { ok: false, reason: `${rangerName} is not on the move right now.` };
        return { ok: true };
    };

    // Spend a power-up from its info card (assumes it is usable), then close.
    const usePowerUpNow = (id: string) => {
        if (!powerupUsable(id).ok) return;
        if (id === "scan" && pin) {
            commitSpot(rollSpot(thirdOf(pin), night));
            usePowerup("scan");
        } else if (id === "ration") {
            resupply(day);
            usePowerup("ration");
            showToast(`Food topped up. ${rangerName} has ${FOOD_DAYS} days of supplies.`);
        } else if (id === "snack") {
            arriveNow();
            usePowerup("snack");
            showToast(`${rangerName} pushes on and reaches the ground.`);
        }
        setPowerupSheet(null);
    };

    const openClueSheet = () => {
        // A clue seen for the first time on its release day deals onto the
        // screen as a card; after that the dock opens the plain clue sheet.
        if (newClueToday && latest) {
            markCluesSeen(day);
            setClueFlipped(prefersReducedMotion());
            setClueCard(latest);
        } else {
            setSheet("clue");
        }
    };

    // Footer action for elimination clues, shared by the clue sheet and the
    // dealt clue card: one tap marks the zone on the case board.
    const clueAction = (c: Clue) =>
        c.kind === "elimination" ? (
            markedClueId === c.id || zoneMarks[c.zoneId] === "ruled-out" ? (
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    <i className="ph ph-check" style={{ marginRight: 5 }} /> Marked on your case board.
                </span>
            ) : (
                <button
                    onClick={() => {
                        ruleOutZone(c.zoneId);
                        setMarkedClueId(c.id);
                    }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0.2rem 0", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-link)", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                    <i className="ph ph-prohibit" /> Rule it out on your case board
                </button>
            )
        ) : undefined;

    return (
        <div style={{ position: "relative", height: "calc(100% + 5.5rem)", marginBottom: "-5.5rem", background: sky.gradient, transition: "background 1.2s var(--ease-out)" }}>
            <KrugerMap
                pin={pin}
                onPlace={truckMode ? onPickDestination : onPlace}
                maxScale={inventory.includes("pro-binoculars") ? 8 : 4}
                walkRangeKm={!truckMode && pin && !pin.locked && canMove ? walkKm : null}
                freeDrag={truckMode}
                trail={trail}
                markers={
                    truckMode
                        ? []
                        : markers.map((m) => ({
                              id: m.id,
                              x: m.x,
                              y: m.y,
                              ttlMs: m.ttlMs,
                              gold: m.rarity !== "common",
                              icon: m.rarity !== "common" ? "star" : FAMILY_ICON[m.type],
                          }))
                }
                onSpotMarker={spotMarker}
                focusSignal={focusSignal}
                camped={night}
                atCamp={Boolean(campAtPin)}
                onCampInfo={setCampInfo}
                campLabel={campAtPin?.name ?? null}
                campClaim={campRewardUnclaimed && campReward ? { label: POWERUP_BY_ID[campReward]?.name ?? "power-up", onClaim: claimCampReward } : null}
                pinRangerSrc={ranger?.photo}
                pinDogSrc={dog?.cutout}
            />

            {/* time-of-day scrim: tints the whole map toward dawn, dusk or night */}
            {sky.scrim && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: sky.scrim,
                        pointerEvents: "none",
                        transition: "background 1.2s var(--ease-out)",
                    }}
                    aria-hidden="true"
                />
            )}



            {/* dim the map while the rucksack is open, so its contents stand out;
                a tap anywhere off the fanned tools closes it */}
            {rucksackOpen && (
                <button
                    aria-label="Close your rucksack"
                    onClick={() => setRucksackOpen(false)}
                    style={{ position: "absolute", inset: 0, zIndex: 5, border: "none", background: "rgba(17,32,26,0.55)", cursor: "pointer" }}
                />
            )}

            {/* the team: one round badge of you and your dog together, ringed by
                the food supply, with the walk/track cues stacked beneath it and
                the rucksack below that. */}
            {ranger && (
                <div style={{ position: "absolute", left: "var(--gutter)", top: 12, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                    <TeamIcon
                        rangerSrc={ranger.photo}
                        dogSrc={dog?.cutout}
                        alt={`${rangerName} and ${dogName}`}
                        ready={rangerReady}
                        danger={foodLow}
                        foodDays={foodLeft}
                        foodTotal={FOOD_DAYS}
                        foodColor={foodTone}
                        onClick={() => setSheet("ranger")}
                    />
                    {/* under the badge: the walk / camp caption, the dog's track
                        cue, and the low-food warning */}
                    {pin && (
                        <>
                            {rangerWalking ? (
                                <MiniChip icon="boot" label={`${rangerWalkLabelSec} to walk to new location`} tone="var(--ochre-700)" maxWidth={150} />
                            ) : night ? (
                                <MiniChip icon="campfire" label="Camped for the night" tone="var(--ochre-600)" maxWidth={150} />
                            ) : heldForResupply ? (
                                <MiniChip icon="fork-knife" label="Resupplied · move out tomorrow" tone="var(--success)" maxWidth={150} />
                            ) : null}
                            {night ? (
                                <MiniChip icon="campfire" label="Camped" tone="var(--ochre-600)" />
                            ) : !rangerArrived ? (
                                <MiniChip icon="paw-print" label="En route" tone="var(--text-muted)" />
                            ) : scentReadHere ? (
                                <MiniChip icon="check-circle" label="Scent read" tone="var(--success)" onClick={openDogSheet} />
                            ) : (
                                <MiniChip icon="paw-print" label="Track scent" tone="var(--ochre-700)" onClick={openDogSheet} />
                            )}
                            {foodLow && (
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, maxWidth: 150, padding: "0.4rem 0.55rem", borderRadius: 10, background: "var(--clay-100)", border: "1px solid var(--clay-500)", boxShadow: "var(--shadow-sm)" }}>
                                    <i className="ph-fill ph-warning" style={{ fontSize: 12, color: "var(--clay-600)", marginTop: 1, flex: "none" }} />
                                    <span style={{ fontSize: "0.68rem", lineHeight: 1.35, color: "var(--clay-600)", fontWeight: 600 }}>Almost out of food. Return to a rest camp to resupply.</span>
                                </div>
                            )}
                        </>
                    )}
                    {/* the rucksack: tap to open, and your power-ups and spots fan
                        out in a half-moon like tipping the bag open to look inside */}
                    <div style={{ position: "relative", marginTop: 12 }}>
                        <button
                            onClick={() => setRucksackOpen((v) => !v)}
                            aria-label={rucksackOpen ? "Close your rucksack" : `Open your rucksack, ${powerupTotal} power-up${powerupTotal === 1 ? "" : "s"}`}
                            aria-expanded={rucksackOpen}
                            className="kw-press"
                            style={{
                                position: "relative",
                                width: 104,
                                height: 104,
                                borderRadius: "50%",
                                border: `2px solid ${rucksackOpen ? "var(--ochre-500)" : "var(--sand-50)"}`,
                                background: "var(--accent-soft)",
                                boxShadow: rucksackOpen ? "var(--shadow-md), 0 0 0 3px var(--ochre-100)" : "var(--shadow-md)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 7,
                                transition: "box-shadow 200ms var(--ease-out), border-color 200ms var(--ease-out)",
                            }}
                        >
                            {rucksackOpen ? (
                                <i className="ph-fill ph-x" style={{ fontSize: 40, color: "var(--ochre-700)" }} />
                            ) : (
                                <Image src="/rucksack.png" alt="" width={78} height={78} style={{ width: 78, height: 78, objectFit: "contain" }} />
                            )}
                            {!rucksackOpen && powerupTotal > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 2,
                                        right: 2,
                                        minWidth: 24,
                                        height: 24,
                                        borderRadius: 999,
                                        background: "var(--ochre-500)",
                                        color: "var(--sand-900)",
                                        border: "2px solid var(--sand-50)",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.74rem",
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "var(--shadow-sm)",
                                    }}
                                >
                                    {powerupTotal}
                                </span>
                            )}
                        </button>
                        {rucksackOpen &&
                            rucksackItems.map((it, i) => (
                                <ArcItem
                                    key={it.id}
                                    icon={it.icon}
                                    count={it.count}
                                    label={it.label}
                                    left={RUCKSACK_ARC[i].left}
                                    top={RUCKSACK_ARC[i].top}
                                    delay={i * 40}
                                    showCount={it.showCount}
                                    onClick={() => {
                                        setRucksackOpen(false);
                                        it.onClick();
                                    }}
                                />
                            ))}
                    </div>
                </div>
            )}

            {/* short-lived toast: power-up used, or a camp reward earned */}
            {toast && (
                <div style={{ position: "absolute", left: "50%", bottom: 78, transform: "translateX(-50%)", zIndex: 8, width: "max-content", maxWidth: "min(84vw, 320px)", pointerEvents: "none" }}>
                    <div
                        className="kw-rise"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "0.55rem 0.85rem",
                            background: "var(--bg-primary-solid, #21332a)",
                            color: "var(--sand-50)",
                            borderRadius: "var(--radius-pill)",
                            boxShadow: "var(--shadow-lg)",
                            fontSize: "0.82rem",
                            lineHeight: 1.4,
                            textAlign: "center",
                        }}
                    >
                        <i className="ph-fill ph-sparkle" style={{ color: "var(--ochre-400)", flex: "none" }} /> {toast}
                    </div>
                </div>
            )}

            {/* top-right: the time of day */}
            <div style={{ position: "absolute", right: "var(--gutter)", top: 12 }}>
                <button
                    onClick={() => setSheet("night")}
                    className="kw-press"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0.42rem 0.7rem",
                        background: "rgba(250,246,236,0.9)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-pill)",
                        boxShadow: "var(--shadow-sm)",
                        cursor: "pointer",
                    }}
                    aria-label={`${PHASE_META[phase].label}, ${formatClock(hour, minute)}. About nights in the Kruger`}
                >
                    <i className={`ph-fill ph-${PHASE_META[phase].icon}`} style={{ fontSize: 15, color: night ? "var(--text-secondary)" : "var(--ochre-600)" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 700, color: "var(--text-primary)" }}>
                        {formatClock(hour, minute)}
                    </span>
                    <i className="ph ph-info" style={{ fontSize: 13, color: "var(--text-muted)" }} />
                </button>
            </div>

            {/* right dock: anchored below the time chip */}
            <div style={{ position: "absolute", right: "var(--gutter)", top: 64, display: "flex", flexDirection: "column", gap: 10 }}>
                <DockTab icon="notebook" label="Clue" dot={newClueToday} sub={clueDockSub} onClick={openClueSheet} />
                <DockTab icon="book-open-text" label="Guides" onClick={() => setSheet("guides")} />
                <DockTab icon="radio" label="Radio" dot={hasRadio && !radioSeen} onClick={openRadioSheet} />
            </div>

            {/* round day counter, plain text on the background behind the map,
                bottom-right above the coordinates */}
            <div
                style={{ position: "absolute", right: "var(--gutter)", bottom: 52, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1, pointerEvents: "none" }}
                aria-label={`Day ${day} of ${ROUND.durationDays}, ${daysRemaining(day)} days left, ${rangersHunting(day).toLocaleString("en-ZA")} rangers tracking`}
            >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.08em", fontWeight: 700, color: night ? "var(--sand-50)" : "var(--text-primary)", textShadow: night ? "0 1px 3px rgba(17,32,26,0.7)" : "0 1px 3px rgba(245,239,226,0.9)" }}>
                    DAY {day} / {ROUND.durationDays}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", fontWeight: 700, color: night ? "rgba(245,239,226,0.85)" : "var(--text-secondary)", textShadow: night ? "0 1px 3px rgba(17,32,26,0.7)" : "0 1px 3px rgba(245,239,226,0.9)" }}>
                    {daysRemaining(day)} DAYS LEFT
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", fontWeight: 700, color: night ? "rgba(245,239,226,0.85)" : "var(--text-secondary)", textShadow: night ? "0 1px 3px rgba(17,32,26,0.7)" : "0 1px 3px rgba(245,239,226,0.9)" }}>
                    {rangersHunting(day).toLocaleString("en-ZA")} RANGERS TRACKING
                </span>
            </div>

            {/* first-pin hint */}
            {!pin && !(showWelcome && !dismissed) && (
                <div
                    className="kw-rise"
                    style={{
                        position: "absolute",
                        left: "50%",
                        bottom: 110,
                        transform: "translateX(-50%)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        maxWidth: "82%",
                        padding: "0.5rem 0.9rem",
                        background: "var(--ochre-500)",
                        color: "var(--sand-900)",
                        borderRadius: "var(--radius-pill)",
                        boxShadow: "var(--shadow-lg)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        pointerEvents: "none",
                        textAlign: "center",
                        lineHeight: 1.3,
                    }}
                >
                    <i className="ph-fill ph-hand-tap" style={{ fontSize: 16 }} />
                    Tap the map to drop your pin and start the hunt
                </div>
            )}

            {/* dusk nudge: move before the ranger makes camp for the night */}
            {showDuskPrompt && !truckMode && (
                <div
                    className="kw-rise"
                    style={{
                        position: "absolute",
                        left: "50%",
                        bottom: 110,
                        transform: "translateX(-50%)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        maxWidth: "84%",
                        padding: "0.5rem 0.9rem",
                        background: "var(--ochre-500)",
                        color: "var(--sand-900)",
                        borderRadius: "var(--radius-pill)",
                        boxShadow: "var(--shadow-lg)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        pointerEvents: "none",
                        textAlign: "center",
                        lineHeight: 1.3,
                    }}
                >
                    <i className="ph-fill ph-sun-horizon" style={{ fontSize: 16, flex: "none" }} />
                    Dusk is falling. Your ranger makes camp at {CAMP_HOUR}:00, so move while there is light.
                </div>
            )}

            {/* bakkie mode: pick a destination anywhere on the map */}
            {truckMode && !truckDest && (
                <div
                    className="kw-rise"
                    style={{
                        position: "absolute",
                        left: "50%",
                        bottom: 110,
                        transform: "translateX(-50%)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        maxWidth: "88%",
                        padding: "0.5rem 0.6rem 0.5rem 0.9rem",
                        background: "var(--ochre-500)",
                        color: "var(--sand-900)",
                        borderRadius: "var(--radius-pill)",
                        boxShadow: "var(--shadow-lg)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        lineHeight: 1.3,
                    }}
                >
                    <i className="ph-fill ph-truck" style={{ fontSize: 16, flex: "none" }} />
                    Tap or drag your pin to where the bakkie should drive
                    <button
                        onClick={cancelRide}
                        aria-label="Cancel the bakkie"
                        style={{ flex: "none", width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(38,29,16,0.16)", color: "var(--sand-900)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <i className="ph-bold ph-x" style={{ fontSize: 13 }} />
                    </button>
                </div>
            )}

            {/* round over: the one banner that stays on the map */}
            {roundOver && (
                <div
                    style={{
                        position: "absolute",
                        left: "var(--gutter)",
                        right: "var(--gutter)",
                        bottom: 120,
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        background: "var(--green-100)",
                        border: "1px solid var(--green-200)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-4)",
                        boxShadow: "var(--shadow-lg)",
                    }}
                >
                    <i className="ph-fill ph-flag-checkered" style={{ fontSize: 22, color: "var(--green-700)" }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>The round is over</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>See how close you came.</div>
                    </div>
                    <Button size="sm" onClick={() => router.push("/debrief")}>
                        Debrief
                    </Button>
                </div>
            )}

            {/* ------- popups ------- */}

            {sheet === "status" && (
                <Sheet onClose={() => setSheet(null)}>
                    <Eyebrow rule>The hunt</Eyebrow>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem var(--space-5)", margin: "var(--space-4) 0", fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.06em", color: "var(--text-secondary)" }}>
                        <span>
                            <i className="ph ph-calendar-blank" /> DAY {day} / {ROUND.durationDays}
                        </span>
                        <span>
                            <i className="ph ph-hourglass-medium" /> {daysRemaining(day)} DAYS LEFT
                        </span>
                        <span>
                            <i className="ph ph-users-three" /> {rangersHunting(day).toLocaleString("en-ZA")} RANGERS TRACKING
                        </span>
                    </div>
                    <div
                        style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "0.55rem 0.7rem", background: "var(--ochre-100)", border: "1px solid var(--ochre-200)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ochre-700)", marginBottom: "var(--space-4)" }}
                    >
                        <i className="ph-fill ph-broadcast" style={{ fontSize: 14, marginTop: 1 }} />
                        <span>
                            Ops room: {near.count} ranger{near.count === 1 ? "" : "s"} within {NEAR_TARGET_KM} km of the suspect ·{" "}
                            {near.locked === 0 ? "none" : near.locked} locked in
                        </span>
                    </div>
                    <ImpactHighlight amount={campaignTotal} onOpen={() => router.push("/impact")} />
                    {roundOver && (
                        <div style={{ marginTop: "var(--space-4)" }}>
                            <Button size="lg" fullWidth onClick={() => router.push("/debrief")} iconRight={<i className="ph ph-flag-checkered" />}>
                                See the debrief
                            </Button>
                        </div>
                    )}
                </Sheet>
            )}

            {sheet === "ranger" && (
                <Sheet onClose={() => setSheet(null)}>
                    <Eyebrow rule>Your ranger</Eyebrow>
                    <h2 style={{ fontSize: "var(--text-h4)", margin: "var(--space-3) 0 0" }}>
                        {!pin ? "Place your ranger" : pin.locked ? "Answer locked in" : `${rangerName} on patrol`}
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "var(--space-2) 0 0" }}>
                        {!pin
                            ? "Tap the map. Where your ranger stands is your guess."
                            : pinZone
                              ? `Zone ${pinZone.number}, ${pinZone.name}${pin.locked ? " · locked for the round" : ""}`
                              : "Locked for the round."}
                    </p>
                    {campAtPin && (
                        <div style={{ marginTop: "var(--space-3)", display: "flex", alignItems: "center", gap: 10, padding: "0.6rem 0.75rem", borderRadius: "var(--radius-lg)", background: "var(--surface-sunken)", border: "1px solid var(--border-subtle)" }}>
                            <i className="ph-fill ph-house-line" style={{ color: "var(--green-700)", fontSize: 20, flex: "none" }} />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>At {campAtPin.name}</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                                    {rangerName} has reached the rest camp.
                                    {campRewardUnclaimed ? " Claim your free power-up above the pin on the map." : campReward ? " Free power-up claimed." : ""}
                                </div>
                            </div>
                        </div>
                    )}
                    {pin && (
                        <div style={{ marginTop: "var(--space-4)", padding: "0.7rem 0.8rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.86rem", fontWeight: 600, color: "var(--text-primary)" }}>
                                    <i className="ph-fill ph-fork-knife" style={{ color: foodTone }} /> Food supply
                                </span>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.08em", textTransform: "uppercase", color: foodTone, fontWeight: 700 }}>
                                    {heldForResupply ? "Resupplied" : `${foodLeft} of ${FOOD_DAYS} days`}
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: 4, marginTop: "var(--space-3)" }}>
                                {Array.from({ length: FOOD_DAYS }).map((_, i) => (
                                    <span key={i} style={{ flex: 1, height: 6, borderRadius: 999, background: i < foodLeft ? foodTone : "var(--surface-sunken)" }} />
                                ))}
                            </div>
                            <p style={{ margin: "var(--space-3) 0 0", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                                {heldForResupply
                                    ? `The bakkie brought ${rangerName} in to ${campAtPin?.name ?? "a rest camp"} to resupply. You move out again tomorrow.`
                                    : campAtPin && foodLeft < FOOD_DAYS
                                      ? `You are at ${campAtPin.name}. Resupply to top back up to ${FOOD_DAYS} days of food.`
                                      : foodLeft <= 1
                                        ? `Almost out. Reach a rest camp to resupply, or the bakkie collects ${rangerName} and takes them to the nearest one.`
                                        : `${rangerName} can stay out ${foodLeft} more day${foodLeft === 1 ? "" : "s"} before resupplying at a rest camp.`}
                            </p>
                            {campAtPin && foodLeft < FOOD_DAYS && !heldForResupply && (
                                <div style={{ marginTop: "var(--space-3)" }}>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => {
                                            resupply(day);
                                            setFoodPrompt(false);
                                            showToast(`Food resupplied at ${campAtPin.name}. ${FOOD_DAYS} days of supplies.`);
                                        }}
                                        iconLeft={<i className="ph-fill ph-fork-knife" />}
                                    >
                                        Resupply at {campAtPin.name}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    {pin && !pin.locked && (
                        <>
                            {rangerReady ? (
                                <div style={{ margin: "var(--space-4) 0 0" }}>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 var(--space-3)", lineHeight: 1.55 }}>
                                        {rangerName} has arrived and is ready. Move up to {walkKm} km. Tap Move to zoom in on your pin, then drag it along the ring. The further you walk, the longer it takes to get there.
                                    </p>
                                    <Button size="lg" fullWidth onClick={startMove} iconLeft={<i className="ph-fill ph-boot" />}>
                                        Move your ranger
                                    </Button>
                                </div>
                            ) : night ? (
                                <div style={{ margin: "var(--space-3) 0 0" }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: 8 }}>
                                        <i className="ph-fill ph-campfire" style={{ color: "var(--ochre-600)", fontSize: 17 }} /> Camped for the night.
                                    </div>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "var(--space-1, 0.25rem) 0 0" }}>
                                        The Kruger is dangerous after dark, so {rangerName} and {dogName} settle by the fire. You move again at dawn.
                                    </p>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "var(--space-2)" }}>
                                        TODAY: {truckedToday ? "BY BAKKIE" : `${kmToday} KM`}
                                        {clueCountdown ? ` · ${clueCountdown}` : ""}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ margin: "var(--space-4) 0 0" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.86rem", fontWeight: 600, color: "var(--text-primary)" }}>
                                            <i className="ph-fill ph-boot" style={{ color: "var(--ochre-600)" }} /> {rangerName} is walking there
                                        </span>
                                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{rangerWalkLabelSec}</span>
                                    </div>
                                    <div style={{ marginTop: "var(--space-3)", height: 8, borderRadius: 999, background: "var(--surface-sunken)", overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${Math.round(rangerWalkPct * 100)}%`, borderRadius: 999, background: "var(--ochre-500)", transition: "width 1s linear" }} />
                                    </div>
                                    <p style={{ margin: "var(--space-3) 0 0", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                                        {rangerName} is on foot to the new ground. The further the leg, the longer the walk. Arrives in {rangerWalkLabelSec}, then you can move again.
                                    </p>
                                </div>
                            )}
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "var(--space-2) 0 0" }}>
                                One lock-in for the whole game. Lock in only when you are sure.
                            </p>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "var(--space-3)" }}>
                                <i className="ph ph-truck" /> Bakkie rides left: {truckRidesLeft}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-5)" }}>
                                {!roundOver &&
                                    (truckRidesLeft > 0 ? (
                                        <Button size="lg" fullWidth variant="secondary" onClick={callBakkie} iconRight={<i className="ph ph-truck" />}>
                                            Call the patrol bakkie
                                        </Button>
                                    ) : (
                                        <Button size="lg" fullWidth variant="secondary" onClick={() => router.push("/shop")} iconRight={<i className="ph ph-truck" />}>
                                            Fuel the patrol bakkie
                                        </Button>
                                    ))}
                                <Button
                                    size="lg"
                                    fullWidth
                                    variant="secondary"
                                    onClick={() => {
                                        setSheet(null);
                                        setLockModal(true);
                                    }}
                                    iconRight={<i className="ph ph-lock-simple" />}
                                >
                                    Lock in
                                </Button>
                            </div>
                        </>
                    )}
                    {pin?.locked && (
                        <>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "var(--space-3) 0 0" }}>
                                Locked for the round. A second lock-in from the kit reopens it if you must move.
                            </p>
                            <div style={{ marginTop: "var(--space-5)" }}>
                                <Button size="lg" fullWidth variant="secondary" onClick={() => router.push("/checkout/extra-lockin")}>
                                    Move again
                                </Button>
                            </div>
                        </>
                    )}
                </Sheet>
            )}

            {sheet === "dog" && (
                <Sheet onClose={() => setSheet(null)}>
                    {(() => {
                        // Tracking here already played its reveal, so its read is safe to show.
                        const trackedHere = scentReadHere;
                        const showRead = Boolean(pin && read && trackedHere && !revealing);
                        const hot = Boolean(showRead && read && read.tier === "hot");
                        return (
                            <div
                                style={{
                                    background: hot ? "var(--clay-100)" : "var(--surface-card)",
                                    border: `1px solid ${hot ? "var(--clay-500)" : "var(--border-subtle)"}`,
                                    borderRadius: "var(--radius-lg)",
                                    padding: "var(--space-4)",
                                    transition: "background var(--dur-base) var(--ease-out)",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: hot ? "var(--clay-600)" : "var(--text-accent)" }}>
                                        <i className="ph ph-paw-print" /> Scent read
                                    </span>
                                    {showRead && read && (
                                        <Tag tone={TIER_META[read.tier].tone} size="sm">
                                            <i className={`ph ph-${TIER_META[read.tier].icon}`} style={{ marginRight: 4 }} />
                                            {TIER_META[read.tier].label}
                                        </Tag>
                                    )}
                                </div>

                                {!pin || !read ? (
                                    <p style={{ margin: "var(--space-4) 0 0", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                                        {dogName} is waiting for you to place your ranger. Tap the map to deploy, then send the dog to track.
                                    </p>
                                ) : revealing ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "var(--space-5) 0 var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                                        <i className="ph ph-paw-print kw-spin" style={{ fontSize: 16, color: "var(--ochre-600)" }} />
                                        {dogName} is casting...
                                    </div>
                                ) : (
                                    <>
                                        {showRead && read && (
                                            <div className="kw-rise">
                                                {prevRead == null && (
                                                    <p style={{ margin: "var(--space-3) 0 0", fontSize: "0.78rem", lineHeight: 1.5, color: "var(--text-muted)" }}>
                                                        {dogName} reads the ground where you stand. Hunt for the scent, then close in.
                                                    </p>
                                                )}
                                                <p style={{ margin: "var(--space-4) 0 0", fontFamily: "var(--font-serif)", fontSize: "1.05rem", lineHeight: 1.55, color: "var(--sand-900)" }}>
                                                    {SCENT_TEXT[read.tier].replace("{dog}", dogName) + " " + scentDirectionText(read, dogName)}
                                                    {read.tier === "hot" && hotStreak === 2 && ` ${dogName} has held this line for two days. The camp is near.`}
                                                    {read.tier === "hot" && hotStreak >= 3 && ` ${dogName} will not leave this ground. Trust the dog.`}
                                                </p>
                                                {read.tier === "hot" && inventory.includes("gps-collar") && pin && (
                                                    <div style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--clay-600)", fontWeight: 700 }}>
                                                        Collar fix: {Math.round(distanceKm(pin, ROUND.poacher))} km to the suspect
                                                    </div>
                                                )}
                                                {read.tier === "cold" && prevRead == null && !roundOver && (
                                                    <p style={{ margin: "var(--space-3) 0 0", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                                        {truckRidesLeft > 0
                                                            ? `Fresh ground is a drive away. The bakkie has ${truckRidesLeft} ride${truckRidesLeft === 1 ? "" : "s"} left.`
                                                            : "The bakkie is out of fuel. The kit room can fill the tank."}
                                                    </p>
                                                )}
                                                {deltaLine && (
                                                    <div style={{ margin: "var(--space-4) 0 0", paddingTop: "var(--space-3)", borderTop: "1px dashed var(--border-default)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                                                        {deltaLine}
                                                    </div>
                                                )}
                                                {hasRadio && (
                                                    <div
                                                        style={{ marginTop: "var(--space-4)", display: "flex", gap: 8, alignItems: "flex-start", background: "var(--ochre-100)", border: "1px solid var(--ochre-200)", borderRadius: "var(--radius-sm)", padding: "0.55rem 0.7rem" }}
                                                    >
                                                        <i className="ph ph-broadcast" style={{ color: "var(--ochre-700)", marginTop: 2 }} />
                                                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                                            HQ radios in: the freshest scent is in {THIRD_LABEL[targetThird]} of the park.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* At night the dog is camped and cannot track. */}
                                        {night && (
                                            <p style={{ margin: "var(--space-4) 0 0", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5, display: "flex", gap: 8, alignItems: "flex-start" }}>
                                                <i className="ph-fill ph-campfire" style={{ color: "var(--ochre-600)", marginTop: 2 }} />
                                                {dogName} is camped for the night. It tracks again at dawn.
                                            </p>
                                        )}

                                        {/* The ranger is still walking in: the dog tracks once you arrive. */}
                                        {!night && !rangerArrived && (
                                            <p style={{ margin: "var(--space-4) 0 0", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5, display: "flex", gap: 8, alignItems: "flex-start" }}>
                                                <i className="ph-fill ph-boot" style={{ color: "var(--ochre-600)", marginTop: 2 }} />
                                                {dogName} tracks the ground once {rangerName} reaches the new location.
                                            </p>
                                        )}

                                        {/* Track CTA: the ranger has arrived on fresh ground. */}
                                        {!night && rangerArrived && !trackedHere && (
                                            <div style={{ marginTop: "var(--space-4)" }}>
                                                <p style={{ margin: "0 0 var(--space-3)", fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                                                    {rangerName} has reached the new location. Send {dogName} to read the ground and pick up the scent.
                                                </p>
                                                <Button size="lg" fullWidth onClick={track} iconLeft={<i className="ph-fill ph-paw-print" />}>
                                                    Track this ground
                                                </Button>
                                            </div>
                                        )}

                                        {/* Already read here: move for fresh ground. */}
                                        {!night && rangerArrived && trackedHere && (
                                            <p style={{ margin: "var(--space-4) 0 0", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5, display: "flex", gap: 8, alignItems: "flex-start" }}>
                                                <i className="ph ph-check-circle" style={{ color: "var(--success)", marginTop: 2 }} />
                                                {dogName} has read this ground. Move to fresh ground for a new read.
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })()}
                </Sheet>
            )}

            {sheet === "clue" && (
                <Sheet onClose={() => setSheet(null)}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                        <Eyebrow>Latest intel</Eyebrow>
                        <button onClick={() => router.push("/journal")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-link)", fontSize: "0.8rem", fontWeight: 600, padding: "0.4rem 0" }}>
                            All clues <i className="ph ph-arrow-right" />
                        </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em", color: "var(--text-muted)" }}>
                        <i className="ph ph-timer" /> {clueCountdown}
                    </div>
                    {latest && <ClueCard clue={latest} action={clueAction(latest)} />}
                </Sheet>
            )}

            {sheet === "radio" && (
                <Sheet onClose={() => setSheet(null)}>
                    <Eyebrow rule>Field radio</Eyebrow>
                    {hasRadio ? (
                        <div
                            style={{
                                marginTop: "var(--space-4)",
                                background: "var(--ochre-100)",
                                border: "1px solid var(--ochre-200)",
                                borderRadius: "var(--radius-lg)",
                                padding: "var(--space-4)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ochre-700)" }}>
                                <i className="ph-fill ph-broadcast" /> HQ operations room
                            </div>
                            <p style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-serif)", fontSize: "1.05rem", lineHeight: 1.55, color: "var(--sand-900)" }}>
                                Other teams have picked up the freshest scent in {THIRD_LABEL[targetThird]} of the park. Work that end of the ground.
                            </p>
                        </div>
                    ) : (
                        <div style={{ marginTop: "var(--space-4)" }}>
                            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                                You need a field radio to reach the K9 operations room and hear where other teams have picked up the scent.
                            </p>
                            <div style={{ marginTop: "var(--space-4)" }}>
                                <Button size="lg" fullWidth onClick={() => router.push("/checkout/field-radio")} iconRight={<i className="ph ph-broadcast" />}>
                                    Get the field radio
                                </Button>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-4)", borderTop: "1px dashed var(--border-default)" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-accent)" }}>Intel intercept</div>
                        <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.5, margin: "var(--space-2) 0 var(--space-3)" }}>
                            Have an intel code from a sponsor or partner? Redeem it for a bonus clue.
                        </p>
                        <Button size="md" variant="secondary" onClick={() => router.push("/codes")} iconRight={<i className="ph ph-arrow-right" />}>
                            Enter an intel code
                        </Button>
                    </div>
                </Sheet>
            )}

            {sheet === "guides" && (
                <Sheet onClose={() => setSheet(null)}>
                    <Eyebrow rule>Field guides</Eyebrow>
                    <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "var(--space-3) 0 var(--space-4)", lineHeight: 1.5 }}>
                        {fieldGuides.length === 0
                            ? "Your first guide unlocks free with your first pin. Drop your pin, then come back here to read the ground."
                            : "Tap a guide you hold to read its ground. Unlock more zones for R25 each."}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                        {ZONES.filter((z) => fieldGuides.includes(z.id)).map((z) => (
                            <button
                                key={z.id}
                                onClick={() => {
                                    setSheet(null);
                                    setGuideZone(z);
                                }}
                                style={{ border: "1px solid var(--border-default)", background: "var(--surface-card)", borderRadius: "var(--radius-pill)", padding: "0.5rem 0.85rem", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
                            >
                                <i className="ph ph-book-open" style={{ marginRight: 5, fontSize: 12, color: "var(--text-accent)" }} />
                                {z.name}
                            </button>
                        ))}
                    </div>
                    {fieldGuides.length < ZONES.length && (
                        <div style={{ marginTop: "var(--space-5)" }}>
                            <Button size="lg" fullWidth variant="secondary" onClick={() => router.push("/journal")} iconRight={<i className="ph ph-arrow-right" />}>
                                Unlock more guides
                            </Button>
                        </div>
                    )}
                </Sheet>
            )}

            {sheet === "spots" && (
                <Sheet onClose={() => setSheet(null)}>
                    <Eyebrow rule>Spotting log</Eyebrow>
                    {(() => {
                        const spotted = new Set(sightings.map((s) => s.speciesId));
                        // Every card in the log opens for a read. Species still out
                        // there show in black and white with a Not found pill.
                        const openSpeciesCard = (s: Species) => {
                            const seen = spotted.has(s.id);
                            setSpotFlipped(true); // a re-read, not a reveal
                            setSpotQueue([]);
                            setSpot({
                                species: s,
                                isNew: false,
                                count: sightings.filter((x) => x.speciesId === s.id).length,
                                found: seen,
                            });
                        };
                        return (
                            <>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-primary)", fontWeight: 700, margin: "var(--space-3) 0 0" }}>
                                    {spotted.size} of {SPECIES.length} species spotted
                                </div>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0.3rem 0 0", lineHeight: 1.5 }}>
                                    Watch the map: species appear near your ranger for a short while, then move on. Tap one to add it to your log. Sightings are common or rare, and the rarer it is, the less time you have to catch it. Spotting follows the clock too, so nocturnal animals only show after dark. Spot all five of the Big, Ugly or Small Five and an instant prize is yours. Tap any card below to read it, found or not.
                                </p>

                                {/* the fives: spot all five of each to complete the row */}
                                {FIVES.map((five) => {
                                    const done = five.members.every((m) => spotted.has(m));
                                    return (
                                        <div
                                            key={five.id}
                                            style={{ marginTop: "var(--space-4)", background: done ? "var(--green-100)" : "var(--surface-card)", border: `1px solid ${done ? "var(--green-200)" : "var(--border-subtle)"}`, borderRadius: "var(--radius-lg)", padding: "var(--space-3) var(--space-4)" }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.14em", textTransform: "uppercase", color: done ? "var(--green-700)" : "var(--text-primary)", fontWeight: 700 }}>
                                                    {five.label} · {five.members.filter((m) => spotted.has(m)).length}/5
                                                </span>
                                                {done && (
                                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--green-700)", fontWeight: 700 }}>
                                                        <i className="ph-fill ph-trophy" /> {fivesWon.includes(five.id) ? "PRIZE WON" : "COMPLETE"}
                                                    </span>
                                                )}
                                            </div>
                                            {done && fivesWon.includes(five.id) && (
                                                <p style={{ fontSize: "0.74rem", color: "var(--green-700)", margin: "0 0 var(--space-2)", lineHeight: 1.4 }}>
                                                    Instant prize: {five.prize}. It will be waiting with your results at round end.
                                                </p>
                                            )}
                                            <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                                {five.members.map((m) => {
                                                    const sp = SPECIES_BY_ID[m];
                                                    const seen = spotted.has(m);
                                                    return (
                                                        <button
                                                            key={m}
                                                            onClick={() => openSpeciesCard(sp)}
                                                            aria-label={seen ? sp.name : `${sp.name}, not yet spotted`}
                                                            style={{ position: "relative", flex: 1, aspectRatio: "1", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${seen ? "var(--ochre-500)" : "var(--border-default)"}`, padding: 0, background: "var(--surface-sunken)", cursor: "pointer" }}
                                                        >
                                                            <Image
                                                                src={sp.photo}
                                                                alt=""
                                                                fill
                                                                sizes="64px"
                                                                style={{ objectFit: "cover", filter: seen ? "none" : "grayscale(1)", opacity: seen ? 1 : 0.35 }}
                                                            />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                                {(
                                    [
                                        { id: "mammal", label: "Mammals" },
                                        { id: "bird", label: "Birds" },
                                        { id: "tree", label: "Trees" },
                                        { id: "reptile", label: "Reptiles" },
                                        { id: "insect", label: "Insects" },
                                        { id: "fish", label: "Fish" },
                                    ] as const
                                ).map((family) => (
                                    <div key={family.id} style={{ marginTop: "var(--space-5)" }}>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-accent)", marginBottom: "var(--space-2)" }}>
                                            {family.label} · {SPECIES.filter((s) => s.type === family.id && spotted.has(s.id)).length}/
                                            {SPECIES.filter((s) => s.type === family.id).length}
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-2)" }}>
                                            {SPECIES.filter((s) => s.type === family.id).map((s) => {
                                                const seen = spotted.has(s.id);
                                                return (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => openSpeciesCard(s)}
                                                        aria-label={seen ? s.name : `${s.name}, not yet spotted`}
                                                        style={{
                                                            position: "relative",
                                                            aspectRatio: "1",
                                                            borderRadius: "var(--radius-md)",
                                                            overflow: "hidden",
                                                            // gold ring for rare sightings and the fives
                                                            border: seen
                                                                ? s.rarity === "rare" || FIVE_OF[s.id]
                                                                    ? "2px solid var(--ochre-400)"
                                                                    : "1px solid var(--border-subtle)"
                                                                : "1px solid var(--border-subtle)",
                                                            background: "var(--surface-sunken)",
                                                            cursor: "pointer",
                                                            padding: 0,
                                                        }}
                                                    >
                                                        <Image
                                                            src={s.photo}
                                                            alt={seen ? s.name : `${s.name}, still out there`}
                                                            fill
                                                            sizes="90px"
                                                            style={{ objectFit: "cover", filter: seen ? "none" : "grayscale(1)", opacity: seen ? 1 : 0.32 }}
                                                        />
                                                        {seen && s.rarity !== "common" && (
                                                            <i
                                                                className={`ph-fill ph-${RARITY_META[s.rarity].icon}`}
                                                                style={{ position: "absolute", top: 3, right: 3, fontSize: 11, color: "var(--sand-50)", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.5))" }}
                                                            />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </>
                        );
                    })()}
                </Sheet>
            )}

            {sheet === "night" && (
                <Sheet onClose={() => setSheet(null)}>
                    <Eyebrow rule>Nights in the Kruger</Eyebrow>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", margin: "var(--space-4) 0" }}>
                        <span style={{ flex: "none", width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", color: "var(--ochre-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                            <i className={`ph-fill ph-${PHASE_META[phase].icon}`} />
                        </span>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-primary)", fontWeight: 700 }}>
                            {PHASE_META[phase].label} · {formatClock(hour, minute)}
                        </div>
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                        Night in the Kruger belongs to the animals. The park holds more of its life after dark than most people ever see.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", margin: "var(--space-4) 0 0" }}>
                        {[
                            { icon: "paw-print", text: "Lion do most of their hunting at night, and leopard slip down from the trees to work the dark. Spotted hyena patrol the roads in clans." },
                            { icon: "drop", text: "Hippo leave the rivers after sunset to graze on land, and are among the most dangerous animals to meet on foot." },
                            { icon: "moon-stars", text: "Elephant and buffalo move to the waterholes, and honey badgers, civets and owls take over the veld." },
                        ].map((row) => (
                            <div key={row.icon} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                                <i className={`ph ph-${row.icon}`} style={{ color: "var(--ochre-600)", fontSize: 18, marginTop: 2 }} />
                                <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{row.text}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "var(--space-4) 0 0" }}>
                        That is why no ranger walks the bush at night, and neither does yours. At {CAMP_HOUR}:00 you and {dogName} make camp behind the firelight, and the trail waits for first light.
                    </p>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "var(--space-4)" }}>
                        Camp at {CAMP_HOUR}:00 · Move again at 05:00
                    </div>
                </Sheet>
            )}

            {sheet === "bakkie" && (
                <Sheet onClose={() => setSheet(null)}>
                    <Eyebrow rule>The patrol bakkie</Eyebrow>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", margin: "var(--space-4) 0" }}>
                        <span style={{ flex: "none", width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", color: "var(--ochre-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                            <i className="ph-fill ph-truck" />
                        </span>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-primary)", fontWeight: 700 }}>
                            Bakkie rides left: {truckRidesLeft}
                        </div>
                    </div>
                    <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                        The real K9 teams deploy by vehicle: handlers and dogs ride to where the trail starts, and the tracking begins where the wheels stop. A ride takes your ranger and {dogName} to any point on the map, far beyond the day&apos;s walking limit, but the drive takes the rest of the day.
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5, margin: "var(--space-3) 0 0" }}>
                        You start the round with two free rides, and they stay free. More fuel can be donated in the kit room for R150 a tank.
                    </p>
                    {!pin && (
                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "var(--space-3) 0 0" }}>
                            Drop your first pin, then the bakkie can pick your team up in the field.
                        </p>
                    )}
                    <div style={{ marginTop: "var(--space-5)" }}>
                        {canCallBakkie && truckRidesLeft > 0 ? (
                            <Button size="lg" fullWidth onClick={callBakkie} iconRight={<i className="ph ph-truck" />}>
                                Call the patrol bakkie
                            </Button>
                        ) : truckRidesLeft <= 0 ? (
                            <Button size="lg" fullWidth variant="secondary" onClick={() => router.push("/shop")} iconRight={<i className="ph ph-truck" />}>
                                Fuel the bakkie in the kit room
                            </Button>
                        ) : null}
                    </div>
                </Sheet>
            )}

            <ZoneSheet
                zone={guideZone}
                onClose={closeGuide}
                onBuyMore={() => {
                    closeGuide();
                    router.push("/shop");
                }}
            />

            {/* rest-camp info card, opened from a camp icon on the map */}
            {campInfo && REST_CAMP_BY_ID[campInfo] && (
                <Sheet onClose={() => setCampInfo(null)}>
                    {(() => {
                        const camp = REST_CAMP_BY_ID[campInfo];
                        return (
                            <>
                                <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--sand-100)" }}>
                                    <Image src={camp.photo} alt={camp.name} fill sizes="480px" style={{ objectFit: "cover" }} />
                                    <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(24,45,35,0) 55%, rgba(24,45,35,0.55) 100%)" }} />
                                    <span style={{ position: "absolute", left: 14, bottom: 10, fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sand-50)" }}>
                                        <i className="ph-fill ph-house-line" style={{ marginRight: 5 }} />
                                        Rest camp
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                                    <h2 style={{ fontSize: "var(--text-h3)", margin: 0 }}>{camp.name}</h2>
                                    <Tag tone="green" size="sm">
                                        <i className="ph ph-map-pin" style={{ marginRight: 4 }} />
                                        {camp.region}
                                    </Tag>
                                </div>
                                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "var(--space-3) 0 0" }}>{camp.blurb}</p>
                                {CAMP_REWARD[camp.id] && (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.7rem",
                                            alignItems: "center",
                                            marginTop: "var(--space-4)",
                                            background: "var(--accent-soft)",
                                            border: "1px solid var(--ochre-200)",
                                            borderRadius: "var(--radius-lg)",
                                            padding: "0.7rem 0.85rem",
                                        }}
                                    >
                                        <i className={`ph-fill ph-${POWERUP_BY_ID[CAMP_REWARD[camp.id]]?.icon ?? "sparkle"}`} style={{ fontSize: 20, color: "var(--ochre-700)" }} />
                                        <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                                            <strong style={{ color: "var(--text-primary)" }}>Free power-up.</strong> Reach {camp.name} with your ranger for one {POWERUP_BY_ID[CAMP_REWARD[camp.id]]?.name.toLowerCase()}.
                                            {campsVisited.includes(camp.id) ? " Already claimed." : ""}
                                        </div>
                                    </div>
                                )}
                                <div style={{ marginTop: "var(--space-4)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                                    <i className="ph ph-crosshair" style={{ marginRight: 5 }} />
                                    {formatLatLng(camp.x, camp.y)}
                                </div>
                            </>
                        );
                    })()}
                </Sheet>
            )}

            {/* food resupply popup: reaching a camp with less than a full supply */}
            {foodPrompt && campAtPin && (
                <Sheet onClose={() => setFoodPrompt(false)}>
                    <Eyebrow rule>Resupply</Eyebrow>
                    <h2 style={{ fontSize: "var(--text-h4)", margin: "var(--space-3) 0 0" }}>Resupply at {campAtPin.name}</h2>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: "var(--space-3) 0 0" }}>
                        {rangerName} has {foodLeft} day{foodLeft === 1 ? "" : "s"} of food left. Top up to {FOOD_DAYS} days here at the rest camp so you can push deeper into the bush.
                    </p>
                    <div style={{ display: "flex", gap: 4, margin: "var(--space-4) 0 var(--space-5)" }}>
                        {Array.from({ length: FOOD_DAYS }).map((_, i) => (
                            <span key={i} style={{ flex: 1, height: 8, borderRadius: 999, background: i < foodLeft ? foodTone : "var(--surface-sunken)" }} />
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                        <Button
                            size="lg"
                            fullWidth
                            onClick={() => {
                                resupply(day);
                                setFoodPrompt(false);
                                showToast(`Food resupplied at ${campAtPin.name}. ${FOOD_DAYS} days of supplies.`);
                            }}
                            iconLeft={<i className="ph-fill ph-fork-knife" />}
                        >
                            Resupply food
                        </Button>
                        <Button size="lg" fullWidth variant="secondary" onClick={() => setFoodPrompt(false)}>
                            Not now
                        </Button>
                    </div>
                </Sheet>
            )}

            {/* auto-pickup notice: the bakkie collected a ranger who ran out of food */}
            {pickupNotice && (
                <Sheet onClose={() => setPickupNotice(null)}>
                    <Eyebrow rule>Out of food</Eyebrow>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "var(--space-3) 0 0" }}>
                        <i className="ph-fill ph-truck" style={{ fontSize: 26, color: "var(--ochre-600)", flex: "none" }} />
                        <h2 style={{ fontSize: "var(--text-h4)", margin: 0 }}>The bakkie brought you in</h2>
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: "var(--space-3) 0 0" }}>
                        {rangerName} ran out of food in the bush. The patrol bakkie collected the team and dropped them at {pickupNotice} to resupply. You move out again tomorrow.
                    </p>
                    <div style={{ marginTop: "var(--space-5)" }}>
                        <Button size="lg" fullWidth onClick={() => setPickupNotice(null)} iconRight={<i className="ph ph-check" />}>
                            Understood
                        </Button>
                    </div>
                </Sheet>
            )}

            {/* power-up info card: what it does, then the option to use it */}
            {powerupSheet && POWERUP_BY_ID[powerupSheet] && (
                <Sheet onClose={() => setPowerupSheet(null)}>
                    {(() => {
                        const pu = POWERUP_BY_ID[powerupSheet];
                        const count = powerCount(pu.id);
                        const u = powerupUsable(pu.id);
                        const btnLabel = pu.id === "scan" ? "Glass the bush" : pu.id === "ration" ? "Top up food" : "Push on";
                        return (
                            <>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                                    <span style={{ flex: "none", width: 52, height: 52, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--ochre-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                                        <i className={`ph-fill ph-${pu.icon}`} />
                                    </span>
                                    <div>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-accent)" }}>
                                            Ranger power-up
                                        </div>
                                        <h2 style={{ fontSize: "var(--text-h4)", margin: "0.15rem 0 0" }}>{pu.name}</h2>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.1em", color: count > 0 ? "var(--text-secondary)" : "var(--text-muted)", marginTop: 2 }}>
                                            {count} left
                                        </div>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "var(--space-4) 0 0" }}>{pu.blurb}</p>

                                {count <= 0 ? (
                                    <div style={{ marginTop: "var(--space-5)", background: "var(--surface-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
                                        <div style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                            None left. Reach a rest camp with your ranger for a free one, or stock up in the kit room.
                                        </div>
                                        <div style={{ marginTop: "var(--space-3)" }}>
                                            <Button size="sm" variant="secondary" onClick={() => router.push("/shop")} iconRight={<i className="ph ph-arrow-right" />}>
                                                Kit room
                                            </Button>
                                        </div>
                                    </div>
                                ) : u.ok ? (
                                    <div style={{ marginTop: "var(--space-5)" }}>
                                        <Button size="lg" fullWidth onClick={() => usePowerUpNow(pu.id)} iconLeft={<i className={`ph-fill ph-${pu.icon}`} />}>
                                            {btnLabel}
                                        </Button>
                                    </div>
                                ) : (
                                    <p style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: "1px dashed var(--border-default)", fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                                        {u.reason} Come back when you can use it.
                                    </p>
                                )}
                            </>
                        );
                    })()}
                </Sheet>
            )}

            {/* First-launch welcome sheet */}
            {showWelcome && !dismissed && (
                <Overlay>
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "var(--bg-overlay, rgba(17,32,26,0.55))" }}
                    onClick={closeWelcome}
                >
                    <div
                        className="kw-rise"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: 480, maxHeight: "88dvh", overflowY: "auto", background: "var(--surface-page)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)", padding: "var(--space-6) var(--gutter) calc(var(--space-7) + env(safe-area-inset-bottom))", boxShadow: "var(--shadow-xl)" }}
                    >
                        <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--border-default)", margin: "0 auto var(--space-5)" }} />
                        <div style={{ textAlign: "center", marginBottom: "var(--space-5)" }}>
                            {(ranger || dog) && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: "var(--space-4)" }}>
                                    {ranger && (
                                        <span style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--ochre-300)", background: "var(--sand-100)" }}>
                                            <Image src={ranger.photo} alt={ranger.name} fill sizes="56px" style={{ objectFit: "cover" }} />
                                        </span>
                                    )}
                                    {dog && (
                                        <span style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--ochre-300)", background: "var(--sand-100)" }}>
                                            <Image src={dog.photo} alt={dog.name} fill sizes="56px" style={{ objectFit: "cover" }} />
                                        </span>
                                    )}
                                </div>
                            )}
                            <Tag tone="green">
                                <i className="ph-fill ph-paw-print" style={{ marginRight: 4 }} />
                                {rangerName} and {dogName} are ready
                            </Tag>
                            <h2 style={{ fontSize: "var(--text-h3)", margin: "var(--space-3) 0 0" }}>Drop your first pin</h2>
                            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: "var(--space-2) 0 0" }}>
                                Tap the map where you think the suspect is hiding. Your ranger deploys there, and that ground&apos;s field guide unlocks free. From then on you move on foot, about {walkKm} km a day, carrying four days of food. When you reach new ground, send your dog to read the scent. Your first clue is waiting, so read it before you choose.
                            </p>
                        </div>
                        <div style={{ marginTop: "var(--space-2)" }}>
                            <Button size="lg" fullWidth onClick={closeWelcome} iconRight={<i className="ph ph-notebook" />}>
                                Read my first clue
                            </Button>
                        </div>
                    </div>
                </div>
                </Overlay>
            )}

            {/* Bakkie ride confirmation: the drive spends the day and a ride */}
            {truckDest && (
                <Overlay>
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--gutter)", background: "var(--bg-overlay, rgba(17,32,26,0.55))" }}
                    onClick={() => setTruckDest(null)}
                >
                    <div
                        className="kw-rise"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: 420, maxHeight: "88dvh", overflowY: "auto", background: "var(--surface-page)", borderRadius: "var(--radius-2xl)", padding: "var(--space-6) var(--gutter) var(--space-6)", boxShadow: "var(--shadow-xl)" }}
                    >
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-4)" }}>
                            <span style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--ochre-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                                <i className="ph-fill ph-truck" />
                            </span>
                        </div>
                        <h2 style={{ fontSize: "var(--text-h4)", textAlign: "center", margin: 0 }}>Ride the bakkie here?</h2>
                        <div style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-accent)", marginTop: "var(--space-2)" }}>
                            Zone {ZONE_BY_ID[zoneAtPoint(truckDest)].number}, {ZONE_BY_ID[zoneAtPoint(truckDest)].name}
                        </div>
                        <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: "var(--space-4) 0 0", textAlign: "center" }}>
                            The drive takes the rest of the day. {dogName} reads the ground where the wheels stop.
                        </p>
                        <div style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "var(--space-3)" }}>
                            Rides left after this: {Math.max(0, truckRidesLeft - 1)}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-5)" }}>
                            <Button size="lg" fullWidth onClick={confirmRide} iconRight={<i className="ph ph-truck" />}>
                                Ride the bakkie
                            </Button>
                            <Button size="lg" fullWidth variant="ghost" onClick={cancelRide}>
                                Stay on foot
                            </Button>
                        </div>
                    </div>
                </div>
                </Overlay>
            )}

            {/* the spotting card: dealt face-down like a trading card, tap to flip.
                Cards read from the log for species still out there show the same
                face in black and white with a Not found pill. */}
            {spot && (
                <DealtCard
                    flipped={spotFlipped}
                    onFlip={() => setSpotFlipped(true)}
                    onDismiss={advanceSpotCard}
                    backIcon="paw-print"
                    backEyebrow={spot.bonus ? "Bonus spot" : "Spotting log"}
                    backLine={spot.bonus ? "And something else moved out there." : "You have spotted something in the bush."}
                    backImage={CARD_BACK.species}
                    // Gold frame marks a rare sighting or a Big, Ugly or Small Five card.
                    frameAccent={spot.found !== false && (spot.species.rarity === "rare" || FIVE_OF[spot.species.id]) ? "var(--ochre-400)" : undefined}
                >
                    <div>
                        {(() => {
                            const found = spot.found !== false;
                            const five = FIVE_OF[spot.species.id];
                            const rMeta = RARITY_META[spot.species.rarity];
                            const gold = found && (spot.species.rarity === "rare" || Boolean(five));
                            const accent = gold ? "var(--ochre-400)" : "var(--border-subtle)";
                            // A rare chip glows gold; common stays dark glass.
                            const rarityBg = spot.species.rarity === "rare" ? "var(--ochre-500)" : "rgba(24,45,35,0.55)";
                            const act = speciesActivity(spot.species.id);
                            return (
                                <>
                                    <div style={{ position: "relative", aspectRatio: "16 / 9", background: "var(--sand-100)" }}>
                                        <Image
                                            src={spot.species.photo}
                                            alt={spot.species.name}
                                            fill
                                            sizes="400px"
                                            style={{ objectFit: "cover", filter: found ? undefined : "grayscale(1)" }}
                                        />
                                        <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(24,45,35,0) 38%, rgba(24,45,35,0.8) 100%)" }} />
                                        {/* family badge, top-left */}
                                        <span style={{ position: "absolute", top: 12, left: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px 5px 8px", borderRadius: 999, background: "rgba(24,45,35,0.5)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", border: "1px solid rgba(245,239,226,0.25)" }}>
                                            <i className={`ph-fill ph-${FAMILY_ICON[spot.species.type]}`} style={{ fontSize: 14, color: "var(--sand-50)" }} />
                                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sand-50)", fontWeight: 700 }}>{FAMILY_LABEL[spot.species.type]}</span>
                                        </span>
                                        {/* rarity chip, top-right */}
                                        <span style={{ position: "absolute", top: 12, right: 12, display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 999, background: rarityBg, border: "1px solid rgba(245,239,226,0.35)", boxShadow: spot.species.rarity !== "common" ? "0 2px 12px rgba(0,0,0,0.3)" : "none" }}>
                                            <i className={`ph-fill ph-${rMeta.icon}`} style={{ fontSize: 13, color: "var(--sand-50)" }} />
                                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sand-50)", fontWeight: 700 }}>{rMeta.label}</span>
                                        </span>
                                        {/* name and status, over the gradient */}
                                        <div style={{ position: "absolute", left: 16, right: 16, bottom: 13 }}>
                                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,239,226,0.72)", marginBottom: 3 }}>
                                                {found ? "Spotted" : "Still out there"}
                                            </div>
                                            <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "1.55rem", lineHeight: 1.1, color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,0.55)" }}>{spot.species.name}</h2>
                                            {five && (
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ochre-300)", fontWeight: 700 }}>
                                                    <i className="ph-fill ph-seal-check" /> {five.replace("The ", "")} member
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* rarity accent stripe */}
                                    <div style={{ height: 4, background: accent }} />
                                    <div style={{ padding: "var(--space-4) var(--space-5) var(--space-5)" }}>
                                        {(!found || act !== "any") && (
                                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
                                                {!found && (
                                                    <Tag tone="neutral" size="sm">
                                                        <i className="ph ph-eye-slash" style={{ marginRight: 4 }} /> Not found
                                                    </Tag>
                                                )}
                                                {act !== "any" && (
                                                    <Tag tone="neutral" size="sm">
                                                        <i className={`ph-fill ph-${act === "night" ? "moon-stars" : "sun"}`} style={{ marginRight: 4 }} />
                                                        {act === "night" ? "After dark" : "By day"}
                                                    </Tag>
                                                )}
                                            </div>
                                        )}
                                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                                            {spot.species.info}
                                        </p>
                                        {speciesStats(spot.species.id).length > 0 && (
                                            <div style={{ marginTop: "var(--space-3)" }}>
                                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-accent)", marginBottom: 6 }}>
                                                    <i className="ph ph-ruler" style={{ marginRight: 5 }} /> Field stats
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                                    {speciesStats(spot.species.id).map((st) => (
                                                        <div key={st.label} style={{ background: "var(--surface-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "0.35rem 0.55rem" }}>
                                                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                                                                {st.label}
                                                            </div>
                                                            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.25, marginTop: 1 }}>
                                                                {st.value}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {five && (
                                            <p style={{ fontSize: "0.82rem", color: "var(--ochre-700)", fontWeight: 600, lineHeight: 1.5, margin: "var(--space-3) 0 0" }}>
                                                {found
                                                    ? `Part of ${five}. Spot all five and an instant prize is yours.`
                                                    : `Part of ${five}. Spot all five to win an instant prize.`}
                                            </p>
                                        )}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", marginTop: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: "1px dashed var(--border-default)" }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", lineHeight: 1.5 }}>
                                    {spot.found === false ? (
                                        <>
                                            Not yet in your collection
                                            <br />
                                            Keep moving to find it
                                        </>
                                    ) : (
                                        <>
                                            Entered into your collection
                                            <br />
                                            {spot.bonus ? "Bonus spot · " : ""}
                                            {spot.isNew ? "New species" : `Sighting no. ${spot.count}`}
                                        </>
                                    )}
                                </div>
                                {spotQueue.length > 0 ? (
                                    <Button size="sm" variant="secondary" onClick={advanceSpotCard} iconRight={<i className="ph-fill ph-sparkle" />}>
                                        Next card
                                    </Button>
                                ) : spot.found === false ? (
                                    <Button size="sm" variant="secondary" onClick={() => setSpot(null)} iconRight={<i className="ph ph-binoculars" />}>
                                        Back to the log
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => {
                                            setSpot(null);
                                            setSheet("spots");
                                        }}
                                        iconRight={<i className="ph ph-binoculars" />}
                                    >
                                        View collection
                                    </Button>
                                )}
                            </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </DealtCard>
            )}

            {/* a new clue, dealt onto the screen like a card from the deck */}
            {clueCard && (
                <DealtCard
                    flipped={clueFlipped}
                    onFlip={() => setClueFlipped(true)}
                    onDismiss={() => setClueCard(null)}
                    backIcon="notebook"
                    backEyebrow="Field clue"
                    backLine="New intel has come in from the field."
                    backImage={CARD_BACK.clue}
                >
                    <div style={{ padding: "var(--space-4)" }}>
                        <ClueCard clue={clueCard} action={clueAction(clueCard)} />
                        <div style={{ marginTop: "var(--space-3)", display: "flex", justifyContent: "flex-end" }}>
                            <Button size="sm" variant="secondary" onClick={() => setClueCard(null)} iconRight={<i className="ph ph-map-pin" />}>
                                Work the ground
                            </Button>
                        </div>
                    </div>
                </DealtCard>
            )}

            {/* a freshly unlocked field guide, dealt in the same way */}
            {guideCard && (
                <DealtCard
                    flipped={guideFlipped}
                    onFlip={() => setGuideFlipped(true)}
                    onDismiss={dismissGuideCard}
                    backIcon="book-open-text"
                    backEyebrow="Field guide"
                    backLine="New ground, unlocked."
                    backImage={CARD_BACK.guide}
                >
                    <GuideCardFront
                        zone={guideCard}
                        note="Unlocked free with your first pin. It reads the ground you are standing on: the rock, the plants, the animals and the named places a clue can point to."
                        onRead={() => {
                            const z = guideCard;
                            dismissGuideCard();
                            setGuideZone(z);
                        }}
                    />
                </DealtCard>
            )}

            {/* spotting bingo: a completed five wins an instant prize */}
            {fiveWin && (
                <Overlay>
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 75, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--gutter)", background: "var(--bg-overlay, rgba(17,32,26,0.65))" }}
                    onClick={() => setFiveWin(null)}
                >
                    <div
                        className="kw-card-pop"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "100%",
                            maxWidth: 400,
                            maxHeight: "88dvh",
                            overflowY: "auto",
                            background: "var(--surface-page)",
                            borderRadius: "var(--radius-2xl)",
                            border: "2px solid var(--ochre-400)",
                            boxShadow: "var(--shadow-xl), 0 0 0 4px var(--ochre-100)",
                            padding: "var(--space-6) var(--gutter)",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-4)" }}>
                            <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--ochre-600)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                                <i className="ph-fill ph-trophy" />
                            </span>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--ochre-700)", fontWeight: 700 }}>
                            Spotting bingo
                        </div>
                        <h2 style={{ fontSize: "var(--text-h3)", margin: "var(--space-2) 0 0" }}>{fiveWin.label}, complete.</h2>
                        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-2)", margin: "var(--space-4) 0" }}>
                            {fiveWin.members.map((m) => {
                                const sp = SPECIES_BY_ID[m];
                                return (
                                    <span key={m} style={{ position: "relative", width: 52, height: 52, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--ochre-400)" }}>
                                        <Image src={sp.photo} alt={sp.name} fill sizes="52px" style={{ objectFit: "cover" }} />
                                    </span>
                                );
                            })}
                        </div>
                        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                            All five, spotted and logged. An instant prize is yours: {fiveWin.prize}. It will be waiting with your results at round end.
                        </p>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "var(--space-4)" }}>
                            Instant prize · Banked
                        </div>
                        <div style={{ marginTop: "var(--space-5)" }}>
                            <Button size="lg" fullWidth onClick={() => setFiveWin(null)} iconRight={<i className="ph ph-paw-print" />}>
                                Back to the hunt
                            </Button>
                        </div>
                    </div>
                </div>
                </Overlay>
            )}

            {/* Lock-in confirmation: this is the one decision that ranks the player */}
            {lockModal && pin && (
                <Overlay>
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--gutter)", background: "var(--bg-overlay, rgba(17,32,26,0.55))" }}
                    onClick={() => setLockModal(false)}
                >
                    <div
                        className="kw-rise"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: 420, maxHeight: "88dvh", overflowY: "auto", background: "var(--surface-page)", borderRadius: "var(--radius-2xl)", padding: "var(--space-6) var(--gutter) var(--space-6)", boxShadow: "var(--shadow-xl)" }}
                    >
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-4)" }}>
                            <span style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--clay-100)", color: "var(--clay-600)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                                <i className="ph-fill ph-lock-simple" />
                            </span>
                        </div>
                        <h2 style={{ fontSize: "var(--text-h4)", textAlign: "center", margin: 0 }}>Lock in your final answer?</h2>
                        {pinZone && (
                            <div style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-accent)", marginTop: "var(--space-2)" }}>
                                Zone {pinZone.number}, {pinZone.name}
                            </div>
                        )}
                        <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: "var(--space-4) 0 0", textAlign: "center" }}>
                            One lock-in for the whole game. This pin is the one that counts when the round closes. Ties go to the earliest locked pin.
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5, margin: "var(--space-3) 0 0", textAlign: "center" }}>
                            Only a second lock-in from the kit can reopen it.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-5)" }}>
                            <Button size="lg" fullWidth onClick={confirmLockIn} iconRight={<i className="ph ph-lock-simple" />}>
                                Lock in for the round
                            </Button>
                            <Button size="lg" fullWidth variant="ghost" onClick={() => setLockModal(false)}>
                                Keep tracking
                            </Button>
                        </div>
                    </div>
                </div>
                </Overlay>
            )}
        </div>
    );
}

export default function MapPage() {
    return (
        <Suspense fallback={null}>
            <MapInner />
        </Suspense>
    );
}
