import * as React from "react";

/**
 * Branded imagery placeholder / wrapper. Without `src` it renders a warm
 * duotone wash + faint glyph; with `src` it renders the photo under a subtle
 * warm overlay so all imagery stays on-palette.
 */
export interface PhotoPlateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Real image URL. Omit to show the branded placeholder. */
  src?: string;
  alt?: string;
  /** Phosphor icon name (without the "ph-" prefix) shown in placeholder mode. @default "image" */
  icon?: string;
  /** Mono caption in placeholder mode. */
  label?: string;
  /** Duotone wash. @default "bushveld" */
  wash?: "bushveld" | "savanna" | "clay" | "dawn" | "sand";
  /** Corner radius override. */
  radius?: string | number;
  children?: React.ReactNode;
}

export function PhotoPlate(props: PhotoPlateProps): JSX.Element;
