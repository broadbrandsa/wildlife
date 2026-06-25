/* Kruger Wild — Website · Footer */
function Footer() {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { Field, Button } = NS;
  const cols = [
    { h: "Explore", links: ["Wildlife", "Big Five", "Birds of Kruger", "Trees & flora", "Maps"] },
    { h: "Visit", links: ["Gates & times", "Rest camps", "Guided drives", "Fees", "Accessibility"] },
    { h: "Conservation", links: ["Anti-poaching", "Research", "Rewilding", "Support us"] },
  ];
  return (
    <footer style={{ background: "var(--green-950)", color: "var(--sand-100)" }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "clamp(2.5rem,5vw,4.5rem) clamp(1.25rem,5vw,4rem) 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(3, 1fr)", gap: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1rem", color: "var(--ochre-300)" }}>
              <img src="../../assets/logo/kruger-wild-mark-mono.svg" width="40" height="40" alt="" />
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "1.3rem", color: "var(--sand-50)" }}>Kruger Wild</span>
            </div>
            <p style={{ color: "rgba(245,239,226,0.7)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "34ch" }}>
              A living field guide to South Africa's flagship national park. Plan, explore, and help protect the lowveld.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.2rem", color: "var(--sand-100)", fontSize: 22 }}>
              <i className="ph ph-instagram-logo" /><i className="ph ph-youtube-logo" /><i className="ph ph-x-logo" />
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ochre-300)", marginBottom: "1rem" }}>{c.h}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {c.links.map((l) => <li key={l}><a href="#" style={{ color: "rgba(245,239,226,0.82)", textDecoration: "none", fontSize: "0.9rem" }}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", paddingTop: "1.6rem", flexWrap: "wrap" }}>
          <div style={{ maxWidth: 360 }}>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <Field label="" placeholder="Your email" inputStyle={{ color: "var(--sand-900)" }} />
              </div>
              <Button variant="accent">Subscribe</Button>
            </div>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.08em", color: "rgba(245,239,226,0.5)" }}>© 2026 KRUGER WILD · DEMO BRAND</span>
        </div>
      </div>
    </footer>
  );
}
window.KW_Footer = Footer;
