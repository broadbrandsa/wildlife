import * as React from "react";

/** Labeled text input with optional leading icon, hint, and error state. */
export interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: string;
  /** Helper text below the field. */
  hint?: string;
  /** Error message — also turns the border/ring red. */
  error?: string;
  /** Leading icon element (Phosphor <i/>). */
  icon?: React.ReactNode;
  /** @default "text" */
  type?: string;
  required?: boolean;
  /** Style for the outer wrapper. */
  style?: React.CSSProperties;
  /** Style applied to the <input> itself. */
  inputStyle?: React.CSSProperties;
}

export function Field(props: FieldProps): JSX.Element;
