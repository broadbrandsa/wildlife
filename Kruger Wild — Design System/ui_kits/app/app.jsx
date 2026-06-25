/* Kruger Wild — App · orchestrator + device frame + tab bar */
function TabBar({ tab, setTab }) {
  const tabs = [
    { id: "today", icon: "house", label: "Today" },
    { id: "guide", icon: "binoculars", label: "Guide" },
    { id: "map", icon: "map-trifold", label: "Map" },
    { id: "log", icon: "list-checks", label: "Checklist" },
  ];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "space-around",
      background: "rgba(250,246,236,0.92)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--border-subtle)",
      padding: "0.5rem 0.5rem 1.4rem" }}>
      {tabs.map((t) => {
        const on = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0.3rem 0.8rem",
            color: on ? "var(--green-800)" : "var(--text-muted)" }}>
            <i className={`ph${on ? "-fill" : ""} ph-${t.icon}`} style={{ fontSize: 23 }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: on ? 700 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function App() {
  const data = window.KW_DATA;
  const [tab, setTab] = React.useState("today");
  const [open, setOpen] = React.useState(null);
  const [logged, setLogged] = React.useState({ buffalo: "06:30 today", giraffe: "Yesterday" });

  const toggleLog = (id) => setLogged((m) => {
    const n = { ...m };
    if (n[id]) delete n[id]; else n[id] = "just now";
    return n;
  });

  const screen = {
    today: <window.KWA_Today species={data.species} onOpen={setOpen} onLog={() => setTab("guide")} />,
    guide: <window.KWA_Explore species={data.species} onOpen={setOpen} />,
    map: <window.KWA_Map species={data.species} onOpen={setOpen} />,
    log: <window.KWA_Log species={data.species} logged={logged} onOpen={setOpen} />,
  }[tab];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
      background: "radial-gradient(120% 120% at 50% 0%, #2C4A39 0%, #16110A 90%)" }}>
      {/* device */}
      <div style={{ width: 390, height: 844, borderRadius: 52, background: "#0c0a07", padding: 12,
        boxShadow: "0 50px 120px -30px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.06)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 42, overflow: "hidden",
          background: "var(--surface-page)" }}>
          {/* dynamic status header background bleeds from today; default sand */}
          <div style={{ position: "absolute", inset: 0, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            {/* status bar sits over green on today, over sand elsewhere */}
            <div style={{ position: "sticky", top: 0, zIndex: 5, background: tab === "today" ? "var(--green-900)" : "transparent" }}>
              <div style={{ color: tab === "today" ? "var(--sand-50)" : "var(--sand-900)" }}>
                <StatusBarThemed dark={tab === "today"} />
              </div>
            </div>
            {screen}
          </div>
          <TabBar tab={tab} setTab={setTab} />
          {open ? (
            <window.KWA_Species species={open} isLogged={!!logged[open.id]} onLog={toggleLog} onBack={() => setOpen(null)} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatusBarThemed({ dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.55rem 1.6rem 0.25rem",
      fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.82rem", color: dark ? "var(--sand-50)" : "var(--sand-900)" }}>
      <span>7:08</span>
      <span style={{ display: "flex", gap: 6, fontSize: "0.95rem" }}>
        <i className="ph ph-cell-signal-full" /><i className="ph ph-wifi-high" /><i className="ph ph-battery-high" />
      </span>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
