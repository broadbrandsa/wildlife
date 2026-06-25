import * as React from "react";

/** Circular icon-only control. Always provide `label` for accessibility. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label / tooltip — required. */
  label: string;
  /** @default "soft" */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** A Phosphor icon element, e.g. <i className="ph ph-heart" />. */
  children?: React.ReactNode;
}

export function IconButton(props: IconButtonProps): JSX.Element;
