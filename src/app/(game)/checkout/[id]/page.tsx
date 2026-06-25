"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Tag } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { CLUE_BY_ID, EQUIPMENT_BY_ID } from "@/data";
import type { Donation } from "@/store/game";
import { zar } from "@/lib/format";
import { useGameStore } from "@/store/game";

const BANKS = [
    { id: "fnb", name: "FNB" },
    { id: "absa", name: "Absa" },
    { id: "standard", name: "Standard Bank" },
    { id: "nedbank", name: "Nedbank" },
    { id: "capitec", name: "Capitec" },
    { id: "tymebank", name: "TymeBank" },
];

type Step = "amount" | "bank" | "auth" | "success";

export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const item = EQUIPMENT_BY_ID[params.id];
    const purchase = useGameStore((s) => s.purchase);

    const [step, setStep] = useState<Step>("amount");
    const [bank, setBank] = useState<string | null>(null);
    const [donation, setDonation] = useState<Donation | null>(null);

    useEffect(() => {
        if (step !== "auth") return;
        const t = setTimeout(() => {
            setDonation(purchase(params.id));
            setStep("success");
        }, 1600);
        return () => clearTimeout(t);
    }, [step, params.id, purchase]);

    if (!item) {
        return (
            <div style={{ padding: "var(--space-8) var(--gutter)", textAlign: "center" }}>
                <p>That item could not be found.</p>
                <Button onClick={() => router.push("/shop")}>Back to the kit room</Button>
            </div>
        );
    }

    const clue = item.unlocksClueId ? CLUE_BY_ID[item.unlocksClueId] : null;
    const selectedBank = BANKS.find((b) => b.id === bank);

    return (
        <div style={{ minHeight: "calc(100dvh - 5.2rem)", display: "flex", flexDirection: "column" }}>
            {/* header */}
            <header style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-5) var(--gutter)", borderBottom: "1px solid var(--border-subtle)" }}>
                {step !== "success" && step !== "auth" && (
                    <button onClick={() => (step === "amount" ? router.back() : setStep("amount"))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 22 }}>
                        <i className="ph ph-arrow-left" />
                    </button>
                )}
                <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-accent)" }}>
                        Donate · Ozow
                    </div>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{zar(item.priceZar)}</span>
            </header>

            <div style={{ flex: 1, padding: "var(--space-6) var(--gutter)" }}>
                {step === "amount" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", boxShadow: "var(--shadow-xs)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                                <span style={{ flex: "none", width: 52, height: 52, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", color: "var(--ochre-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                                    <i className={`ph ph-${item.icon}`} />
                                </span>
                                <div>
                                    <strong>{item.name}</strong>
                                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{item.description}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-subtle)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--green-700)" }}>
                                    <i className="ph ph-target" /> How it helps the hunt
                                </div>
                                <p style={{ margin: "0.3rem 0 0", fontSize: "0.84rem", color: "var(--text-primary)", lineHeight: 1.5 }}>{item.effect}</p>
                            </div>
                            <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "var(--text-secondary)" }}>Your donation</span>
                                <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 600 }}>{zar(item.priceZar)}</span>
                            </div>
                            <div style={{ marginTop: "var(--space-3)", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--text-muted)" }}>
                                <i className="ph ph-hand-heart" /> {item.fundedEquivalent}
                            </div>
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, display: "flex", gap: 6 }}>
                            <i className="ph ph-shield-check" style={{ marginTop: 2 }} /> 100% goes to the SAWC K9 Unit. A Section 18A tax certificate is issued for your records.
                        </p>
                        <Button size="lg" fullWidth onClick={() => setStep("bank")} iconRight={<i className="ph ph-arrow-right" />}>
                            Choose your bank
                        </Button>
                    </div>
                )}

                {step === "bank" && (
                    <div className="kw-rise">
                        <h2 style={{ fontSize: "var(--text-h4)", marginTop: 0 }}>Pay from your bank</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Pick your bank to approve the donation in your banking app.</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                            {BANKS.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => {
                                        setBank(b.id);
                                        setStep("auth");
                                    }}
                                    style={{
                                        cursor: "pointer",
                                        background: "var(--surface-card)",
                                        border: "1.5px solid var(--border-default)",
                                        borderRadius: "var(--radius-md)",
                                        padding: "var(--space-4)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        fontWeight: 600,
                                    }}
                                >
                                    <i className="ph ph-bank" style={{ fontSize: 22, color: "var(--green-600)" }} /> {b.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === "auth" && (
                    <div style={{ minHeight: "50dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "var(--space-5)" }}>
                        <i className="ph ph-spinner-gap kw-spin" style={{ fontSize: 44, color: "var(--green-600)" }} />
                        <div>
                            <div style={{ fontWeight: 700 }}>Approve in your {selectedBank?.name} app</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>Waiting for confirmation…</div>
                        </div>
                    </div>
                )}

                {step === "success" && donation && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                        <div style={{ textAlign: "center" }}>
                            <span style={{ display: "inline-flex", width: 64, height: 64, borderRadius: "var(--radius-pill)", background: "var(--success-soft)", color: "var(--success)", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                                <i className="ph-fill ph-check-circle" />
                            </span>
                            <h2 style={{ fontSize: "var(--text-h3)", margin: "var(--space-4) 0 0" }}>Thank you</h2>
                            <p style={{ color: "var(--text-secondary)", margin: "var(--space-2) 0 0" }}>
                                Your donation funded {item.fundedEquivalent.toLowerCase()}.
                            </p>
                        </div>

                        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", boxShadow: "var(--shadow-xs)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: 8 }}>
                                <span style={{ color: "var(--text-muted)" }}>Receipt</span>
                                <span style={{ fontFamily: "var(--font-mono)" }}>{donation.receiptNumber}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: 8 }}>
                                <span style={{ color: "var(--text-muted)" }}>Amount</span>
                                <span style={{ fontFamily: "var(--font-mono)" }}>{zar(donation.amountZar)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                                <span style={{ color: "var(--text-muted)" }}>Tax</span>
                                <Tag tone="green" size="sm">
                                    Section 18A
                                </Tag>
                            </div>
                            <p style={{ margin: "var(--space-4) 0 0", fontSize: "0.76rem", color: "var(--text-muted)" }}>
                                A receipt has been emailed for SARS purposes. (Demo: no real payment was taken.)
                            </p>
                        </div>

                        {clue && (
                            <div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-accent)", marginBottom: "var(--space-3)" }}>
                                    New intel unlocked
                                </div>
                                <ClueCard clue={clue} />
                            </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            <Button size="lg" fullWidth onClick={() => router.push("/map")} iconRight={<i className="ph ph-map-trifold" />}>
                                Back to the hunt
                            </Button>
                            <Button size="lg" variant="ghost" fullWidth onClick={() => router.push("/journal")}>
                                View journal
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
