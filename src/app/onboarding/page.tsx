"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DOGS } from "@/data";
import { Button, Eyebrow, Field } from "@/components/ds";
import { useGameStore } from "@/store/game";

const THIS_YEAR = 2026;

const ORIGIN = [
    "There has been an incursion overnight on the western boundary.",
    "We have a fresh scent. The ranger team is grounded in fog. You and your dog are our best chance.",
    "Drop a pin where you think the suspect is hiding. Closest guess at round end gets the team in there.",
    "Welcome to the K9 Unit.",
];

type Step = "age" | "parent" | "name" | "origin" | "dog";

function ProgressDots({ index, total }: { index: number; total: number }) {
    return (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: "var(--space-4)" }}>
            {Array.from({ length: total }).map((_, i) => (
                <span
                    key={i}
                    style={{
                        width: i === index ? 22 : 7,
                        height: 7,
                        borderRadius: 999,
                        background: i <= index ? "var(--accent)" : "var(--border-default)",
                        transition: "all var(--dur-base) var(--ease-out)",
                    }}
                />
            ))}
        </div>
    );
}

export default function OnboardingPage() {
    const router = useRouter();
    const setPlayer = useGameStore((s) => s.setPlayer);

    const [step, setStep] = useState<Step>("age");
    const [birthYear, setBirthYear] = useState("");
    const [parentEmail, setParentEmail] = useState("");
    const [name, setName] = useState("");
    const [originSeen, setOriginSeen] = useState(1);
    const [dogId, setDogId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const age = birthYear ? THIS_YEAR - Number(birthYear) : null;
    const isMinor = age != null && age < 18;
    const steps: Step[] = isMinor ? ["age", "parent", "name", "origin", "dog"] : ["age", "name", "origin", "dog"];
    const stepIndex = steps.indexOf(step);

    const submitAge = () => {
        const y = Number(birthYear);
        if (!y || y < 1920 || y > THIS_YEAR) {
            setError("Enter the year you were born.");
            return;
        }
        setError("");
        setStep(THIS_YEAR - y < 18 ? "parent" : "name");
    };

    const submitParent = () => {
        if (!parentEmail.includes("@")) {
            setError("We need a parent or guardian's email.");
            return;
        }
        setError("");
        setStep("name");
    };

    const submitName = () => {
        if (name.trim().length < 2) {
            setError("Pick a ranger name.");
            return;
        }
        setError("");
        setStep("origin");
    };

    const finish = () => {
        if (!dogId) return;
        setPlayer({
            id: crypto.randomUUID(),
            displayName: name.trim(),
            birthYear: Number(birthYear),
            dogId,
            parentEmail: isMinor ? parentEmail : undefined,
        });
        router.replace("/map?welcome=1");
    };

    return (
        <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--surface-page)" }}>
            <div style={{ padding: "var(--space-6) var(--gutter) 0" }}>
                <button
                    onClick={() => (stepIndex <= 0 ? router.back() : setStep(steps[stepIndex - 1]))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}
                >
                    <i className="ph ph-arrow-left" /> Back
                </button>
                <ProgressDots index={stepIndex} total={steps.length} />
            </div>

            <div style={{ flex: 1, padding: "var(--space-7) var(--gutter)", display: "flex", flexDirection: "column" }}>
                {step === "age" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                        <div>
                            <Eyebrow>Step 01 · Sign-on</Eyebrow>
                            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 0" }}>What year were you born?</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>
                                We ask so younger rangers get a parent's say-so. We never store your full birth date.
                            </p>
                        </div>
                        <Field
                            label="Birth year"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g. 2014"
                            value={birthYear}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthYear(e.target.value)}
                            error={error || undefined}
                        />
                        <Button size="lg" fullWidth onClick={submitAge}>
                            Continue
                        </Button>
                    </div>
                )}

                {step === "parent" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                        <div>
                            <Eyebrow>Step 02 · Parent's say-so</Eyebrow>
                            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 0" }}>A grown-up's email</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>
                                Because you are under 18, we send a quick note to a parent or guardian. This is a demo, so nothing is sent yet.
                            </p>
                        </div>
                        <Field
                            label="Parent or guardian email"
                            type="email"
                            icon={<i className="ph ph-envelope-simple" />}
                            placeholder="parent@email.com"
                            value={parentEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setParentEmail(e.target.value)}
                            error={error || undefined}
                        />
                        <Button size="lg" fullWidth onClick={submitParent}>
                            Continue
                        </Button>
                    </div>
                )}

                {step === "name" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                        <div>
                            <Eyebrow>Sign-on</Eyebrow>
                            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 0" }}>What should we call you?</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>This is your ranger name on the leaderboard.</p>
                        </div>
                        <Field
                            label="Ranger name"
                            icon={<i className="ph ph-identification-badge" />}
                            placeholder="Ranger Kgosi"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            error={error || undefined}
                        />
                        <Button size="lg" fullWidth onClick={submitName}>
                            Continue
                        </Button>
                    </div>
                )}

                {step === "origin" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        <Eyebrow rule>Incoming · field radio</Eyebrow>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-5)" }}>
                            {ORIGIN.slice(0, originSeen).map((line, i) => (
                                <div
                                    key={i}
                                    className="kw-rise"
                                    style={{
                                        alignSelf: "flex-start",
                                        maxWidth: "85%",
                                        background: i === ORIGIN.length - 1 ? "var(--brand)" : "var(--surface-card)",
                                        color: i === ORIGIN.length - 1 ? "var(--sand-50)" : "var(--text-primary)",
                                        border: "1px solid var(--border-subtle)",
                                        borderRadius: "var(--radius-lg)",
                                        borderBottomLeftRadius: 4,
                                        padding: "var(--space-4) var(--space-5)",
                                        boxShadow: "var(--shadow-sm)",
                                    }}
                                >
                                    {i === 0 && (
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-accent)", marginBottom: 4 }}>
                                            Dispatch · Theresa
                                        </div>
                                    )}
                                    {line}
                                </div>
                            ))}
                        </div>
                        <Button
                            size="lg"
                            fullWidth
                            onClick={() => (originSeen < ORIGIN.length ? setOriginSeen((n) => n + 1) : setStep("dog"))}
                            iconRight={<i className="ph ph-arrow-right" />}
                        >
                            {originSeen < ORIGIN.length ? "Next message" : "Choose your dog"}
                        </Button>
                    </div>
                )}

                {step === "dog" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                        <div>
                            <Eyebrow>Final step · your partner</Eyebrow>
                            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 0" }}>Pick your dog</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>
                                Each is based on a real SAWC K9 role and gives a small edge on the hunt.
                            </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            {DOGS.map((d) => {
                                const on = dogId === d.id;
                                return (
                                    <button
                                        key={d.id}
                                        onClick={() => setDogId(d.id)}
                                        style={{
                                            textAlign: "left",
                                            cursor: "pointer",
                                            background: on ? "var(--accent-soft)" : "var(--surface-card)",
                                            border: `1.5px solid ${on ? "var(--ochre-500)" : "var(--border-subtle)"}`,
                                            borderRadius: "var(--radius-lg)",
                                            padding: "var(--space-4)",
                                            display: "flex",
                                            gap: "var(--space-4)",
                                            alignItems: "center",
                                            boxShadow: on ? "0 0 0 3px var(--ochre-100)" : "var(--shadow-xs)",
                                            transition: "all var(--dur-fast) var(--ease-out)",
                                        }}
                                    >
                                        <span style={{ flex: "none", width: 48, height: 48, borderRadius: "var(--radius-pill)", background: "var(--green-100)", color: "var(--green-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                                            <i className={`ph${on ? "-fill" : ""} ph-${d.icon}`} />
                                        </span>
                                        <span style={{ flex: 1 }}>
                                            <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                                <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>{d.name}</strong>
                                                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{d.breed}</span>
                                            </span>
                                            <span style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 2 }}>{d.personality}</span>
                                            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.06em", color: "var(--ochre-700)", marginTop: 6 }}>
                                                <i className="ph ph-sparkle" /> {d.effect}
                                            </span>
                                        </span>
                                        {on && <i className="ph-fill ph-check-circle" style={{ color: "var(--ochre-600)", fontSize: 22 }} />}
                                    </button>
                                );
                            })}
                        </div>
                        <Button size="lg" fullWidth disabled={!dogId} onClick={finish} iconRight={<i className="ph ph-paw-print" />}>
                            Begin the hunt
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
