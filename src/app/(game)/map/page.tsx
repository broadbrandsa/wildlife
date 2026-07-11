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
import { Overlay } from "@/components/game/Overlay";
import { ZoneSheet } from "@/components/game/ZoneSheet";
import { CLUE_BY_ID, CLUES, DOG_BY_ID, FIVES, FIVE_OF, RANGER_BY_ID, ROUND, SPECIES, SPECIES_BY_ID, ZONES, ZONE_BY_ID, speciesActivity } from "@/data";
import type { Clue, Species, Zone } from "@/data";
import {
    SCENT_TEXT,
    THIRD_LABEL,
    availableClueIds,
    dailyWalkKm,
    distanceKm,
    scentDirectionText,
    TRACK_COOLDOWN_MS,
    daysRemaining,
    isRested,
    isRoundOver,
    moveCooldownMs,
    nextClueLabel,
    poacherThird,
    restProgress,
    restRemainingLabel,
    scentRead,
    tierRank,
    zoneAtPoint,
} from "@/lib/game";
import { RARITY_META, SPOTTER_DOGS } from "@/lib/spotting";
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

/** Round avatar button for the split ranger / dog team icons. A green border
 *  and ring mark the ranger or dog as rested and ready to use. */
function AvatarButton({ src, alt, ready, onClick }: { src: string; alt: string; ready: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label={ready ? `${alt}, ready` : alt}
            className="kw-press"
            style={{
                position: "relative",
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: `2px solid ${ready ? "var(--success)" : "var(--sand-50)"}`,
                background: "var(--sand-100)",
                boxShadow: ready ? "var(--shadow-md), 0 0 0 3px var(--success-soft)" : "var(--shadow-md)",
                cursor: "pointer",
                padding: 0,
                overflow: "visible",
                transition: "box-shadow 200ms var(--ease-out), border-color 200ms var(--ease-out)",
            }}
        >
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
                <Image src={src} alt={alt} fill sizes="52px" style={{ objectFit: "cover" }} />
            </span>
        </button>
    );
}

/** A compact recovery chip sitting to the right of a team icon: a fill bar over
 *  a small countdown of the rest time left (or "Ready"). Kept narrow so it
 *  clears the centred time chip on small screens. */
