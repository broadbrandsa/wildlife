# Claude Code prompt: copy refresh (excluding clues)

Copy everything below the line into Claude Code, run from the project root.

---

Read `CLAUDE.md` first and obey the project rules: calm field-ranger voice, sentence case, "you" for the player, no emoji, no exclamation marks, and never use em dashes in any copy. Data in mono. Run `npm run build` when finished.

This is a copy-only pass. Do not change any mechanics, styles, structure or clue content (`src/data/clues.ts` is untouched). Each change below is a find-and-replace: locate the current string and replace it with the new one exactly. If a string has already drifted slightly (other passes are in flight), match the nearest equivalent and apply the same intent.

Voice notes for this pass: shorter sentences hit harder. Cut anything the player already knows, lead with the verb, keep one image per sentence. The ranger voice can be terse; terse reads confident.

## 1. Welcome carousel (`src/app/welcome/page.tsx`)

- Hero sub-line. Current: "You and your dog are the team's best chance of finding the suspect. Here is how the hunt works."
  New: "A poacher is hiding somewhere in Kruger. You and your dog are going to find him."

- Card 1 body. Current: "Clues drip out across the round, each one a real fact about Kruger's rivers, rock, plants and animals. Here is your first, exactly as it lands in your journal on day 1."
  New: "Every clue is a real fact about Kruger's rock, rivers, plants and animals. Solve them and the map gets smaller. Here is your first."

- Card 2 body. Current: "Send your ranger to a spot on the map and your dog reads the ground there. Move each day, follow the pull, close in, then lock in your answer."
  New: "Stand somewhere and your dog reads the ground. Cold, faint, warm, fresh. Move each day and walk the trail warmer."

- Card 3 body. Current: "The closest locked pins take the prizes: a Kruger safari with a visit to the K9 pack, getaways and gear for 26 winners in all."
  New: "The closest locked pins win. A Kruger safari with the K9 pack, getaways and gear, 26 winners in all."

- Card 4 body. Current: "Donate to kit out your hunt. Every rand goes to the SAWC K9 Anti-Poaching Unit, and winning never requires spending a cent."
  New: "Kit out your hunt if you choose. Every rand goes to the real SAWC K9 unit, and winning never costs a cent."

## 2. Onboarding (`src/app/onboarding/page.tsx`)

- Ranger step intro. Current: "Step through and pick the ranger that feels like you. The lineup reflects the real rangers of the Greater Kruger. Then sign on with your name below."
  New: "Pick the ranger that feels like you. The lineup mirrors the real rangers of the Greater Kruger."

- Dog step intro. Current: "Step through the dogs. Each is based on a real SAWC K9 role and brings its own superpower to the tracking. Name your dog below."
  New: "Every dog here does this job for real at SAWC. Each brings its own superpower to your hunt."

- Dog name hint. Current: "This is what we'll call your dog in the game."
  New: "What your dog answers to in the field."

