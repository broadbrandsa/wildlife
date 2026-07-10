"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DOGS, RANGERS } from "@/data";
import { Button, Eyebrow, Field } from "@/components/ds";
import { CarouselArrow, CarouselDots } from "@/components/game/Carousel";
import { PhoneStage } from "@/components/game/PhoneStage";
import { useGameStore } from "@/store/game";

type Step = "ranger" | "dog" | "origin";

const STEPS: Step[] = ["ranger", "dog", "origin"];

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

    const [step, setStep] = useState<Step>("ranger");
    const [name, setName] = useState("");
    const [originSeen, setOriginSeen] = useState(1);
    // Ranger and dog are chosen with a carousel: the one on screen is the pick.
    const [rangerIndex, setRangerIndex] = useState(0);
    const [dogIndex, setDogIndex] = useState(0);
    const [dogName, setDogName] = useState("");

    const selectedRanger = RANGERS[rangerIndex];
    const selectedDog = DOGS[dogIndex];
    const stepThrough = (setIndex: (fn: (i: number) => number) => void, length: number, dir: 1 | -1) =>
        setIndex((i) => (i + dir + length) % length);

    const stepIndex = STEPS.indexOf(step);
    const rangerName = name.trim();
    const chosenDogName = dogName.trim();

    // The team is chosen and named first, so dispatch can welcome them properly.
    const ORIGIN = [
        `Welcome to the SAWC K9 Unit, ${rangerName || "ranger"}. You and ${chosenDogName || "your dog"} join the roster this morning.`,
        "And not a moment too soon. Poachers crossed the western boundary in the dark. One of them is still inside the park, lying up somewhere in the bush.",
        `The ranger teams are grounded in fog and the aircraft cannot fly. Until it lifts, you and ${chosenDogName || "your dog"} are the only ones who can work this scent.`,
        `The trail shows itself slowly. Across the round, clues come in from the field: the rock underfoot, the rivers, the plants, radio traffic from other teams. Read them, and ${chosenDogName || "your dog"} tells you how close the scent runs.`,
        "Drop your pin where you think the suspect is hiding, then move in as the trail sharpens. Lock in when you are sure. The closest pin when the round closes puts the real team on the ground, and every move funds the dogs who do this for real.",
    ];

    const finish = () => {
        setPlayer({
            id: crypto.randomUUID(),
            displayName: rangerName,
            rangerId: selectedRanger.id,
            dogId: selectedDog.id,
            dogName: chosenDogName || selectedDog.breed,
        });
        // The first field guide is unlocked free when the player drops their first pin.
        router.replace("/map?welcome=1");
    };

    return (
        <PhoneStage columnStyle={{ flexDirection: "column" }}>
            <div style={{ padding: "var(--space-6) var(--gutter) 0" }}>
                <button
                    onClick={() => (stepIndex <= 0 ? router.back() : setStep(STEPS[stepIndex - 1]))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", padding: "0.4rem 0" }}
                >
                    <i className="ph ph-arrow-left" /> Back
                </button>
                <ProgressDots index={stepIndex} total={STEPS.length} />
            </div>

            <div style={{ flex: 1, padding: "var(--space-6) var(--gutter) var(--space-7)", display: "flex", flexDirection: "column" }}>
                {step === "ranger" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                        <div>
                            <Eyebrow>Your ranger</Eyebrow>
                            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 0" }}>This is you</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>
                                Step through and pick the ranger that feels like you. The lineup reflects the real rangers of the Greater Kruger. Then sign on with your name below.
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

                        <Field
                            label="Your ranger name"
                            icon={<i className="ph ph-identification-badge" />}
                            placeholder="e.g. Ranger Kgosi"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            hint="Your name on the team and on the leaderboard."
                        />

                        <Button size="lg" fullWidth disabled={rangerName.length < 2} onClick={() => setStep("dog")} iconRight={<i className="ph ph-arrow-right" />}>
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
                                Step through the dogs. Each is based on a real SAWC K9 role and brings its own superpower to the tracking. Name your dog below.
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
                        <Button size="lg" fullWidth disabled={!chosenDogName} onClick={() => setStep("origin")} iconRight={<i className="ph ph-arrow-right" />}>
                            Report for duty
                        </Button>
                    </div>
                )}

                {step === "origin" && (
                    <div className="kw-rise" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Eyebrow rule>Incoming · field radio</Eyebrow>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-5)" }}>
                            {ORIGIN.slice(0, originSeen).map((line, i) => {
                                const hero = i === 0; // the welcome card leads the thread
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
                                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ochre-300)", marginBottom: 4 }}>
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
                            onClick={() => (originSeen < ORIGIN.length ? setOriginSeen((n) => n + 1) : finish())}
                            iconRight={<i className={`ph ph-${originSeen < ORIGIN.length ? "arrow-right" : "paw-print"}`} />}
                        >
                            {originSeen < ORIGIN.length ? "Next message" : "Begin the hunt"}
                        </Button>
                    </div>
                )}
            </div>
        </PhoneStage>
    );
}
