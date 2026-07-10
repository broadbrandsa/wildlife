"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { Button, IconButton, Tag } from "@/components/ds";
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
    scentDirectionText,
    daysRemaining,
    isRoundOver,
    nextClueLabel,
    poacherThird,
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
    const moveRanger = useGameStore((s) => s.moveRanger);
    const lockPin = useGameStore((s) => s.lockPin);
    const grantFieldGuide = useGameStore((s) => s.grantFieldGuide);
    const cluesUnlocked = useGameStore((s) => s.cluesUnlocked);
    const inventory = useGameStore((s) => s.inventory);
    const fieldGuides = useGameStore((s) => s.fieldGuides);
    const pinMovesToday = useGameStore((s) => s.pinMovesToday);
    const campaignTotal = useCampaignTotal();

    const [dismissed, setDismissed] = useState(false);
    const [guideZone, setGuideZone] = useState<Zone | null>(null);
    const [guideJustUnlocked, setGuideJustUnlocked] = useState(false);
    const [lockModal, setLockModal] = useState(false);
    const day = useCurrentDay();
    const roundOver = isRoundOver(day);

    const available = useMemo(() => {
        const ids = availableClueIds(cluesUnlocked, day);
        return CLUES.filter((c) => ids.has(c.id));
    }, [cluesUnlocked, day]);

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
    const clueCountdown = nextClueLabel(day);

    // Movement: one move a day, plus one for boots, plus one for Storm's drive.
    // Each move covers at most a day's walk in km (Banjo walks further).
    const maxMoves =
        1 + (inventory.includes("ranger-boots") ? 1 : 0) + (player && EXTRA_MOVE_DOGS.has(player.dogId) ? 1 : 0);
    const movesToday = pinMovesToday?.day === day ? pinMovesToday.count : 0;
    const canMove = !pin?.locked && movesToday < maxMoves;
    const walkKm = dailyWalkKm(player?.dogId);

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

    // Field radio: HQ tells you which third the scent is in.
    const hasRadio = inventory.includes("field-radio");
    const targetThird = poacherThird();

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
                            {ROUND.name}
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
                <KrugerMap
                    pin={pin}
                    onPlace={onPlace}
                    maxScale={inventory.includes("pro-binoculars") ? 8 : 4}
                    legendTop={64}
                    walkRangeKm={pin && !pin.locked && canMove ? walkKm : null}
                />
                {!pin && !(showWelcome && !dismissed) && (
                    <div
                        className="kw-rise"
                        style={{
                            position: "absolute",
                            left: "50%",
                            bottom: 52,
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

            {/* Field guide chips: only the guides you hold, plus a link to unlock more */}
            <div style={{ padding: "var(--space-3) 0 0", background: "var(--surface-page)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", overflowX: "auto", padding: "0 var(--gutter)", scrollbarWidth: "none" }}>
                    <span style={{ flex: "none", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                        Field guides
                    </span>
                    {ZONES.filter((z) => fieldGuides.includes(z.id)).map((z) => (
                        <button
                            key={z.id}
                            onClick={() => setGuideZone(z)}
                            style={{
                                flex: "none",
                                border: "1px solid var(--border-default)",
                                background: "var(--surface-card)",
                                borderRadius: "var(--radius-pill)",
                                padding: "0.3rem 0.75rem",
                                fontSize: "0.74rem",
                                fontWeight: 600,
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <i className="ph ph-book-open" style={{ marginRight: 5, fontSize: 12, color: "var(--text-accent)" }} />
                            {z.name}
                        </button>
                    ))}
                    {fieldGuides.length === 0 && (
                        <span style={{ flex: "none", fontSize: "0.74rem", color: "var(--text-muted)" }}>
                            Your first guide unlocks with your first pin.
                        </span>
                    )}
                    {fieldGuides.length < ZONES.length && (
                        <button
                            onClick={() => router.push("/journal")}
                            style={{
                                flex: "none",
                                border: "none",
                                background: "none",
                                padding: "0.3rem 0.2rem",
                                fontSize: "0.74rem",
                                fontWeight: 600,
                                color: "var(--text-link)",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Unlock more <i className="ph ph-arrow-right" />
                        </button>
                    )}
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
                        <i className={`ph${pin ? "-fill" : ""} ph-${pin?.locked ? "lock-simple" : "person-simple-walk"}`} />
                    </span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                            {!pin ? "Place your ranger" : pin.locked ? "Answer locked in" : `${rangerName} on patrol`}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {!pin
                                ? "Tap the map to send your ranger to a spot. That spot is also your guess."
                                : pinZone
                                  ? `Zone ${pinZone.number}, ${pinZone.name}${pin.locked ? " · locked for the round" : ""}`
                                  : "Locked for the round."}
                        </div>
                        {pin && !pin.locked && (
                            <>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 4 }}>
                                    {canMove
                                        ? `You have ${maxMoves - movesToday === 1 ? "one ranger move" : `${maxMoves - movesToday} ranger moves`} left today, each up to ${walkKm} km on foot. The ring on the map shows your reach.`
                                        : "You have walked as far as you can today. Fresh legs tomorrow."}
                                </div>
                                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 3 }}>
                                    One lock-in for the whole game. Lock in only when you are sure.
                                </div>
                            </>
                        )}
                        {pin?.locked && (
                            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 4 }}>
                                Locked in for the round. Changed your mind? A second lock-in from the kit reopens your pin to move once more.
                            </div>
                        )}
                    </div>
                    {pin && !pin.locked && (
                        <Button size="sm" variant="secondary" onClick={() => setLockModal(true)}>
                            Lock in
                        </Button>
                    )}
                    {pin?.locked && (
                        <Button size="sm" variant="secondary" onClick={() => router.push("/checkout/extra-lockin")}>
                            Move again
                        </Button>
                    )}
                </div>

                {/* Scent read: the dog reads the ground where your ranger stands */}
                {pin && read && !roundOver && (
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
                            <Tag tone={TIER_META[read.tier].tone} size="sm">
                                <i className={`ph ph-${TIER_META[read.tier].icon}`} style={{ marginRight: 4 }} />
                                {read.inThird ? TIER_META[read.tier].label : "Nothing here"}
                            </Tag>
                        </div>
                        <p style={{ margin: "0.4rem 0 0", fontSize: "0.78rem", lineHeight: 1.5, color: "var(--text-muted)" }}>
                            {dogName} reads the ground wherever your ranger stands. On some ground the dog catches the scent, on some there is nothing. Move your ranger to hunt for it, then close in.
                        </p>
                        <p style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-serif)", fontSize: "0.98rem", lineHeight: 1.5, color: "var(--sand-900)" }}>
                            {SCENT_TEXT[read.tier].replace("{dog}", dogName) + " " + scentDirectionText(read, dogName)}
                        </p>
                        {hasRadio && (
                            <div
                                style={{
                                    marginTop: "var(--space-3)",
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "flex-start",
                                    background: "var(--ochre-100)",
                                    border: "1px solid var(--ochre-200)",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "0.55rem 0.7rem",
                                }}
                            >
                                <i className="ph ph-broadcast" style={{ color: "var(--ochre-700)", marginTop: 2 }} />
                                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                    HQ radios in: other teams place the freshest scent in {THIRD_LABEL[targetThird]} of the park.
                                </span>
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
                                Tap the map where you think the suspect is hiding. That spot is where your ranger stands and your guess for the round, and it unlocks a free field guide for that ground. Choose with care: once on the ground, your ranger can only walk about {walkKm} km of bush a day. Here is your first clue to work from.
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
                            You get one lock-in for the whole game. This is your final decision, and this pin is the one used to rank you when the round ends.
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5, margin: "var(--space-3) 0 0", textAlign: "center" }}>
                            Changed your mind later? Only a second lock-in from the kit can reopen your pin.
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
