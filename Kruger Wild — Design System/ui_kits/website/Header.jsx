/* Kruger Wild — Website · Header */
function Header({ onNav, active }) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const { Button, IconButton } = NS;
  const links = ["Explore", "Plan Your Visit", "Conservation", "Journal"];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.9rem clamp(1.25rem, 5vw, 4rem)",
      background: "rgba(250,246,236,0.86)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--border-subtle)",
    }}>
      <a href="#" onClick={(e) => { e.preventDefault(); onNav("home"); }}
         style={{ display: "flex", alignItems: "center", gap: "0.7rem", textDecoration: "none" }}>
        <img src="../../assets/logo/kruger-wild-mark.svg" width="40" height="40" alt="" />
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "1.25rem", color: "var(--green-900)" }}>Kruger Wild</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ochre-700)", marginTop: 3 }}>South Africa</span>
        </span>
      </a>

      <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {links.map((l) => {
          const key = l === "Explore" ? "explore" : "home";
          const isActive = (l === "Explore" && active === "explore");
          return (
            <a key={l} href="#" onClick={(e) => { e.preventDefault(); onNav(l === "Explore" ? "explore" : "home"); }}
               style={{
                 fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9rem",
                 textDecoration: "none", color: isActive ? "var(--green-800)" : "var(--text-secondary)",
                 borderBottom: isActive ? "2px solid var(--ochre-500)" : "2px solid transparent",
                 paddingBottom: 3,
               }}>{l}</a>
          );
        })}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
        <IconButton label="Search" variant="ghost"><i className="ph ph-magnifying-glass" /></IconButton>
        <Button variant="accent" size="sm">Book a safari</Button>
      </div>
    </header>
  );
}
window.KW_Header = Header;
