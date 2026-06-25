import Link from "next/link";

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                textAlign: "center",
                padding: "2rem",
                background: "radial-gradient(130% 100% at 50% 0%, #21392C 0%, #16110A 92%)",
                color: "var(--sand-50)",
            }}
        >
            <i className="ph ph-compass" style={{ fontSize: 48, color: "var(--ochre-400)" }} />
            <h1 style={{ color: "#fff", margin: 0 }}>Off the map</h1>
            <p style={{ color: "rgba(245,239,226,0.75)", maxWidth: 320 }}>This track leads nowhere. Head back to the hunt.</p>
            <Link href="/map" style={{ color: "var(--ochre-300)", fontWeight: 600 }}>
                Return to the hunt
            </Link>
        </div>
    );
}
