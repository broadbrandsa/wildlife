"use client";

import { useRouter } from "next/navigation";

import { Button, Eyebrow, StatBlock } from "@/components/ds";
import { DOG_BY_ID, EQUIPMENT_BY_ID, ROUND } from "@/data";
import { currentDay } from "@/lib/game";
import { zar } from "@/lib/format";
import { useGameStore } from "@/store/game";

function Row({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-4)",
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "left",
            }}
        >
            <i className={`ph ph-${icon}`} style={{ fontSize: 20, color: "var(--green-600)" }} />
            <span style={{ flex: 1, fontWeight: 600 }}>{label}</span>
            <i className="ph ph-caret-right" style={{ color: "var(--text-muted)" }} />
        </button>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const player = useGameStore((s) => s.player);
    const dog = player ? DOG_BY_ID[player.dogId] : null;
    const donations = useGameStore((s) => s.donations);
    const donationsTotal = useGameStore((s) => s.donationsTotal);
    const redeemedCodes = useGameStore((s) => s.redeemedCodes);
    const reset = useGameStore((s) => s.reset);

    const onReset = () => {
        if (confirm("Reset this demo? This clears your ranger, pin, donations and clues.")) {
            reset();
            router.replace("/");
        }
    };

    return (
        <div style={{ paddingBottom: "var(--space-7)" }}>
            {/* header */}
            <div style={{ background: "radial-gradient(120% 130% at 50% 0%, #2C4A39 0%, #182D23 100%)", color: "var(--sand-50)", padding: "var(--space-7) var(--gutter) var(--space-6)", textAlign: "center" }}>
                <span style={{ display: "inline-flex", width: 72, height: 72, borderRadius: "var(--radius-pill)", background: "rgba(245,239,226,0.12)", color: "var(--ochre-300)", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: "var(--space-3)" }}>
                    <i className={`ph-fill ph-${dog?.icon ?? "user"}`} />
                </span>
                <h1 style={{ color: "#fff", fontSize: "var(--text-h3)", margin: 0 }}>{player?.displayName}</h1>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.12em", color: "var(--ochre-300)", marginTop: 6 }}>
                    HANDLER · {dog?.name?.toUpperCase()} THE {dog?.breed?.toUpperCase()}
                </div>
            </div>

            <div style={{ padding: "var(--space-6) var(--gutter)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                {/* stats */}
                <div style={{ display: "flex", gap: "var(--space-5)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", boxShadow: "var(--shadow-xs)" }}>
                    <StatBlock value={zar(donationsTotal)} label="Donated" />
                    <StatBlock value={donations.length} label="Gifts" divider />
                    <StatBlock value={`${currentDay()}/${ROUND.durationDays}`} label="Round day" divider />
                </div>

                {/* donation history */}
                <div>
                    <Eyebrow>Donation history</Eyebrow>
                    <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                        {donations.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>No donations yet. Visit the kit room to support the unit.</p>
                        ) : (
                            donations.map((d) => {
                                const item = EQUIPMENT_BY_ID[d.equipmentId];
                                return (
                                    <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem var(--space-4)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item?.name ?? d.equipmentId}</div>
                                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", color: "var(--text-muted)" }}>{d.receiptNumber}</div>
                                        </div>
                                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{zar(d.amountZar)}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* links */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    <Row icon="hand-heart" label="Our allies" onClick={() => router.push("/allies")} />
                    <Row icon="radio" label="Intel Intercept (enter a code)" onClick={() => router.push("/codes")} />
                    <Row icon="scroll" label="Rules & privacy" onClick={() => router.push("/legal")} />
                </div>

                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center" }}>
                    {redeemedCodes.length} sponsor code{redeemedCodes.length === 1 ? "" : "s"} redeemed
                </div>

                <Button variant="ghost" fullWidth onClick={onReset} iconLeft={<i className="ph ph-arrow-counter-clockwise" />}>
                    Reset demo
                </Button>
            </div>
        </div>
    );
}
