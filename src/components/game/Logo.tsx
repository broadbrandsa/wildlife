import Image from "next/image";

interface LogoProps {
    size?: number;
    showWordmark?: boolean;
    inverse?: boolean;
    tagline?: string;
}

/** Acacia emblem + wordmark lockup, composed per the Kruger Wild brand. */
export function Logo({ size = 44, showWordmark = true, inverse = false, tagline = "K9 PIN-DROP HUNT" }: LogoProps) {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem" }}>
            <Image src="/logo/kruger-wild-mark.svg" alt="Kruger Wild" width={size} height={size} priority />
            {showWordmark && (
                <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1 }}>
                    <span
                        style={{
                            fontFamily: "var(--font-serif)",
                            fontWeight: "var(--fw-semibold)",
                            fontSize: "1.15rem",
                            letterSpacing: "-0.01em",
                            color: inverse ? "var(--sand-50)" : "var(--text-primary)",
                        }}
                    >
                        Kruger Wild
                    </span>
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.58rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: inverse ? "var(--ochre-300)" : "var(--text-accent)",
                            marginTop: 3,
                        }}
                    >
                        {tagline}
                    </span>
                </span>
            )}
        </span>
    );
}