- Origin card 4. Current: "The trail shows itself slowly. Across the round, clues come in from the field: the rock underfoot, the rivers, the plants, radio traffic from other teams. Read them, and {dog} tells you how close the scent runs."
  New: "Clues will come in from the field: the rock underfoot, the rivers, radio traffic from other teams. Read them, and {dog} will tell you how warm the trail runs." (Keep the template interpolation for the dog's name exactly as coded.)

- Origin card 5. Current: "Drop your pin where you think the suspect is hiding, then move in as the trail sharpens. Lock in when you are sure. The closest pin when the round closes puts the real team on the ground, and every move funds the dogs who do this for real."
  New: "Drop your pin where you think he is hiding, move in as the trail sharpens, and lock in when you are sure. Closest pin at the close wins, and every donation feeds the dogs who do this for real."

- Origin cards 1 to 3 stay as they are. The buttons ("Report for duty", "Begin the hunt") stay.

## 3. Map page (`src/app/(game)/map/page.tsx`)

- Pin card, no pin yet. Current: "Tap the map to send your ranger to a spot. That spot is also your guess."
  New: "Tap the map. Where your ranger stands is your guess."

- Pin card, moves remaining. Current: "You have {n} ranger moves left today, each up to {km} km on foot. Drag your pin to walk it; the ring shows your reach."
  New: "{n} moves left today, up to {km} km each. Drag your pin to walk. The ring is your reach." (Keep the singular/plural handling: "One move left today" when n is 1.)

- Pin card, locked state. Current: "Locked in for the round. Changed your mind? A second lock-in from the kit reopens your pin to move once more."
  New: "Locked for the round. A second lock-in from the kit reopens it if you must move."

- Scent card explainer (the paragraph under the Scent read eyebrow; the engagement pass may already hide it after two reads, the shorter text still applies while it shows). Current: "{dog} reads the ground wherever your ranger stands. On some ground the dog catches the scent, on some there is nothing. Move your ranger to hunt for it, then close in."
  New: "{dog} reads the ground where you stand. Hunt for the scent, then close in."

- Field radio line. Current: "HQ radios in: other teams place the freshest scent in {region} of the park."
  New: "HQ radios in: the freshest scent is in {region} of the park." (Keep the `THIRD_LABEL` interpolation.)

- First-launch welcome sheet body. Current: "Tap the map where you think the suspect is hiding. That spot is where your ranger stands and your guess for the round, and it unlocks a free field guide for that ground. Choose with care: once on the ground, your ranger can only walk about {km} km of bush a day. Here is your first clue to work from."
  New: "Tap the map where you think the suspect is hiding. Your ranger deploys there, and that ground's field guide unlocks free. From then on you move on foot, about {km} km a day, so read your first clue before you choose."

- Lock-in modal body. Current: "You get one lock-in for the whole game. This is your final decision, and this pin is the one used to rank you when the round ends."
  New: "One lock-in for the whole game. This pin is the one that counts when the round closes. Ties go to the earliest locked pin." (If the engagement pass already added a tie-breaker sentence, do not duplicate it.)

- Lock-in modal secondary line. Current: "Changed your mind later? Only a second lock-in from the kit can reopen your pin."
  New: "Only a second lock-in from the kit can reopen it."

- Keep unchanged: "Tap the map to drop your pin and start the hunt", "One lock-in for the whole game. Lock in only when you are sure.", the round-over banner, "Keep tracking".

## 4. Journal (`src/app/(game)/journal/page.tsx`)

- Field guides helper (or the case board helper if the engagement pass landed). Current: "Your first field guide is free: it unlocks for the ground where you drop your first pin. Tap a guide you own to read it. Unlock any other zone for R25."
  New: "Your first guide unlocked with your first pin. Tap an owned guide to read it. Any other zone opens for R25."

- "Still out there" card body. Current: "{n} field clue(s) still to come. Each lands on its own, so keep tracking."
  New: "{n} field clue(s) still to come. Each lands on its own day, so keep tracking."

## 5. Kit room (`src/app/(game)/shop/page.tsx`)

- Page sub-line. Current: "Every donation buys real kit for the K9 Unit and gives you a real edge on the hunt."
  New: "Every rand buys real kit for the dogs and a real edge for you."

- Field guides section helper. Current: "You start with one area's field guide, unlocked where you dropped your first pin. Unlock more to read the terrain, plants and animals of other zones and rule them in or out as the clues land."
  New: "Your first guide unlocked where you first pinned. The rest open other zones' ground so you can rule them in or out as the clues land."

- Keep unchanged: the three section blurbs (Ranger kit, Dog kit, Air support), "What is this really?", the fair-play line, "You hold every field guide. The whole park is open to read."

## 6. Equipment data (`src/data/equipment.ts`, `effect` fields only)

Do not touch `description`, `fundedEquivalent` or `realWorldNote` values.

- `field-radio` effect. Current: "Call HQ to hear where other ranger teams have picked up a scent, revealing which third of the park to head for."
  New: "Call HQ to hear where other teams have picked up the scent, so you know which end of the park to work."
  IMPORTANT: this fixes a real leak. The word "third" exposes the hidden thirds mechanic (see the comment on `THIRD_LABEL` in `src/lib/game.ts`). The word "third" must not appear in any player-facing copy; sweep the codebase for other player-visible uses and reword any you find the same way.

- `pro-binoculars` effect. Current: "Doubles how far you can zoom into the map, so you can read the terrain and place your pin far more precisely."
  New: "Doubles your map zoom, for reading the ground closely and placing a precise pin."

- `ranger-boots` effect. Current: "Fresh legs cover more ground, so you can move your ranger a second time in the same day."
  New: "Fresh legs. Move your ranger a second time every day."

- `ranger-compass` effect. Current: "Adds the compass pull to your dog's scent reads, showing which direction the trail is drawing toward."
  New: "Adds an exact bearing to every scent read."

- `standard-collar` effect. Current: "Standard issue for every dog on the roster. It does not change the hunt on its own; the paid kit below does."
  New: "Standard issue for every dog on the roster. The paid kit below is what changes the hunt."

- Leave `monthly-healthcare`, `topo-map`, `gps-collar`, `plane-flyover`, `ranger-gps`, `helicopter-recon`, `extra-lockin` and `truck-fuel` effects as they are (the gps-collar effect may have been extended by the engagement pass; leave that too).

## 7. Checkout (`src/app/(game)/checkout/[id]/page.tsx`)

- Field guide unlocked note. Current: "{item name} is now open. Read it from the field guide chips on the map, or from the field guides in your journal."
  New: "{item name} is open. Read it from the chips on the map or from your journal."

- Extra lock-in note. Current: "Your pin is reopened. Head back to the hunt, move your ranger, and lock in once more."
  New: "Your pin is open again. Move your ranger, then lock in once more."

- Keep unchanged: "100% goes to the SAWC K9 Unit. A Section 18A tax certificate is issued for your records.", the receipt copy, "Thank you".

## 8. Intel Intercept (`src/app/(game)/codes/page.tsx`)

- Success fallback for non-clue unlocks. Current: "Reward unlocked."
  New: "Intel received."

- Keep unchanged: "Heard a code on the radio or seen one online? Tune it in to unlock a sponsor's clue.", the error messages, "Tuning in…". (The pass-it-on line is added by the engagement pass; do not duplicate.)

## 9. Profile (`src/app/(game)/profile/page.tsx`)

- Link row label. Current: "Intel Intercept (enter a code)"
  New: "Enter a sponsor code"

- Empty donation history. Current: "No donations yet. Visit the kit room to support the unit."
  New: "No donations yet. The kit room funds the dogs."

## 10. Leave alone (deliberately)

These lines are already doing their job; do not rework them: the debrief page (including "The bushveld keeps its secrets from the hesitant."), the tracker rating lines in `src/lib/game.ts`, `SCENT_TEXT` and the sky-cue direction lines, the prizes data in `src/data/prizes.ts`, dog and ranger personality copy in `src/data/dogs.ts` and `src/data/rangers.ts`, the Our Allies and impact pages, and all of `src/data/clues.ts`.

## Verify before finishing

- `npm run build` passes clean.
- Grep the whole `src` tree for player-facing uses of the word "third" (case-insensitive) and confirm none remain in copy shown to the player. Internal identifiers (`thirdOf`, `poacherThird`, `Third` types, comments) stay.
- Sweep every changed string for em dashes and exclamation marks; there must be none.
- Read the onboarding flow and map page end to end once on `npm run dev` to confirm interpolations ({dog}, {km}, counts) still render correctly.
