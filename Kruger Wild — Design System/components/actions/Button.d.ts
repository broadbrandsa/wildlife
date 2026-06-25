import * as React from "react";

/**
 * Primary action control for Kruger Wild. Pill-shaped, five brand variants.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "ghost" | "ondark";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Icon element rendered before the label (e.g. a Phosphor <i>). */
  iconLeft?: React.ReactNode;
  /** Icon element rendered after the label. */
  iconRight?: React.ReactNode;
  /** Stretch to fill the container width. @default false */
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
