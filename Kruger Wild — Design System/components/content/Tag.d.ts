import * as React from "react";

/** Soft pill for categories, habitats, trail difficulty, and filter chips. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. @default "neutral" */
  tone?: "neutral" | "green" | "ochre" | "clay" | "teal";
  /** Leading icon element (Phosphor <i/>). */
  icon?: React.ReactNode;
  /** Render as a clickable filter chip. @default false */
  interactive?: boolean;
  /** Selected state for filter chips (fills brand green). @default false */
  selected?: boolean;
  /** @default "md" */
  size?: "sm" | "md";
  children?: React.ReactNode;
}

export function Tag(props: TagProps): JSX.Element;
