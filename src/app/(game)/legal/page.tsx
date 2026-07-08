"use client";

import { useRouter } from "next/navigation";

import { Eyebrow } from "@/components/ds";

const SECTIONS = [
    {
        title: "About this build",
        body: "This is a prototype of the SAWC K9 Pin-Drop Hunt, built on the Kruger Wild design system. No real payments are processed and no live data is collected. Copy, clues and funding figures are illustrative and pending SAWC sign-off.",
    },
    {
        title: "Your privacy (POPIA)",
        body: "We collect the least we can: a ranger name and your birth year. Players under 18 are asked for a parent or guardian's email before playing. We never collect a full date of birth, and we do not sell or share your information.",
    },
    {
        title: "The hunt & prizes",
        body: "The 26 locked pins closest to the revealed camp win the round's tiered prizes (1 first, 5 second, 20 third). Ties are broken by whichever pin locked earliest. Entry is free and never tied to a donation. Winners are verified and announced within seven days of round end. Full written rules, a free entry path and independent verification will be published before any prize round runs, in line with section 36 of the Consumer Protection Act. Prize partners shown in this prototype are illustrative.",
    },
    {
        title: "Where your money goes",
        body: "Donations support the Southern African Wildlife College K9 Anti-Poaching Unit. A Section 18A tax certificate is issued for qualifying donations, subject to SAWC's confirmed PBO status.",
    },
];

export default function LegalPage() {
    const router = useRouter();
    return (
        <div style={{ padding: "var(--space-5) var(--gutter) var(--space-8)" }}>
            <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
                <i className="ph ph-arrow-left" /> Back
            </button>
            <Eyebrow>Rules & privacy</Eyebrow>
            <h1 style={{ fontSize: "var(--text-h2)", margin: "var(--space-3) 0 var(--space-5)" }}>The fine print</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                {SECTIONS.map((s) => (
                    <section key={s.title}>
                        <h2 style={{ fontSize: "var(--text-h4)", margin: "0 0 var(--space-2)" }}>{s.title}</h2>
                        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>{s.body}</p>
                    </section>
                ))}
            </div>
        </div>
    );
}
