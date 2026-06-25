"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { Button, IconButton, Tag } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { ImpactHighlight, useCampaignTotal } from "@/components/game/impact";
import { KrugerMap } from "@/components/game/KrugerMap";
import { CLUE_BY_ID, CLUES, DOG_BY_ID, RANGER_BY_ID, ROUND } from "@/data";
import { availableClueIds, currentDay, daysRemaining } from "@/lib/game";
import { useGameStore } from "@/store/game";

function MapInner() {
    const router = useRouter();
    const params = useSearchParams();
    const showWelcome = params.get("welcome") === "1";

    const player = useGameStore((s) => s.player);
    const pin = useGameStore((s) => s.pin);
    const setPin = useGameStore((s) => s.setPin);
    const lockPin = useGameStore((s) => s.lockPin);
    const cluesUnlocked = useGameStore((s) => s.cluesUnlocked);
    const campaignTotal = useCampaignTotal();

    const [dismissed, setDismissed] = useState(false);
    const day = currentDay();

    const available = useMemo(() => {
        const ids = availableClueIds(cluesUnlocked, day);
        return CLUES.filter((c) => ids.has(c.id));
    }, [cluesUnlocked, day]);

    // Latest / most specific clue to surface on the HUD.
    const latest = useMemo(() => {
        const freeSorted = available.filter((c) => c.source === "free").sort((a, b) => (b.releaseDay ?? 0) - (a.releaseDay ?? 0));
        return freeSorted[0] ?? available[available.length - 1] ?? CLUE_BY_ID["free-d1"];
    }, [available]);

    const dog = player ? DOG_BY_ID[player.dogId] : null;
    const ranger = player ? RANGER_BY_ID[player.rangerId] : null;
    const rangerName = player?.displayName ?? "Ranger";
    const dogName = player?.dogName ?? dog?.name ?? "your dog";

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
                    <IconButton label="Intel Intercept" variant="solid" onClick={() => router.push("/codes")} style={{ background: "var(--ochre-500)", color: "var(--sand-900)" }}>
                        <i className="ph ph-radio" />
                    </IconButton>
                </div>

                <div style={{ display: "flex", gap: "var(--space-5)", marginTop: "var(--space-4)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.06em", color: "rgba(245,239,226,0.82)" }}>
                    <span>
                        <i className="ph ph-calendar-blank" /> DAY {day} / {ROUND.durationDays}
                    </span>
                    <span>
                        <i className="ph ph-hourglass-medium" /> {daysRemaining()} DAYS LEFT
                    </span>
                    <span>
                        <i className="ph ph-crosshair" /> 1 SUSPECT AT LARGE
                    </span>
                </div>
            </header>

            {/* Map */}
            <div style={{ position: "relative", height: "min(52dvh, 460px)", background: "radial-gradient(120% 110% at 50% 0%, #2C4A39 0%, #16110A 92%)" }}>
                <KrugerMap pin={pin} onPlace={(x, y) => setPin(x, y)} />
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

            {/* Pin status + latest clue */}
            <div style={{ flex: 1, padding: "var(--space-5) var(--gutter)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
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
                            {!pin ? "Tap the map to place your guess." : pin.locked ? "Locked for the round." : "Tap the map to move it, any time before lock."}
                        </div>
                    </div>
                    {pin && !pin.locked && (
                        <Button size="sm" variant="secondary" onClick={lockPin}>
                            Lock in
                        </Button>
                    )}
                </div>

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
                        <ClueCard clue={latest} />
                    </div>
                )}
            </div>

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
                        <ClueCard clue={CLUE_BY_ID["free-d1"]} />
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
