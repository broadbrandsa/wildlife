/* Kruger Wild — App · Map (game-drive tab) */
function MapTab({ onOpen, species }) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { Tag, IconButton } = NS;
  const pins = [
    { top: "28%", left: "32%", icon: "paw-print", tone: "var(--clay-500)" },
    { top: "44%", left: "62%", icon: "paw-print", tone: "var(--ochre-500)" },
    { top: "62%", left: "40%", icon: "bird", tone: "var(--teal-500)" },
    { top: "70%", left: "70%", icon: "paw-print", tone: "var(--clay-500)" },
  ];
  return (
    <div style={{ position: "relative", height: "100%" }}>
      {/* map surface */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#5C7348 0%,#3C5C49 45%,#2C4A39 100%)" }}>
        {/* faux rivers */}
        <svg viewBox="0 0 390 760" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}>
          <path d="M40 0 C120 160 60 320 160 460 C220 560 180 700 240 760" stroke="#4C7572" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M320 -10 C260 140 340 280 300 420 C270 540 330 660 300 760" stroke="#4C7572" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M0 300 C120 280 240 360 390 330" stroke="#6B8B73" strokeWidth="3" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* search bar overlay */}
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", gap: 8 }}>
        <div style={{ flex: 1, background: "var(--surface-card)", borderRadius: "var(--radius-pill)", boxShadow: "var(--shadow-md)",
          padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <i className="ph ph-magnifying-glass" /> Search the park
        </div>
        <IconButton label="Layers" variant="solid"><i className="ph ph-stack" /></IconButton>
      </div>

      {/* pins */}
      {pins.map((p, i) => (
        <button key={i} onClick={() => onOpen(species[i])} style={{ position: "absolute", top: p.top, left: p.left, transform: "translate(-50%,-100%)",
          background: "none", border: "none", cursor: "pointer" }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50% 50% 50% 2px",
            background: p.tone, transform: "rotate(45deg)", boxShadow: "var(--shadow-md)" }}>
            <i className={`ph ph-${p.icon}`} style={{ transform: "rotate(-45deg)", color: "#fff", fontSize: 18 }} />
          </span>
        </button>
      ))}

      {/* you are here */}
      <div style={{ position: "absolute", top: "52%", left: "48%", transform: "translate(-50%,-50%)" }}>
        <span style={{ display: "block", width: 16, height: 16, borderRadius: "50%", background: "var(--ochre-400)", border: "3px solid #fff", boxShadow: "0 0 0 6px rgba(213,162,90,0.3)" }} />
      </div>

      {/* bottom sheet */}
      <div style={{ position: "absolute", left: 12, right: 12, bottom: 84, background: "var(--surface-card)", borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)", padding: "1rem 1.1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ochre-700)" }}>Nearby · last hour</div>
          <Tag tone="green" size="sm">4 active</Tag>
        </div>
        <div style={{ fontWeight: 700, marginTop: 6 }}>Leopard spotted 1.2 km north</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>-24.9945° S · 31.5547° E · H1-2 road</div>
      </div>
    </div>
  );
}
window.KWA_Map = MapTab;
