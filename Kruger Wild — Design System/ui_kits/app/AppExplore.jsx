/* Kruger Wild — App · Explore (species list tab) */
function AppExplore({ species, onOpen }) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { Field, Tag, Badge } = NS;
  const [q, setQ] = React.useState("");
  const filters = ["All", "Big Five", "Birds"];
  const [f, setF] = React.useState("All");

  const shown = species.filter((s) => {
    const inF = f === "All" || (f === "Big Five" && s.bigFive) || (f === "Birds" && s.group === "bird");
    const inQ = !q || (s.name + s.latin).toLowerCase().includes(q.toLowerCase());
    return inF && inQ;
  });

  return (
    <div style={{ padding: "1.3rem 1.25rem 96px" }}>
      <h1 style={{ fontSize: "1.6rem", margin: "0 0 0.9rem" }}>Field guide</h1>
      <Field icon={<i className="ph ph-magnifying-glass" />} placeholder="Search species…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div style={{ display: "flex", gap: "0.5rem", margin: "0.9rem 0 1.2rem", flexWrap: "wrap" }}>
        {filters.map((x) => <Tag key={x} interactive selected={f === x} onClick={() => setF(x)}>{x}</Tag>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {shown.map((s) => (
          <div key={s.id} onClick={() => onOpen(s)} style={{
            display: "flex", alignItems: "center", gap: "0.9rem", background: "var(--surface-card)",
            borderRadius: "var(--radius-md)", padding: "0.6rem 0.7rem", border: "1px solid var(--border-subtle)", cursor: "pointer",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", overflow: "hidden", flex: "none",
              background: `linear-gradient(150deg, var(--${s.group === "bird" ? "teal-500" : "green-700"}), var(--green-900))`,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className={`ph ph-${s.icon}`} style={{ color: "rgba(245,239,226,0.5)", fontSize: 22 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.95rem" }}>{s.name}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.8rem", color: "var(--text-muted)" }}>{s.latin}</div>
            </div>
            <Badge status={s.iucn} />
          </div>
        ))}
      </div>
    </div>
  );
}
window.KWA_Explore = AppExplore;
