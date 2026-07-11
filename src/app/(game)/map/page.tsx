"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { Button, Eyebrow, Tag } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { ImpactHighlight, useCampaignTotal } from "@/components/game/impact";
import { KrugerMap } from "@/components/game/KrugerMap";
import { Overlay } from "@/components/game/Overlay";
import { ZoneSheet } from "@/components/game/ZoneSheet";
import { CLUE_BY_ID, CLUES, DOG_BY_ID, FIVES, FIVE_OF, RANGER_BY_ID, ROUND, SPECIES, SPECIES_BY_ID, ZONES, ZONE_BY_ID } from "@/data";
import type { Species, Zone } from "@/data";
import {
    EXTRA_MOVE_DOGS,
    SCENT_TEXT,
    THIRD_LABEL,
    availableClueIds,
    dailyWalkKm,
    distanceKm,
    scentDirectionText,
    daysRemaining,
    isRoundOver,
    nextClueLabel,
    poacherThird,
    scentRead,
    thirdOf,
    tierRank,
    zoneAtPoint,
} from "@/lib/game";
import { RARITY_META, SPOTTER_DOGS, bonusSpotDue, rollFirstSpot, rollSpot } from "@/lib/spotting";
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

type SheetId = "status" | "ranger" | "dog" | "clue" | "guides" | "bakkie" | "night" | "spots";

type SpotItem = { species: Species; isNew: boolean; count: number; bonus?: boolean };

/**
 * A trading-card flip: children render the front, the back is the branded
 * plate. The front's natural height sizes the card; the back covers it.
 */
function CardFlip({
    flipped,
    onFlip,
    backIcon,
    backEyebrow,
    backLine,
    children,
}: {
    flipped: boolean;
    onFlip: () => void;
    backIcon: string;
    backEyebrow: string;
    backLine: string;
    children: React.ReactNode;
}) {
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
                </div>
            </div>
        </div>
    );
}

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

/** Round avatar button for the split ranger / dog team icons. */
function AvatarButton({ src, alt, dot, onClick }: { src: string; alt: string; dot: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label={alt}
            className="kw-press"
            style={{
                position: "relative",
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: "2px solid var(--sand-50)",
                background: "var(--sand-100)",
                boxShadow: "var(--shadow-md)",
                cursor: "pointer",
                padding: 0,
                overflow: "visible",
            }}
        >
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
                <Image src={src} alt={alt} fill sizes="52px" style={{ objectFit: "cover" }} />
            </span>
            {dot && <NDot />}
        </button>
    );
}

