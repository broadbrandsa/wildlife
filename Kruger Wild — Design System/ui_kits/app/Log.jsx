/* Kruger Wild — App · Log (my checklist tab) */
function Log({ species, logged, onOpen }) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { Badge, StatBlock, Button } = NS;
  const seen = species.filter((s) => logged[s.id]);
  const bigFiveSeen = seen.filter((s) => s.bigFive).length;

  return (
    <div style={{ padding: "1.3rem 1.25rem 96px" }}>
      <h1 style={{ fontSize: "1.6rem", margin: "0 0 0.2rem" }}>My checklist</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", margin: "0 0 1.3rem" }}>This trip · Skukuza, Sept 2026</p>

      <div style={{ display: "flex", gap: "1.6rem", background: "var(--surface-card)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)", padding: "1.1rem 1.3rem", marginBottom: "1.4rem", boxShadow: "var(--shadow-xs)" }}>
        <StatBlock value={`${bigFiveSeen}/5`} label="Big Five" />
        <StatBlock value={seen.length} label="Species" divider />
        <StatBlock value="14" label="Sightings" divider />
      </div>

      {seen.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
          <i className="ph ph-binoculars" style={{ fontSize: 40, color: "var(--sand-400)" }} />
          <p style={{ margin: "0.8rem 0 1.2rem" }}>No sightings logged yet.</p>
          <Button variant="accent" iconLeft={<i className="ph ph-plus" />}>Log your first sighting</Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {seen.map((s) => (
            <div key={s.id} onClick={() => onOpen(s)} style={{
              display: "flex", alignItems: "center", gap: "0.9rem", background: "var(--surface-card)",
              borderRadius: "var(--radius-md)", padding: "0.7rem 0.8rem", border: "1px solid var(--border-subtle)", cursor: "pointer",
            }}>
              <i className="ph ph-check-circle" style={{ fontSize: 26, color: "var(--success)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{s.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--text-muted)", marginTop: 2 }}>Logged {logged[s.id]}</div>
              </div>
              {s.bigFive ? <Badge status="info">Big Five</Badge> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
window.KWA_Log = Log;
