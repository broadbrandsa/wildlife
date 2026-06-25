/* Kruger Wild — Website · Species detail drawer */
function SpeciesDetail({ species, onClose }) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { IconButton, Tag, Badge, Button, StatBlock, PhotoPlate, Eyebrow } = NS;
  if (!species) return null;
  const s = species;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(17,32,26,0.5)", backdropFilter: "blur(2px)", animation: "kwFade var(--dur-base) var(--ease-out)" }} />
      <aside style={{
        position: "absolute", top: 0, right: 0, height: "100%", width: "min(520px, 94vw)",
        background: "var(--surface-page)", boxShadow: "var(--shadow-xl)", overflowY: "auto",
        display: "flex", flexDirection: "column", animation: "kwSlide var(--dur-slow) var(--ease-out)",
      }}>
        <div style={{ position: "relative", height: 260, flex: "none" }}>
          <PhotoPlate wash={s.wash} icon={s.icon} label={s.latin} />
          <div style={{ position: "absolute", top: 16, right: 16 }}>
            <IconButton label="Close" variant="ondark" onClick={onClose}><i className="ph ph-x" /></IconButton>
          </div>
          <div style={{ position: "absolute", left: 20, bottom: 16 }}>
            <Badge status={s.iucn} solid />
          </div>
        </div>

        <div style={{ padding: "clamp(1.5rem, 4vw, 2.4rem)", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <div>
            <Eyebrow>{s.group === "bird" ? "Bird" : "Mammal"}</Eyebrow>
            <h2 style={{ fontSize: "var(--text-h2)", margin: "0.5rem 0 0.2rem" }}>{s.name}</h2>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--text-muted)", margin: 0 }}>{s.latin}</p>
          </div>

          <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{s.long}</p>

          <div style={{ display: "flex", gap: "2rem", padding: "1.2rem 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", flexWrap: "wrap" }}>
            <StatBlock value={s.weight} label="Adult weight" />
            <StatBlock value={s.count} label="In the park" divider />
            <StatBlock value={s.best} label="Best viewing" divider />
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.6rem" }}>Habitat</div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {s.habitats.map((h) => <Tag key={h} tone="green" icon={<i className="ph ph-tree" />}>{h}</Tag>)}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            <i className="ph ph-map-pin" style={{ color: "var(--clay-500)" }} />
            {s.where}
          </div>

          <div style={{ display: "flex", gap: "0.7rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
            <Button variant="primary" iconLeft={<i className="ph ph-bookmark-simple" />}>Add to my checklist</Button>
            <Button variant="ghost" iconLeft={<i className="ph ph-share-network" />}>Share</Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
window.KW_SpeciesDetail = SpeciesDetail;
