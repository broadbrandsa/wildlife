"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DOGS, RANGERS } from "@/data";
import { Button, Eyebrow, Field } from "@/components/ds";
import { PhoneStage } from "@/components/game/PhoneStage";
import { useGameStore } from "@/store/game";

const THIS_YEAR = 2026;

const ORIGIN = [
    "Poachers crossed the western boundary in the dark. One of them is still inside the park, lying up somewhere in the bush.",
    "The ranger teams are grounded in fog and the aircraft cannot fly. Until it lifts, you and your dog are the only ones who can work this scent.",
    "The trail shows itself slowly. Across the round, clues come in from the field: the rock underfoot, the rivers, the plants, radio traffic from other teams. Read them, and your dog tells you how close the scent runs.",
    "Drop your pin where you think the suspect is hiding, then move in as the trail sharpens. Lock in when you are sure. The closest pin when the round closes puts the real team on the ground, and every move funds the dogs who do this for real.",
    "Welcome to the K9 Unit.",
    "First, choose your ranger. Then, choose your dog.",
];
const HERO_CARD = "Welcome to the K9 Unit.";

type Step = "age" | "parent" | "name" | "origin" | "ranger" | "dog";

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

function CarouselArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={dir === "left" ? "Previous" : "Next"}
            style={{
                position: "absolute",
                top: "50%",
                left: dir === "left" ? 10 : undefined,
                right: dir === "right" ? 10 : undefined,
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: "rgba(250,246,236,0.92)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-primary)",
            }}
        >
            <i className={`ph-bold ph-caret-${dir}`} style={{ fontSize: 20 }} />
        </button>
    );
}

