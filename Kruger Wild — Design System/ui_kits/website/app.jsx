/* Kruger Wild — Website · app orchestrator */
function App() {
  const [view, setView] = React.useState("home");   // home | explore
  const [open, setOpen] = React.useState(null);      // species or null
  const data = window.KW_DATA;

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <React.Fragment>
      <window.KW_Header active={view} onNav={(v) => { setView(v); window.scrollTo(0, 0); }} />
      {view === "home"
        ? <window.KW_Home species={data.species} regions={data.regions} onOpen={setOpen} onExplore={() => { setView("explore"); window.scrollTo(0, 0); }} />
        : <window.KW_Explore species={data.species} onOpen={setOpen} />}
      <window.KW_Footer />
      <window.KW_SpeciesDetail species={open} onClose={() => setOpen(null)} />
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
