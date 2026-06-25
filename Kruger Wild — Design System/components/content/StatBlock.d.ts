import * as React from "react";

/** Field-guide figure: large serif value + mono uppercase label. */
export interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The headline figure, e.g. "19,485 km²". */
  value: React.ReactNode;
  /** Mono uppercase caption, e.g. "Park area". */
  label: string;
  /** Optional supporting line below. */
  sub?: string;
  /** @default "left" */
  align?: "left" | "center";
  /** Show a left divider rule (for stat strips). @default false */
  divider?: boolean;
  /** Light text for dark/photographic backgrounds. @default false */
  inverse?: boolean;
}

export function StatBlock(props: StatBlockProps): JSX.Element;
