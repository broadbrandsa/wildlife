/* Kruger Wild — App · Species detail (full screen) */
function AppSpecies({ species, isLogged, onLog, onBack }) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { IconButton, Button, Tag, Badge, StatBlock, PhotoPlate, Eyebrow } = NS;
  const s = species;
  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--surface-page)", zIndex: 20, overflowY: "auto" }}>
      <div style={{ position: "relative", height: 240 }}>
        <PhotoPlate wash={s.wash} icon={s.icon} label={s.latin} />
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <IconButton label="Back" variant="ondark" onClick={onBack}><i className="ph ph-arrow-left" /></IconButton>
        </div>
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <IconButton label="Share" variant="ondark"><i className="ph ph-share-network" /></IconButton>
        </div>
        <div style={{ position: "absolute", left: 16, bottom: 14 }}><Badge status={s.iucn} solid /></div>
      </div>

      <div style={{ padding: "1.3rem 1.25rem 110px", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <div>
          <Eyebrow>{s.group === "bird" ? "Bird" : "Mammal"}</Eyebrow>
          <h1 style={{ fontSize: "1.8rem", margin: "0.4rem 0 0.1rem" }}>{s.name}</h1>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--text-muted)", margin: 0 }}>{s.latin}</p>
        </div>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{s.long}</p>
        <div style={{ display: "flex", gap: "1.6rem", padding: "1rem 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
          <StatBlock value={s.weight} label="Weight" />
          <StatBlock value={s.best} label="Best time" divider />
          <StatBlock value={s.activity.split(" ")[0]} label="Activity" divider />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.6rem" }}>Habitat</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {s.habitats.map((h) => <Tag key={h} tone="green" icon={<i className="ph ph-tree" />}>{h}</Tag>)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "var(--text-secondary)" }}>
          <i className="ph ph-map-pin" style={{ color: "var(--clay-500)" }} /> {s.where}
        </div>
      </div>

      {/* sticky log bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.9rem 1.25rem 1.2rem", background: "linear-gradient(180deg, rgba(250,246,236,0), var(--surface-page) 30%)" }}>
        <Button fullWidth variant={isLogged ? "secondary" : "accent"} onClick={() => onLog(s.id)}
          iconLeft={<i className={`ph ${isLogged ? "ph-check-circle" : "ph-plus-circle"}`} />}>
          {isLogged ? "Logged on your checklist" : "Log this sighting"}
        </Button>
      </div>
    </div>
  );
}
window.KWA_Species = AppSpecies;