function CarouselDots({ index, total }: { index: number; total: number }) {
    return (
        <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
            {Array.from({ length: total }).map((_, i) => (
                <span
                    key={i}
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: i === index ? "var(--accent)" : "var(--border-default)",
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
    // Ranger and dog are chosen with a carousel: the one on screen is the pick.
    const [rangerIndex, setRangerIndex] = useState(0);
    const [dogIndex, setDogIndex] = useState(0);
    const [dogName, setDogName] = useState("");
    const [error, setError] = useState("");

    const selectedRanger = RANGERS[rangerIndex];
    const selectedDog = DOGS[dogIndex];
    const rangerId = selectedRanger.id;
    const dogId = selectedDog.id;
    const stepThrough = (setIndex: (fn: (i: number) => number) => void, length: number, dir: 1 | -1) =>
        setIndex((i) => (i + dir + length) % length);

    const age = birthYear ? THIS_YEAR - Number(birthYear) : null;
    const isMinor = age != null && age < 18;
    const steps: Step[] = isMinor
        ? ["age", "parent", "name", "origin", "ranger", "dog"]
        : ["age", "name", "origin", "ranger", "dog"];
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
        const dogFallback = selectedDog.breed;
        setPlayer({
            id: crypto.randomUUID(),
            displayName: name.trim(),
            birthYear: Number(birthYear),
            rangerId,
            dogId,
            dogName: dogName.trim() || dogFallback,
            parentEmail: isMinor ? parentEmail : undefined,
        });
        // The first field guide is unlocked free when the player drops their first pin.
        router.replace("/map?welcome=1");
    };

    return (
        <PhoneStage columnStyle={{ flexDirection: "column" }}>
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
                            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 0" }}>Name your ranger</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>You are the ranger. This is your name on the team and on the leaderboard.</p>
                        </div>
                        <Field
                            label="Ranger name"
                            icon={<i className="ph ph-identification-badge" />}
                            placeholder="e.g. Ranger Kgosi"
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
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Eyebrow rule>Incoming · field radio</Eyebrow>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-5)" }}>
                            {ORIGIN.slice(0, originSeen).map((line, i) => {
                                const hero = line === HERO_CARD;
                                return (
                                    <div
                                        key={i}
                                        className="kw-rise"
                                        style={{
                                            alignSelf: "flex-start",
                                            maxWidth: "85%",
                                            background: hero ? "var(--brand)" : "var(--surface-card)",
                                            color: hero ? "var(--sand-50)" : "var(--text-primary)",
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
                                );
                            })}
                        </div>
                        <Button
                            size="lg"
                            fullWidth
                            onClick={() => (originSeen < ORIGIN.length ? setOriginSeen((n) => n + 1) : setStep("ranger"))}
                            iconRight={<i className="ph ph-arrow-right" />}
                        >
                            {originSeen < ORIGIN.length ? "Next message" : "Choose your ranger"}
                        </Button>
                    </div>
                )}

                {step === "ranger" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                        <div>
                            <Eyebrow>Your ranger</Eyebrow>
                            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 0" }}>Pick your look, {name.trim() || "ranger"}</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>
                                This is you on the team. The lineup reflects the real rangers of the Greater Kruger. Step through and pick the one that feels like you; you play as {name.trim() || "yourself"}.
                            </p>
                        </div>

                        <div style={{ position: "relative" }}>
                            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", background: "var(--sand-100)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                                <Image key={selectedRanger.id} src={selectedRanger.photo} alt="Ranger portrait" fill sizes="430px" style={{ objectFit: "cover" }} className="kw-rise" />
                            </div>
                            <CarouselArrow dir="left" onClick={() => stepThrough(setRangerIndex, RANGERS.length, -1)} />
                            <CarouselArrow dir="right" onClick={() => stepThrough(setRangerIndex, RANGERS.length, 1)} />
                        </div>
                        <CarouselDots index={rangerIndex} total={RANGERS.length} />

                        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.5, textAlign: "center" }}>
                            &ldquo;{selectedRanger.personality}&rdquo;
                        </p>

                        <Button size="lg" fullWidth onClick={() => setStep("dog")} iconRight={<i className="ph ph-arrow-right" />}>
                            Now choose your dog
                        </Button>
                    </div>
                )}

                {step === "dog" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                        <div>
                            <Eyebrow>Your partner</Eyebrow>
                            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 0" }}>Pick your dog</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>
                                Step through the dogs. Each is based on a real SAWC K9 role and gives a small edge on the hunt. Name your dog below.
                            </p>
                        </div>

                        <div style={{ position: "relative" }}>
                            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", background: "var(--sand-100)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                                <Image key={selectedDog.id} src={selectedDog.photo} alt={selectedDog.breed} fill sizes="430px" style={{ objectFit: "cover" }} className="kw-rise" />
                            </div>
                            <CarouselArrow dir="left" onClick={() => stepThrough(setDogIndex, DOGS.length, -1)} />
                            <CarouselArrow dir="right" onClick={() => stepThrough(setDogIndex, DOGS.length, 1)} />
                        </div>
                        <CarouselDots index={dogIndex} total={DOGS.length} />

                        <div>
                            <strong style={{ display: "block", fontFamily: "var(--font-serif)", fontSize: "1.25rem" }}>{selectedDog.breed}</strong>
                            <span style={{ display: "block", fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: 3 }}>{selectedDog.personality}</span>
                            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.06em", color: "var(--ochre-700)", marginTop: 8 }}>
                                <i className="ph ph-sparkle" /> {selectedDog.effect}
                            </span>
                        </div>

                        <Field
                            label="Name your dog"
                            icon={<i className="ph ph-paw-print" />}
                            placeholder="e.g. Bandit"
                            value={dogName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDogName(e.target.value)}
                            hint="This is what we'll call your dog in the game."
                        />
                        <Button size="lg" fullWidth disabled={!dogName.trim()} onClick={finish} iconRight={<i className="ph ph-paw-print" />}>
                            Begin the hunt
                        </Button>
                    </div>
                )}
            </div>
        </PhoneStage>
    );
}
