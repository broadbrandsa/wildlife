/* Kruger Wild — App · Today (home tab) */
function Today({ species, onOpen, onLog }) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { Tag, Badge, IconButton } = NS;
  const feed = [
    { s: species[1], t: "08:12", dist: "1.2 km", who: "Ranger N." },
    { s: species[0], t: "07:40", dist: "3.8 km", who: "You" },
    { s: species[8], t: "07:05", dist: "0.6 km", who: "M. Dlamini" },
    { s: species[4], t: "06:30", dist: "5.1 km", who: "Self-drive" },
  ];
  const actions = [
    { icon: "binoculars", label: "Log sighting" },
    { icon: "map-trifold", label: "Game map" },
    { icon: "first-aid", label: "Emergency" },
  ];

  return (
    <div style={{ paddingBottom: 96 }}>
      {/* greeting header */}
      <div style={{ padding: "1.4rem 1.25rem 1rem", background: "var(--green-900)", color: "var(--sand-50)", borderRadius: "0 0 22px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ochre-300)" }}>
              <i className="ph ph-map-pin" style={{ marginRight: 5 }} />Skukuza Rest Camp
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "1.7rem", color: "#fff", margin: "0.5rem 0 0" }}>Good morning</h1>
            <p style={{ color: "rgba(245,239,226,0.75)", fontSize: "0.85rem", margin: "0.3rem 0 0" }}>Sunrise 06:14 · 6 sightings logged near you today</p>
          </div>
          <IconButton label="Profile" variant="ondark"><i className="ph ph-user" /></IconButton>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.2rem" }}>
          {actions.map((a) => (
            <button key={a.label} onClick={a.label === "Log sighting" ? onLog : undefined} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "var(--radius-md)", padding: "0.8rem 0.4rem", cursor: "pointer", color: "var(--sand-50)",
            }}>
              <i className={`ph ph-${a.icon}`} style={{ fontSize: 22, color: "var(--ochre-300)" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 600 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* feed */}
      <div style={{ padding: "1.4rem 1.25rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem" }}>
          <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Recent sightings</h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.08em", color: "var(--ochre-700)" }}>LIVE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {feed.map((f, i) => (
            <div key={i} onClick={() => onOpen(f.s)} style={{
              display: "flex", alignItems: "center", gap: "0.9rem", background: "var(--surface-card)",
              borderRadius: "var(--radius-md)", padding: "0.7rem", border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-xs)", cursor: "pointer",
            }}>
              <div style={{ width: 54, height: 54, borderRadius: "var(--radius-sm)", overflow: "hidden", flex: "none",
                background: "linear-gradient(150deg,#2C4A39,#182D23)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className={`ph ph-${f.s.icon}`} style={{ color: "rgba(245,239,226,0.5)", fontSize: 24 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.95rem" }}>{f.s.name}</span>
                  <Badge status={f.s.iucn} />
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 3 }}>{f.t} · {f.dist} away · {f.who}</div>
              </div>
              <i className="ph ph-caret-right" style={{ color: "var(--text-muted)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
window.KWA_Today = Today;