/** Custom side-dock tab: a rounded plate hanging off the right edge of the map. */
function DockTab({ icon, label, dot, onClick }: { icon: string; label: string; dot?: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
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
    const pinMovesToday = useGameStore((s) => s.pinMovesToday);
    const scentSeenAt = useGameStore((s) => s.scentSeenAt);
    const cluesSeenDay = useGameStore((s) => s.cluesSeenDay);
    const markScentSeen = useGameStore((s) => s.markScentSeen);
    const markCluesSeen = useGameStore((s) => s.markCluesSeen);
    const truckRidesLeft = useGameStore((s) => s.truckRidesLeft);
    const rideTruck = useGameStore((s) => s.rideTruck);
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
    const campaignTotal = useCampaignTotal();

    const [dismissed, setDismissed] = useState(false);
    const [guideZone, setGuideZone] = useState<Zone | null>(null);
    const [guideJustUnlocked, setGuideJustUnlocked] = useState(false);
    const [lockModal, setLockModal] = useState(false);
    const [sheet, setSheet] = useState<SheetId | null>(null);
    // Bakkie mode: pick anywhere on the map, then confirm the ride.
    const [truckMode, setTruckMode] = useState(false);
    const [truckDest, setTruckDest] = useState<{ x: number; y: number } | null>(null);
    // Which elimination clue was just marked on the case board (confirmation line).
    const [markedClueId, setMarkedClueId] = useState<string | null>(null);
    // The species just spotted (or a collection card being read), plus any
    // bonus card still waiting to be dealt (spotter dog or binoculars).
    const [spot, setSpot] = useState<SpotItem | null>(null);
    const [spotQueue, setSpotQueue] = useState<SpotItem[]>([]);
    // Fresh spots deal in face-down like a trading card; a tap flips the reveal.
    const [spotFlipped, setSpotFlipped] = useState(true);
    // New clues deal in the same way, once per release day.
    const [clueFlipped, setClueFlipped] = useState(true);
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

    // Movement: one move a day, plus one for boots, plus one for Storm's drive.
    const maxMoves =
        1 + (inventory.includes("ranger-boots") ? 1 : 0) + (player && EXTRA_MOVE_DOGS.has(player.dogId) ? 1 : 0);
    const movesToday = pinMovesToday?.day === day ? pinMovesToday.count : 0;
    // At night the ranger and dog have made camp, so no movement until dawn.
    const canMove = !pin?.locked && movesToday < maxMoves && !night;
    const walkKm = dailyWalkKm(player?.dogId);
    // Dusk nudge: light is going and the ranger has not moved today.
    const showDuskPrompt = Boolean(pin && !pin.locked && !roundOver && isDusk(hour) && movesToday === 0);

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

    // Notification badges.
    const rangerDot = Boolean(pin && canMove);
    const dogDot = Boolean(pin && pin.updatedAt !== scentSeenAt);
    const newClueToday = CLUES.some((c) => c.source === "free" && c.releaseDay === day) && cluesSeenDay !== day;

    // Every move turns up one species from the ground the ranger now stands on.
    // The first spot of the game always comes from the Big, Ugly or Small Five.
    const spotAtCurrentPin = () => {
        const p = useGameStore.getState().pin;
        if (!p) return;
        const firstEver = useGameStore.getState().sightings.length === 0;
        const species = firstEver ? rollFirstSpot(thirdOf(p)) : rollSpot(thirdOf(p));
        const priorCount = useGameStore.getState().sightings.filter((s) => s.speciesId === species.id).length;
        recordSighting(species.id, day);
        // Every third move a spotter dog or the binoculars turn up ONE bonus
        // card. Having both never stacks beyond the single extra.
        const queue: SpotItem[] = [];
        const totalMoves = useGameStore.getState().trail.length;
        const hasSpotterDog = Boolean(player && SPOTTER_DOGS.has(player.dogId));
        if (bonusSpotDue(totalMoves, hasSpotterDog, inventory.includes("pro-binoculars"))) {
            const extra = rollSpot(thirdOf(p));
            const extraPrior = useGameStore.getState().sightings.filter((s) => s.speciesId === extra.id).length;
            recordSighting(extra.id, day);
            queue.push({ species: extra, isNew: extraPrior === 0, count: extraPrior + 1, bonus: true });
        }
        // Bingo: did this move complete one of the fives for the first time?
        const collected = new Set(useGameStore.getState().sightings.map((s) => s.speciesId));
        const won = useGameStore.getState().fivesWon;
        const completed = FIVES.find((f) => !won.includes(f.id) && f.members.every((m) => collected.has(m)));
        if (completed) {
            recordFiveWin(completed.id);
            setPendingFiveWin(completed);
        }
        // Deal the card face-down; reduced motion goes straight to the reveal.
        const reduced =
            typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setSpotQueue(queue);
        setSpotFlipped(reduced);
        setSpot({ species, isNew: priorCount === 0, count: priorCount + 1 });
    };

    // Dismissing a spot card deals the next one; the last card gives way to
    // the bingo celebration if this move completed a five.
    const advanceSpotCard = () => {
        if (spotQueue.length > 0) {
            const [next, ...rest] = spotQueue;
            const reduced =
                typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            setSpotQueue(rest);
            setSpotFlipped(reduced);
            setSpot(next);
        } else {
            setSpot(null);
            if (pendingFiveWin) {
                setFiveWin(pendingFiveWin);
                setPendingFiveWin(null);
            }
        }
    };

    const onPlace = (x: number, y: number) => {
        if (!canMove && pin) return; // out of moves today; existing pin stays put
        const firstPin = fieldGuides.length === 0;
        moveRanger(x, y, day);
        spotAtCurrentPin();
        // Your first field guide is free: unlock it for the ground you first pin,
        // then bring it up so the player reads it and learns they can unlock more.
        if (firstPin) {
            const zoneId = zoneAtPoint({ x, y });
            grantFieldGuide(zoneId);
            setGuideZone(ZONE_BY_ID[zoneId]);
            setGuideJustUnlocked(true);
        }
    };

    const closeGuide = () => {
        setGuideZone(null);
        setGuideJustUnlocked(false);
    };

    const confirmLockIn = () => {
        lockPin();
        setLockModal(false);
    };

    const closeWelcome = () => {
        setDismissed(true);
        router.replace("/map");
    };

    const openDogSheet = () => {
        markScentSeen();
        startReveal();
        setSheet("dog");
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
            spotAtCurrentPin();
        }
        setTruckDest(null);
        setTruckMode(false);
    };

    const cancelRide = () => {
        setTruckDest(null);
        setTruckMode(false);
    };

    const openClueSheet = () => {
        // A clue seen for the first time on its release day deals in face-down.
        const fresh = newClueToday;
        const reduced =
            typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setClueFlipped(!fresh || reduced);
        markCluesSeen(day);
        setSheet("clue");
    };

    return (
        <div style={{ position: "relative", height: "calc(100% + 5.5rem)", marginBottom: "-5.5rem", background: sky.gradient, transition: "background 1.2s var(--ease-out)" }}>
            <KrugerMap
                pin={pin}
                onPlace={truckMode ? onPickDestination : onPlace}
                maxScale={inventory.includes("pro-binoculars") ? 8 : 4}
                legendTop={200}
                walkRangeKm={!truckMode && pin && !pin.locked && canMove ? walkKm : null}
                freeDrag={truckMode}
                trail={trail}
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

            {/* time of day: sun or moon with the clock; opens the Kruger nights note */}
            <div style={{ position: "absolute", left: "50%", top: 12, transform: "translateX(-50%)" }}>
                <button
                    onClick={() => setSheet("night")}
                    className="kw-press"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0.42rem 0.75rem",
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

            {/* the team, split: you, your dog and the bakkie, each with their own signal */}
            {ranger && (
                <div style={{ position: "absolute", left: "var(--gutter)", top: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    <AvatarButton src={ranger.photo} alt={`${rangerName}, your ranger`} dot={rangerDot} onClick={() => setSheet("ranger")} />
                    {dog && <AvatarButton src={dog.photo} alt={`${dogName}, your dog`} dot={dogDot} onClick={openDogSheet} />}
                    {/* the bakkie: full colour while it has fuel, grey when the tank is dry */}
                    <button
                        onClick={() => setSheet("bakkie")}
                        aria-label={`Patrol bakkie, ${truckRidesLeft} ride${truckRidesLeft === 1 ? "" : "s"} left`}
                        className="kw-press"
                        style={{
                            position: "relative",
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            border: "2px solid var(--sand-50)",
                            background: "var(--accent-soft)",
                            boxShadow: "var(--shadow-md)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            filter: truckRidesLeft > 0 ? "none" : "grayscale(1)",
                            opacity: truckRidesLeft > 0 ? 1 : 0.65,
                        }}
                    >
                        <i className="ph-fill ph-truck" style={{ fontSize: 24, color: "var(--ochre-700)" }} />
                        {truckRidesLeft > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: -3,
                                    right: -3,
                                    minWidth: 17,
                                    height: 17,
                                    borderRadius: 999,
                                    background: "var(--ochre-500)",
                                    color: "var(--sand-900)",
                                    border: "2px solid var(--sand-50)",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.58rem",
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "var(--shadow-sm)",
                                }}
                            >
                                {truckRidesLeft}
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* top-right, under the compass: round status and prizes */}
            <div style={{ position: "absolute", right: "var(--gutter)", top: 64, display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                    onClick={() => setSheet("status")}
                    aria-label="Round status"
                    className="kw-press"
                    style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border-subtle)", background: "rgba(250,246,236,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxShadow: "var(--shadow-sm)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}
                >
                    <i className="ph ph-calendar-blank" style={{ fontSize: 18 }} />
                </button>
                <button
                    onClick={() => router.push("/prizes")}
                    aria-label="Prizes and how to win"
                    className="kw-press"
                    style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border-subtle)", background: "rgba(250,246,236,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxShadow: "var(--shadow-sm)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}
                >
                    <i className="ph ph-trophy" style={{ fontSize: 18 }} />
                </button>
            </div>

            {/* right dock: anchored below the compass, status and trophy stack so
                the two columns can never overlap, whatever the screen height */}
            <div style={{ position: "absolute", right: "var(--gutter)", top: 168, display: "flex", flexDirection: "column", gap: 10 }}>
                <DockTab icon="notebook" label="Clue" dot={newClueToday} onClick={openClueSheet} />
                <DockTab icon="book-open-text" label="Guides" onClick={() => setSheet("guides")} />
                <DockTab icon="binoculars" label="Spots" onClick={() => setSheet("spots")} />
                <DockTab icon="radio" label="Radio" onClick={() => router.push("/codes")} />
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
                    {pin && !pin.locked && (
                        <>
                            {canMove ? (
                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "var(--space-3) 0 0" }}>
                                    {`${maxMoves - movesToday === 1 ? "One move" : `${maxMoves - movesToday} moves`} left today, up to ${walkKm} km each. Drag your pin to walk. The ring is your reach.`}
                                </p>
                            ) : (
                                <div style={{ margin: "var(--space-3) 0 0" }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: 8 }}>
                                        <i className="ph-fill ph-campfire" style={{ color: "var(--ochre-600)", fontSize: 17 }} /> Camped for the night.
                                    </div>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "var(--space-1, 0.25rem) 0 0" }}>
                                        {night
                                            ? `The Kruger is dangerous after dark, so ${dogName} settles by the fire. You move again at dawn.`
                                            : `${dogName} settles by the fire. Fresh legs at dawn.`}
                                    </p>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "var(--space-2)" }}>
                                        TODAY: {truckedToday ? "BY BAKKIE" : `${kmToday} KM`}
                                        {read ? ` · ${TIER_META[read.tier].label.toUpperCase()}` : ""} · {clueCountdown}
                                    </div>
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
                        const hot = Boolean(read && !revealing && read.tier === "hot");
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
                                    {pin && read && !revealing && (
                                        <Tag tone={TIER_META[read.tier].tone} size="sm">
                                            <i className={`ph ph-${TIER_META[read.tier].icon}`} style={{ marginRight: 4 }} />
                                            {TIER_META[read.tier].label}
                                        </Tag>
                                    )}
                                </div>

                                {!pin || !read ? (
                                    <p style={{ margin: "var(--space-4) 0 0", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                                        {dogName} is waiting for you to place your ranger. Tap the map and the dog reads the ground there.
                                    </p>
                                ) : revealing ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "var(--space-5) 0 var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                                        <i className="ph ph-paw-print kw-spin" style={{ fontSize: 16, color: "var(--ochre-600)" }} />
                                        {dogName} is casting...
                                    </div>
                                ) : (
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
                    {latest && (
                        <CardFlip
                            flipped={clueFlipped}
                            onFlip={() => setClueFlipped(true)}
                            backIcon="notebook"
                            backEyebrow="Field clue"
                            backLine="New intel has come in from the field."
                        >
                        <ClueCard
                            clue={latest}
                            action={
                                latest.kind === "elimination" ? (
                                    markedClueId === latest.id || zoneMarks[latest.zoneId] === "ruled-out" ? (
                                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                            <i className="ph ph-check" style={{ marginRight: 5 }} /> Marked on your case board.
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                ruleOutZone(latest.zoneId);
                                                setMarkedClueId(latest.id);
                                            }}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.2rem 0", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-link)", display: "inline-flex", alignItems: "center", gap: 6 }}
                                        >
                                            <i className="ph ph-prohibit" /> Rule it out on your case board
                                        </button>
                                    )
                                ) : undefined
                            }
                        />
                        </CardFlip>
                    )}
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
                        return (
                            <>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-primary)", fontWeight: 700, margin: "var(--space-3) 0 0" }}>
                                    {spotted.size} of {SPECIES.length} species spotted
                                </div>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0.3rem 0 0", lineHeight: 1.5 }}>
                                    Every move, {dogName} puts something up. Common sightings fill the log, rare ones are a good day, and a once in a lifetime sighting is linked to prizes at round end.
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
                                                        <span key={m} style={{ position: "relative", flex: 1, aspectRatio: "1", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${seen ? "var(--ochre-500)" : "var(--border-default)"}` }}>
                                                            <Image
                                                                src={sp.photo}
                                                                alt={seen ? sp.name : `${sp.name}, not yet spotted`}
                                                                fill
                                                                sizes="64px"
                                                                style={{ objectFit: "cover", filter: seen ? "none" : "grayscale(1)", opacity: seen ? 1 : 0.35 }}
                                                            />
                                                        </span>
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
                                                        onClick={() => {
                                                            if (!seen) return;
                                                            setSpotFlipped(true); // a re-read, not a reveal
                                                            setSpotQueue([]);
                                                            setSpot({
                                                                species: s,
                                                                isNew: false,
                                                                count: sightings.filter((x) => x.speciesId === s.id).length,
                                                            });
                                                        }}
                                                        aria-label={seen ? s.name : "Not yet spotted"}
                                                        style={{
                                                            position: "relative",
                                                            aspectRatio: "1",
                                                            borderRadius: "var(--radius-md)",
                                                            overflow: "hidden",
                                                            // gold ring for the fives, clay for once in a lifetime
                                                            border: seen
                                                                ? s.rarity === "oialt"
                                                                    ? "2px solid var(--clay-500)"
                                                                    : FIVE_OF[s.id]
                                                                      ? "2px solid var(--ochre-400)"
                                                                      : "1px solid var(--border-subtle)"
                                                                : "1px solid var(--border-subtle)",
                                                            background: "var(--surface-sunken)",
                                                            cursor: seen ? "pointer" : "default",
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
                justUnlocked={guideJustUnlocked}
                onBuyMore={() => {
                    closeGuide();
                    router.push("/shop");
                }}
            />

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
                                Tap the map where you think the suspect is hiding. Your ranger deploys there, and that ground&apos;s field guide unlocks free. From then on you move on foot, about {walkKm} km a day, so read your first clue before you choose.
                            </p>
                        </div>
                        <ClueCard clue={CLUE_BY_ID["f01"]} />
                        <div style={{ marginTop: "var(--space-5)" }}>
                            <Button size="lg" fullWidth onClick={closeWelcome} iconRight={<i className="ph ph-map-pin" />}>
                                Drop my first pin
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

            {/* the spotting card: dealt face-down like a trading card, tap to flip */}
            {spot && (
                <Overlay>
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--gutter)", background: "var(--bg-overlay, rgba(17,32,26,0.6))" }}
                    onClick={() => (spotFlipped ? advanceSpotCard() : setSpotFlipped(true))}
                >
                    <div className="kw-card-pop" onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 400 }}>
                    <CardFlip
                        flipped={spotFlipped}
                        onFlip={() => setSpotFlipped(true)}
                        backIcon="paw-print"
                        backEyebrow={spot.bonus ? "Bonus spot" : "Spotting log"}
                        backLine={spot.bonus ? "And something else moved out there." : `${dogName} put something up.`}
                    >
                    <div
                        style={{
                            maxHeight: "88dvh",
                            overflowX: "hidden",
                            overflowY: "auto",
                            background: "var(--surface-page)",
                            borderRadius: "var(--radius-2xl)",
                            // Gold marks a Big, Ugly or Small Five card; clay marks once in a lifetime.
                            boxShadow: FIVE_OF[spot.species.id]
                                ? "var(--shadow-xl), 0 0 0 3px var(--ochre-100)"
                                : "var(--shadow-xl)",
                            border:
                                spot.species.rarity === "oialt"
                                    ? "2px solid var(--clay-500)"
                                    : FIVE_OF[spot.species.id]
                                      ? "2px solid var(--ochre-400)"
                                      : "1px solid var(--border-subtle)",
                        }}
                    >
                        <div style={{ position: "relative", aspectRatio: "16 / 10", background: "var(--sand-100)" }}>
                            <Image src={spot.species.photo} alt={spot.species.name} fill sizes="400px" style={{ objectFit: "cover" }} />
                            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(24,45,35,0) 55%, rgba(24,45,35,0.45) 100%)" }} />
                            <span style={{ position: "absolute", left: 14, bottom: 10, fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sand-50)" }}>
                                Spotted · {spot.species.type}
                            </span>
                        </div>
                        <div style={{ padding: "var(--space-5) var(--space-5) var(--space-6)" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
                                <h2 style={{ fontSize: "var(--text-h4)", margin: 0 }}>{spot.species.name}</h2>
                                <span style={{ display: "inline-flex", gap: 6, flex: "none" }}>
                                    {FIVE_OF[spot.species.id] && (
                                        <Tag tone="teal" size="sm">
                                            <i className="ph-fill ph-seal-check" style={{ marginRight: 4 }} />
                                            {FIVE_OF[spot.species.id].replace("The ", "")}
                                        </Tag>
                                    )}
                                    <Tag tone={RARITY_META[spot.species.rarity].tone} size="sm">
                                        <i className={`ph-fill ph-${RARITY_META[spot.species.rarity].icon}`} style={{ marginRight: 4 }} />
                                        {RARITY_META[spot.species.rarity].label}
                                    </Tag>
                                </span>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: "var(--space-3) 0 0" }}>
                                {spot.species.info}
                            </p>
                            {spot.species.rarity === "oialt" && (
                                <p style={{ fontSize: "0.82rem", color: "var(--clay-600)", fontWeight: 600, lineHeight: 1.5, margin: "var(--space-3) 0 0" }}>
                                    A once in a lifetime sighting. Hold onto this card: sightings like this one are linked to prizes when the round closes.
                                </p>
                            )}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", marginTop: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: "1px dashed var(--border-default)" }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", lineHeight: 1.5 }}>
                                    Entered into your collection
                                    <br />
                                    {spot.bonus ? "Bonus spot · " : ""}
                                    {spot.isNew ? "New species" : `Sighting no. ${spot.count}`}
                                </div>
                                {spotQueue.length > 0 ? (
                                    <Button size="sm" variant="secondary" onClick={advanceSpotCard} iconRight={<i className="ph-fill ph-sparkle" />}>
                                        Next card
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
                    </div>
                    </CardFlip>
                    </div>
                </div>
                </Overlay>
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
