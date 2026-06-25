/* Kruger Wild — Website · Home */
function Home({ species, regions, onOpen, onExplore }) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { Button, Eyebrow, Tag, Badge, StatBlock, Card, PhotoPlate } = NS;
  const wrap = { maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 clamp(1.25rem, 5vw, 4rem)" };

  return (
    <div>
      {/* ---- Hero ---- */}
      <section style={{ position: "relative", minHeight: "82vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <PhotoPlate wash="bushveld" icon="paw-print" />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(17,32,26,0.45) 0%, rgba(17,32,26,0.18) 35%, rgba(17,32,26,0.86) 100%)" }} />
        <div style={{ ...wrap, position: "relative", paddingBottom: "clamp(2.5rem, 6vw, 5rem)", paddingTop: "4rem", color: "var(--sand-50)" }}>
          <Eyebrow rule color="var(--ochre-300)">Field Guide to the Lowveld</Eyebrow>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: "#fff", fontSize: "clamp(2.75rem, 1.6rem + 5.2vw, 5.5rem)", lineHeight: 1.02, letterSpacing: "-0.02em", margin: "1rem 0 0", maxWidth: "16ch" }}>
            Where the wild still runs
          </h1>
          <p style={{ fontSize: "var(--text-lead)", lineHeight: 1.6, color: "rgba(245,239,226,0.9)", maxWidth: "48ch", margin: "1.2rem 0 0" }}>
            Nearly two million hectares of South African bushveld — home to the Big Five, 507 bird species, and a story written across two billion years of rock.
          </p>
          <div style={{ display: "flex", gap: "0.9rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <Button variant="accent" size="lg" iconRight={<i className="ph ph-arrow-right" />} onClick={onExplore}>Explore the wildlife</Button>
            <Button variant="ondark" size="lg" iconLeft={<i className="ph ph-map-trifold" />}>Plan your visit</Button>
          </div>
          <div style={{ display: "flex", gap: "2rem", marginTop: "2.6rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(245,239,226,0.7)", flexWrap: "wrap" }}>
            <span>-24.9945° S, 31.5547° E</span>
            <span>GATES 05:30—18:00</span>
            <span>EST. 1898</span>
          </div>
        </div>
      </section>

      {/* ---- Stat strip ---- */}
      <section style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ ...wrap, display: "flex", gap: "clamp(1.5rem,5vw,4rem)", padding: "clamp(2rem,4vw,3rem) clamp(1.25rem,5vw,4rem)", flexWrap: "wrap" }}>
          <StatBlock value="19,485" label="Park area (km²)" />
          <StatBlock value="147" label="Mammal species" divider />
          <StatBlock value="507" label="Bird species" divider />
          <StatBlock value="336" label="Tree species" divider />
          <StatBlock value="1898" label="Established" divider />
        </div>
      </section>

      {/* ---- Big Five ---- */}
      <section style={{ ...wrap, padding: "var(--section-y) clamp(1.25rem,5vw,4rem)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginBottom: "2.2rem", flexWrap: "wrap" }}>
          <div>
            <Eyebrow rule>The Big Five</Eyebrow>
            <h2 style={{ fontSize: "var(--text-h1)", margin: "0.7rem 0 0", maxWidth: "18ch" }}>Five animals that define the bushveld</h2>
          </div>
          <Button variant="secondary" iconRight={<i className="ph ph-arrow-right" />} onClick={onExplore}>All 147 species</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.4rem" }}>
          {species.slice(0, 5).map((s) => (
            <div key={s.id} onClick={() => onOpen(s)} style={{ cursor: "pointer" }}>
              <Card
                media={<PhotoPlate wash={s.wash} icon={s.icon} label={s.latin} />}
                mediaHeight={170}
                eyebrow={<Badge status={s.iucn} />}
                title={s.name}
                meta={s.activity}
                description={s.blurb}
                footer={<><Tag tone="green" icon={<i className="ph ph-tree" />}>{s.habitat}</Tag><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ochre-700)" }}>View →</span></>}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ---- Regions ---- */}
      <section style={{ background: "var(--surface-card)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ ...wrap, padding: "var(--section-y) clamp(1.25rem,5vw,4rem)" }}>
          <Eyebrow rule>Regions</Eyebrow>
          <h2 style={{ fontSize: "var(--text-h1)", margin: "0.7rem 0 2rem", maxWidth: "20ch" }}>From the southern rivers to the far north</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.4rem" }}>
            {regions.map((r) => (
              <Card key={r.name} overlay mediaHeight={320}
                media={<PhotoPlate wash={r.wash} icon={r.icon} />}
                eyebrow={<Eyebrow color="var(--ochre-300)">{r.tag}</Eyebrow>}
                title={r.name}
                description={r.blurb}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Plan your visit CTA ---- */}
      <section style={{ ...wrap, padding: "var(--section-y) clamp(1.25rem,5vw,4rem)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "0", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-lg)", minHeight: 340 }}>
          <div style={{ background: "var(--green-900)", color: "var(--sand-50)", padding: "clamp(2rem,4vw,3.4rem)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Eyebrow color="var(--ochre-300)">Plan your visit</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: "#fff", fontSize: "var(--text-h1)", margin: "0.8rem 0 0.6rem", lineHeight: 1.05 }}>Nine gates. One unforgettable wilderness.</h2>
            <p style={{ color: "rgba(245,239,226,0.82)", maxWidth: "42ch", lineHeight: 1.6 }}>Reserve gate entry, book a rest camp, or set out on a guided drive. Everything you need to meet the bushveld on its own terms.</p>
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.6rem", flexWrap: "wrap" }}>
              <Button variant="accent" iconRight={<i className="ph ph-arrow-right" />}>Book your trip</Button>
              <Button variant="ondark">Gate times &amp; fees</Button>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <PhotoPlate wash="savanna" icon="tent" />
          </div>
        </div>
      </section>
    </div>
  );
}
window.KW_Home = Home;
