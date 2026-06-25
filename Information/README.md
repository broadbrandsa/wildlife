# SAWC K9 Pin-Drop Hunt: project files

This folder contains the complete research and decision history for the SAWC K9 Pin-Drop Hunt mobile conservation fundraising game.

## Files in this folder (recommended read order)

1. **SAWC_K9_PIN_DROP_HUNT_HANDOVER.md** (start here)
   Master handover document. Single source of truth covering: concept summary, locked decisions, NGO partner context, strategic validation summary, Kruger geography summary, 8 game zones, full v1 prototype spec (28 screens), game mechanics, equipment shop, coupon code system, visual design, architecture, pitch demo flow, risks and compliance, v2 roadmap, open questions for SAWC, 7-day build plan, and outstanding research areas.

2. **SAWC_K9_Strategic_Validation_Briefing.md** (deeper background)
   The original strategic validation briefing. Goes deeper on: SA mobile gaming market, comparable conservation games (Sea Hero Quest, Wildeverse, Green Game Jam), competitive landscape including existing Kruger apps, NGO partner candidates and why SAWC was chosen, original tech stack analysis (Flutter/Unity considered before locking on Next.js), educational angle and CAPS curriculum alignment, donation tier theory, partnership landscape, risks, and the original go-to-market phasing.

3. **SAWC_K9_Game_Kruger_Briefing.md** (clue system source material)
   Deep Kruger National Park research used to design the map and clue system. Covers: geographic overview, rivers and water systems, geology with spatial distribution by region, vegetation biomes, range-restricted animal species (the best clue mechanics), climate gradient, archaeological and historical features, place-name etymology, the 8 game zones with signature clues, and worked clue examples across 10 categories.

## Locked decisions (quick reference)

- NGO partner: Southern African Wildlife College (SAWC) K9 Unit
- Audience: SA market (residents + tourists), kids/schools (CAPS-aligned)
- Single-player only in v1, no shared pins or clues
- Sponsor model: NO logos in gameplay. Coupon codes shared via sponsor channels (e.g. 5FM breakfast show). Single quiet Our Allies tab in menu lists sponsors as plain text.
- Tech stack: Next.js 15 App Router, TypeScript, Tailwind v4, Rubik font, Vercel hosting
- Real payments out of scope for v1 (Ozow-mimic fake checkout); real Ozow + PayFast in v2
- Standing instruction: never use em dashes in any written content

## Outstanding research areas (next briefs to commission)

See section 19 of the handover doc. Four open scopes: deep game mechanics + customer flow, promo strategy, sponsor partnerships, asset creation pipeline. Each has clarifying questions Mike still needs to answer before launching the next research wave.

## Next action

The fastest path forward:

1. Confirm the handover doc is accurate and complete with Mike
2. Decide on the four scope questions in section 19
3. Begin the day-1 build plan in section 18 in parallel with answering the section 17 questions to SAWC

The hardest dependency is not technical: SAWC's review of the 18 round-1 clues and sign-off on the funding-equivalent copy. Start that conversation on day one.