function RestBar({ progress, ready, label }: { progress: number; ready: boolean; label: string }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "4px 6px",
                borderRadius: 10,
                background: "rgba(250,246,236,0.9)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-sm)",
            }}
        >
            <span style={{ display: "block", width: 40, height: 5, borderRadius: 999, background: "var(--surface-sunken)", overflow: "hidden" }}>
                <span
                    style={{
                        display: "block",
                        height: "100%",
                        width: `${Math.round(progress * 100)}%`,
                        borderRadius: 999,
                        background: ready ? "var(--success)" : "var(--ochre-500)",
                        transition: "width 2s linear, background 200ms var(--ease-out)",
                    }}
                />
            </span>
            <span
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5rem",
                    letterSpacing: "0.04em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: ready ? "var(--success)" : "var(--text-primary)",
                    lineHeight: 1,
                }}
            >
                {label}
            </span>
        </div>
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
    const scentSeenAt = useGameStore((s) => s.scentSeenAt);
    const cluesSeenDay = useGameStore((s) => s.cluesSeenDay);
    const markScentSeen = useGameStore((s) => s.markScentSeen);
    const markCluesSeen = useGameStore((s) => s.markCluesSeen);
    const truckRidesLeft = useGameStore((s) => s.truckRidesLeft);
    const rideTruck = useGameStore((s) => s.rideTruck);
    const lastMoveAt = useGameStore((s) => s.lastMoveAt);
    const lastTrackAt = useGameStore((s) => s.lastTrackAt);
    const recordTrack = useGameStore((s) => s.recordTrack);
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
    // Wall-clock tick that drives the ranger and dog rest bars.
    const [nowMs, setNowMs] = useState(() => Date.now());
    // Bumped by the ranger's Move action to zoom the map in on the pin.
    const [focusSignal, setFocusSignal] = useState(0);
    // Whether the field radio's HQ report has been opened this session (dock dot).
    const [radioSeen, setRadioSeen] = useState(false);
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

    // Movement is paced by a real-time recovery: after a move the ranger rests
    // before moving again. Boots and a driven dog shorten the recovery. The dog
    // rests longer after a track. At night both make camp, so neither can work.
    const moveCd = moveCooldownMs(player?.dogId, inventory.includes("ranger-boots"));
    const rangerRested = isRested(lastMoveAt, nowMs, moveCd);
    const dogRested = isRested(lastTrackAt, nowMs, TRACK_COOLDOWN_MS);
    const rangerReady = Boolean(pin && !pin.locked && !night && !roundOver && rangerRested);
    const dogTrackReady = Boolean(pin && !night && !roundOver && dogRested);
    // The ranger can move when rested; the very first pin drops with no pin yet.
    const canMove = !pin ? true : rangerReady;
    const walkKm = dailyWalkKm(player?.dogId);
    // Rest bars for the team icons and their profiles.
    const rangerRestPct = restProgress(lastMoveAt, nowMs, moveCd);
    const rangerRestLabel = restRemainingLabel(lastMoveAt, nowMs, moveCd);
    const dogRestPct = restProgress(lastTrackAt, nowMs, TRACK_COOLDOWN_MS);
    const dogRestLabel = restRemainingLabel(lastTrackAt, nowMs, TRACK_COOLDOWN_MS);
    // Bar label under each icon: the time left, or the reason it is not ready.
    const rangerBarLabel = !rangerRested ? rangerRestLabel : night ? "Camp" : "Ready";
    const dogBarLabel = !dogRested ? dogRestLabel : night ? "Camp" : "Ready";
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

    // Tick the wall clock so the ranger and dog rest bars fill live.
    useEffect(() => {
        const iv = setInterval(() => setNowMs(Date.now()), 2000);
        return () => clearInterval(iv);
    }, []);

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

    // Send the dog to track: it reads the ground, then rests before it can
    // track again. The reveal only plays on this tap, never on opening the sheet.
    const track = () => {
        recordTrack();
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
                legendTop={200}
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

            {/* the team, split: you, your dog and the bakkie. The ranger and dog
                each carry a rest bar and turn green-ringed when ready to use. */}
            {ranger && (
                <div style={{ position: "absolute", left: "var(--gutter)", top: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <AvatarButton src={ranger.photo} alt={`${rangerName}, your ranger`} ready={rangerReady} onClick={() => setSheet("ranger")} />
                        {pin && <RestBar progress={rangerRestPct} ready={rangerReady} label={rangerBarLabel} />}
                    </div>
                    {dog && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <AvatarButton src={dog.photo} alt={`${dogName}, your dog`} ready={dogTrackReady} onClick={openDogSheet} />
                            {pin && <RestBar progress={dogRestPct} ready={dogTrackReady} label={dogBarLabel} />}
                        </div>
                    )}
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
                <DockTab icon="radio" label="Radio" dot={hasRadio && !radioSeen} onClick={openRadioSheet} />
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
                            {rangerReady ? (
                                <div style={{ margin: "var(--space-4) 0 0" }}>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 var(--space-3)", lineHeight: 1.55 }}>
                                        {rangerName} is rested and ready. Move up to {walkKm} km. Tap Move to zoom in on your pin, then drag it along the ring.
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
                                            <i className="ph-fill ph-boot" style={{ color: "var(--ochre-600)" }} /> {rangerName} is recovering
                                        </span>
                                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{rangerRestLabel}</span>
                                    </div>
                                    <div style={{ marginTop: "var(--space-3)", height: 8, borderRadius: 999, background: "var(--surface-sunken)", overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${Math.round(rangerRestPct * 100)}%`, borderRadius: 999, background: "var(--ochre-500)", transition: "width 2s linear" }} />
                                    </div>
                                    <p style={{ margin: "var(--space-3) 0 0", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                                        A ranger covers hard ground on foot and needs rest between moves. {rangerName} will be ready to move again in {rangerRestLabel}.
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
                        const trackedHere = Boolean(pin && revealKey && revealKey === lastRevealKey);
                        const resting = Boolean(pin && !dogRested);
                        const progress = dogRestPct;
                        const remaining = dogRestLabel;
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
                                        {!resting && night && (
                                            <p style={{ margin: "var(--space-4) 0 0", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5, display: "flex", gap: 8, alignItems: "flex-start" }}>
                                                <i className="ph-fill ph-campfire" style={{ color: "var(--ochre-600)", marginTop: 2 }} />
                                                {dogName} is camped for the night. It tracks again at dawn.
                                            </p>
                                        )}

                                        {/* Track CTA: the dog is rested and there is fresh ground to read. */}
                                        {!resting && !night && !trackedHere && (
                                            <div style={{ marginTop: "var(--space-4)" }}>
                                                <p style={{ margin: "0 0 var(--space-3)", fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                                                    {dogName} is rested and ready. Send it to read the ground where your ranger stands.
                                                </p>
                                                <Button size="lg" fullWidth onClick={track} iconLeft={<i className="ph-fill ph-paw-print" />}>
                                                    Track this ground
                                                </Button>
                                            </div>
                                        )}

                                        {/* Rested, but this ground is already read: move for a new one. */}
                                        {!resting && !night && trackedHere && (
                                            <p style={{ margin: "var(--space-4) 0 0", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5, display: "flex", gap: 8, alignItems: "flex-start" }}>
                                                <i className="ph ph-check-circle" style={{ color: "var(--success)", marginTop: 2 }} />
                                                {dogName} is rested. Move to fresh ground for a new read.
                                            </p>
                                        )}

                                        {/* Resting: the dog tires after a track. A ration refuels it early. */}
                                        {resting && (
                                            <div
                                                style={{
                                                    marginTop: showRead ? "var(--space-4)" : "var(--space-3)",
                                                    paddingTop: showRead ? "var(--space-4)" : 0,
                                                    borderTop: showRead ? "1px dashed var(--border-default)" : "none",
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.86rem", fontWeight: 600, color: "var(--text-primary)" }}>
                                                        <i className="ph-fill ph-moon-stars" style={{ color: "var(--ochre-600)" }} /> {dogName} is resting
                                                    </span>
                                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{remaining}</span>
                                                </div>
                                                <div style={{ marginTop: "var(--space-3)", height: 8, borderRadius: 999, background: "var(--surface-sunken)", overflow: "hidden" }}>
                                                    <div
                                                        style={{
                                                            height: "100%",
                                                            width: `${Math.round(progress * 100)}%`,
                                                            borderRadius: 999,
                                                            background: "var(--ochre-500)",
                                                            transition: "width 1s linear",
                                                        }}
                                                    />
                                                </div>
                                                <p style={{ margin: "var(--space-3) 0 0", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                                                    A working dog tires after a track. {dogName} will be ready to track again in {remaining}, or a ration from the kit refuels it now.
                                                </p>
                                                <div style={{ marginTop: "var(--space-3)" }}>
                                                    <Button size="sm" variant="secondary" onClick={() => router.push("/checkout/dog-ration")} iconLeft={<i className="ph-fill ph-bone" />}>
                                                        Refuel {dogName} with a ration
                                                    </Button>
                                                </div>
                                            </div>
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
                                    Watch the map: species appear near your ranger for a short while, then move on. Tap one to add it to your log. The rarer it is, the less time you have. Spotting follows the clock too, so nocturnal animals only show after dark. A once in a lifetime sighting is linked to prizes at round end. Tap any card below to read it, found or not.
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
                                                            // gold ring for rare sightings and the fives, clay for once in a lifetime
                                                            border: seen
                                                                ? s.rarity === "oialt"
                                                                    ? "2px solid var(--clay-500)"
                                                                    : s.rarity === "rare" || FIVE_OF[s.id]
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
                                Tap the map where you think the suspect is hiding. Your ranger deploys there, and that ground&apos;s field guide unlocks free. From then on you move on foot, about {walkKm} km a day. Your first clue is waiting, so read it before you choose.
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
                >
                    <div
                        style={{
                            maxHeight: "88dvh",
                            overflowX: "hidden",
                            overflowY: "auto",
                            background: "var(--surface-page)",
                            borderRadius: "var(--radius-2xl)",
                            // Gold marks a rare sighting or a Big, Ugly or Small Five card;
                            // clay marks once in a lifetime. Unfound cards stay neutral.
                            boxShadow: spot.found !== false && (spot.species.rarity === "rare" || FIVE_OF[spot.species.id])
                                ? "var(--shadow-xl), 0 0 0 3px var(--ochre-100)"
                                : "var(--shadow-xl)",
                            border:
                                spot.found === false
                                    ? "1px solid var(--border-subtle)"
                                    : spot.species.rarity === "oialt"
                                      ? "2px solid var(--clay-500)"
                                      : spot.species.rarity === "rare" || FIVE_OF[spot.species.id]
                                        ? "2px solid var(--ochre-400)"
                                        : "1px solid var(--border-subtle)",
                        }}
                    >
                        {(() => {
                            const found = spot.found !== false;
                            const five = FIVE_OF[spot.species.id];
                            const rMeta = RARITY_META[spot.species.rarity];
                            const gold = found && (spot.species.rarity === "rare" || Boolean(five));
                            const clay = found && spot.species.rarity === "oialt";
                            const accent = clay ? "var(--clay-500)" : gold ? "var(--ochre-400)" : "var(--border-subtle)";
                            // A rare or once in a lifetime chip glows in its own colour.
                            const rarityBg = spot.species.rarity === "oialt" ? "var(--clay-500)" : spot.species.rarity === "rare" ? "var(--ochre-500)" : "rgba(24,45,35,0.55)";
                            const act = speciesActivity(spot.species.id);
                            return (
                                <>
                                    <div style={{ position: "relative", aspectRatio: "16 / 11", background: "var(--sand-100)" }}>
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
                                    <div style={{ padding: "var(--space-5) var(--space-5) var(--space-6)" }}>
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
                                        {spot.species.rarity === "oialt" && (
                                            <p style={{ fontSize: "0.82rem", color: "var(--clay-600)", fontWeight: 600, lineHeight: 1.5, margin: "var(--space-3) 0 0" }}>
                                                {found
                                                    ? "A once in a lifetime sighting. Hold onto this card: sightings like this one are linked to prizes when the round closes."
                                                    : "A once in a lifetime card. Sightings like this one are linked to prizes when the round closes."}
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
                >
                    <div
                        style={{
                            maxHeight: "88dvh",
                            overflowX: "hidden",
                            overflowY: "auto",
                            background: "var(--surface-page)",
                            borderRadius: "var(--radius-2xl)",
                            border: "1px solid var(--border-subtle)",
                            boxShadow: "var(--shadow-xl)",
                            padding: "var(--space-4)",
                        }}
                    >
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
