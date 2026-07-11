"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Portals a full-screen overlay (bottom sheet, modal, card) to document.body,
 * so it can never be clipped or out-stacked by the app shell's scroll
 * containers or the tab bar. iOS Safari in particular contains position:fixed
 * elements inside scrollable ancestors under several conditions; rendering at
 * the body root sidesteps the whole class of bug.
 */
export function Overlay({ children }: { children: ReactNode }) {
    if (typeof document === "undefined") return null;
    return createPortal(children, document.body);
}
