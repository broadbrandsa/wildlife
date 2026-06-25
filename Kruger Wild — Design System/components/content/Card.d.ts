import * as React from "react";

/**
 * Editorial content card for species, articles, trails, and lodges.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Media slot — a PhotoPlate, <img>, or <image-slot>. */
  media?: React.ReactNode;
  /** Media height in px (default mode). @default 200 */
  mediaHeight?: number;
  /** Eyebrow node (e.g. <Eyebrow> or <Tag>). */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Mono meta line (default mode), e.g. coordinates or distance. */
  meta?: React.ReactNode;
  /** Footer row (default mode) — split left/right. */
  footer?: React.ReactNode;
  /** Content sits over the media with a protection gradient. @default false */
  overlay?: boolean;
  /** Lift + deepen shadow on hover. @default true */
  hoverLift?: boolean;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
