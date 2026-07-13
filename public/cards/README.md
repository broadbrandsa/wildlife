# Card back artwork

Custom back-side art for the dealt cards (species spot, field clue, field
guide). Drop the PNGs here with these exact filenames and the game picks them
up automatically. Until a file is present, that card shows the built-in woven
back, so you can add them one at a time.

| Card | File |
| --- | --- |
| Species spot | `card-back-species.png` |
| Field clue | `card-back-clue.png` |
| Field guide | `card-back-guide.png` |

(The three can be identical if you want one shared back; just drop the same
image under all three names.)

## Designer spec

**Deliver: full-bleed PNG, square corners, sRGB.**

- **Canvas: 1200 × 1200 px, square.** This is 3x the largest on-screen size, so
  it stays crisp on high-density phones.
- **Do NOT round the corners.** The game clips the card to a **40 px rounded
  corner** at display size (about **10% of the card width**, ~120 px at this
  1200 px master). Design to the square edge; the rounding is applied for you.
- **No drop shadow / no outer glow.** The game adds the card shadow.
- Solid artwork (no transparency needed — it is always clipped to the card).

### Why square, and the safe area

On screen a card is **up to 400 px wide** (about 335 px on a typical phone) and
its **height varies by card type** (the front content sets it: the species card
is tall and portrait, the clue card is short and wide). The art is scaled to
**cover** the card and centre-cropped, so a square master crops gracefully to
any height.

- Keep the **logo, emblem and any text inside a centred safe zone of ~840 px
  diameter** (the middle ~70%). Anything outside that may be cropped on the
  shorter cards.
- Let the **background pattern/texture run to all four edges** so the crop never
  shows a seam.

### On-screen reference sizes (for mockups)

- Card width: **335 px** (phones) up to **400 px** (max).
- Corner radius: **40 px** at that width.
- Heights differ per card and are content-driven, roughly: species ~540 px,
  guide ~430 px, clue ~260 px at 335 px wide. Treat these as guidance only — the
  square master + cover handles all of them.

If you would rather supply three exact rectangles (one per card, no cropping),
tell the developer and the cards can be pinned to fixed sizes instead.
