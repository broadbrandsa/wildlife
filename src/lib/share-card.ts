/**
 * Builds a 1080x1350 result card on a canvas and shares it via the Web Share
 * API (with file support) where available, falling back to a PNG download.
 * No external libraries. Client-only: call from an event handler.
 */

export interface ShareCardInput {
    rangerName: string;
    dogName: string;
    distanceKm: number;
    ratingTitle: string;
    roundName: string;
}

// Brand hexes. Canvas cannot read CSS variables, so the palette is mirrored here.
const BG_INNER = "#21392C";
const BG_OUTER = "#16110A";
const SAND = "#FAF6EC";
const OCHRE = "#E4BE85";
const MUTED = "rgba(245,239,226,0.62)";

const W = 1080;
const H = 1350;

async function loadFonts(): Promise<void> {
    if (typeof document === "undefined" || !document.fonts) return;
    try {
        await Promise.all([
            document.fonts.load('600 108px "Spectral"'),
            document.fonts.load('500 46px "Hanken Grotesk"'),
            document.fonts.load('700 40px "Space Mono"'),
        ]);
        await document.fonts.ready;
    } catch {
        // fonts fall back to system faces; drawing still succeeds
    }
}

function setTracking(ctx: CanvasRenderingContext2D, px: number): void {
    // letterSpacing is supported in modern canvas; ignore where it is not
    try {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
    } catch {
        /* no-op */
    }
}

async function render(input: ShareCardInput): Promise<HTMLCanvasElement> {
    await loadFonts();

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not available");

    // background
    const grad = ctx.createRadialGradient(W / 2, H * 0.28, 80, W / 2, H * 0.5, H * 0.75);
    grad.addColorStop(0, BG_INNER);
    grad.addColorStop(1, BG_OUTER);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    // logo
    try {
        const logo = new Image();
        logo.src = "/logo/kruger-wild-mark.svg";
        await logo.decode();
        if (logo.naturalWidth) ctx.drawImage(logo, W / 2 - 92, 190, 184, 184);
    } catch {
        /* skip logo if it cannot be decoded */
    }

    // round name eyebrow
    ctx.fillStyle = OCHRE;
    ctx.font = '700 34px "Space Mono", monospace';
    setTracking(ctx, 6);
    ctx.fillText(input.roundName.toUpperCase(), W / 2, 470);
    setTracking(ctx, 0);

    // rating title, auto-fit to width
    ctx.fillStyle = OCHRE;
    let size = 112;
    do {
        ctx.font = `600 ${size}px "Spectral", serif`;
        if (ctx.measureText(input.ratingTitle).width <= W - 140) break;
        size -= 4;
    } while (size > 56);
    ctx.fillText(input.ratingTitle, W / 2, 620);

    // ranger with dog
    ctx.fillStyle = SAND;
    ctx.font = '500 46px "Hanken Grotesk", sans-serif';
    ctx.fillText(`${input.rangerName} with ${input.dogName}`, W / 2, 720);

    // distance
    ctx.fillStyle = SAND;
    ctx.font = '700 40px "Space Mono", monospace';
    setTracking(ctx, 4);
    ctx.fillText(`${Math.round(input.distanceKm)} KM FROM THE CAMP`, W / 2, 800);
    setTracking(ctx, 0);

    // hairline
    ctx.strokeStyle = "rgba(245,239,226,0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 160, 1120);
    ctx.lineTo(W / 2 + 160, 1120);
    ctx.stroke();

    // footer lockup
    ctx.fillStyle = SAND;
    ctx.font = '600 46px "Spectral", serif';
    ctx.fillText("SAWC K9 Pin-Drop Hunt", W / 2, 1210);

    ctx.fillStyle = MUTED;
    ctx.font = '400 26px "Space Mono", monospace';
    setTracking(ctx, 3);
    ctx.fillText("IN SUPPORT OF THE SAWC K9 ANTI-POACHING UNIT", W / 2, 1262);
    setTracking(ctx, 0);

    return canvas;
}

/** Renders and shares the result card, or downloads it if sharing is unavailable. */
export async function shareTrackerResult(input: ShareCardInput): Promise<void> {
    const canvas = await render(input);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;

    const file = new File([blob], "sawc-k9-pin-drop-hunt.png", { type: "image/png" });
    const text = `I tracked the poacher to within ${Math.round(input.distanceKm)} km in the SAWC K9 Pin-Drop Hunt.`;
    const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
        share?: (data?: ShareData) => Promise<void>;
    };

    if (nav.canShare && nav.share && nav.canShare({ files: [file] })) {
        try {
            await nav.share({ files: [file], title: "SAWC K9 Pin-Drop Hunt", text });
            return;
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") return; // user cancelled
            // otherwise fall through to download
        }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sawc-k9-pin-drop-hunt.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
