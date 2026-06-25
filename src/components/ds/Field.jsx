"use client";

import React from "react";

/**
 * Kruger Wild — Field
 * Labeled text input with optional leading icon, hint, and error.
 * Soft sand-tinted field; ochre focus ring.
 */
export function Field({
  label, hint, error, icon, id, type = "text", required = false,
  value, defaultValue, placeholder, style, inputStyle, ...rest
}) {
  const reactId = React.useId();
  const fieldId = id || reactId;
  const [focus, setFocus] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", ...style }}>
      {label ? (
        <label htmlFor={fieldId} style={{
          fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)",
          fontSize: "var(--text-sm)", color: "var(--text-primary)",
        }}>
          {label}{required ? <span style={{ color: "var(--clay-500)" }}> *</span> : null}
        </label>
      ) : null}

      <div style={{
        display: "flex", alignItems: "center", gap: "0.6rem",
        background: "var(--surface-card)",
        border: `1.5px solid ${error ? "var(--danger)" : focus ? "var(--ochre-500)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-md)", padding: "0 0.85rem",
        boxShadow: focus ? "0 0 0 3px var(--ochre-100)" : "none",
        transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
      }}>
        {icon ? <span style={{ display: "inline-flex", fontSize: 18, color: "var(--text-muted)" }}>{icon}</span> : null}
        <input
          id={fieldId} type={type} required={required}
          value={value} defaultValue={defaultValue} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
            fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--text-primary)",
            padding: "0.7rem 0", ...inputStyle,
          }}
          {...rest}
        />
      </div>

      {error ? (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--danger)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{hint}</span>
      ) : null}
    </div>
  );
}
