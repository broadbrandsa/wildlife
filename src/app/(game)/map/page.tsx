"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useRef, useState } from "react";

import { Button, IconButton, Tag } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { ImpactHighlight, useCampaignTotal } from "@/components/game/impact";
import { KrugerMap } from "@/components/game/KrugerMap";
import { ZoneSheet } from "@/components/game/ZoneSheet";
import { CLUE_BY_ID, CLUES, DOG_BY_ID, RANGER_BY_ID, ROUND, ZONES, ZONE_BY_ID } from "@/data";
import type { Zone } from "@/data";
import {
    SCENT_TEXT,
    availableClueIds,
    daysRemaining,
    isRoundOver,
    nextClueLabel,
    readShowsDirection,
    scentRead,
    zoneAtPoint,
} from "@/lib/game";
import type { ScentTier } from "@/lib/game";
import { rangersHunting } from "@/lib/community";
import { useCurrentDay, useGameStore } from "@/store/game";

const TIER_META: Record<ScentTier, { label: string; tone: "neutral" | "teal" | "ochre" | "clay"; icon: string }> = {
    cold: { label: "Cold ground", tone: "neutral", icon: "thermometer-cold" },
    faint: { label: "Faint trail", tone: "teal", icon: "wind" },
    warm: { label: "Warm trail", tone: "ochre", icon: "footprints" },
    hot: { label: "Fresh sign", tone: "clay", icon: "paw-print" },
};

