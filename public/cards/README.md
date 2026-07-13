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

The cards are a **standard playing-card portrait, 2.5 × 3.5** (the poker-card
ratio, 0.714). The back fills the card exactly at that ratio, so there is **no
cropping** — design straight to the frame.

- **Canvas: 1200 × 1680 px** (2.5 × 3.5). This is 3x the on-screen size, so it
  stays crisp on high-density phones. (Equivalent to a 2.5" × 3.5" card at
  480 DPI; the print-standard 750 × 1050 @ 300 DPI is the same ratio if you
  prefer to work at print size.)
- **Do NOT round the corners.** The game clips the card to a **40 px rounded
  corner** at display size — about **120 px at this 1200 px master**. Design to
  the square edge; the rounding is applied for you. Keep important detail a few
  px in from the edge so nothing lands right on the rounded corner.
- **No drop shadow / no outer glow** — the game adds the card shadow.
- **sRGB, PNG.** Solid artwork (no transparency needed — it is clipped to the
  card).

### On-screen reference

- Card size: **2.5 × 3.5 portrait**, up to **400 × 560 px** (about **335 × 469
  px** on a typical phone). The master (1200 × 1680) scales down to this.
- Corner radius: **40 px** at 400 px wide (10% of width).
