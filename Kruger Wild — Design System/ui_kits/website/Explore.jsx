/* Kruger Wild — Website · Explore (species directory) */
function Explore({ species, onOpen }) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { Eyebrow, Tag, Badge, Card, PhotoPlate, Field } = NS;
  const filters = ["All wildlife", "Big Five", "Predators", "Herbivores", "Birds"];
  const [active, setActive] = React.useState("All wildlife");
  const [q, setQ] = React.useState("");

  const shown = species.filter((s) => {
    const inFilter = active === "All wildlife"
      || (active === "Big Five" && s.bigFive)
      || (active === "Predators" && s.group === "predator")
      || (active === "Herbivores" && s.group === "herbivore")
      || (active === "Birds" && s.group === "bird");
    const inQ = !q || (s.name + " " + s.latin).toLowerCase().includes(q.toLowerCase());
    return inFilter && inQ;
  });

  const wrap = { maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 clamp(1.25rem, 5vw, 4rem)" };

  return (
    <div style={{ ...wrap, paddingTop: "clamp(2.5rem,5vw,4rem)", paddingBottom: "var(--section-y)" }}>
      <Eyebrow rule>Field Guide</Eyebrow>
      <h1 style={{ fontSize: "var(--text-h1)", margin: "0.7rem 0 0.4rem" }}>Wildlife of Kruger</h1>
      <p style={{ fontSize: "var(--text-lead)", color: "var(--text-secondary)", maxWidth: "52ch", margin: 0 }}>
        Browse the mammals and birds you are most likely to encounter, with habitat, activity, and conservation status for each.
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", margin: "2rem 0 1.6rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {filters.map((f) => (
            <Tag key={f} tone="neutral" interactive selected={active === f} onClick={() => setActive(f)}>{f}</Tag>
          ))}
        </div>
        <div style={{ width: 280, maxWidth: "100%" }}>
          <Field icon={<i className="ph ph-magnifying-glass" />} placeholder="Search species…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "1.2rem" }}>
        {shown.length} {shown.length === 1 ? "RESULT" : "RESULTS"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.4rem" }}>
        {shown.map((s) => (
          <div key={s.id} onClick={() => onOpen(s)} style={{ cursor: "pointer" }}>
            <Card
              media={<PhotoPlate wash={s.wash} icon={s.icon} label={s.latin} />}
              mediaHeight={160}
              eyebrow={<Badge status={s.iucn} />}
              title={s.name}
              meta={s.activity}
              description={s.blurb}
              footer={<><Tag tone="green" icon={<i className="ph ph-tree" />}>{s.habitat}</Tag><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ochre-700)" }}>View →</span></>}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
window.KW_Explore = Explore;
