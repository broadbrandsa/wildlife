"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Eyebrow } from "@/components/ds";
import { ClueCard } from "@/components/game/ClueCard";
import { CLUE_BY_ID, COUPON_CODES } from "@/data";
import type { Clue } from "@/data";
import { useGameStore } from "@/store/game";

type View =
    | { kind: "input" }
    | { kind: "checking" }
    | { kind: "success"; clue: Clue | null; credit: string }
    | { kind: "error"; message: string };

const ERROR_COPY: Record<string, string> = {
    unknown: "Code not recognised. Check the spelling and try again.",
    used: "You have already used this code on your account.",
    expired: "This code has expired.",
};

export default function CodesPage() {
    const router = useRouter();
    const redeemCode = useGameStore((s) => s.redeemCode);

    const [value, setValue] = useState("");
    const [view, setView] = useState<View>({ kind: "input" });

    const submit = () => {
        if (!value.trim()) return;
        setView({ kind: "checking" });
        setTimeout(() => {
            const res = redeemCode(value);
            if (res.ok) {
                const clue = res.unlockType === "clue" ? CLUE_BY_ID[res.payloadId] : null;
                setView({ kind: "success", clue, credit: res.creditLine });
            } else {
                setView({ kind: "error", message: ERROR_COPY[res.reason] });
            }
        }, 1200);
    };

    const reset = () => {
        setValue("");
        setView({ kind: "input" });
    };

    return (
        <div style={{ minHeight: "calc(100dvh - 5.2rem)", display: "flex", flexDirection: "column", background: "radial-gradient(120% 90% at 50% 0%, #21392C 0%, #16110A 100%)" }}>
            <header style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-5) var(--gutter)" }}>
                <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,239,226,0.7)", fontSize: 22 }}>
                    <i className="ph ph-arrow-left" />
                </button>
                <div>
                    <Eyebrow color="var(--ochre-300)">Intel Intercept</Eyebrow>
                    <div style={{ color: "#fff", fontWeight: 700, marginTop: 2 }}>Enter a sponsor code</div>
                </div>
            </header>

            <div style={{ flex: 1, padding: "var(--space-5) var(--gutter) var(--space-8)", display: "flex", flexDirection: "column" }}>
                {/* radio dial */}
                <div style={{ display: "flex", justifyContent: "center", margin: "var(--space-5) 0 var(--space-7)" }}>
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            background: "conic-gradient(from 220deg, #C58A3D, #8C611C, #C58A3D)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 0 8px rgba(197,138,61,0.18), var(--shadow-lg)",
                        }}
                    >
                        <span style={{ width: 92, height: 92, borderRadius: "50%", background: "var(--green-950)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className={`ph ph-radio ${view.kind === "checking" ? "kw-spin" : ""}`} style={{ fontSize: 44, color: "var(--ochre-300)" }} />
                        </span>
                    </div>
                </div>

                {view.kind === "input" || view.kind === "checking" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                        <p style={{ textAlign: "center", color: "rgba(245,239,226,0.78)", margin: 0 }}>
                            Heard a code on the radio or seen one online? Tune it in to unlock a sponsor&apos;s clue.
                        </p>
                        <input
                            value={value}
                            disabled={view.kind === "checking"}
                            onChange={(e) => setValue(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === "Enter" && submit()}
                            placeholder="5FM-SHINGWEDZI-42"
                            style={{
                                textAlign: "center",
                                fontFamily: "var(--font-mono)",
                                fontSize: "1.05rem",
                                letterSpacing: "0.08em",
                                padding: "0.9rem 1rem",
                                borderRadius: "var(--radius-md)",
                                border: "1.5px solid rgba(245,239,226,0.25)",
                                background: "rgba(0,0,0,0.25)",
                                color: "var(--sand-50)",
                                outline: "none",
                            }}
                        />
                        <Button variant="accent" size="lg" fullWidth disabled={view.kind === "checking" || !value.trim()} onClick={submit}>
                            {view.kind === "checking" ? "Tuning in…" : "Unlock clue"}
                        </Button>

                        <div style={{ marginTop: "var(--space-5)", textAlign: "center" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", color: "rgba(245,239,226,0.45)", marginBottom: 8 }}>
                                DEMO CODES
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                                {COUPON_CODES.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => setValue(c.code)}
                                        style={{ background: "rgba(245,239,226,0.08)", border: "1px solid rgba(245,239,226,0.18)", color: "var(--sand-100)", borderRadius: 999, padding: "0.3rem 0.7rem", fontFamily: "var(--font-mono)", fontSize: "0.66rem", cursor: "pointer" }}
                                    >
                                        {c.code}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}

                {view.kind === "error" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "center" }}>
                        <p style={{ color: "var(--clay-200)", textAlign: "center", margin: 0 }}>
                            <i className="ph ph-warning-circle" style={{ marginRight: 6 }} />
                            {view.message}
                        </p>
                        <Button variant="ondark" onClick={reset}>
                            Try another code
                        </Button>
                    </div>
                )}

                {view.kind === "success" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                        {view.clue ? (
                            <ClueCard clue={view.clue} />
                        ) : (
                            <p style={{ color: "var(--sand-50)", textAlign: "center" }}>Intel received.</p>
                        )}
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(245,239,226,0.7)", textAlign: "center", margin: 0 }}>
                            {view.credit}
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "rgba(245,239,226,0.6)", textAlign: "center", margin: 0 }}>
                            Heard it somewhere? Pass it on. Codes are for everyone.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
                            <Button variant="accent" size="lg" fullWidth onClick={() => router.push("/map?panel=clue")}>
                                See your clues
                            </Button>
                            <Button variant="ondark" fullWidth onClick={reset}>
                                Enter another code
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
