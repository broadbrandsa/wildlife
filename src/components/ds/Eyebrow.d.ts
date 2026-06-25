import * as React from "react";

/** Mono uppercase kicker shown above headings / section openers. */
export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show a short leading rule before the text. @default false */
  rule?: boolean;
  /** Override text color (defaults to ochre). */
  color?: string;
  children?: React.ReactNode;
}

export function Eyebrow(props: EyebrowProps): JSX.Element;
