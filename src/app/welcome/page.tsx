"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Tag } from "@/components/ds";
import { CarouselArrow, CarouselDots } from "@/components/game/Carousel";
import { ClueCard } from "@/components/game/ClueCard";
import { Logo } from "@/components/game/Logo";
import { PhoneStage } from "@/components/game/PhoneStage";
import { CLUE_BY_ID, PRIZE_TIERS } from "@/data";

/** Framed in-game preview, so new rangers see the real thing before they start. */
function GameFrame({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
                <i className="ph ph-device-mobile" /> From the game
            </div>
            <div style={{ border: "1px dashed var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", background: "var(--surface-sunken)" }}>
                {children}
            </div>
        </div>
    );
}

/** A static replica of the map page's scent-read card. */
function ScentPreview() {
    return (
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    <i className="ph ph-paw-print" /> Scent read
                </span>
                <Tag tone="ochre" size="sm">
                    <i className="ph ph-footprints" style={{ marginRight: 4 }} /> Warm trail
                </Tag>
            </div>
            <p style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-serif)", fontSize: "0.98rem", lineHeight: 1.5, color: "var(--sand-900)" }}>
                Your dog works the ground in tightening loops, tail up. The trail has been through here. The nose swings toward the sunrise.
            </p>
        </div>
    );
}

/** A compact replica of the prize tiers. */
function PrizePreview() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {PRIZE_TIERS.map((t) => (
                <div key={t.place} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "0.55rem var(--space-4)" }}>
                    <i className={`ph-fill ph-${t.icon}`} style={{ fontSize: 18, color: "var(--ochre-600)" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.84rem", fontWeight: 700 }}>
                            {t.place} · {t.title}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {t.count === 1 ? "1 winner" : `${t.count} winners`} · {t.sponsor}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/** A compact replica of a kit room item. */
function KitPreview() {
    return (
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", display: "flex", gap: "var(--space-3)" }}>
            <span style={{ flex: "none", width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", color: "var(--ochre-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                <i className="ph ph-broadcast" />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                    <strong style={{ fontSize: "0.92rem" }}>Field radio</strong>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, whiteSpace: "nowrap" }}>R300</span>
                </div>
                <div style={{ marginTop: 6, background: "var(--green-50)", border: "1px solid var(--green-100)", borderRadius: "var(--radius-sm)", padding: "0.45rem 0.6rem", fontSize: "0.76rem", color: "var(--text-primary)", lineHeight: 1.45 }}>
                    <span style={{ color: "var(--green-700)", fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 2 }}>
                        How it helps the hunt
                    </span>
                    Call HQ to hear where other teams have picked up the scent.
                </div>
            </div>
        </div>
    );
}

const CARDS = [
    {
        title: "Read the clues",
        body: "Clues drip out across the round, each one a real fact about Kruger's rivers, rock, plants and animals. Here is your first, exactly as it lands in your journal on day 1.",
        visual: <ClueCard clue={CLUE_BY_ID["f01"]} />,
    },
    {
        title: "Track the scent",
        body: "Send your ranger to a spot on the map and your dog reads the ground there. Move each day, follow the pull, close in, then lock in your answer.",
        visual: <ScentPreview />,
    },
    {
        title: "Win real prizes",
        body: "The closest locked pins take the prizes: a Kruger safari with a visit to the K9 pack, getaways and gear for 26 winners in all.",
        visual: <PrizePreview />,
    },
    {
        title: "Fund the dogs",
        body: "Donate to kit out your hunt. Every rand goes to the SAWC K9 Anti-Poaching Unit, and winning never requires spending a cent.",
        visual: <KitPreview />,
    },
];

export default function WelcomePage() {
    const router = useRouter();
    const [card, setCard] = useState(0);
    const active = CARDS[card];

    return (
        <PhoneStage columnStyle={{ flexDirection: "column" }}>
            <div
                style={{
                    background: "radial-gradient(120% 100% at 50% 0%, #2C4A39 0%, #182D23 100%)",
                    color: "var(--sand-50)",
                    padding: "var(--space-7) var(--gutter) var(--space-6)",
                }}
            >
                <Logo inverse />
                <h1 style={{ color: "#fff", fontSize: "var(--text-h1)", margin: "var(--space-5) 0 var(--space-3)" }}>
                    Welcome to the K9 Unit.
                </h1>
                <p style={{ color: "rgba(245,239,226,0.82)", fontSize: "var(--text-lead)", margin: 0 }}>
                    You and your dog are the team's best chance of finding the suspect. Here is how the hunt works.
                </p>
            </div>

            <div style={{ flex: 1, padding: "var(--space-6) var(--gutter)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div key={card} className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-accent)" }}>
                            {String(card + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
                        </span>
                        <h3 style={{ margin: 0, fontSize: "var(--text-h4)" }}>{active.title}</h3>
                    </div>
                    <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.55 }}>{active.body}</p>

                    <div style={{ position: "relative" }}>
                        <GameFrame>{active.visual}</GameFrame>
                        <CarouselArrow dir="left" onClick={() => setCard((c) => (c - 1 + CARDS.length) % CARDS.length)} />
                        <CarouselArrow dir="right" onClick={() => setCard((c) => (c + 1) % CARDS.length)} />
                    </div>
                </div>
                <CarouselDots index={card} total={CARDS.length} />
            </div>

            <div style={{ padding: "var(--space-5) var(--gutter) var(--space-8)", borderTop: "1px solid var(--border-subtle)" }}>
                <Button size="lg" fullWidth onClick={() => router.push("/onboarding")} iconRight={<i className="ph ph-arrow-right" />}>
                    Start tracking
                </Button>
            </div>
        </PhoneStage>
    );
}
