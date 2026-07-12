"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";

import { Button, Eyebrow, StatBlock } from "@/components/ds";
import { ImpactCard, useCampaignTotal } from "@/components/game/impact";
import { DOG_BY_ID, EQUIPMENT_BY_ID, RANGER_BY_ID, ROUND } from "@/data";
import { zar } from "@/lib/format";
import { useCurrentDay, useGameStore } from "@/store/game";

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
    const ranger = player ? RANGER_BY_ID[player.rangerId] : null;
    const dogName = player?.dogName ?? dog?.name ?? "your dog";
    const campaignTotal = useCampaignTotal();
    const donations = useGameStore((s) => s.donations);
    const donationsTotal = useGameStore((s) => s.donationsTotal);
    const redeemedCodes = useGameStore((s) => s.redeemedCodes);
    const reset = useGameStore((s) => s.reset);
    const setDemoDay = useGameStore((s) => s.setDemoDay);
    const demoHour = useGameStore((s) => s.demoHour);
    const setDemoHour = useGameStore((s) => s.setDemoHour);
    const day = useCurrentDay();

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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "var(--space-3)" }}>
                    {ranger && (
                        <span style={{ position: "relative", width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--ochre-300)", background: "var(--sand-100)" }}>
                            <Image src={ranger.photo} alt={ranger.name} fill sizes="80px" style={{ objectFit: "cover" }} />
                        </span>
                    )}
                    {dog && (
                        <span style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--ochre-300)", background: "var(--sand-100)" }}>
                            <Image src={dog.photo} alt={dog.name} fill sizes="64px" style={{ objectFit: "cover" }} />
                        </span>
                    )}
                </div>
                <h1 style={{ color: "#fff", fontSize: "var(--text-h3)", margin: 0 }}>{player?.displayName}</h1>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.12em", color: "var(--ochre-300)", marginTop: 6 }}>
                    {`FIELD RANGER · WITH ${dogName.toUpperCase()}`}
                </div>
            </div>

            <div style={{ padding: "var(--space-6) var(--gutter)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                {/* your team: ranger then dog */}
                <div>
                    <Eyebrow>Your team</Eyebrow>
                    <div style={{ marginTop: "var(--space-3)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-4)" }}>
                            <span style={{ position: "relative", flex: "none", width: 56, height: 56, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--sand-100)" }}>
                                {ranger && <Image src={ranger.photo} alt={player?.displayName ?? "Ranger"} fill sizes="56px" style={{ objectFit: "cover" }} />}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-accent)" }}>Your ranger</div>
                                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", display: "block", marginTop: 2 }}>{player?.displayName}</strong>
                                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>You, on the team</span>
                            </div>
                        </div>
                        <div style={{ height: 1, background: "var(--border-subtle)" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-4)" }}>
                            <span style={{ position: "relative", flex: "none", width: 56, height: 56, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--sand-100)" }}>
                                {dog && <Image src={dog.photo} alt={dogName} fill sizes="56px" style={{ objectFit: "cover" }} />}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-accent)" }}>Your dog</div>
                                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", display: "block", marginTop: 2 }}>{dogName}</strong>
                                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{dog?.breed}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* stats */}
                <div style={{ display: "flex", gap: "var(--space-5)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", boxShadow: "var(--shadow-xs)" }}>
                    <StatBlock value={zar(donationsTotal)} label="Donated" />
                    <StatBlock value={donations.length} label="Gifts" divider />
                    <StatBlock value={`${day}/${ROUND.durationDays}`} label="Round day" divider />
                </div>

                {/* impact (community total) */}
                <ImpactCard amount={campaignTotal} onOpen={() => router.push("/impact")} />

                {/* donation history */}
                <div>
                    <Eyebrow>Donation history</Eyebrow>
                    <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                        {donations.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>No donations yet. The kit room funds the dogs.</p>
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
                    <Row icon="trophy" label="Prizes and how to win" onClick={() => router.push("/prizes")} />
                    <Row icon="users-three" label="Meet the real K9 Unit" onClick={() => router.push("/team")} />
                    <Row icon="hand-heart" label="Your impact" onClick={() => router.push("/impact")} />
                    <Row icon="heart" label="Our allies" onClick={() => router.push("/allies")} />
                    <Row icon="radio" label="Enter a sponsor code" onClick={() => router.push("/codes")} />
                    <Row icon="scroll" label="Rules & privacy" onClick={() => router.push("/legal")} />
                </div>

                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center" }}>
                    {redeemedCodes.length} sponsor code{redeemedCodes.length === 1 ? "" : "s"} redeemed
                </div>

                {/* demo controls: scrub through the round to pitch the full arc */}
                <div style={{ background: "var(--surface-card)", border: "1px dashed var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)" }}>
                    <Eyebrow>Demo controls</Eyebrow>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginTop: "var(--space-4)" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                            DAY {day}
                        </span>
                        <input
                            type="range"
                            min={1}
                            max={ROUND.durationDays}
                            value={day}
                            onChange={(e) => setDemoDay(Number(e.target.value))}
                            aria-label="Simulate round day"
                            style={{ flex: 1, accentColor: "var(--green-700)" }}
                        />
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "var(--space-3) 0 0", lineHeight: 1.5 }}>
                        Scrub through the round to show how clues release over the 45 days.
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginTop: "var(--space-5)" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                            {demoHour == null ? "LIVE TIME" : `${String(demoHour).padStart(2, "0")}:00`}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={23}
                            value={demoHour ?? 12}
                            onChange={(e) => setDemoHour(Number(e.target.value))}
                            aria-label="Simulate time of day"
                            style={{ flex: 1, accentColor: "var(--green-700)" }}
                        />
                        {demoHour != null && (
                            <button onClick={() => setDemoHour(null)} aria-label="Use the device clock" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-link)", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                                Live
                            </button>
                        )}
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "var(--space-3) 0 0", lineHeight: 1.5 }}>
                        Simulate the time of day. From 20:00 the ranger makes camp and cannot move until dawn. Moving the clock lands the ranger and rests the dog, so both are ready to work again.
                    </p>

                    <div style={{ marginTop: "var(--space-4)" }}>
                        <Button size="sm" variant="secondary" fullWidth onClick={() => router.push("/debrief?preview=1")} iconRight={<i className="ph ph-flag-checkered" />}>
                            Preview the round-end debrief
                        </Button>
                    </div>
                </div>

                <Button variant="ghost" fullWidth onClick={onReset} iconLeft={<i className="ph ph-arrow-counter-clockwise" />}>
                    Reset demo
                </Button>
            </div>
        </div>
    );
}