function MapInner() {
    const router = useRouter();
    const params = useSearchParams();
    const showWelcome = params.get("welcome") === "1";

    const player = useGameStore((s) => s.player);
    const pin = useGameStore((s) => s.pin);
    const setPin = useGameStore((s) => s.setPin);
    const lockPin = useGameStore((s) => s.lockPin);
    const cluesUnlocked = useGameStore((s) => s.cluesUnlocked);
    const inventory = useGameStore((s) => s.inventory);
    const fieldGuides = useGameStore((s) => s.fieldGuides);
    const lastScentRead = useGameStore((s) => s.lastScentRead);
    const scentReadsToday = useGameStore((s) => s.scentReadsToday);
    const recordScentRead = useGameStore((s) => s.recordScentRead);
    const campaignTotal = useCampaignTotal();

    const [dismissed, setDismissed] = useState(false);
    const [guideZone, setGuideZone] = useState<Zone | null>(null);
    const [confirmLock, setConfirmLock] = useState(false);
    const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const day = useCurrentDay();
    const roundOver = isRoundOver(day);

    const available = useMemo(() => {
        const ids = availableClueIds(cluesUnlocked, day, player?.dogId);
        return CLUES.filter((c) => ids.has(c.id));
    }, [cluesUnlocked, day, player?.dogId]);

    // Latest / most specific clue to surface on the HUD.
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
    const readTakenToday = lastScentRead?.day === day;
    const maxReads = inventory.includes("reinforced-leash") ? 2 : 1;
    const readsToday = scentReadsToday?.day === day ? scentReadsToday.count : 0;
    const canRead = readsToday < maxReads;
    const clueCountdown = nextClueLabel(day, player?.dogId);

    const showsDirection = readShowsDirection(player?.dogId, inventory.includes("ranger-compass"));

    const onAskForRead = () => {
        if (!pin || !canRead) return;
        const result = scentRead(pin, {
            dogId: player?.dogId,
            boots: inventory.includes("ranger-boots"),
            healthy: inventory.includes("monthly-healthcare"),
        });
        recordScentRead({ day, tier: result.tier, direction: result.direction, x: pin.x, y: pin.y });
    };

    const onLockTap = () => {
        if (!confirmLock) {
            setConfirmLock(true);
            if (confirmTimer.current) clearTimeout(confirmTimer.current);
            confirmTimer.current = setTimeout(() => setConfirmLock(false), 3500);
            return;
        }
        if (confirmTimer.current) clearTimeout(confirmTimer.current);
        setConfirmLock(false);
        lockPin();
    };

    const closeWelcome = () => {
        setDismissed(true);
        router.replace("/map");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100dvh - 5.2rem)" }}>
            {/* HUD header */}
            <header
                style={{
                    padding: "var(--space-5) var(--gutter) var(--space-3)",
                    background: "radial-gradient(120% 140% at 0% 0%, #21392C 0%, #182D23 100%)",
                    color: "var(--sand-50)",
                }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ochre-300)" }}>
                            Round {ROUND.number} · {ROUND.name}
                        </div>
                        <h1 style={{ color: "#fff", fontSize: "var(--text-h3)", margin: "0.3rem 0 0" }}>The hunt</h1>
                    </div>
                    <span style={{ display: "inline-flex", gap: "var(--space-2)" }}>
                        <IconButton label="Prizes and how to win" variant="solid" onClick={() => router.push("/prizes")} style={{ background: "rgba(245,239,226,0.14)", color: "var(--sand-50)" }}>
                            <i className="ph ph-trophy" />
                        </IconButton>
                        <IconButton label="Intel Intercept" variant="solid" onClick={() => router.push("/codes")} style={{ background: "var(--ochre-500)", color: "var(--sand-900)" }}>
                            <i className="ph ph-radio" />
                        </IconButton>
                    </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem var(--space-5)", marginTop: "var(--space-4)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.06em", color: "rgba(245,239,226,0.82)" }}>
                    <span>
                        <i className="ph ph-calendar-blank" /> DAY {day} / {ROUND.durationDays}
                    </span>
                    <span>
                        <i className="ph ph-hourglass-medium" /> {daysRemaining(day)} DAYS LEFT
                    </span>
                    <span>
                        <i className="ph ph-users-three" /> {rangersHunting(day).toLocaleString("en-ZA")} RANGERS HUNTING
                    </span>
                </div>
            </header>

            {/* Map */}
            <div style={{ position: "relative", height: "min(52dvh, 460px)", background: "radial-gradient(120% 110% at 50% 0%, #2C4A39 0%, #16110A 92%)" }}>
                <KrugerMap pin={pin} onPlace={(x, y) => setPin(x, y)} maxScale={inventory.includes("pro-binoculars") ? 8 : 4} />
                {(ranger || dog) && (
                    <button
                        onClick={() => router.push("/profile")}
                        aria-label="Your team"
                        style={{
                            position: "absolute",
                            left: 12,
                            top: 12,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            background: "rgba(250,246,236,0.94)",
                            backdropFilter: "blur(8px)",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "var(--radius-pill)",
                            padding: "0.3rem 0.85rem 0.3rem 0.4rem",
                            boxShadow: "var(--shadow-md)",
                        }}
                    >
                        <span style={{ display: "inline-flex" }}>
                            {ranger && (
                                <span style={{ position: "relative", width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--sand-50)", background: "var(--sand-100)" }}>
                                    <Image src={ranger.photo} alt={ranger.name} fill sizes="32px" style={{ objectFit: "cover" }} />
                                </span>
                            )}
                            {dog && (
                                <span style={{ position: "relative", width: 32, height: 32, marginLeft: -10, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--sand-50)", background: "var(--sand-100)" }}>
                                    <Image src={dog.photo} alt={dog.name} fill sizes="32px" style={{ objectFit: "cover", objectPosition: "center" }} />
                                </span>
                            )}
                        </span>
                        <span style={{ textAlign: "left", lineHeight: 1.1 }}>
                            <span style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>{rangerName}</span>
                            <span style={{ display: "block", fontSize: "0.66rem", color: "var(--text-muted)" }}>with {dogName}</span>
                        </span>
                    </button>
                )}
            </div>

            {/* Field guide chips: owned zones open the guide, others send you to the kit room */}
            <div style={{ padding: "var(--space-3) 0 0", background: "var(--surface-page)" }}>
                <div style={{ display: "flex", gap: "var(--space-2)", overflowX: "auto", padding: "0 var(--gutter)", scrollbarWidth: "none" }}>
                    <span style={{ flex: "none", alignSelf: "center", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                        Field guides
                    </span>
                    {ZONES.map((z) => {
                        const owned = fieldGuides.includes(z.id);
                        return (
                            <button
                                key={z.id}
                                onClick={() => (owned ? setGuideZone(z) : router.push("/shop"))}
                                style={{
                                    flex: "none",
                                    border: "1px solid var(--border-default)",
                                    background: owned ? "var(--surface-card)" : "var(--surface-sunken)",
                                    borderRadius: "var(--radius-pill)",
                                    padding: "0.3rem 0.75rem",
                                    fontSize: "0.74rem",
                                    fontWeight: 600,
                                    color: owned ? "var(--text-secondary)" : "var(--text-muted)",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {owned ? (
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", color: "var(--text-accent)", marginRight: 5 }}>{z.number}</span>
                                ) : (
                                    <i className="ph ph-lock-simple" style={{ marginRight: 5, fontSize: 12 }} />
                                )}
                                {z.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pin status + scent read + latest clue */}
            <div style={{ flex: 1, padding: "var(--space-4) var(--gutter) var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {roundOver && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-3)",
                            background: "var(--green-100)",
                            border: "1px solid var(--green-200)",
                            borderRadius: "var(--radius-lg)",
                            padding: "var(--space-4)",
                        }}
                    >
                        <i className="ph-fill ph-flag-checkered" style={{ fontSize: 22, color: "var(--green-700)" }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>The round is over</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>The suspect&apos;s camp has been found. See how close you came.</div>
                        </div>
                        <Button size="sm" onClick={() => router.push("/debrief")}>
                            Debrief
                        </Button>
                    </div>
                )}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        background: "var(--surface-card)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-4)",
                        boxShadow: "var(--shadow-xs)",
                    }}
                >
                    <span style={{ flex: "none", width: 40, height: 40, borderRadius: "var(--radius-pill)", background: pin ? "var(--clay-100)" : "var(--surface-sunken)", color: pin ? "var(--clay-600)" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                        <i className={`ph${pin ? "-fill" : ""} ph-${pin?.locked ? "lock-simple" : "map-pin"}`} />
                    </span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                            {!pin ? "No pin dropped yet" : pin.locked ? "Pin locked in" : "Pin dropped"}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {!pin
                                ? "Tap the map to place your guess."
                                : pinZone
                                  ? `Zone ${pinZone.number} · ${pinZone.name}${pin.locked ? " · locked for the round" : ""}`
                                  : pin.locked
                                    ? "Locked for the round."
                                    : "Tap the map to move it, any time before lock."}
                        </div>
                        {pin && !pin.locked && (
                            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 4 }}>
                                Ties go to the earliest locked pin, so lock in when you are sure.
                            </div>
                        )}
                    </div>
                    {pin && !pin.locked && (
                        <Button size="sm" variant={confirmLock ? "primary" : "secondary"} onClick={onLockTap}>
                            {confirmLock ? "Tap to confirm" : "Lock in"}
                        </Button>
                    )}
                </div>

                {/* Scent read: the dog's daily verdict on your pin */}
                {pin && !roundOver && (
                    <div
                        style={{
                            background: "var(--surface-card)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-lg)",
                            padding: "var(--space-4)",
                            boxShadow: "var(--shadow-xs)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-accent)" }}>
                                <i className="ph ph-paw-print" /> Scent read
                            </span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                {readTakenToday && lastScentRead && (
                                    <Tag tone={TIER_META[lastScentRead.tier].tone} size="sm">
                                        <i className={`ph ph-${TIER_META[lastScentRead.tier].icon}`} style={{ marginRight: 4 }} />
                                        {TIER_META[lastScentRead.tier].label}
                                    </Tag>
                                )}
                                {canRead && (
                                    <Button size="sm" onClick={onAskForRead}>
                                        {readTakenToday ? "Ask again" : `Ask ${dogName}`}
                                    </Button>
                                )}
                            </span>
                        </div>
                        <p style={{ margin: "0.4rem 0 0", fontSize: "0.78rem", lineHeight: 1.5, color: "var(--text-muted)" }}>
                            Once a day, {dogName} checks the ground under your pin and reads how close the trail is: cold, faint, warm or fresh. Move the pin and read again tomorrow to close in.
                        </p>
                        <p style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-serif)", fontSize: "0.98rem", lineHeight: 1.5, color: "var(--sand-900)" }}>
                            {readTakenToday && lastScentRead
                                ? SCENT_TEXT[lastScentRead.tier].replace("{dog}", dogName) +
                                  (lastScentRead.tier !== "hot" && showsDirection
                                      ? ` The trail pulls ${lastScentRead.direction}.`
                                      : "")
                                : `Tap "Ask ${dogName}" to send your dog to the pin.`}
                        </p>
                        {readTakenToday && (
                            <div style={{ marginTop: "var(--space-2)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
                                {maxReads > 1
                                    ? `READS TODAY: ${readsToday} OF ${maxReads}`
                                    : `READ TAKEN · ${dogName.toUpperCase()} RESTS UNTIL TOMORROW`}
                            </div>
                        )}
                    </div>
                )}

                <ImpactHighlight amount={campaignTotal} onOpen={() => router.push("/impact")} />

                {latest && (
                    <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-accent)" }}>
                                Latest intel
                            </span>
                            <button onClick={() => router.push("/journal")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-link)", fontSize: "0.8rem", fontWeight: 600 }}>
                                All clues <i className="ph ph-arrow-right" />
                            </button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em", color: "var(--text-muted)" }}>
                            <i className="ph ph-timer" /> {clueCountdown}
                        </div>
                        <ClueCard clue={latest} />
                    </div>
                )}
            </div>

            <ZoneSheet zone={guideZone} onClose={() => setGuideZone(null)} />

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
                            <h2 style={{ fontSize: "var(--text-h3)", margin: "var(--space-3) 0 0" }}>Your first clue</h2>
                        </div>
                        <ClueCard clue={CLUE_BY_ID["f01"]} />
                        <div style={{ marginTop: "var(--space-5)" }}>
                            <Button size="lg" fullWidth onClick={closeWelcome} iconRight={<i className="ph ph-map-pin" />}>
                                Start tracking
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
