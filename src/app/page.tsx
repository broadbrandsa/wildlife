"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ds";
import { Logo } from "@/components/game/Logo";
import { PhoneStage } from "@/components/game/PhoneStage";
import { useHydrated } from "@/hooks/use-hydrated";
import { useGameStore } from "@/store/game";

export default function SplashPage() {
    const router = useRouter();
    const hydrated = useHydrated();
    const player = useGameStore((s) => s.player);

    useEffect(() => {
        if (hydrated && player) router.replace("/map");
    }, [hydrated, player, router]);

    return (
        <PhoneStage
            columnStyle={{
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--gutter)",
                background: "radial-gradient(130% 100% at 50% 0%, #2C4A39 0%, #11201A 60%, #16110A 100%)",
            }}
        >
            <div style={{ width: "100%", maxWidth: 440, textAlign: "center", color: "var(--sand-50)" }} className="kw-rise">
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-6)" }}>
                    <Logo size={96} showWordmark={false} />
                </div>

                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--ochre-300)",
                        marginBottom: "var(--space-3)",
                    }}
                >
                    Kruger Wild · K9 Unit
                </div>

                <h1 style={{ fontSize: "var(--text-h1)", color: "#fff", margin: 0, marginBottom: "var(--space-4)" }}>
                    Pin-Drop Hunt
                </h1>

                <p style={{ color: "rgba(245,239,226,0.82)", fontSize: "var(--text-lead)", margin: "0 auto var(--space-7)", maxWidth: 360 }}>
                    Read the bushveld. Track the poacher across the lowveld. Every clue you solve helps fund the anti-poaching dogs.
                </p>

                <Button variant="accent" size="lg" fullWidth onClick={() => router.push("/welcome")} iconRight={<i className="ph ph-arrow-right" />}>
                    Begin the hunt
                </Button>

                <p style={{ marginTop: "var(--space-6)", fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.1em", color: "rgba(245,239,226,0.5)" }}>
                    IN SUPPORT OF THE SAWC K9 ANTI-POACHING UNIT
                </p>
            </div>
        </PhoneStage>
    );
}
