"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { Button, Eyebrow, StatBlock, Tag } from "@/components/ds";
import { KrugerMap } from "@/components/game/KrugerMap";
import { DOG_BY_ID, ROUND, ZONE_BY_ID } from "@/data";
import { distanceKm, isRoundOver, trackerRating, zoneAtPoint } from "@/lib/game";
import { rangersHunting } from "@/lib/community";
import { shareTrackerResult } from "@/lib/share-card";
import { zar } from "@/lib/format";
import { useCurrentDay, useGameStore } from "@/store/game";

function DebriefInner() {
    const router = useRouter();
    const params = useSearchParams();
    const preview = params.get("preview") === "1";

    const player = useGameStore((s) => s.player);
    const pin = useGameStore((s) => s.pin);
    const donationsTotal = useGameStore((s) => s.donationsTotal);
    const day = useCurrentDay();
    const roundOver = isRoundOver(day);

    // The debrief only exists once the round is over (or in preview mode).
    useEffect(() => {
        if (!roundOver && !preview) router.replace("/map");
    }, [roundOver, preview, router]);
    if (!roundOver && !preview) return null;

    const dog = player ? DOG_BY_ID[player.dogId] : null;
    const dogName = player?.dogName ?? dog?.name ?? "your dog";
    const dist = pin ? distanceKm(pin, ROUND.poacher) : null;
    const rating = dist != null ? trackerRating(dist) : null;
    const pinZone = pin ? ZONE_BY_ID[zoneAtPoint(pin)] : null;
    const targetZone = ZONE_BY_ID[ROUND.poacherZoneId];
    const zoneRight = pinZone?.id === targetZone.id;

    return (
        <div style={{ paddingBottom: "var(--space-7)" }}>
            {/* header */}
            <div
                style={{
                    background: "radial-gradient(120% 130% at 50% 0%, #2C4A39 0%, #182D23 100%)",
                    color: "var(--sand-50)",
                    padding: "var(--space-7) var(--gutter) var(--space-6)",
                    textAlign: "center",
                }}
            >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ochre-300)" }}>
                    Debrief{preview && !roundOver ? " · preview" : ""}
                </div>
                <h1 style={{ color: "#fff", fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-2)" }}>The camp is found</h1>
                <p style={{ color: "rgba(245,239,226,0.85)", margin: "0 auto", maxWidth: 420, fontSize: "0.92rem", lineHeight: 1.55 }}>
                    The suspect was camped at {ROUND.poacherFeature}, in zone {targetZone.number}, {targetZone.name}.
                </p>
            </div>

            {/* reveal map */}
            <div style={{ position: "relative", height: "min(46dvh, 420px)", background: "radial-gradient(120% 110% at 50% 0%, #2C4A39 0%, #16110A 92%)" }}>
                <KrugerMap pin={pin} target={ROUND.poacher} />
            </div>

            <div style={{ padding: "var(--space-6) var(--gutter)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                {pin && dist != null && rating ? (
                    <>
                        <div style={{ display: "flex", gap: "var(--space-5)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", boxShadow: "var(--shadow-xs)" }}>
                            <StatBlock value={`${Math.round(dist)} km`} label="From the camp" />
                            <StatBlock value={pinZone ? `Zone ${pinZone.number}` : "?"} label="Your pin" divider />
                            <StatBlock value={zar(donationsTotal)} label="You gave" divider />
                        </div>

                        <div
                            style={{
                                background: "var(--surface-card)",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "var(--radius-lg)",
                                padding: "var(--space-5)",
                                boxShadow: "var(--shadow-xs)",
                                textAlign: "center",
                            }}
                        >
                            <Tag tone={dist <= 40 ? "ochre" : "teal"}>
                                <i className="ph-fill ph-medal" style={{ marginRight: 5 }} />
                                {rating.title}
                            </Tag>
                            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.08rem", lineHeight: 1.55, color: "var(--sand-900)", margin: "var(--space-4) 0 0" }}>
                                {rating.line}
                            </p>
                            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", margin: "var(--space-3) 0 0", lineHeight: 1.55 }}>
                                {zoneRight
                                    ? `You called the right zone. ${dogName} knew it all along, and gets an extra bone tonight.`
                                    : `The trail ended in zone ${targetZone.number}. ${dogName} still gets dinner, and so does the whole pack.`}
                            </p>
                        </div>

                        <Button
                            fullWidth
                            onClick={() =>
                                shareTrackerResult({
                                    rangerName: player?.displayName ?? "Ranger",
                                    dogName,
                                    distanceKm: dist,
                                    ratingTitle: rating.title,
                                    roundName: ROUND.name,
                                })
                            }
                            iconLeft={<i className="ph ph-share-network" />}
                        >
                            Share your result
                        </Button>

                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
                            {rangersHunting(ROUND.durationDays).toLocaleString("en-ZA")} rangers tracked this round
                        </p>
                    </>
                ) : (
                    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", textAlign: "center" }}>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", margin: 0, lineHeight: 1.55 }}>
                            You never dropped a pin this round. The bushveld keeps its secrets from the hesitant.
                        </p>
                    </div>
                )}

                <div
                    style={{
                        display: "flex",
                        gap: "var(--space-3)",
                        alignItems: "flex-start",
                        background: "var(--ochre-100)",
                        border: "1px solid var(--ochre-200)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-4)",
                    }}
                >
                    <i className="ph-fill ph-trophy" style={{ fontSize: 20, color: "var(--ochre-700)", marginTop: 2 }} />
                    <div style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                        The 26 closest locked pins take the round&apos;s prizes, from a Kruger safari with the K9 pack down to tracker gear.
                        Winners are verified and announced within seven days.{" "}
                        <button
                            onClick={() => router.push("/prizes")}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-link)", fontWeight: 600, padding: 0, fontSize: "inherit" }}
                        >
                            See the prizes <i className="ph ph-arrow-right" />
                        </button>
                    </div>
                </div>

                <div>
                    <Eyebrow rule>What your hunt funded</Eyebrow>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "var(--space-3) 0 0" }}>
                        Every clue bought and every piece of kit in this game maps to real costs at the SAWC K9 Unit: food, healthcare,
                        GPS kit and flying hours for the dogs that do this for real.
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    <Button fullWidth onClick={() => router.push("/impact")} iconRight={<i className="ph ph-hand-heart" />}>
                        See the unit&apos;s impact
                    </Button>
                    <Button fullWidth variant="secondary" onClick={() => router.push("/map")}>
                        Back to the map
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function DebriefPage() {
    return (
        <Suspense fallback={null}>
            <DebriefInner />
        </Suspense>
    );
}
