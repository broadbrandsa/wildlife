"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import { useGameStore } from "@/store/game";
import { PhoneStage } from "@/components/game/PhoneStage";

const TABS = [
    { id: "map", href: "/map", icon: "map-trifold", label: "Hunt" },
    { id: "journal", href: "/journal", icon: "notebook", label: "Journal" },
    { id: "shop", href: "/shop", icon: "binoculars", label: "Kit" },
    { id: "team", href: "/team", icon: "dog", label: "K9 Unit" },
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
        <PhoneStage scroll={false}>
            {/* NOTE: no -webkit-overflow-scrolling here. That legacy property makes
                iOS Safari clip position:fixed descendants (the bottom sheets and
                modals) to this scroll box; modern iOS scrolls with momentum anyway. */}
            <main
                className="kw-noscroll"
                style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingBottom: "5.5rem" }}
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
                        padding: "0.5rem 0.5rem calc(0.7rem + env(safe-area-inset-bottom))",
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
        </PhoneStage>
    );
}
