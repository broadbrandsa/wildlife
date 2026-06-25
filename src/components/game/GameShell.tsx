"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import { useGameStore } from "@/store/game";

const TABS = [
    { id: "map", href: "/map", icon: "map-trifold", label: "Hunt" },
    { id: "journal", href: "/journal", icon: "notebook", label: "Journal" },
    { id: "shop", href: "/shop", icon: "binoculars", label: "Kit" },
    { id: "profile", href: "/profile", icon: "user", label: "You" },
];

function Loader() {
    return (
        <div
            style={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "radial-gradient(120% 120% at 50% 0%, #2C4A39 0%, #16110A 90%)",
            }}
        >
            <i className="ph ph-paw-print kw-spin" style={{ fontSize: 40, color: "var(--ochre-400)" }} />
        </div>
    );
}

export function GameShell({ children }: { children: React.ReactNode }) {
    const hydrated = useHydrated();
    const player = useGameStore((s) => s.player);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (hydrated && !player) router.replace("/welcome");
    }, [hydrated, player, router]);

    if (!hydrated || !player) return <Loader />;

    return (
        <div
            style={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
                background: "radial-gradient(130% 100% at 50% 0%, #21392C 0%, #16110A 92%)",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 480,
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--surface-page)",
                    boxShadow: "0 40px 100px -30px rgba(0,0,0,0.6)",
                }}
            >
                <main
                    className="kw-noscroll"
                    style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", paddingBottom: "5.5rem" }}
                >
                    {children}
                </main>

                <nav
                    style={{
                        position: "sticky",
                        bottom: 0,
                        display: "flex",
                        justifyContent: "space-around",
                        background: "rgba(250,246,236,0.92)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        borderTop: "1px solid var(--border-subtle)",
                        padding: "0.5rem 0.5rem 1.3rem",
                    }}
                >
                    {TABS.map((t) => {
                        const on = pathname === t.href || pathname.startsWith(t.href + "/");
                        return (
                            <button
                                key={t.id}
                                onClick={() => router.push(t.href)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 3,
                                    padding: "0.3rem 0.9rem",
                                    color: on ? "var(--green-800)" : "var(--text-muted)",
                                }}
                            >
                                <i className={`ph${on ? "-fill" : ""} ph-${t.icon}`} style={{ fontSize: 23 }} />
                                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: on ? 700 : 500 }}>
                                    {t.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
