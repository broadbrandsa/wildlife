import * as React from "react";

/**
 * Status indicator with a leading dot. Defaults to IUCN conservation
 * statuses (auto-labels) but works for generic tones.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * IUCN status (lc/nt/vu/en/cr) or generic (info/neutral).
   * When children are omitted, IUCN statuses auto-fill their label.
   * @default "neutral"
   */
  status?: "lc" | "nt" | "vu" | "en" | "cr" | "info" | "neutral";
  /** Solid fill instead of soft tint + dot. @default false */
  solid?: boolean;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
