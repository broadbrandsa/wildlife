"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { Button, Eyebrow, Tag } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { ImpactHighlight, useCampaignTotal } from "@/components/game/impact";
import { KrugerMap } from "@/components/game/KrugerMap";
import { ZoneSheet } from "@/components/game/ZoneSheet";
import { CLUE_BY_ID, CLUES, DOG_BY_ID, RANGER_BY_ID, ROUND, ZONES, ZONE_BY_ID } from "@/data";
import type { Zone } from "@/data";
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
    tierRank,
    zoneAtPoint,
} from "@/lib/game";
import type { ScentTier } from "@/lib/game";
import { NEAR_TARGET_KM, rangersHunting, rangersNearTarget } from "@/lib/community";
import { useCurrentDay, useGameStore } from "@/store/game";

const TIER_META: Record<ScentTier, { label: string; tone: "neutral" | "teal" | "ochre" | "clay"; icon: string }> = {
    cold: { label: "Cold ground", tone: "neutral", icon: "thermometer-cold" },
    faint: { label: "Faint trail", tone: "teal", icon: "wind" },
    warm: { label: "Warm trail", tone: "ochre", icon: "footprints" },
    hot: { label: "Fresh sign", tone: "clay", icon: "paw-print" },
};

type SheetId = "status" | "ranger" | "dog" | "clue" | "guides" | "bakkie";

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
                borderRight: "none",
                borderRadius: "14px 0 0 14px",
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

/** Bottom sheet shared by every popup on the map. */
function Sheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
    return (
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
                    maxHeight: "80dvh",
                    overflowY: "auto",
                    background: "var(--surface-page)",
                    borderTopLeftRadius: "var(--radius-2xl)",
                    borderTopRightRadius: "var(--radius-2xl)",
                    padding: "var(--space-5) var(--gutter) var(--space-7)",
                    boxShadow: "var(--shadow-xl)",
                }}
            >
                <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--border-default)", margin: "0 auto var(--space-5)" }} />
                {children}
            </div>
        </div>
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
    const day = useCurrentDay();
    const roundOver = isRoundOver(day);

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
    const canMove = !pin?.locked && movesToday < maxMoves;
    const walkKm = dailyWalkKm(player?.dogId);

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

    const onPlace = (x: number, y: number) => {
        if (!canMove && pin) return; // out of moves today; existing pin stays put
        const firstPin = fieldGuides.length === 0;
        moveRanger(x, y, day);
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

    // The bakkie: only once a pin exists, never on a locked pin or a closed round.
    const canCallBakkie = Boolean(pin && !pin.locked && !roundOver);

    const callBakkie = () => {
        setSheet(null);
        setTruckMode(true);
    };

    const onPickDestination = (x: number, y: number) => setTruckDest({ x, y });

    const confirmRide = () => {
        if (truckDest) rideTruck(truckDest.x, truckDest.y, day);
        setTruckDest(null);
        setTruckMode(false);
    };

    const cancelRide = () => {
        setTruckDest(null);
        setTruckMode(false);
    };

    const openClueSheet = () => {
        markCluesSeen(day);
        setSheet("clue");
    };

    return (
        <div style={{ position: "relative", height: "calc(100% + 5.5rem)", marginBottom: "-5.5rem", background: "radial-gradient(120% 110% at 50% 0%, #2C4A39 0%, #16110A 92%)" }}>
            <KrugerMap
                pin={pin}
                onPlace={truckMode ? onPickDestination : onPlace}
                maxScale={inventory.includes("pro-binoculars") ? 8 : 4}
                legendTop={140}
                walkRangeKm={!truckMode && pin && !pin.locked && canMove ? walkKm : null}
                freeDrag={truckMode}
                trail={trail}
            />

            {/* the team, split: you and your dog, each with their own signal */}
            {ranger && (
                <div style={{ position: "absolute", left: "var(--gutter)", top: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    <AvatarButton src={ranger.photo} alt={`${rangerName}, your ranger`} dot={rangerDot} onClick={() => setSheet("ranger")} />
                    {dog && <AvatarButton src={dog.photo} alt={`${dogName}, your dog`} dot={dogDot} onClick={openDogSheet} />}
                </div>
            )}

            {/* top-right, under the compass: round status and prizes */}
            <div style={{ position: "absolute", right: "var(--gutter)", top: 64, display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                    onClick={() => setSheet("status")}
                    aria-label="Round status"
                    style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border-subtle)", background: "rgba(250,246,236,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxShadow: "var(--shadow-sm)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}
                >
                    <i className="ph ph-calendar-blank" style={{ fontSize: 18 }} />
                </button>
                <button
                    onClick={() => router.push("/prizes")}
                    aria-label="Prizes and how to win"
                    style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border-subtle)", background: "rgba(250,246,236,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxShadow: "var(--shadow-sm)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}
                >
                    <i className="ph ph-trophy" style={{ fontSize: 18 }} />
                </button>
            </div>

            {/* right dock: field clue, field guides and the radio hang off the edge */}
            <div style={{ position: "absolute", right: 0, top: "46%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 10 }}>
                <DockTab icon="notebook" label="Clue" dot={newClueToday} onClick={openClueSheet} />
                <DockTab icon="book-open-text" label="Guides" onClick={() => setSheet("guides")} />
                <DockTab icon="truck" label="Bakkie" onClick={() => setSheet("bakkie")} />
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
                                        {dogName} settles by the fire. Fresh legs at dawn.
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
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "var(--bg-overlay, rgba(17,32,26,0.55))" }}
                    onClick={closeWelcome}
                >
                    <div
                        className="kw-rise"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: 480, background: "var(--surface-page)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)", padding: "var(--space-6) var(--gutter) var(--space-7)", boxShadow: "var(--shadow-xl)" }}
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
            )}

            {/* Bakkie ride confirmation: the drive spends the day and a ride */}
            {truckDest && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--gutter)", background: "var(--bg-overlay, rgba(17,32,26,0.55))" }}
                    onClick={() => setTruckDest(null)}
                >
                    <div
                        className="kw-rise"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: 420, background: "var(--surface-page)", borderRadius: "var(--radius-2xl)", padding: "var(--space-6) var(--gutter) var(--space-6)", boxShadow: "var(--shadow-xl)" }}
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
            )}

            {/* Lock-in confirmation: this is the one decision that ranks the player */}
            {lockModal && pin && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--gutter)", background: "var(--bg-overlay, rgba(17,32,26,0.55))" }}
                    onClick={() => setLockModal(false)}
                >
                    <div
                        className="kw-rise"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: 420, background: "var(--surface-page)", borderRadius: "var(--radius-2xl)", padding: "var(--space-6) var(--gutter) var(--space-6)", boxShadow: "var(--shadow-xl)" }}
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
