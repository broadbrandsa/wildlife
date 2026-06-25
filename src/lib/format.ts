/** Format a rand amount as "R1,250" (no decimals for whole-rand donations). */
export function zar(amount: number): string {
    return "R" + amount.toLocaleString("en-ZA");
}

/** A fake but plausible Section 18A receipt number. */
export function receiptNumber(seed: number): string {
    return "SAWC-2026-" + (seed % 1_000_000).toString().padStart(6, "0");
}
