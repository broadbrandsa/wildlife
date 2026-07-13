"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ds";
import { Logo } from "@/components/game/Logo";
import { PhoneStage } from "@/components/game/PhoneStage";

/** The whole how-it-works brief, sized to sit on one screen: no carousel to
 *  click through and no scrolling to reach the start button. */
const RULES = [
    { icon: "magnifying-glass", title: "Read the clues", body: "Every clue is a real fact about Kruger. Solve them and the search area shrinks." },
    { icon: "paw-print", title: "Track the scent", body: "Move your ranger on foot, then send the dog to read the ground, from cold to fresh." },
    { icon: "binoculars", title: "Spot the wildlife", body: "Species appear on the map. Tap to log them, and complete a Five for an instant prize." },
    { icon: "fork-knife", title: "Stay supplied", body: "You carry four days of food. Resupply at a rest camp, or the bakkie fetches you." },
    { icon: "trophy", title: "Win real prizes", body: "The closest locked pins win. Twenty-six winners, from a Kruger safari to gear." },
    { icon: "hand-heart", title: "Fund the dogs", body: "Kit is optional. Every rand goes to the real SAWC K9 unit, and winning is free." },
];

export default function WelcomePage() {
    const router = useRouter();

    return (
        <PhoneStage columnStyle={{ flexDirection: "column" }}>
            <div
                style={{
                    background: "radial-gradient(120% 100% at 50% 0%, #2C4A39 0%, #182D23 100%)",
                    color: "var(--sand-50)",
                    padding: "var(--space-6) var(--gutter) var(--space-5)",
                }}
            >
                <Logo inverse />
                <h1 style={{ color: "#fff", fontSize: "var(--text-h2)", margin: "var(--space-4) 0 var(--space-2)" }}>
                    Welcome to the K9 Unit.
                </h1>
                <p style={{ color: "rgba(245,239,226,0.82)", fontSize: "var(--text-base)", margin: 0, lineHeight: 1.5 }}>
                    A poacher is hiding somewhere in Kruger. You and your dog are going to find him. Here is how it works.
                </p>
            </div>

            <div style={{ flex: 1, minHeight: 0, padding: "var(--space-5) var(--gutter) var(--space-4)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "var(--space-3)" }}>
                {RULES.map((r, i) => (
                    <div key={r.title} className="kw-rise" style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", animationDelay: `${i * 45}ms` }}>
                        <span
                            style={{
                                flex: "none",
                                width: 38,
                                height: 38,
                                borderRadius: "var(--radius-md)",
                                background: "var(--accent-soft)",
                                color: "var(--ochre-700)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 20,
                            }}
                        >
                            <i className={`ph-fill ph-${r.icon}`} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-accent)" }}>{String(i + 1).padStart(2, "0")}</span>
                                <strong style={{ fontSize: "0.98rem", color: "var(--text-primary)" }}>{r.title}</strong>
                            </div>
                            <p style={{ margin: "1px 0 0", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{r.body}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ padding: "var(--space-4) var(--gutter) var(--space-7)", borderTop: "1px solid var(--border-subtle)" }}>
                <Button size="lg" fullWidth onClick={() => router.push("/onboarding")} iconRight={<i className="ph ph-arrow-right" />}>
                    Start tracking
                </Button>
            </div>
        </PhoneStage>
    );
}
