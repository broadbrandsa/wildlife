import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "SAWC K9 Pin-Drop Hunt",
    description:
        "Track the poacher across the lowveld. Read the clues, drop your pin, and help fund the Southern African Wildlife College K9 Anti-Poaching Unit.",
    applicationName: "SAWC K9 Pin-Drop Hunt",
};

export const viewport: Viewport = {
    themeColor: "#182D23",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    // Lets the app draw behind the iOS home indicator; safe-area env() insets
    // keep the tab bar and bottom sheets clear of it.
    viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* Phosphor icon webfont (regular + fill weights) */}
                <Script src="https://unpkg.com/@phosphor-icons/web@2.1.1" strategy="beforeInteractive" />
            </head>
            <body>{children}</body>
        </html>
    );
}
