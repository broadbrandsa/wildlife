# SAWC K9 Pin-Drop Hunt: complete handover document

**Project:** Mobile conservation fundraising game for the Southern African Wildlife College (SAWC) K9 Anti-Poaching Unit
**Working title:** SAWC K9 Pin-Drop Hunt
**Owner:** Mike, BroadBrand
**Date:** May 2026
**Document purpose:** Single source of truth for Cowork (or any team picking up the project) covering every decision, all research, and every open question to date. Read top to bottom; nothing else needed to keep building.

> Style note: This document avoids em dashes throughout, per Mike's standing instruction.

---

## Table of contents

1. [Concept summary](#1-concept-summary)
2. [Locked decisions](#2-locked-decisions)
3. [NGO partner: Southern African Wildlife College (SAWC) K9 Unit](#3-ngo-partner-southern-african-wildlife-college-sawc-k9-unit)
4. [Strategic validation: market and competitive landscape](#4-strategic-validation-market-and-competitive-landscape)
5. [Kruger National Park: geography, ecology, and clue zones](#5-kruger-national-park-geography-ecology-and-clue-zones)
6. [Clue bank: worked examples by category](#6-clue-bank-worked-examples-by-category)
7. [Eight game zones](#7-eight-game-zones)
8. [v1 prototype specification](#8-v1-prototype-specification)
9. [Player customer journey: 29 screens](#9-player-customer-journey-29-screens)
10. [Game mechanics and economy](#10-game-mechanics-and-economy)
11. [Coupon code and sponsor clue mechanic](#11-coupon-code-and-sponsor-clue-mechanic)
12. [Visual design direction](#12-visual-design-direction)
13. [Architecture and data model](#13-architecture-and-data-model)
14. [Pitch demo flow](#14-pitch-demo-flow)
15. [Risks and compliance](#15-risks-and-compliance)
16. [v2 roadmap](#16-v2-roadmap)
17. [Open questions for SAWC](#17-open-questions-for-sawc)
18. [Suggested next 7 days for the build team](#18-suggested-next-7-days-for-the-build-team)
19. [Outstanding research areas (next briefs)](#19-outstanding-research-areas-next-briefs)
20. [Source list](#20-source-list)

---

## 1. Concept summary

Mobile, single-player game where the player acts as a Southern African Wildlife College (SAWC) K9 Unit ranger with a dog companion, hunting a fictional poacher hidden at a predetermined location on a stylised custom-illustrated map of Kruger National Park.

The poacher's location is set by SAWC for each round (rounds run roughly 3 months). Players drop a pin at any time during the window to guess the location; closest pin at round end wins. Educational clues drip-feed across the round and tie to real Kruger geography, geology, biomes, and species. All donations go to the SAWC K9 Anti-Poaching Unit.

The game intentionally avoids visible corporate branding during gameplay. Sponsors instead share coupon codes via their own channels (radio shows, social posts, websites, events). Players who hear or see the code enter it in-app to unlock that sponsor's exclusive clue. A single quiet "Our Allies" tab in the menu lists sponsors as plain text. Players are never pushed to it.

The visual style and clue system are anchored in real Kruger's spatial distribution of features (rivers, koppies, biomes, species), so a researching player can genuinely solve clues by learning Kruger.

---

## 2. Locked decisions

These have been confirmed in conversation and should not be revisited unless explicitly reopened.

| Decision | Locked answer |
|---|---|
| NGO partner | Southern African Wildlife College (SAWC) K9 Unit |
| Target audience | Local SA market (residents and tourists) plus kids/schools (CAPS-aligned) |
| Player progression | Single-player. Players cannot see other players' clues or pins |
| Monetisation | Pure donation model. Free play with limited clues. Donations purchase in-game equipment that unlocks more clues or improves the hunt |
| Round structure | Limited time, roughly 3 months per round, with a predetermined poacher location set by SAWC |
| Pin-drop mechanic | Player can drop pin any time in the round, can change pin until 48 hours before round end (hard lock) |
| Map | Custom-illustrated, stylised. NOT a replica of real KNP, but spatially faithful so real-world research solves clues |
| Sponsor model | NO corporate logos in gameplay. Sponsors share coupon codes via their own channels. One quiet "Our Allies" tab in menu lists sponsors as plain text |
| Sponsor on-channel activation | Example: 5FM has a real KNP ranger as breakfast-show guest, presenters announce the coupon code on-air, listeners enter the code in-app to unlock that sponsor's clue |
| Prototype platform | Real working Next.js 15 app, hosted on Vercel, sponsors play it on their phone in pitch meetings |
| Tech stack | Next.js 15 App Router, TypeScript, Tailwind CSS v4, Rubik font, Vercel (matches Mike's PulseApp standard) |
| Real payments in v1 | Out of scope. Entire payment journey UI-complete with fake checkout |
| Demo state | Day 1 of Round 1 (fresh first-launch experience) |
| v1 admin scope | Out of scope. Player-only build for v1 |
| Standing user instruction | Never use em dashes in any content or written work |

---

## 3. NGO partner: Southern African Wildlife College (SAWC) K9 Unit

### 3.1 Why SAWC

The original brief said "Southern African Wildlife Foundation (SAWF)", which does not exist as a registered organisation. Three candidates were investigated:

1. Southern African Wildlife College (SAWC)
2. South African National Parks (SANParks) directly
3. SANParks Honorary Rangers (SHR), specifically its K9 Project Watchdog volunteer fundraising arm

After review, SAWC was confirmed as the partner. SAWC is a non-profit established 1996, based 10 km west of Kruger near Orpen/Hoedspruit. It directly operates its own K9 Unit and free-running hound pack supporting the Greater Kruger area (including Balule, Timbavati, Klaserie and Umbabat private reserves). SAWC has trained more than 18,000 students from 56 countries.

Sources: [SAWC K9 Unit](https://wildlifecollege.org.za/k9-unit/); [International Rhino Foundation](https://rhinos.org/blog/expanding-support-for-k9-units-and-training-in-southern-africa/); [SAWC Field Ranger Training](https://wildlifecollege.org.za/field-ranger-training/).

### 3.2 SAWC K9 unit structure

- Established 2015 with funding from WWF Nedbank Green Trust
- ~21 dogs by 2018, expanded with the addition of Texan-born free-running hounds (donated by houndsman Joe Braman in 2018, with the relocation funded by the Ivan Carter Wildlife Conservation Alliance)
- SAWC-confirmed breeds: Belgian Malinois (apprehension and detection), plus a home-bred free-running pack of English Foxhound × Bluetick Coonhound crosses, American Black and Tan Coonhounds, Bluetick Coonhounds and a Beagle cross, all running off-leash at up to 40 km/h
- Wider Greater Kruger K9 ecosystem (not SAWC's own kennel): cold-spoor Bloodhounds used by the SANParks Kruger unit, and detection Springer Spaniels worked at park gates for ammunition, horn and pangolin scales. The game represents these as guest dogs cross-training with SAWC
- Dog Master: Johan van Straaten
- CEO: Theresa Sowry
- Operational stats: between Feb 2018 and Dec 2019, deployed 120 times, arrested 134 poachers, seized 55 weapons
- Apprehension rate with dogs: 54-68% versus 3-5% without
- Key existing donors: WWF Nedbank Green Trust, IFAW, International Rhino Foundation ($100,000 grant), Ivan Carter Wildlife Conservation Alliance, Garmin (tracking collars), Foundation Hans Wilsdorf, Tusk Trust, Chamberlain Foundation Trust
- In-kind partners: Pack Leader Pet Products, Rogz, Howard G. Buffett Foundation, Hill's Pet Nutrition (Hill's also feeds 46 dogs in the SANParks K9 Unit in Kruger separately)

### 3.3 SAWC funding needs (real costs anchoring donation tiers)

| Item | Indicative cost |
|---|---|
| Two dog vaccinations | ~R200 (~£10) |
| SAWC K9 monthly dog food budget | ~R20,000 / month for the whole unit |
| SAWC K9 2025 healthcare fund goal | R175,000 for the year (R500/dog/month) |
| Full K9 care (Global Conservation Force benchmark) | ~US$310 / month per dog |
| Trained working dog (global benchmark) | US$15,000-120,000 depending on skills |
| 6-week anti-poaching ranger training | ZAR 42,000-52,000 |
| Experienced field ranger monthly salary | ZAR 12,000-20,000; K9 handler R20,000-40,000 |
| Comrades Race4Charity 2024 yield | R1.5 million funded K9 kennel upgrades plus two Bloodhounds (Yoris and Khargi) for Kruger |
| Ranger handheld GPS (SAWC published) | ZAR 2,400 |
| Leadership bursary (SAWC published) | ZAR 15,500 |

These figures anchor the in-game equipment shop pricing.

### 3.4 Operating context: rhino poaching urgency

In 2025, 352 rhinos were poached nationally (a 16% decline overall), but Kruger specifically saw poaching nearly double from 88 (2024) to 175 (2025), its worst year on record. Seven Ranger Services employees at Kruger were dismissed following polygraph testing linked to the December 2024-2025 surge.

Sources: [The Citizen](https://www.citizen.co.za/news/south-africa/good-news-for-south-africas-rhino-poaching-fight-but-alarm-bells-at-kruger-national-park/); [SA News](https://www.sanews.gov.za/south-africa/poaching-declines-16/); [Africanews](https://www.africanews.com/2026/02/12/rhino-poaching-in-south-africas-kruger-park-doubles-despite-national-drop/).

This is a live, media-relevant crisis that gives the launch a credible urgency frame.

---

## 4. Strategic validation: market and competitive landscape

### 4.1 South African mobile gaming market

- ~US$134 million (R2.4 billion) projected 2025
- 18+ million mobile gamers in SA
- 75% of SA gamers identify smartphones as preferred gaming device (vs 42.5% PC, 29.7% console)
- 91% of African gamers identify mobile as primary platform (2025 GeoPoll/Pan Africa Gaming Group report, 6,000 players surveyed across 6 countries)
- 59% have made purchases after in-game advertising
- Strong cultural appetite: more than 50% of African players want more African settings and Black characters
- SA market specifically: 26.5 million players at 44% penetration; mobile = 91% of gaming spend
- 9% handset excise duty eliminated April 2025, widening entry-level funnel

Sources: [Meltwater](https://www.meltwater.com/en/blog/mobile-gaming-in-south-africa-2025); [Games Industry Africa](https://gamesindustryafrica.com/2025/12/10/new-2025-gaming-in-africa-report-reveals-mobile-first-market-and-strong-demand-for-cultural-representation/); [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/africa-gaming-market).

### 4.2 Comparable conservation games

- **Sea Hero Quest** (Glitchers/Deutsche Telekom/Alzheimer's Research UK): 4.3 million players, 117 combined years played, dementia research data 176x faster than lab. 9 Cannes Lions in 2016. Single biggest proof point that cause-led mobile games can reach mass audience with corporate co-marketing partnership.
- **Internet of Elephants**: Wildeverse (AR), Safari Central, Unseen Empire. Closest conceptual precedent. Peer-reviewed RCT (Dunn et al., 2021, *People and Nature*) showed Wildeverse shifted pro-conservation attitudes more effectively than watching BBC's *Primates* documentary.
- **Smithsonian Zoo Guardians** (with JumpStart Games): age 9+, education-plus-fundraising template
- **Green Game Jam** (Google Play with UNEP Playing for the Planet Alliance): 11 studios, 250 million players. Notable: Creative Mobile Games' Zoocraft raised US$14,410 for Wolf Conservation Trust; Supercell's Boom Beach: Turtle Division funded Sea Turtle Conservancy
- **WDC Games for Waves**: streaming-and-gaming model via Tiltify and Twitch
- **Save a Rhino**, **Beyond Blue**, **Terra Nil**, **Crab God: Mother of the Tide** (Chaos Theory Games): ecological education layer references

Caveat: no conservation game has yet hit mainstream-smash status. Several analyses note the difficulty of combining narrative closure with long-term retention. Plan accordingly.

### 4.3 Existing Kruger app ecosystem (whitespace analysis)

- **Latest Sightings**: 7.16 million followers on Kruger Facebook page; app shows real-time wildlife sightings, offline capability, push notifications. Subscription model on Google Play with mixed reviews
- **KrugerExplorer App**: 700+ species profiles, 70+ guided routes, offline-capable
- **Kruger Animal Tracker**: ~$6 SA / $10 international
- **Africam**: live webcams
- **Official SANParks app**

Strategic implication: no existing Kruger app is a game, none is fundraising-led. Genuine whitespace.

### 4.4 Closest fundraising precedent in SA

"Making CONTACT": five-part Hill's Pet Nutrition mini-series with Project Watchdog, Ezemvelo KZN Wildlife and SANParks, directing donations to K9 units, paired with GivenGain crowdfunding (used by SAWC). "Our Horn is NOT Medicine", Blankets for Baby Rhinos (UK), Save the Rhino International also active on this beneficiary.

Sources: [Wildlife Act](https://www.wildlifeact.com/blog/making-contact-paws-and-boots-together-on-the-ground-fighting-poaching); [Hills Transforming Lives](https://www.hillstransforminglives.co.za/making-contact/the-national-parks-featured); [SAWC Field Ranger Training](https://wildlifecollege.org.za/field-ranger-training/); [Good Things Guy](https://www.goodthingsguy.com/environment/kriger-nationa-park-k9-unit-rebuild/).

### 4.5 SA giving infrastructure

- **PayFast**: hosts thousands of registered SA non-profits including WWF South Africa, CHOC, SADAG, Reach for a Dream. Free NPO onboarding, no monthly/setup fees. Card 3.2% + R2 / Instant EFT 2%
- **Ozow**: NGO/Social package = 0% fees for qualifying nonprofits under R1m/month
- **SnapScan**: from 2.95% ex VAT, micro-donation friendly
- **Peach Payments / Paystack**: tokenised recurring donations
- **Apple Pay + Google Pay** via PayFast for low-friction checkout

---

## 5. Kruger National Park: geography, ecology, and clue zones

This is the deep park research used to design the map and clue system.

### 5.1 Geographic and topographic overview

- ~19,485 km² (some sources cite 20,000 km²); roughly the size of Wales or Israel
- 360 km north-to-south, average 65 km east-to-west, max ~90 km wide
- Eastern boundary: Lebombo Mountains, the international border with Mozambique
- Northern boundary: Limpopo River, border with Zimbabwe
- Part of Greater Limpopo Transfrontier Park (with Limpopo NP Mozambique and Gonarezhou Zimbabwe)
- Altitude: ~140m on eastern plains to ~839m at Khandizwe (highest peak)
- 10 main entry gates: Pafuri, Punda Maria, Phalaborwa, Orpen, Paul Kruger, Numbi, Phabeni, Malelane, Crocodile Bridge, Giriyondo
- 12 main rest camps: Berg-en-Dal, Crocodile Bridge, Letaba, Lower Sabie, Mopani, Olifants, Orpen, Pretoriuskop, Punda Maria, Satara, Shingwedzi, Skukuza
- 5 bushveld camps: Bateleur, Biyamiti, Shimuwini, Sirheni, Talamati
- ~1,800 km of roads. Spine: H1 (Malelane to Pafuri). Famous loops: S100 (predator hotspot east of Satara), H4-1 (Skukuza-Lower Sabie along the Sabie)

Five regions:
1. **Far North / Pafuri** (Punda Maria to Limpopo): most biodiverse, least visited, riverine forest, fever trees, baobabs, sandstone gorges, Crook's Corner
2. **North / Shingwedzi**: vast mopane woodlands, big elephant country, Red Rocks
3. **Central / Olifants-Satara**: open savanna, lion country, knob-thorn/marula
4. **South / Skukuza-Lower Sabie-Berg-en-Dal**: busiest, most developed, Sabie River
5. **South-west / Pretoriuskop-Malelane**: highest rainfall, sourveld, granite koppies, sable country

### 5.2 Rivers (all east-flowing)

| River | Flow context | Notable features |
|---|---|---|
| Limpopo | Far north border | Border with Zimbabwe |
| Luvuvhu | Pafuri, joins Limpopo at Crook's Corner | Fever tree forests, Pel's fishing owl, samango monkey, Plateosauravus dinosaur fossils |
| Shingwedzi | Northern, joins Limpopo system in Mozambique | Red Rocks viewpoint, Kanniedood Dam |
| Letaba | Joins Olifants | Engelhard Dam, Letaba camp Elephant Hall |
| Olifants | Central spine, 560 km, joins Limpopo as Rio dos Elefantes | Olifants Gorge, most iconic gorge view |
| Timbavati | Joins Olifants | White lion sightings historically |
| Sabie | Southern, joins Incomati in Mozambique | 49 fish species, leopard corridor, H4-1 road |
| Crocodile | Southern border | Border, Komatipoort exit |

Notable dams: Engelhard, Kanniedood, Nsemani, Sunset, Mlondozi, Orpen, Kumana, Pioneer.

### 5.3 Geology (CRITICAL for clue system)

Fundamental rule: granites dominate WEST, basalts dominate EAST, rhyolite forms LEBOMBO ridge, sandstones in FAR NORTH.

| Rock type | Colour | Region | Signature landscape | Key species |
|---|---|---|---|---|
| Granite/gneiss | Grey, pinkish-grey | Southwest, west | Rounded koppies, sourveld | Sable, reedbuck |
| Basalt | Dark chocolate, weathers black | Central-east plains | Flat open grassland | Lion, cheetah, zebra, wildebeest |
| Rhyolite | Reddish-brown to grey | Lebombo ridge (east) | Steep rocky ridge | Klipspringer, Verreaux's eagle |
| Sandstone (Red Rocks) | Deep red, iron-stained | Shingwedzi area, Pafuri | Weathered outcrops, cliffs | Klipspringer, rock hyrax |
| Karoo sediments | Cream, grey | Central-north | Low ridges | Mixed woodland |
| Phalaborwa carbonatite | Mixed | Central-west (Phalaborwa) | Mine visible from park | Not zone-specific |

Granite units:
- Nelspruit Granite Suite (south, koppies around Pretoriuskop, Berg-en-Dal, Skukuza)
- Makhutswi Gneiss (central-west, Orpen-Satara)
- Goudplaats Gneiss (north, Mopani-Letaba)
- Tshombo Granite (deep north-west near Punda Maria)

Far north sandstones (Soutpansberg Group): produce Red Rocks viewpoint on the Shingwedzi (literal "red rock" answer to the clue example), Lanner Gorge, Thulamela hill.

### 5.4 Vegetation zones

| Zone | Where | Anchor species |
|---|---|---|
| Mopane woodland and shrubveld | North of Olifants | Elephant, buffalo, impala, kudu |
| Thorn thickets | Olifants-Letaba | Mixed |
| Knob-thorn / marula savanna | Central (Satara country) | Lion, zebra, wildebeest, buffalo, giraffe, kori bustard |
| Combretum-Terminalia woodland | Southwest | Mixed |
| Sourveld | Pretoriuskop (highest rainfall) | Sable, reedbuck, mountain reedbuck, oribi |
| Riverine / gallery forest | Along all perennial rivers | Bushbuck, nyala, narina trogon |
| Pafuri sandveld and fever tree forest | Far north | Samango monkey, Sharpe's grysbok, Pel's fishing owl, mottled spinetail, racket-tailed roller |
| Lebombo bushveld | East ridge | Klipspringer, Verreaux's eagle |
| Floodplain grassland | Luvuvhu, Limpopo banks | Buffalo, elephant, kudu, bushbuck |

Distinctive trees: baobab (north of Olifants), fever tree (Vachellia xanthophloea, Luvuvhu), nyala-tree/mashatu (Luvuvhu), lala palm (Pafuri), wild date palm (riverine), sycamore fig, tamboti (SW), silver cluster-leaf (Pretoriuskop), knob-thorn and marula (central), mopane (north), leadwood (riverine giants).

### 5.5 Range-restricted animals (best clue power)

| Species | Where (game-clue level) |
|---|---|
| Samango monkey | Pafuri riverine forest only |
| Sharpe's grysbok | Far north only |
| Suni antelope | Pafuri thickets only (very rare) |
| Sable antelope | Pretoriuskop sourveld, Nhlanguleni, Pafuri |
| Roan antelope | Northern plains (Babalala, Nshawu, Mooiplaas) |
| Tsessebe | Basalt plains (S100/Satara/Nwanetsi) |
| Nyala | Luvuvhu, Letaba, Shingwedzi riverine (north) |
| Klipspringer | Rocky koppies, Lebombo |
| Pel's fishing owl | Luvuvhu/Pafuri, lower Letaba, Shingwedzi |
| Racket-tailed roller | Far north mopane |
| Mottled spinetail | Pafuri fever tree forest |
| Cape vulture | Lebombo cliffs (rare) |
| Narina trogon | Dense riverine (Sabie, Luvuvhu) |
| Kori bustard | Open basalt plains (S100, Satara) |

### 5.6 Climate gradient

- Rainfall: 750mm SW (Pretoriuskop) -> 400mm NE (Pafuri/Lebombos)
- Summer Nov-Mar: rains, migrant birds arrive (European rollers, Wahlberg's eagles)
- Winter Jun-Aug: dry, game concentrates at water, intense impala rut
- Spring Sep-Oct: tension at waterholes; first rains end October

Seasonal clues anchor both time and place.

### 5.7 Archaeological and historical features

- **Thulamela** (far north sandstone hill near Pafuri): Late Iron Age, Venda gold artefacts, Great Zimbabwe/Mapungubwe trade network
- **Masorini** (Phalaborwa Gate): Iron Age smelting village, BaPhalaborwa
- **Albasini Ruins** (Phabeni): 19thC Portuguese trader João Albasini
- **Makahane Ruins** (north of Punda Maria): Makuleke history
- **Shirimantanga Koppie** (Skukuza): James Stevenson-Hamilton's ashes scattered here
- **Crook's Corner** (Luvuvhu-Limpopo confluence): 19thC smugglers' refuge, triple-border trick
- **Stevenson-Hamilton Memorial Library** (Skukuza)
- **Jock of the Bushveld route** (south-west, Afsaal area)

### 5.8 Place-name etymology (clue category)

| Name | Language | Meaning |
|---|---|---|
| Skukuza | Tsonga | "He who sweeps clean" (Stevenson-Hamilton's nickname) |
| Nwanetsi | Tsonga | "Place where snakes drink" |
| Letaba | Tsonga | "River of sand" |
| Shingwedzi | Tsonga | "Place of ironstone" |
| Mopane | Northern Sotho/Tsonga | "Butterfly leaf" |
| Punda Maria | Swahili-Afrikaans | "Striped donkey" (zebra) |
| Thulamela | Venda | "Place of giving birth" |
| Masorini | Tsonga | "Iron workers" |
| Satara | Hindi | "Seventeen" (surveyor's plot number) |
| Mathekenyane | Tsonga | "Place of jigger fleas" |
| Sabie | Tsonga | "Fearful" (crocodile danger) |

### 5.9 Famous named features (best clue targets)

Red Rocks Viewpoint (Shingwedzi), Crook's Corner, Pafuri Picnic Spot, Lanner Gorge (150m sandstone canyon cut by Luvuvhu), Olifants Lookout, Nwanetsi Picnic Spot, Tshokwane, Afsaal, Orpen Dam, Mathekenyane, S100 road, H4-1 road, Mananga Loop, Mahonie Loop (Punda baobabs), Engelhard Dam, Nsemani Dam, Sunset Dam, Shirimantanga Koppie, Thulamela, Masorini.

---

## 6. Clue bank: worked examples by category

Each clue's resolved zone is given in brackets. Every clue should teach something verifiable so a researching player can solve it.

### 6.1 Geological

1. *"Kwela the spaniel found a cold campfire on iron-red boulders smoothed by centuries of Shingwedzi floods."* -> Red Rocks, Shingwedzi.
2. *"The ranger's boot prints crossed ancient grey gneiss striped with white quartz, where koppies rise like bald domes above the marula."* -> Makhutswi Gneiss / Satara-Orpen.
3. *"The poacher's fire was built against a sheer rhyolite cliff cooler than the plains, where klipspringers whistled at dusk."* -> Lebombo ridge.
4. *"Basalt turf clung to the Land Cruiser's tyres: dark, cracked and rich. The plains stretched for miles."* -> Central basalt (S100/Satara).
5. *"An ancient baobab cast shadows across cream-coloured sandstone slabs, where dinosaur bones were once found."* -> Pafuri/Luvuvhu.

### 6.2 Hydrological

1. *"At the confluence of three rivers in three countries, the poacher paused and watched a finfoot disappear into the reeds."* -> Crook's Corner.
2. *"The dogs lost the scent where the Letaba meets a bigger river, in a gorge beyond where elephants once bathed."* -> Olifants-Letaba confluence.
3. *"The smoke rose from a bend in the 49-fish river, where leopards hunt beneath the Natal mahoganies."* -> Sabie River.
4. *"She heard water crashing through a 150-metre cliff-lined canyon cut by the river that ends at Crook's Corner."* -> Lanner Gorge.
5. *"A half-submerged boot washed up beside a dam that bears an American industrialist's name on the Letaba."* -> Engelhard Dam.

### 6.3 Botanical

1. *"Yellow-barked trees lined the floodplain. A mottled spinetail flicked between them."* -> Pafuri fever tree forest.
2. *"Silver-leaved trees shimmered in the heat. The dogs panted under sour grasses no antelope would eat."* -> Pretoriuskop sourveld.
3. *"The campfire ashes were mixed with butterfly-shaped leaves turning orange."* -> Mopane (north of Olifants), autumn.
4. *"The poacher had hidden behind the fat grey trunk of a giant so old the San drew it on a rock."* -> Baobab, north of Olifants.
5. *"The marula fruit was fresh under her boots, and the knob-thorn spines drew blood."* -> Central knob-thorn/marula savanna.

### 6.4 Bird

1. *"A large rufous owl stared at the dogs from a sycamore fig overhanging a river in the far north."* -> Pel's fishing owl, Luvuvhu.
2. *"A racket-tailed roller called from a mopane tree, a sound no ranger south of Shingwedzi would recognise."* -> Far north mopane.
3. *"The poacher's footprint was beside the nest of a southern ground hornbill, in open savanna south of the Olifants."* -> Central/southern Kruger.
4. *"Cape vultures circled a kill on the rhyolite ridge where the border fence runs."* -> Lebombo ridge.
5. *"A lemon-breasted canary perched on a lala palm, a scene found only in the northern floodplains."* -> Luvuvhu floodplain.

### 6.5 Mammal

1. *"Samango monkeys barked from the canopy, a sound heard only in the park's northernmost forests."* -> Pafuri.
2. *"A herd of roan antelope watched from the distance, north of Letaba."* -> Northern roan plains.
3. *"Sable antelope ran through silver cluster-leaf trees beside a sour grassland."* -> Pretoriuskop.
4. *"A Sharpe's grysbok darted across a bushwillow path near an ancient stone citadel."* -> Pafuri, near Thulamela.
5. *"Tsessebe kicked up dust on a basalt plain where the S100 begins."* -> Satara/Nwanetsi.

### 6.6 Archaeological / historical

1. *"The dogs halted at the base of a hill where Venda kings were once buried in gold."* -> Thulamela.
2. *"Old iron slag crunched underfoot at the site where the BaPhalaborwa smelted metal a thousand years ago."* -> Masorini.
3. *"The smoke drifted past the plaque marking where a warden's ashes were scattered beside a koppie near the Sabie."* -> Shirimantanga Koppie.
4. *"The poacher camped near the ruins of a trading post belonging to a 19th-century Portuguese hunter."* -> Albasini Ruins.
5. *"A broken wagon wheel from the Jock of the Bushveld era lay half-buried on the old transport road from Paradise Camp."* -> Afsaal.

### 6.7 Cultural / linguistic

1. *"The ranger said it was near 'the place where snakes come to drink'."* -> Nwanetsi.
2. *"The camp bears the name of the man 'who swept clean' the old hunters from the reserve."* -> Skukuza.
3. *"The poacher hid at a camp named for a surveyor's plot number 17."* -> Satara.
4. *"The gate's name is a Swahili-Afrikaans hybrid meaning 'striped donkey'."* -> Punda Maria.
5. *"They headed for 'the river of sand' before the Shingwedzi confluence."* -> Letaba.

### 6.8 Ranger / operational

1. *"The SAWC free-running pack tracked 18 km east from base before losing scent at the Timbavati River boundary."* -> Timbavati-Kruger junction (near Orpen).
2. *"The closest rest camp to the K9 base is the gate with a family-donated name."* -> Orpen.
3. *"A helicopter spotted smoke 42 km north-east of Olifants camp, close to where mopane meets the Lebombo."* -> Central-east mopane.

### 6.9 Weather / seasonal

1. *"It had just rained 35 mm overnight, a typical summer figure for the park's wettest camp."* -> Pretoriuskop.
2. *"The dry northern air carried the smell of smoke westward from the Mozambique border."* -> Lebombo ridge.
3. *"European rollers had just arrived from the north, and the tamboti trees were flushing green. It was late October."* -> Seasonal cue (Oct-Mar).
4. *"Morning frost on the ground meant the poacher's fire had burned through the coldest night of the year, in July, in the southern high country."* -> Berg-en-Dal/Malelane, winter.

### 6.10 Astronomical

1. *"The Southern Cross hung above a jagged rhyolite ridge at 9 pm in June."* -> Lebombo.
2. *"At midnight in July, Canopus set behind the mopane, and the poacher moved."* -> Northern, winter.

---

## 7. Eight game zones

The map is divided into 8 zones for the clue system. Each zone has unique geology, vegetation, signature species, named features, and a "signature clue" that unambiguously points there.

### Zone 1: Far North (Pafuri / Makuleke / Luvuvhu)
- **Boundaries:** North of the Luvuvhu-Limpopo confluence, including Crook's Corner
- **Geology:** Sandstone (Soutpansberg Group), red-orange outcrops
- **Vegetation:** Fever tree forest, baobab, nyala-berry, lala palm, riverine forest
- **Diagnostic species:** Samango monkey, Sharpe's grysbok, suni, nyala (high density), Pel's fishing owl, mottled spinetail, racket-tailed roller, crested guineafowl, African finfoot
- **Named features:** Pafuri Picnic Spot, Crook's Corner, Lanner Gorge, Thulamela, Makuleke Contract Park
- **Signature clue:** *"A samango monkey barked from a yellow-barked tree above the confluence of three countries."*

### Zone 2: Northern Sandveld & Punda Maria (Mahonie Loop)
- **Boundaries:** South of the Luvuvhu, around Punda Maria, north to the Shingwedzi junction
- **Geology:** Sandveld over sandstone, some granite
- **Vegetation:** Sandveld mopane, baobabs, cluster-leafs
- **Diagnostic species:** Eland, occasional roan, tsessebe, Arnot's chat, racket-tailed roller, three-banded courser
- **Named features:** Punda Maria, Mahonie Loop (famous baobabs), Dimbo koppie, Makahane Ruins
- **Signature clue:** *"The dogs found tracks along a loop road named for an ironwood, near a camp whose name means 'striped donkey'."*

### Zone 3: Mopane Plains & Shingwedzi (Red Rocks zone)
- **Boundaries:** South of Punda Maria to the Letaba River, including Mopani and Shingwedzi rest camps
- **Geology:** Karoo sediments, Clarens sandstone, Soutpansberg sandstone (Red Rocks)
- **Vegetation:** Mopane woodland and shrubveld, occasional baobab
- **Diagnostic species:** Elephant (large herds), tsessebe, roan, cheetah (Nshawu), bateleur, Meves's starling, ground hornbill
- **Named features:** Red Rocks viewpoint, Kanniedood Dam, Shingwedzi camp, Mopani camp, Pioneer Dam
- **Signature clue:** *"Iron-red boulders rose above the Shingwedzi where elephants cooled in the river below."*

### Zone 4: Letaba & Olifants Gorge
- **Boundaries:** Between Letaba and Olifants rest camps, to the Olifants-Letaba confluence
- **Geology:** Karoo sediments, Goudplaats Gneiss, basalt encroaching from east
- **Vegetation:** Mopane transitioning to mixed woodland, riverine along both rivers
- **Diagnostic species:** Elephant, hippo, crocodile, Pel's fishing owl on lower Letaba, Verreaux's eagle (gorge cliffs), tigerfish
- **Named features:** Olifants camp (gorge views), Letaba camp (Elephant Hall), Engelhard Dam, Olifants Gorge
- **Signature clue:** *"From a camp high above a gorge, the K9 team spotted smoke where two rivers finally meet."*

### Zone 5: Central Basalt Plains (Satara / Orpen / S100)
- **Boundaries:** Olifants River south to Tshokwane, between Orpen Gate and the Lebombo
- **Geology:** Basalt, some Karoo sediments
- **Vegetation:** Knob-thorn / marula savanna, open golden grassland
- **Diagnostic species:** Lion (highest density), cheetah (open plains), wild dog occasional, kori bustard, lappet-faced vulture, martial eagle, secretary bird, tsessebe
- **Named features:** Satara, Orpen, Orpen Dam, Nsemani Dam, Kumana Dam, Timbavati picnic spot, S100 road, Mananga Loop
- **Signature clue:** *"The pride roared on the black basalt plain east of the camp surveyors named 'Seventeen'."*

### Zone 6: Lebombo & Nwanetsi (Eastern Ridge)
- **Boundaries:** The rhyolite Lebombo ridge along the Mozambique border
- **Geology:** Rhyolite, eastern basalt foothills
- **Vegetation:** Lebombo ironwood, Euphorbia confinalis, bushwillow, rocky grassland
- **Diagnostic species:** Klipspringer, Verreaux's eagle, Cape vulture (rare), leopard on kopjes, flat lizards, rock hyrax
- **Named features:** Nwanetsi picnic site and koppie, Singita Lebombo concession, Giriyondo border gate
- **Signature clue:** *"Klipspringers whistled on rhyolite boulders as the border fence shimmered in the distance."*

### Zone 7: Southern Sabie & Lower Sabie (Leopard Corridor)
- **Boundaries:** Olifants Gorge south to the Crocodile River, bounded by Skukuza-Lower Sabie H4-1 corridor
- **Geology:** Nelspruit Granite Suite, basalt near Lower Sabie
- **Vegetation:** Mixed woodland, riverine forest, thicket; sycamore figs, jackalberry, Natal mahogany
- **Diagnostic species:** Leopard (very high density), lion, elephant, hippo, narina trogon, saddle-billed stork, African finfoot
- **Named features:** Skukuza, Lower Sabie, Sunset Dam, H4-1 road, Shirimantanga Koppie, Mathekenyane, Tshokwane, Mlondozi Dam, Nkuhlu picnic spot
- **Signature clue:** *"A leopard dragged her kill into a jackalberry above a dam that glows orange at sunset, near the camp whose name means 'he who sweeps clean'."*

### Zone 8: South-West Granite Highlands (Pretoriuskop / Berg-en-Dal / Malelane)
- **Boundaries:** South-west corner from Pretoriuskop through Berg-en-Dal to Malelane Gate
- **Geology:** Nelspruit Granite Suite (many koppies)
- **Vegetation:** Sourveld, silver cluster-leaf woodland, granite koppie thicket
- **Diagnostic species:** Sable antelope (best population), mountain reedbuck, reedbuck, oribi, grey hornbill, black-collared barbet
- **Named features:** Pretoriuskop (oldest camp), Berg-en-Dal, Malelane Gate, Numbi Gate, Phabeni Gate, Afsaal, Albasini Ruins, Manungu Koppie, Shitlhave Dam
- **Signature clue:** *"Sable bulls grazed under silver-leaf trees in the camp where Jock of the Bushveld once travelled."*

### 7.1 Difficulty curve across a 3-month round

| Period | Clue type | Specificity |
|---|---|---|
| Month 1 (days 1-30) | Zone-level | Narrows to 1 of 8 zones |
| Month 2 (days 31-60) | Feature-level | Narrows to a named feature within zone |
| Month 3 (days 61-90) | Specific-pin level | Within ~5km of poacher pin |

### 7.2 Suggested Round 1 poacher location candidates

Red Rocks (Shingwedzi), Lanner Gorge, Crook's Corner, Shirimantanga Koppie, N'wanetsi koppie, Masorini. Final choice should be made by SAWC.

---

## 8. v1 prototype specification

### 8.1 What the prototype is

A real, working Next.js 15 application using App Router and TypeScript, hosted on Vercel, that sponsors can play on their phones during pitch meetings. Real payments are not in scope but the entire payment journey must be UI-complete with a fake checkout (Section 18A receipt preview and all).

### 8.2 What's in scope

- Player journey end-to-end (29 screens, see section 9)
- Game mechanics (pin drop, equipment shop, clue release)
- Coupon code system with three demo sponsor codes
- Our Allies page (plain text, no logos)
- Fake Ozow-mimic checkout
- Day 1 of Round 1 demo state
- `/__demo` reset utility for back-to-back pitches

### 8.3 What's out of scope for v1

- Real payments (Ozow, PayFast, Yoco): wired in v2
- SAWC admin portal: v2
- Sponsor self-service portal: v2
- Real Apple Pay nonprofit approval: v2
- Capacitor native shell for App Store: v2
- Multi-language: v2
- Full POPIA consent flow with audit trails: v2 (but data minimisation applied in v1)
- Real-time leaderboard: v2

---

## 9. Player customer journey: 29 screens

The player passes through 29 distinct screens between first launch and round-end. The flow is intentionally linear for the first session (so a sponsor at a pitch cannot get lost) and becomes free-roam HUD from session two.

| # | Route | Phase | Purpose |
|---|---|---|---|
| 1 | `/` | Launch | Splash, asset prime |
| 2 | `/welcome` | Onboarding | Hero CTA "Start hunting" |
| 3 | `/onboarding/age` | Onboarding | Birth year picker |
| 4 | `/onboarding/parent` | Onboarding | Parent email gate (under 18 only) |
| 5 | `/onboarding/name` | Onboarding | Display name |
| 6 | `/onboarding/origin` | Onboarding | Chat-bubble origin story (5 cards) |
| 7 | `/onboarding/ranger` | Onboarding | Pick your ranger (5 options) |
| 8 | `/onboarding/dog` | Onboarding | Pick your dog (5 options) |
| 9 | `/clue/first` | Hunt | First clue reveal |
| 10 | `/map` | Hunt | Main HUD, map exploration |
| 11 | `/map/pin` | Hunt | Pin confirm sheet |
| 12 | `/journal` | Hunt | Clue journal list |
| 13 | `/journal/[id]` | Hunt | Single clue card |
| 14 | `/shop` | Shop | Equipment shop with 3 tabs |
| 15 | `/shop/[id]` | Shop | Item detail |
| 16 | `/checkout/[id]` | Shop | Amount confirm |
| 17 | `/checkout/[id]/bank` | Shop | Bank picker (Ozow mimic) |
| 18 | `/checkout/[id]/auth` | Shop | "Open your bank app" loader |
| 19 | `/checkout/[id]/success` | Shop | Receipt + activate |
| 20 | `/codes` | Hunt | Intel Intercept entry (coupon codes) |
| 21 | `/codes/success` | Hunt | Sponsor clue reveal |
| 22 | `/profile` | Meta | Stats and history |
| 23 | `/profile/donations` | Meta | Donation history |
| 24 | `/profile/edit` | Meta | Edit name, ranger, dog |
| 25 | `/allies` | Meta | Our Allies (plain table) |
| 26 | `/round/end` | Hunt | Round-end reveal (3-card sequence) |
| 27 | `/round/winner` | Hunt | Winner reveal (top 50) |
| 28 | `/round/new` | Hunt | New round welcome |
| 29 | `/legal` | Meta | Terms, privacy, Section 36 rules |

Plus a hidden `/__demo` route (env-gated) that resets state and seeds pitch-ready data.

### 9.1 Recommended login approach

**Guest mode by default with optional account upgrade.** First-time player taps "Start hunting" and is given a UUID stored in localStorage. They can play, drop a pin, donate, and enter coupon codes without ever signing in. Only when they want to appear on the public leaderboard or sync across devices do they upgrade. At that point: email magic link first, Google second, Apple third.

Justification: audience is mixed adults and kids on Android-dominant SA networks (Android ~83% share). Forcing Apple SSO at first launch blocks 80% of users; Google SSO breaks the kid-without-parent-Gmail use case; magic link is universal but adds 60 seconds of email-app-switching at the worst possible moment, the pitch demo. Guest mode with optional upgrade is the lowest-friction approach and matches Pokemon GO, Forest, and Sea Hero Quest.

### 9.2 Origin story

A 5-card chat-bubble sequence styled as field-radio messages from "Theresa" (a fictional dispatcher whose name nods to real CEO Theresa Sowry without misrepresenting her).

- Card 1: "There has been an incursion overnight on the western boundary."
- Card 2: "We have a fresh scent. The ranger team is grounded in fog. You and your dog are our best chance."
- Card 3: "Drop a pin where you think the suspect is hiding. Closest guess at round end gets the team in there."
- Card 4: "Welcome to the K9 Unit."
- Card 5: "First, choose your ranger. Then, choose your dog."

Card 5 sets up the two selection screens that follow: ranger first, then dog.

The chat-bubble pattern is borrowed from Internet of Elephants' Wildeverse: cheap, kid-readable, low-data, and avoids cinematic-cutscene cheese.

### 9.3 Ranger selection

The player chooses a ranger character to play as. The ranger is the player's avatar; the dog (next screen) is their companion. Two separate screens: ranger first, then dog.

Five selectable rangers. Ranger choice is **cosmetic only** in v1: it carries no mechanical bonus, since the dog provides the gameplay effect. The choice is purely about player identity and representation.

| Name | Who they are | Heritage | Personality | Background silhouette |
|---|---|---|---|---|
| Grace | Black South African woman | Tsonga/Shangaan, from a community near the Greater Kruger | "Brave, kind, deeply rooted in this land. She knows this bush by heart." | Marula trees |
| Sabata | Black South African man | Sesotho name meaning "leader" or "chief" | "Experienced, calm natural authority, the kind of senior ranger who has trained dozens of others." | Mopane leaves |
| Vince | White South African man | Afrikaner heritage, weathered dog handler | "Focused, intense, the look of a dog handler who reads the bush like a book." | Acacia thorn tree |
| Rubaina | Indian South African woman | KwaZulu-Natal heritage, careful observer | "Thoughtful, sharp-eyed, the quiet competence of someone who earned her place." | Fever tree branches |
| Shakier | Coloured South African man | Western Cape heritage, team morale | "Open, friendly, the morale of the team, with the alert eyes of someone who knows the bush." | Lowveld grass |

The lineup mirrors the real demographic of SAWC field rangers and the wider Greater Kruger anti-poaching community, so any player can see themselves on the team. Grace is anchored on real SAWC ranger Precious Malapane, a Tsonga/Shangaan woman who trains and runs the SAWC free-running hound pack.

Visual consistency across all five: olive-green field uniform with rolled-up sleeves, brown hiking boots, a wide-brim bush hat or peaked olive field cap, and binoculars on a leather strap. No firearms, no military insignia, no logos. Each ranger sits against the background silhouette noted above for quick visual identity.

### 9.4 Dog selection

Five selectable dogs, each tied to a real SAWC K9 role and conferring a small mechanical bonus.

| Dog | Breed | SAWC role | In-game effect | Personality |
|---|---|---|---|---|
| Storm | Belgian Malinois | Apprehension and detection all-rounder | +1 free clue at round midpoint | "Brave, fast, will protect you" |
| Scout | Bloodhound (guest dog from a sister unit, cross-trains with SAWC) | On-leash cold-spoor tracker | Reveals zone-level direction hint earlier in the round | "Patient, methodical, world-class nose" |
| Banjo | English Foxhound × American Bluetick Coonhound cross | Free-running pack hound, off-leash sprinter | Slightly larger pin radius (more forgiving scoring) | "Off-leash, fearless, runs at 40 km/h" |
| Dotty | American (Black and Tan) Coonhound | Senior pack matriarch, top-performing off-leash hound, mother of the home-bred SAWC pack | Unlocks pack-formation clue at day 30 | "Experienced, calm, the heart of the pack" |
| Pepper | English Springer Spaniel (guest detection dog, cross-trains with SAWC) | Detection of rhino horn, ivory, ammunition, contraband | Unlocks "contraband intercept" bonus clue | "Small, focused, finds what others miss" |

Mechanical effects are subtle and balanced. This is a fundraising game, not a competitive one. Choice is for personality and re-play, not min-maxing.

Breed accuracy and honesty: Storm (Malinois), Banjo (English Foxhound × American Bluetick Coonhound cross) and Dotty (American Black and Tan Coonhound) are SAWC-confirmed breeds and need no further framing. Scout (Bloodhound) and Pepper (Springer Spaniel) are framed in-game as guest dogs cross-training with SAWC, because those exact breeds are not in SAWC's confirmed kennel roster: Bloodhounds are used by the SANParks Kruger unit and Springer Spaniels work park gates for detection. This framing is honest and teaches players about the wider Kruger K9 ecosystem.

Real-life tie-ins surface as "Did you know?" facts. Banjo carries the Texan-hound origin: the free-running pack was donated by houndsman Joe Braman in 2018, with the relocation funded by the Ivan Carter Wildlife Conservation Alliance. Dotty is modelled on a real four-year-old SAWC Coonhound, one of the unit's top-performing off-leash hounds, who had a litter of 10 puppies in March 2026.

---

## 10. Game mechanics and economy

### 10.1 Equipment shop catalogue (12 items)

Pricing anchored to SAWC's published donation-page values where they exist (R500 monthly K9 healthcare, R2,400 ranger GPS, R15,500 leadership bursary).

| # | Item | Tier | Price (ZAR) | In-world description | Mechanical effect | Funding equivalent |
|---|---|---|---|---|---|---|
| 1 | Standard collar | Free | 0 | Default leather collar | None | n/a |
| 2 | Field map | Free | 0 | Default map view | None | n/a |
| 3 | Tin of dog biscuits | Care | R20 | A treat for your tracker | Cosmetic dog wag animation | One day of treats |
| 4 | Reinforced leash | Hunt | R50 | Heavy-duty Rogz leash | +1 pin change credit/week | One week of leash wear-replacement |
| 5 | Pro binoculars | Hunt | R100 | Higher zoom on map | Map max zoom doubles | Field rangers' binocular kit |
| 6 | Week of dog food | Care | R150 | Premium working-hound nutrition | Cosmetic, dog stat full | Estimated one week one dog (in-kind donated by Pack Leader) |
| 7 | Topographic map | Hunt | R200 | Geology layers reveal | Toggle showing rhyolite, granite, basalt, sandstone overlays | Skukuza ranger field-map printing |
| 8 | Premium GPS collar | Hunt | R250 | Real-time dog tracking | +1 clue, visible patrol radius | Garmin/Tractive working-hound GPS pool |
| 9 | Plane fly-over | Hunt | R350 | Bat Hawk aerial sweep | Aerial photo clue in one zone | One-third Bat Hawk flight hour (~R1,000-1,200/hr) |
| 10 | Monthly K9 healthcare | Care | R500 | Vet, vaccinations, parasite control | Cosmetic, "fit for duty" badge | EXACT match SAWC published donation |
| 11 | Ranger handheld GPS | Big-ticket | R2,400 | Field-team navigation | Multi-zone visibility 3 days | EXACT match SAWC published donation |
| 12 | Helicopter recon | Big-ticket | R15,000 | Squirrel helicopter sweep | Two adjacent zones revealed | One hour SANParks Squirrel ops |

Two items (10 and 11) match SAWC's actual donation page exactly so we can wire the v2 real-payment integration with zero copy changes. Plane fly-over and helicopter recon are the two "wow" demo items for the pitch.

### 10.2 Clue economy

A 90-day round contains **18 clues**:

- **9 free time-released clues** at days 1, 7, 14, 21, 30, 45, 60, 75, 88. Difficulty curve: zone level (1-21), feature level (30-60), landmark level (75-88). Day 88 is the synthesis clue.
- **5 equipment-locked clues** unlocked by purchasing items 5, 7, 8, 9, 12.
- **Up to 4 sponsor-coupon clues** released ad hoc by SAWC.

Three clue types differ in tone:
- **Free clues:** atmospheric and geographic, lean into geology and biome facts
- **Paid-equipment clues:** operational and visual, feel like equipment justified the find
- **Sponsor-coupon clues:** character-led and educational, tie sponsor's funded segment to a teachable moment

### 10.3 Pin-drop mechanic

Players can change their pin **as many times as they want** until 48 hours before round end (hard lock). Donation-not-extraction philosophy means we don't paywall pin changes. A "lock in" prompt fires at the 48-hour mark; players can also tap "Lock in early" anytime for a "Confident" achievement chip. Every change is timestamped in the player's journal.

### 10.4 Scoring and leaderboard

Distance is calculated as Euclidean pixel distance on the normalised 0-1 map coordinate space, multiplied by the scaled lowveld dimension to produce a kilometre figure. We do not use real haversine because the map is stylised illustration, not a true projection.

Closest pin wins. **Top 50 publicly ranked** (POPIA data minimisation; avoids exposing kid display names buried at rank 4,000).

### 10.5 Recommended prize structure (open question for SAWC)

- **First place:** 2-night SAWC K9 Unit experience for two, including kennel visit, training demonstration, overnight at SAWC campus near Orpen
- **Second place:** Naming rights for one of the next litter of pack hounds
- **Third to tenth:** "Adopt a K9" annual sponsorship certificate plus signed photograph of adopted dog
- **All top 50:** Mention in round-end Our Allies page

Avoids cash prizes (Lotteries Act scrutiny). Every prize tied to existing SAWC assets, so cost is operational not procurement.

---

## 11. Coupon code and sponsor clue mechanic

### 11.1 Entry point

HUD top-right "Intel Intercept" icon, styled as an old field-radio dial with a small antenna. One-time first-launch coach mark: "Heard a code on the radio? Tap here." We deliberately do not push the player to it through banners, modals, or notifications.

### 11.2 Code format and entry

Codes are uppercase alphanumeric, 6-12 characters, with optional hyphens for human readability. Format: `[SPONSOR]-[ZONE]-[NUMBER]`. Example: `5FM-OLIFANTS-42`. Hyphens auto-inserted client-side at every fourth character. The QR scan button is present in v1 but mocked.

### 11.3 Validation states

- Loading: 1.2s radio dial spin
- Success: card slides in with sponsor's funded clue, single line crediting sponsor
- Errors:
  - "Code not recognised" (typos)
  - "This code has already been used on your account" (one-use)
  - "This code expired on 12 May 2026" (time-bounded)
  - "Too many attempts. Try again in 5 minutes." (rate limit; default 10 attempts/hour/account)

### 11.4 What unlocks

Variety is essential. v1 supports four unlock types:
- **Bonus clue** (most common): unique text/image card
- **Free equipment unlock:** sponsor funds a free week of dog food, unlocking item 6 at no cost
- **Zone reveal:** aerial photo of a single zone
- **Specialist dog deployment:** one-round bonus ("Pepper joins your hunt this week")

### 11.5 Anti-abuse

- One-use per account enforced server-side (`code_redemptions` row per `(code_id, player_id)` with unique constraint)
- Rate limit 10 entries per hour per account
- Codes have optional `valid_from`, `valid_until`, `max_redemptions`
- Guest-mode redemptions capped at 3 per device

### 11.6 Our Allies page

Single screen at `/allies`. Plain text, sentence-case headers. No logos, no images. Three sections:
- **Sponsor partners** (table: name, funded amount, what it funded)
- **In-kind partners** (table: name, contribution category)
- **Founding donors** (paragraph naming WWF Nedbank Green Trust, IFAW, IRF, Ivan Carter Wildlife Conservation Alliance)

Tone: grateful and factual. No outbound links to sponsor websites in v1 (avoids placement-vehicle perception).

### 11.7 5FM example flow

1. SAWC issues 5FM the code `5FM-OLIFANTS-42` (set up for one specific clue, expiring after 7 days)
2. 5FM brings a real KNP ranger as breakfast-show guest
3. Presenters discuss the hunt, ranger answers questions in character
4. Presenters announce the code on air at 7:30am
5. Listener opens app, taps Intel Intercept icon, types code, hears radio-dial animation
6. Vellum card slides in: "Ranger Precious tells you the suspect was last seen at sundown near the Lebombo. The Lebombo is rhyolite, formed 180 million years ago when Africa split from Antarctica."
7. Single line at the bottom: "Funded by 5FM. Their support funded 3 months of dog food for the pack."

Critically: 5FM logo never appears anywhere in the app.

---

## 12. Visual design direction

### 12.1 Aesthetic principles

**Conservation-serious meets game-playful**, anchored in three principles:
- **Authenticity** (real SAWC dogs, real KNP geography, real funding equivalents) is the moat against "white-saviour conservation game" tropes
- **Restraint** (no logos in gameplay, no neon, no aggressive gamification) earns donor and parent trust
- **Warmth** (savanna palette, hand-painted texture overlays, dog wag animations) makes it inviting to kids

References: Alba: A Wildlife Adventure (ustwo, 2020) for soft conservation tone; Sea Hero Quest (Glitchers/Deutsche Telekom, 2016) for gender-neutral broad-audience palette and memorise-the-map mechanic. Pokemon GO's sponsored locations inform our coupon-code restraint: sponsors add gameplay value, never visual takeover.

### 12.2 Colour palette

Anchored in lowveld geology and biomes.

| Role | Name | Hex | Use |
|---|---|---|---|
| Primary | Mopane red | `#A8442B` | Buttons, primary CTAs, pin colour |
| Primary dark | Lebombo rhyolite | `#5C2A1F` | Dark mode primary, headers |
| Secondary | Savanna ochre | `#D9A24E` | Secondary buttons, highlights |
| Tertiary | Granite blush | `#C9A89A` | Backgrounds, cards |
| Accent 1 | Sabie turquoise | `#2E8C9A` | Rivers, success states |
| Accent 2 | Fever-tree lime | `#B8C44A` | Achievement chips |
| Accent 3 | Sourveld mustard | `#C49B2E` | Coupon-code success, radio dial |
| Neutral 0 | Bone | `#F4EAD8` | Page bg, vellum cards |
| Neutral 1 | Sand | `#E2D2B5` | Cards, dividers |
| Neutral 2 | Dust | `#7C6F5A` | Body text |
| Neutral 3 | Charcoal | `#2A241D` | Headers, dark mode bg |

Dark mode flips Bone/Sand for Charcoal/Dust and increases contrast on accents (Sabie turquoise becomes `#5BB8C5`).

### 12.3 Typography

**Rubik throughout.** Type scale 1.25 modular ratio anchored on 16px body.

| Token | Weight | Size | Use |
|---|---|---|---|
| display | 700 | 40 px | Splash hero, round-end |
| h1 | 600 | 32 px | Section headers |
| h2 | 600 | 24 px | Card headers |
| h3 | 500 | 20 px | Sub-headers |
| body | 400 | 16 px | Default |
| small | 400 | 14 px | Captions |
| micro | 500 | 12 px | Achievement chips, tags |

Letter spacing tightens by -0.01em at display weight. Vellum cards use `font-feature-settings: "liga"` for hand-typed feel.

### 12.4 Map illustration style

**Recommendation: flat vector with subtle hand-painted texture overlays, top-down 2.5D with slight north-south compression.**

Reasons:
1. **Performance on entry-tier Android.** Flat vector keeps the single map asset under 400KB compressed. Painterly raster at 4K = 8-12MB and stutters on pinch.
2. **Pin-drop legibility.** Players judge distance precisely. Decorative tourist-style maps obscure scale; flat vector preserves geographic intuition.
3. **Cross-demographic appeal.** Reads as friendly and educational without being childish. Same lesson Sea Hero Quest demonstrated.

**Recommended illustrators (SA, editorial-grade with African subject matter):** Daniel Ting Chong, Karabo Poppy, Sindiso Nyoni "R!OT". This strengthens the brand story.

### 12.5 Dog illustrations

**Stylised character art faithful to breed silhouette, not photoreal.** Each dog gets head-and-shoulders portrait for shop and HUD; full-body 2D billboard for map. Real breed accuracy (Malinois black mask, Bloodhound dewlap, Foxhound × Bluetick Coonhound markings, Black and Tan Coonhound tan points, Springer feathered ears) for educational integrity. Stylisation prevents uncanny valley.

### 12.6 Animation strategy

**CSS-only for almost everything; Motion (formerly Framer Motion) only for gesture-driven; canvas-confetti for success moments.**

- **Pin drop** (CSS keyframes): translateY -30px scale 0 -> overshoot bounce -> settled. 600ms ease-out.
- **Plane fly-over** (CSS offset-path): Bat Hawk silhouette traces curved path over 3 seconds, fading trail. Pure CSS.
- **Clue reveal** (CSS): vellum card fades in, types text on (CSS `steps()` on width). 1.2s.
- **Dog movement** (CSS): translate along precomputed path, 2s.
- **Coupon-code success** (canvas-confetti, 7KB): radio dial spins, confetti bursts in palette colours.
- **Page transitions** (Motion): only between major sections. Shared-layout for dog avatar.

Lottie only if designer-led character animations are produced. Lazy-load `@lottiefiles/dotlottie-react` via `next/dynamic({ ssr: false })`.

---

## 13. Architecture and data model

### 13.1 Frontend architecture

```
app/
├── (onboarding)/
│   ├── welcome/page.tsx
│   ├── onboarding/age/page.tsx
│   ├── onboarding/parent/page.tsx
│   ├── onboarding/name/page.tsx
│   ├── onboarding/origin/page.tsx
│   └── onboarding/dog/page.tsx
├── (game)/
│   ├── map/page.tsx
│   ├── map/@pin/page.tsx          // parallel route for pin sheet
│   ├── journal/page.tsx
│   ├── journal/[id]/page.tsx
│   ├── shop/page.tsx
│   ├── shop/[id]/page.tsx
│   ├── checkout/[id]/page.tsx
│   ├── checkout/[id]/bank/page.tsx
│   ├── checkout/[id]/auth/page.tsx
│   ├── checkout/[id]/success/page.tsx
│   ├── codes/page.tsx
│   ├── codes/success/page.tsx
│   └── round/(end|winner|new)/page.tsx
├── (meta)/
│   ├── profile/page.tsx
│   ├── profile/donations/page.tsx
│   ├── profile/edit/page.tsx
│   ├── allies/page.tsx
│   └── legal/page.tsx
├── api/
│   ├── codes/redeem/route.ts
│   ├── checkout/simulate/route.ts
│   └── leaderboard/route.ts
├── layout.tsx
├── page.tsx                       // splash
└── __demo/page.tsx                // pitch-reset utility (env-gated)
```

**Server Components by default**, Client Components only where genuinely needed: map (gesture), checkout (form state), codes (input state), HUD (Zustand subscription). Onboarding pages, shop list, profile list, allies, journal list = all Server Components.

Parallel route `/map/@pin` so pin-confirm sheet is true overlay without unmounting map.

### 13.2 State management

**Zustand with persist middleware.** Single store, single hook, ~1.2KB gzipped, official Next.js 15 RSC compat, automatic localStorage persistence in one line that doubles as v1 mock backend. Avoid Context (re-render storms), Server Actions only (round-trip kills mobile UX on SA networks), Redux Toolkit (boilerplate).

```ts
// store/game.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  player: { id: string; displayName: string; birthYear: number; dogId: string } | null;
  pin: { x: number; y: number; updatedAt: string } | null;
  inventory: string[];
  cluesUnlocked: string[];
  redeemedCodes: string[];
  donationsTotal: number;
  setPin: (x: number, y: number) => void;
  unlockClue: (id: string) => void;
  addInventory: (id: string, amount: number) => void;
  redeemCode: (code: string, clueId: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      player: null,
      pin: null,
      inventory: [],
      cluesUnlocked: [],
      redeemedCodes: [],
      donationsTotal: 0,
      setPin: (x, y) => set({ pin: { x, y, updatedAt: new Date().toISOString() } }),
      unlockClue: (id) => set((s) => ({ cluesUnlocked: [...new Set([...s.cluesUnlocked, id])] })),
      addInventory: (id, amount) => set((s) => ({
        inventory: [...new Set([...s.inventory, id])],
        donationsTotal: s.donationsTotal + amount,
      })),
      redeemCode: (code, clueId) => set((s) => ({
        redeemedCodes: [...s.redeemedCodes, code],
        cluesUnlocked: [...new Set([...s.cluesUnlocked, clueId])],
      })),
    }),
    { name: 'sawc-game' }
  )
);
```

### 13.3 Data model

**v1: JSON seed files in `/data` for static content + Zustand+localStorage for player state.** Faster than Supabase to scaffold; bulletproof in pitch where demo cannot depend on network. Wire Supabase in week 2.

Each table is JSON file in v1; v2 schema as Postgres:

```sql
create table players (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  birth_year int not null,
  province text,
  parent_email text,                    -- encrypted, only if under 18
  consent_record jsonb,
  ranger_id text references rangers(id),
  dog_id text references dogs(id),
  created_at timestamptz default now()
);

create table rangers (
  id text primary key,                  -- 'grace', 'sabata', 'vince', 'rubaina', 'shakier'
  name text not null,
  heritage text not null,
  personality text not null,
  background text not null,             -- background silhouette motif, e.g. 'marula trees'
  cosmetic boolean default true         -- rangers carry no mechanical bonus in v1
);

create table dogs (
  id text primary key,                  -- 'storm', 'scout', 'banjo', 'dotty', 'pepper'
  name text not null,
  breed text not null,
  role text not null,
  bonus jsonb not null,
  description text not null
);

create table equipment (
  id text primary key,
  name text not null,
  tier text not null,                   -- 'free', 'hunt', 'care', 'big-ticket'
  price_zar int not null,
  description text not null,
  funded_equivalent text not null,
  effect jsonb not null
);

create table clues (
  id text primary key,
  round_id uuid not null references rounds(id),
  release_day int,                      -- null for equipment/sponsor clues
  required_item_id text references equipment(id),
  difficulty text not null,             -- 'zone', 'feature', 'landmark'
  body text not null,
  image_url text
);

create table codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  sponsor_id uuid references sponsors(id),
  clue_id text references clues(id),
  unlock_type text not null,            -- 'clue', 'equipment', 'zone', 'dog'
  unlock_payload jsonb not null,
  valid_from timestamptz,
  valid_until timestamptz,
  max_redemptions int,
  redemptions_count int default 0
);

create table code_redemptions (
  player_id uuid references players(id),
  code_id uuid references codes(id),
  redeemed_at timestamptz default now(),
  primary key (player_id, code_id)
);

create table pins (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id),
  round_id uuid references rounds(id),
  x numeric(8,6) not null,
  y numeric(8,6) not null,
  is_locked boolean default false,
  updated_at timestamptz default now()
);

create table donations (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id),
  equipment_id text references equipment(id),
  amount_zar int not null,
  receipt_number text unique not null,
  status text not null,                 -- 'simulated', 'pending', 'completed'
  created_at timestamptz default now()
);

create table sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  funded_amount_zar int not null,
  funded_description text not null,
  active boolean default true
);

create table rounds (
  id uuid primary key default gen_random_uuid(),
  number int not null,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  poacher_x numeric(8,6) not null,      -- hidden from client, server-only
  poacher_y numeric(8,6) not null,
  status text not null
);
```

V2 RLS: players read/write own row; pins, donations, code_redemptions gated by `auth.uid() = player_id`. Rounds.poacher_x/y never exposed via anon client; use a server-only RPC for distance calculation.

### 13.4 Auth

- **v1:** Guest mode with localStorage UUID. No Supabase Auth.
- **v2:** Supabase Auth, email magic link primary, Google + Apple SSO as upgrades.

### 13.5 Map rendering

**`react-zoom-pan-pinch` wrapping a single `<img>` with absolute-positioned `<button>` pins.** ~6KB gzipped, cheapest cold start on mid-range Android. Native React state ergonomics: pin coords = `{x, y}` percentages stored in Zustand. Pinch-zoom, pan, double-tap-zoom, inertia all work on mobile out of the box.

```tsx
'use client';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useGameStore } from '@/store/game';

export function MapView() {
  const { pin, setPin } = useGameStore();

  const handleMapTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPin(x, y);
  };

  return (
    <TransformWrapper minScale={0.5} maxScale={4} doubleClick={{ mode: 'zoomIn' }}>
      <TransformComponent>
        <div className="relative" onClick={handleMapTap}>
          <img src="/map/lowveld.webp" alt="Lowveld map" className="w-full h-auto" />
          {pin && (
            <button
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-full"
              style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
              aria-label="Your guess"
            >
              <PinIcon />
            </button>
          )}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
```

Use Leaflet with CRS.Simple only if v2 needs 100+ pins, marker clustering, or markers scaling inverse to zoom.

### 13.6 Fake payments (Ozow mimic)

**Mimic Ozow's flow.** Bank-pick + bank-app-approval pattern is the most familiar SA mobile donation UX in 2026 (Takealot, Mr Price, Hollywoodbets all use it). Works without a card. Ozow waives transaction fees for NPOs under R1m/month.

Four-step component: `Amount → Bank → Auth → Success`. Each step is a Server Component shell with a Client Component form. Simulate-success route at `/api/checkout/simulate` returns a fake receipt number after 1.4s delay.

```ts
// app/api/checkout/simulate/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { equipmentId, amount } = await req.json();
  await new Promise((r) => setTimeout(r, 1400));
  const receiptNumber = `SAWC-2026-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  return NextResponse.json({
    success: true,
    receiptNumber,
    equipmentId,
    amount,
    section18A: true,
  });
}
```

Swap to real Ozow integration in v2 by replacing `/api/checkout/simulate` with an Ozow API call. Frontend UX unchanged.

### 13.7 Realtime

Almost nothing needs realtime in v1. Leaderboard updates server-side once per minute; clients fetch on `/round/winner`. Clue release is deterministic schedule, computed client-side from round start. Skip Supabase Realtime in v1.

### 13.8 Push notifications

**OneSignal Web Push.** Free tier: unlimited subscribers, unlimited messages on web. iOS Safari supports web push since 16.4 (March 2023) but iOS PWAs require "Add to Home Screen" first; OneSignal handles this. When app is wrapped in Capacitor for App Store, OneSignal's native SDKs reuse same dashboard.

Three notification types in v1:
- New clue available
- Round ending in 7 days (lock approaching)
- Round result

Permission requested only after first pin drop (highest engagement moment), with copy: "We'll only ping you when a new clue drops, never more than weekly." iOS players get soft "Add to Home Screen" coach mark on onboarding close.

---

## 14. Pitch demo flow

The single most important deliverable. 3 minutes 30 seconds. Three emotional beats: "this is real" (SAWC is a real organisation), "this is fun" (dog choice and pin drop), "this funds something specific" (donation maps to real ranger cost).

`/__demo` resets player state to fresh first-launch and seeds Day 1 of Round 1.

### 14.1 The 3:30 flow

1. Mike taps `/__demo` before handing the phone (reset is invisible)
2. Sponsor lands on splash (1.2s), then welcome (5s read)
3. **Onboarding as a kid in Joburg** (45s): birth year 2014 (kid path), name "Ranger Kgosi", Gauteng, parent email gate bypassed in demo mode (hidden behind query param; mandatory in production)
4. **Origin story chat-bubbles** (30s): five cards establish SAWC K9 as real, 54-68% apprehension rate vs 3-5% without, and set up the two character picks
5. **Ranger and dog selection** (20s): first pick from five rangers (the player's avatar; the lineup reflects the real demographic of SAWC rangers so every player sees themselves on the team), then five dogs. Mike has a soft preference for Banjo because the Texan-hound origin is the most surprising fact, though Dotty, a real SAWC dog and mother of the home-bred pack, is the strongest emotional hook
6. **First clue reveal** (10s): vellum card with Day 1 zone-level clue
7. **Map exploration** (20s): pinch and pan, Mike points out 8 zones briefly
8. **Drop a pin** (10s): tap somewhere, pin animates in
9. **Equipment shop** (30s): scroll 3 tabs. Mike highlights R150 = one week of dog food; R500 = one month of one dog's full healthcare (exact match SAWC published)
10. **Buy plane fly-over (R350)** (40s): **THE KEY DEMO MOMENT.** Ozow-mimic checkout runs, sponsor taps FNB, watches loader, taps simulate button, sees Section 18A receipt preview ("a receipt has been emailed for SARS purposes"). This lands "the entire payment journey works."
11. **New clue revealed** (15s): plane animates across map, drops aerial photo card. Clue narrows to feature.
12. **5FM coupon code** (30s): Mike says "you just heard this code on 5FM breakfast." Shows card with `5FM-OLIFANTS-42`. Sponsor taps radio icon, types code, success animation, sponsor-funded clue with single-line credit
13. **Our Allies page** (15s): plain table with three demo sponsors and funded amounts. Mike: "your name would go here, with what your money funded."
14. **Stat dashboard** (15s): pitch-only screen at `/__demo/dashboard`. "Round 1: 2,847 players, R412,000 raised, equivalent to 8 K9 healthcare months, 165 weeks of dog food, 1 helicopter hour"

### 14.2 Hardcoded vs live

**Hardcoded:** Round 1 poacher location (server-side, hidden); Day 1 clue text; 5 demo rangers; 5 demo dogs; 12 equipment items; 3 demo sponsors; 3 demo coupon codes; round-1 dashboard aggregate stats.

**Live (computed at runtime):** pin position; pin distance from poacher; inventory state; clues unlocked; donation total; redeemed codes; days remaining (computed from round start). All persist in localStorage. `/__demo` resets between sponsors.

### 14.3 Seed data needed

| Data | Source | Format |
|---|---|---|
| Round 1 metadata | Hardcoded | `data/rounds.json` |
| Poacher location | Hardcoded, server-only | `data/poacher.server.json` |
| 18 round-1 clues | Hardcoded, written with SAWC review | `data/clues.json` |
| 5 rangers | Hardcoded, cosmetic avatars | `data/rangers.json` |
| 5 dogs | Hardcoded, real SAWC roles | `data/dogs.json` |
| 12 equipment items | Hardcoded, prices anchored to SAWC publications | `data/equipment.json` |
| 3 demo sponsors with allies copy | Hardcoded | `data/sponsors.json` |
| 3 demo coupon codes | Hardcoded | `data/codes.json` |
| Map asset | Commissioned illustration | `public/map/lowveld.webp` |
| Ranger portraits | Commissioned illustration (5 full-body avatars) | `public/rangers/*.webp` |
| Dog portraits | Commissioned illustration | `public/dogs/*.webp` |
| Plane silhouette | Commissioned illustration | `public/equipment/bat-hawk.svg` |

---

## 15. Risks and compliance

### 15.1 POPIA

The Protection of Personal Information Act 4 of 2013 sections 34-35 prohibit processing personal info of anyone under 18 without prior consent of a competent person (parent/legal guardian). Information Regulator's Guidance Note (28 June 2021): provide reasonable means for competent person to review/refuse processing, do not encourage disclosure beyond reasonable necessity, maintain integrity and confidentiality.

**Mitigations baked into v1:**
- Birth-year-only collection (no full DOB)
- Parent-email-gated kid flow with delayed activation via verifiable email link
- AWS af-south-1 (Cape Town) hosting in v2 to avoid cross-border transfer requirements under section 72
- Retention policy: 24 months for inactive accounts
- Parent-portal for deletion on request (v2)

Penalties: up to R10 million administrative fines, up to 10 years imprisonment.

### 15.2 SA promotional competition law

Closest-pin prize sits in a grey zone. Section 36 Consumer Protection Act 68 of 2008 + Regulation 11 of GNR.293 (1 April 2011) catches "any competition, game, scheme, arrangement, system, plan or device for distributing prizes by lot or chance, irrespective of whether a participant is required to demonstrate any skill or ability."

**Conservative default: comply with section 36 fully:**
- Prepared written rules
- Free entry path (donation must be optional, decoupled from competition entry; non-donors must have equivalent free path)
- Independent auditor verification (Reg 11(5): registered accountant, auditor, attorney, or advocate)
- Full disclosure in offer to participate
- No employee participation
- Rules retained for 3 years post-competition

**Critically: never tie donation amount to entry odds** (would push into Lotteries Act 57 of 1997 territory; private lotteries generally illegal).

### 15.3 Apple App Store rules

- **Guideline 3.2.1(vi):** approved nonprofits can fundraise in-app; must offer Apple Pay; must disclose how funds are used
- **Guideline 3.2.1(iv):** non-approved-nonprofit charity collection must be outside-the-app (Safari, SMS)
- **Crucial:** donations are NOT processed through IAP, so Apple's 30% does not apply
- **Apple Developer Program $99/yr fee waiver is NOT currently available in SA** (eligible regions list excludes SA per developer.apple.com/help/account/membership/fee-waivers). SAWC will need to budget $99 or enrol via UK/US affiliate

**v1 path:** External Safari donate flow (no Apple Pay nonprofit registration day 1). Pursue Benevity-mediated Apple Pay nonprofit approval in parallel for v2.

### 15.4 SARS Section 18A

From 1 March 2026 (Government Gazette #53589, 24 October 2025) every receipt must capture:
- Donor full name
- Nature, ID/registration number
- Tax reference number
- Donation date, amount, nature
- Unique receipt number
- PBO reference number

PBOs issuing more than 50 receipts/year must register as third-party data providers and submit IT3(d) data via SARS HTTPS gateway annually by 31 May.

**Verify SAWC's Section 18A approval status with SARS' approved-PBO list before relying on it in product copy.** SAWC is a registered private FET institution with founding partners Peace Parks Foundation and WWF South Africa. Conservation activities fall in Part II of the Ninth Schedule, so 18A approval is highly likely but must be confirmed.

### 15.5 Security of clue content

**Clue content must NOT expose real SAWC ranger tactics, real waypoints, or real anti-poaching operations geography.** Every clue reviewed by SAWC's Dog Master or equivalent before publication. Fictional poacher locations should not coincide with real recent incursion sites. Sponsor coupon clues are particularly sensitive (collaborative writing); SAWC retains final editorial control.

### 15.6 SANParks trademark and Kruger imagery

SANParks holds registered trademarks for "SANPARKS" (SA trademarks 2004/12407 onwards). Protected Areas Act 2003 (NEM:PAA Act 57 of 2003) makes unauthorised commercial use of any national park name a criminal offence (per Lisa Hopkinson, SANParks Legal).

**Recommendation:** Launch v1 with original stylised "lowveld" map and SAWC branding. Avoid "Kruger National Park" prominently in app store listings, app icon, primary UI. Open parallel comms channel to SANParks Corporate Affairs for MOU permitting "Kruger National Park" reference and ideally co-marketing. Stylised illustrations of the lowveld region are not derivative of any specific SANParks map and are defensible.

### 15.7 Ethical considerations

- **Don't cast the poacher as a protagonist.** Never name real poachers, never glamorise the trade
- Poacher = silhouette of criminal syndicate; emphasis on protecting rhinos, dogs, rangers, communities
- Narrative should highlight socio-economic drivers (unemployment in buffer communities) in age-appropriate ways without simplistic villain framing
- Dog welfare angle: center dogs as athletes and partners, not weapons
- Community conservation: integrate content on community benefit, mirroring SAWC's four-tier approach

---

## 16. v2 roadmap

In rough priority order:

1. **Real Ozow + PayFast integration**, with Section 18A automated receipt issuance via SARS IT3(d) gateway. Yoco as card fallback for non-EFT donors
2. **SAWC admin portal** at `/admin` (separate auth, gated): set poacher location, write/schedule clues, generate sponsor codes, see donation totals, export reports
3. **Sponsor portal** at `/sponsor`: self-service code generation, redemption analytics, monthly funded-equivalent CSV reports
4. **Apple Developer Program enrolment under SAWC** ($99/yr if SA remains ineligible for waiver), Benevity-mediated Apple Pay nonprofit approval
5. **Native shell via Capacitor** for App Store and Play Store, reusing OneSignal SDK
6. **Automated round transitions** with server-side cron at round end: compute distances, update leaderboard, trigger round-end push
7. **School portal for teachers** at `/teachers`: class group views, CAPS-aligned learning packets per zone, distance-from-poacher as maths exercise, biome facts as natural sciences exercise
8. **Multi-language**: Afrikaans, isiZulu, Sepedi (Limpopo, where SAWC is based, has high Sepedi first-language share)
9. **Full POPIA consent flow**: explicit consent records per processing purpose, parent dashboard for kid accounts, DSAR flow, retention timer
10. **Accessibility audit to WCAG 2.2 AA**: screen reader for vellum cards, keyboard-only pin drop, contrast verification on savanna palette in dark mode

---

## 17. Open questions for SAWC

These need explicit SAWC sign-off before build proceeds.

1. **Clue accuracy and review process.** Who at SAWC signs off on the 18 round-1 clues? Recommended: Theresa Sowry or Johan van Straaten as approver, two-week review window
2. **Map approval.** Does SAWC want the map closer to or further from real KNP? Default: lowveld-inspired, non-literal
3. **Dog naming and likeness.** Five selectable dogs use generic names (Storm, Scout, Banjo, Dotty, Pepper). Dotty is modelled on a real SAWC dog (a four-year-old Coonhound, mother of the home-bred pack), so confirm SAWC is comfortable with that tie-in. Does SAWC want to use more real K9 names (V, Rhino, Scent are publicly known)? Some real dogs may be retired/deceased; emotional risk
4. **Donation flow approval.** SAWC's finance team must approve Section 18A receipt template and funding-equivalent copy ("R150 = one week of dog food"). Some claims (dog food figure) are estimates; SAWC may substitute their own published equivalents
5. **Prize structure.** Is "Kruger experience for 2 + naming rights + adopt-a-K9" structure acceptable? Pack-hound naming rights has emotional, brand, operational implications
6. **Section 18A status confirmation** with SARS approved-PBO list
7. **Anchor corporate sponsor identification** (Hill's, Nedbank, MTN, Vodacom?)
8. **MOU with SANParks** for KNP reference rights
9. **Security review protocol** with SANParks Security Services
10. **Selection of Round 1 poacher location** from candidates: Red Rocks, Lanner Gorge, Crook's Corner, Shirimantanga Koppie, Nwanetsi koppie, Masorini

---

## 18. Suggested next 7 days for the build team

One-week build plan for v1 prototype, demo-ready. Assumes one full-stack developer + AI-assisted scaffolding.

| Day | Focus | Deliverables | AI tools |
|---|---|---|---|
| 1 | Project setup, design system | Next.js 15 + Tailwind v4 + Rubik scaffold, palette tokens, type scale, Zustand store, route shells for all 29 screens with placeholders. Order final map illustration from SA illustrator (parallel track) | v0.dev for screen mockups; Cursor/Claude Code for App Router scaffolding |
| 2 | Onboarding + ranger + dog flow | Splash, welcome, age, parent gate, name, origin chat-bubbles, ranger select, dog select. JSON seed for the 5 rangers and 5 dogs | Cursor for chat-bubble component; v0.dev for ranger and dog cards |
| 3 | Map + pin drop | react-zoom-pan-pinch with placeholder map, pin drop with confirm sheet, parallel route for pin overlay, journal screen | Claude Code for gesture-handler logic |
| 4 | Shop + fake checkout | Shop with 3 tabs, item detail, four-screen Ozow-mimic checkout, Section 18A receipt preview, item activation toast, JSON seed for 12 items | v0.dev for checkout screens; Claude for receipt component |
| 5 | Coupon codes + Our Allies | Intel Intercept input with hyphen auto-format, success animation, error states, 3 demo codes seed, allies plain-table page, profile and donations history | Claude Code for input validation and rate limit |
| 6 | Round-end + demo route | Round-end three-card sequence, share-to-social card generator, `/__demo` reset, dashboard at `/__demo/dashboard`, push permission ask. OneSignal integration | Figma for share card asset templates |
| 7 | Polish, seed final, Vercel deploy | Final clue copy review with SAWC, map asset integration if delivered, animation pass (pin drop, plane fly-over, coupon success), Vercel deploy, demo rehearsal | Cursor for animation tuning |

By end of day 7: prototype runs at `sawc-pin-drop.vercel.app`, demo-ready, `/__demo` resets cleanly between pitches.

**AI-assisted scaffolding leverage:**
- **v0.dev** highest-leverage for screen-by-screen UI build (design system well-defined). Prompt template: "tablet/mobile-first Next.js 15 page using Tailwind v4 with [palette tokens], showing [content], in the style of Alba: A Wildlife Adventure"
- **Claude Code or Cursor** handle integration glue (Zustand wiring, App Router route groups, Server vs Client component decisions)
- **Figma** for commissioned map illustration handoff and share-to-social card templates

**Single biggest risk to 7-day timeline:** the map illustration. Commission day 1 with the visual direction brief in section 12.4. Accept placeholder map days 1-6 if needed.

---

## 19. Outstanding research areas (next briefs)

These were proposed but not yet completed. Each should be a separate research task, with clarifying questions answered first.

### 19.1 Deeper game mechanics + customer flow specifications

Open question for Mike: depth of detail on day-by-day clue progression, achievement system, retention mechanics, returning-player logic, kids-mode adaptations.

### 19.2 Promo strategy

Open question for Mike: scope = (a) player acquisition promos (radio reads, social, school activations, paid media, PR), (b) in-game promotional events (limited-time mini-rounds, double-clue weekends, World Ranger Day specials), or (c) both full marketing funnel from awareness through retention plus in-game event calendar.

### 19.3 Sponsor partnerships

Open question for Mike: depth of detail = (a) tier ladder + pricing (Bronze R50k / Silver R150k / Gold R500k with what each gets), (b) target list with specific brand recommendations (which 20-30 SA brands to approach, why each fits, who the contact is), (c) pitch deck content (what story, slides, social proof, asks for the pitch meeting itself), or (d) all three full sponsorship business case end-to-end.

### 19.4 Asset creation pipeline

Open question for Mike: depth = (a) strategic only (illustrator shortlist with portfolios, recommended stack like Midjourney/Procreate/Figma, brief templates, art direction guide), (b) production-ready (full asset list with specs, file naming, dimensions, formats, naming conventions, plus AI-pipeline for which assets you can generate yourself with which tools and which need a human illustrator), (c) both strategic art direction document AND a production manifest with build-it-yourself vs commission-it decisions per asset.

**Suggested production-manifest categories to cover when this brief launches:**
- The illustrated lowveld map (single biggest asset, commission)
- Ranger avatars (5 rangers, full-body illustrations for the ranger-selection screen, consistent uniform and per-ranger background silhouette, commission)
- Dog portraits and full-body billboards (5 dogs x 2 views = 10 illustrations, commission with consistent character art)
- Equipment item icons (12 items, can be AI-generated then refined in Figma/Procreate, or simple flat illustrations)
- Vellum/journal card backgrounds (texture, AI-generatable)
- UI iconography (pin, radio dial, satchel, etc.; lucide-react base + custom for SAWC-specific)
- Plane / Bat Hawk silhouette (one SVG, simple)
- Helicopter / Squirrel silhouette (one SVG)
- Splash / brand identity assets (kudu silhouette, wordmark)
- Sound design (optional v1: pin-drop confirm chime, radio static, dog bark, page turn)
- Share-to-social card templates (Figma, programmatically composed)

Recommended human-vs-AI split:
- **Commission a human illustrator** for: the map, the 5 rangers, the 5 dogs, the kudu silhouette, the vellum card frames, any character art
- **AI-generate then refine** for: equipment icons, texture overlays, generic UI assets
- **Pure design tool work** for: typography, layout, share cards, route map illustrations

### 19.5 Other research not yet done

- POPIA-aligned privacy policy first draft and Information Officer designation
- Section 18A receipt template design (SARS-compliant)
- Section 36 promotional competition rules drafting (the actual rules document to be published)
- Apple App Store nonprofit approval pathway through Benevity
- SANParks MOU outline / draft
- Schools / CAPS curriculum mapping for v2 teacher portal
- Multi-language localisation strategy
- Influencer / ambassador shortlist with engagement metrics
- Anchor corporate sponsor brief (which 5-10 brands to pitch first, with tailored angles)

---

## 20. Source list

### NGO partner and K9 unit

- [SAWC K9 Unit](https://wildlifecollege.org.za/k9-unit/)
- [SAWC: K9 Unit welcomes puppies](https://wildlifecollege.org.za/k9-unit-welcomes-puppies/)
- [SAWC Pack Leader and Nutritional Requirements](https://wildlifecollege.org.za/k-9-unit-pack-leader-and-nutritional-requirements/)
- [SAWC Field Ranger Training](https://wildlifecollege.org.za/field-ranger-training/)
- [SAWC Sponsor a K9 Monthly Healthcare](https://wildlifecollege.org.za/product/sponsor-the-k9-unit-monthly-vet-bill/)
- [SAWC Buy a Ranger a Compass](https://wildlifecollege.org.za/product/buy-a-ranger-a-compass/)
- [SAWC Protected Area Integrity Update March 2023](https://wildlifecollege.org.za/protected-area-integrity-department-update-march-2023/)
- [International Rhino Foundation: Expanding K9 Support](https://rhinos.org/blog/expanding-support-for-k9-units-and-training-in-southern-africa/)
- [SA Hunters: SAWC K9 Expansion](https://sahunters.co.za/sa-hunters-assists-with-added-security-as-the-sawcs-k9-unit-expands/)
- [Wild In Africa: Training Dogs for Anti-Poaching](https://wildinafrica.store/blogs/wildlife-conservation/training-dogs-for-anti-poaching)
- [SANParks Fundraising K9 Unit](https://www.sanparks.org/corporate/fundraising/support-the-k9-unit)
- [SANParks Honorary Rangers K9 National Project](https://www.sanparksvolunteers.org/k9-national-project/)
- [Hills Transforming Lives: Making CONTACT National Parks](https://www.hillstransforminglives.co.za/making-contact/the-national-parks-featured)
- [Wildlife Act: Making CONTACT](https://www.wildlifeact.com/blog/making-contact-paws-and-boots-together-on-the-ground-fighting-poaching)
- [Good Things Guy: Kruger K9 Unit Rebuild](https://www.goodthingsguy.com/environment/kriger-nationa-park-k9-unit-rebuild/)
- [Contiki: K9 Project Watchdog](https://www.contiki.com/six-two/article/k9-project-watchdog-protecting-kruger-park/)
- [Global Conservation Force: Anti-Poaching K9s](https://globalconservationforce.org/gcfs-anti-poaching-k9s/)
- [Conservation Travel Africa: APU Training Programme](https://conservationtravelafrica.org/volunteering-in-africa/conservation-programmes/anti-poaching-training-course-and-volunteer-ranger/)

### Rhino poaching context

- [The Citizen: Kruger Rhino Poaching 2025](https://www.citizen.co.za/news/south-africa/good-news-for-south-africas-rhino-poaching-fight-but-alarm-bells-at-kruger-national-park/)
- [SA News: Poaching Declines 16%](https://www.sanews.gov.za/south-africa/poaching-declines-16/)
- [Africanews: Kruger Park Poaching Doubles](https://www.africanews.com/2026/02/12/rhino-poaching-in-south-africas-kruger-park-doubles-despite-national-drop/)
- [Discover Africa: SA Rhino Poaching 2025](https://www.discoverafrica.com/blog/south-africa-rhino-poaching-2025/)
- [Rising Sun: SHR Race4Charity 2024](https://risingsunnewspapers.co.za/323939/sanparks-honorary-rangers-aims-to-raise-more-than-a-million-for-conservation/)
- [DFFE: Rhino Poaching Speech](https://www.dffe.gov.za/speeches/george_downwardtrend_rhinopoachingstats)

### Mobile gaming and SA market

- [Meltwater: Mobile Gaming SA 2025](https://www.meltwater.com/en/blog/mobile-gaming-in-south-africa-2025)
- [Games Industry Africa: 2025 Gaming in Africa Report](https://gamesindustryafrica.com/2025/12/10/new-2025-gaming-in-africa-report-reveals-mobile-first-market-and-strong-demand-for-cultural-representation/)
- [Mordor Intelligence: Africa Gaming Market](https://www.mordorintelligence.com/industry-reports/africa-gaming-market)
- [Statista: Mobile OS Share SA](https://www.statista.com/statistics/1063937/market-share-held-by-mobile-operating-systems-in-south-africa/)
- [Research and Markets: Africa Gaming](https://www.researchandmarkets.com/report/africa-gaming-market)

### Comparable conservation games

- [Sea Hero Quest Wikipedia](https://en.wikipedia.org/wiki/Sea_Hero_Quest)
- [Alzheimer's Research UK: Sea Hero Quest](https://www.alzheimersresearchuk.org/research/for-researchers/resources-and-information/sea-hero-quest/)
- [Deutsche Telekom: Sea Hero Quest](https://www.telekom.com/en/corporate-responsibility/corporate-responsibility/sea-hero-quest-game-for-good-587134)
- [Internet of Elephants: Five Games for Conservation](https://www.internetofelephants.com/news/2018/4/25/five-games-apps-for-conservation)
- [Wiley: Wildeverse RCT (Dunn et al., 2021)](https://besjournals.onlinelibrary.wiley.com/doi/10.1002/pan3.10273)
- [Mongabay: Animated Animals Conservation](https://news.mongabay.com/2017/07/animated-animals-can-games-engage-an-audience-with-a-conservation-message/)
- [Smithsonian National Zoo: Zoo Guardians](https://nationalzoo.si.edu/news/smithsonians-national-zoo-and-conservation-biology-institute-and-jumpstart-games-launch-zoo)
- [Google Play / Medium: Green Game Jam](https://medium.com/googleplaydev/green-game-jam-environmentally-conscious-gaming-650228601ad6)
- [Jonny Page: Video Games for Conservation](https://medium.com/@jonny.w.page/video-games-for-conservation-850763e5aa6)
- [WDC: Games for Waves](https://games.whales.org/stream-for-us/)
- [Chaos Theory Games: Environmental Games 2023](https://www.chaostheorygames.com/what-are-environmental-games-2023)

### Existing Kruger apps

- [Latest Sightings App](https://latestsightings.com/app)
- [KrugerExplorer App](https://www.krugerexplorer.com/the-app)
- [Kruger Animal Tracker](https://www.krugeranimaltracker.com/)

### Tech and payments

- [PayFast: Empowering SA Charities](https://payfast.io/blog/empowering-south-african-charities-with-seamless-secure-donations/)
- [Ozow: FAQ](https://ozow.com/faq)
- [Ozow: Easy Fast Trusted Payment Solution](https://ozow.com/blog/the-easy-fast-trusted-payment-solution-for-customers)
- [NowPayments: Payment Gateway South Africa](https://nowpayments.io/blog/payment-gateway-south-africa)
- [Romanos Boraine: Best Payment Gateways SA](https://romanosboraine.co.za/resources/best-payment-gateways-south-africa)
- [Website Admin: SA Payment Gateways](https://websiteadmin.co.za/blog/south-african-payment-gateways-for-ecommerce/)
- [Mobiloud: PWA Push Notifications](https://www.mobiloud.com/blog/pwa-push-notifications)
- [Apple Developer Forum: Charity Donations](https://developer.apple.com/forums/thread/95386)
- [Get On The Store: Nonprofit Donation Apps](https://getonthestore.com/nonprofit-donation-apps/)

### POPIA

- [POPIA Official](https://popia.co.za/)
- [Usercentrics: POPIA Overview](https://usercentrics.com/knowledge-hub/south-africa-popia-protection-of-personal-information-act-overview/)
- [VDT Attorneys: Children's Personal Information](https://vdt.co.za/consent/south-africa-processing-of-childrens-personal-information-in-the-modern-age-of-technology/)
- [ComplianceOnline: Processing Child Information](https://www.complianceonline.co.za/processing-child-information-doesnt-get-personal/)
- [GetTerms: POPIA Penalties](https://getterms.io/blog/south-africa-protection-of-personal-information-act-popia)
- [Lexology: DBE POPIA Ruling](https://www.lexology.com/library/detail.aspx?g=3f8f7afa-9bc5-4167-a102-5dcaf7a72113)

### Education and CAPS

- [Department of Basic Education CAPS Senior Phase](https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS)/CAPSSenior.aspx)
- [Department of Basic Education CAPS Grades 4-6](https://www.education.gov.za/LinkClick.aspx?fileticket=IzbFrpzoQ44%3D)
- [TIMSS: SA Science Curriculum](https://timssandpirls.bc.edu/timss2015/encyclopedia/countries/south-africa/the-science-curriculum-in-primary-and-lower-secondary-grades/)
- [StudyLib: NS&T CAPS](https://studylib.net/doc/8168526/natural-sciences-and-technology)
- [CapeNature: For Teachers](https://www.capenature.co.za/resources/for-teachers/p4)
- [WCED ePortal](https://wcedeportal.co.za/eresource/112876)
- [Thutong](https://www.thutong.doe.gov.za/ResourceDownload.aspx?id=44969)

### Kruger geography and ecology

- [Wikipedia: Kruger National Park](https://en.wikipedia.org/wiki/Kruger_National_Park)
- [Krugerpark.co.za: Park Map](https://www.krugerpark.co.za/kruger_park_map.html)
- [Britannica: Kruger National Park](https://www.britannica.com/place/Kruger-National-Park)
- [Krugerpark: Pafuri Triangle](https://www.krugerpark.co.za/Kruger_Park_Pafuri_Triangle-travel/pafuri-triangle.html)
- [Krugerpark: Pafuri Picnic Spot](https://www.krugerpark.co.za/africa_pafuri_picnic_spot.html)
- [Krugerpark: Lanner Gorge](https://www.krugerpark.co.za/africa_lanner_gorge.html)
- [Krugerpark: Red Rocks](https://www.krugerpark.co.za/africa_red_rocks.html)
- [Krugerpark: Olifants River](https://www.krugerpark.co.za/africa_olifants_river.html)
- [Krugerpark: Letaba River](https://www.krugerpark.co.za/africa_letaba_river.html)
- [Krugerpark: Crook's Corner](https://www.krugerpark.co.za/africa_crooks_corner.html)
- [Krugerpark: Skukuza](https://www.krugerpark.co.za/africa_skukuza.html)
- [Krugerpark: Punda Maria](https://www.krugerpark.co.za/africa_punda_maria.html)
- [Krugerpark: Fever Tree Forest](https://www.krugerpark.co.za/africa_fever_tree_forest.html)
- [Krugerpark: Masorini Ruins](https://www.krugerpark.co.za/africa_masorini.html)
- [Krugerpark: Vegetation Zones](https://www.krugerpark.co.za/Kruger_Park_Vegetation_Zones-travel/general-information-21.html)
- [Krugerpark: Birding Hotspots](https://www.krugerpark.co.za/krugerpark-times-3-23-birds-hotspots-25447.html)
- [Wikipedia: Olifants River (Limpopo)](https://en.wikipedia.org/wiki/Olifants_River_(Limpopo))
- [Wikipedia: Luvuvhu River](https://en.wikipedia.org/wiki/Luvuvhu_River)
- [Wikipedia: Shingwedzi River](https://en.wikipedia.org/wiki/Shingwedzi_River)
- [Wikipedia: Sabie River](https://en.wikipedia.org/wiki/Sabie_River)
- [Wikipedia: Crocodile River](https://en.wikipedia.org/wiki/Crocodile_River_(Komati_River))
- [Wikipedia: Lebombo Mountains](https://en.wikipedia.org/wiki/Lebombo_Mountains)
- [Wikipedia: Thulamela](https://en.wikipedia.org/wiki/Thulamela)
- [SANParks: Geology](https://www.sanparks.org/parks/kruger/tourism/biodiversity/geology)
- [Tracks4Africa: Pel's Fishing-Owl in Kruger](https://blog.tracks4africa.co.za/pels-fishing-owl-in-the-kruger/)
- [Reddit r/skukuza: Shirimantanga Reminiscences](https://www.reddit.com/r/skukuza/comments/16e0rg9/shirimantanga_reminiscences_with_great_grandfather/)
- [Times of SA: Exploring Kruger's Dams](https://timesofsa.com/exploring-kruger-national-parks-dams-a-journey-through-natures-water-treasures/)
- [Go to Africa Safaris: Central Kruger](https://gotoafricasafaris.com/kruger-safari/central-kruger/)
- [Tour My Way: Kruger National Park](https://tourmyway.com/the-kruger-national-park/)
- [Defence Web: New Aircraft for Kruger](https://www.defenceweb.co.za/aerospace/aerospace-aerospace/new-aircraft-for-kruger/)

### Brand and partnership context

- [MTN Sustainability](https://group.mtn.com/sustainability/sustainable-societies/social-investment/)
- [Vodacom](https://www.vodacom.com/)
- [City AM: FNB Springbok Sponsorship](https://www.cityam.com/fnb-to-replace-mtn-as-sponsor-of-south-africa-rugbys-springboks/)
- [Quora: SA APU Ranger Salaries](https://www.quora.com/How-much-do-anti-poaching-Rangers-make-earn-in-south-Africa-anti-poaching-Rangers-not-park-Rangers)

---

## End of handover

This document is the complete state of the project as of the date in the header. Anything not covered here is genuinely an open question. The fastest path forward for Cowork is:

1. Confirm this document is accurate and complete with Mike
2. Decide on the four scope questions in section 19 (game mechanics depth, promo strategy, sponsor partnerships, asset creation)
3. Begin the day-1 build plan in section 18 in parallel with answering the section 17 questions to SAWC

The hardest dependency is not technical. It is SAWC's review of the 18 round-1 clues and their sign-off on the funding-equivalent copy. Start that conversation on day one.
