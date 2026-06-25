# Changelog

## 2026-06-25: Ranger selection feature

Added a five-ranger roster and a parallel character-selection step. The player now chooses both a ranger (their avatar) and a dog (their companion), on two separate onboarding screens: ranger first, then dog. The five rangers are Grace, Sabata, Vince, Rubaina and Shakier, a lineup that reflects the real demographic of SAWC field rangers (Grace anchored on real ranger Precious Malapane). Rangers are cosmetic only in v1, with no mechanical bonus; the dog still provides the gameplay effect. Shared visual spec: olive-green field uniform, brown boots, bush hat or field cap, binoculars on a leather strap, no firearms, no insignia, no logos.

Screen count rose from 28 to 29 (new `/onboarding/ranger`). The origin story gained a fifth chat-bubble card ("First, choose your ranger. Then, choose your dog.").

Documents updated: `Information/SAWC_K9_PIN_DROP_HUNT_HANDOVER.md` (section 9 screen inventory and totals, section 9.2 origin story, new section 9.3 ranger selection with dog selection renumbered to 9.4, section 13 data model with a rangers table and players.ranger_id, pitch demo flow, hardcoded/seed lists, 7-day build plan, asset pipeline), `Information/SAWC_K9_Strategic_Validation_Briefing.md` (core-loop description), `Information/SAWC_K9_Game_Kruger_Briefing.md` (narrative hook), `README.md` (onboarding flow).

Note: the live prototype code does not yet implement ranger selection. Adding the `/onboarding/ranger` screen, a `rangers` seed, and the `rangerId` store field is a separate follow-up.

## 2026-06-25: Dog roster

Dog roster updated from 4 to 5 dogs. Added Dotty (American Coonhound, mother of SAWC home-bred pack). Corrected Banjo's breed from generic "Texan coonhound cross" to "English Foxhound × American Bluetick Coonhound cross" per SAWC's published kennel composition. Scout (Bloodhound) and Pepper (Springer Spaniel) reframed as "guest dogs cross-training with SAWC" for accuracy.

Documents updated: `Information/SAWC_K9_PIN_DROP_HUNT_HANDOVER.md` (section 9.3 dog selection, section 3.2 unit structure, data model dog ids, visual design breed notes, pitch demo step 5, seed-data table, 7-day build plan day 2, open questions, asset pipeline), `Information/SAWC_K9_Strategic_Validation_Briefing.md` (unit structure breed composition, MVP scope dog count), `Information/SAWC_K9_Game_Kruger_Briefing.md` (SAWC K9 narrative hook and dog-class role mapping).

Note: the live prototype code (`src/data/dogs.ts` and the onboarding dog picker) still ships the original 4 dogs. Adding Dotty to the app is a separate follow-up.
