/* @ds-bundle: {"format":3,"namespace":"KrugerWildDesignSystem_6ab219","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Badge","sourcePath":"components/content/Badge.jsx"},{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/content/Eyebrow.jsx"},{"name":"PhotoPlate","sourcePath":"components/content/PhotoPlate.jsx"},{"name":"StatBlock","sourcePath":"components/content/StatBlock.jsx"},{"name":"Tag","sourcePath":"components/content/Tag.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"132c5009aca6","components/actions/IconButton.jsx":"75d53f0e90d9","components/content/Badge.jsx":"b88acf1d050d","components/content/Card.jsx":"8e7263610bd6","components/content/Eyebrow.jsx":"bcf9175bcfac","components/content/PhotoPlate.jsx":"1d3130c66542","components/content/StatBlock.jsx":"21d68f78143b","components/content/Tag.jsx":"e1c4cae3124c","components/forms/Field.jsx":"fb694871f064","ui_kits/app/AppExplore.jsx":"83744b36ebdc","ui_kits/app/AppSpecies.jsx":"1c82e88b2ee8","ui_kits/app/Log.jsx":"74d4b117f6fa","ui_kits/app/Map.jsx":"33971011bb3b","ui_kits/app/Today.jsx":"3a827ee6f0bf","ui_kits/app/app.jsx":"d8fd81565742","ui_kits/app/data.js":"2b26cfbc28eb","ui_kits/website/Explore.jsx":"229e05ff81cb","ui_kits/website/Footer.jsx":"465cd9c4e637","ui_kits/website/Header.jsx":"62bdffc4b4f8","ui_kits/website/Home.jsx":"054788616517","ui_kits/website/SpeciesDetail.jsx":"98116e2187ff","ui_kits/website/app.jsx":"653503ef13ea","ui_kits/website/data.js":"2b26cfbc28eb"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KrugerWildDesignSystem_6ab219 = window.KrugerWildDesignSystem_6ab219 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kruger Wild — Button
 * Pill-shaped action. Calm, confident; warm shadow on raised variants.
 */
const SIZES = {
  sm: {
    fontSize: "0.8125rem",
    padding: "0.5rem 1rem",
    gap: "0.4rem",
    iconSize: 16
  },
  md: {
    fontSize: "0.9375rem",
    padding: "0.7rem 1.4rem",
    gap: "0.5rem",
    iconSize: 18
  },
  lg: {
    fontSize: "1.0625rem",
    padding: "0.9rem 1.9rem",
    gap: "0.6rem",
    iconSize: 20
  }
};
const VARIANTS = {
  primary: {
    background: "var(--brand)",
    color: "var(--text-inverse)",
    border: "1px solid transparent",
    boxShadow: "var(--shadow-sm)",
    "--hover-bg": "var(--brand-hover)",
    "--active-bg": "var(--brand-active)"
  },
  accent: {
    background: "var(--accent)",
    color: "var(--sand-900)",
    border: "1px solid transparent",
    boxShadow: "var(--shadow-sm)",
    "--hover-bg": "var(--accent-hover)",
    "--active-bg": "var(--ochre-700)"
  },
  secondary: {
    background: "transparent",
    color: "var(--text-brand)",
    border: "1.5px solid var(--green-700)",
    boxShadow: "none",
    "--hover-bg": "var(--green-50)",
    "--active-bg": "var(--green-100)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid transparent",
    boxShadow: "none",
    "--hover-bg": "var(--surface-sunken)",
    "--active-bg": "var(--sand-200)"
  },
  ondark: {
    background: "var(--sand-50)",
    color: "var(--green-900)",
    border: "1px solid transparent",
    boxShadow: "var(--shadow-md)",
    "--hover-bg": "var(--white)",
    "--active-bg": "var(--sand-150)"
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = "button",
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const bg = disabled ? v.background : active && v["--active-bg"] ? v["--active-bg"] : hover && v["--hover-bg"] ? v["--hover-bg"] : v.background;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : "auto",
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: s.fontSize,
      lineHeight: 1,
      letterSpacing: "0.01em",
      padding: s.padding,
      borderRadius: "var(--radius-pill)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transform: active && !disabled ? "translateY(0.5px)" : "none",
      transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
      ...v,
      background: bg,
      ...style
    }
  }, rest), iconLeft ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      fontSize: s.iconSize
    }
  }, iconLeft) : null, children, iconRight ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      fontSize: s.iconSize
    }
  }, iconRight) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kruger Wild — IconButton
 * Circular icon-only control. Pass a Phosphor <i className="ph ph-…" /> as children.
 */
const SIZES = {
  sm: 32,
  md: 40,
  lg: 48
};
const FONT = {
  sm: 16,
  md: 20,
  lg: 24
};
const VARIANTS = {
  solid: {
    background: "var(--brand)",
    color: "var(--text-inverse)",
    border: "1px solid transparent",
    "--hover-bg": "var(--brand-hover)"
  },
  soft: {
    background: "var(--surface-sunken)",
    color: "var(--text-primary)",
    border: "1px solid transparent",
    "--hover-bg": "var(--sand-200)"
  },
  outline: {
    background: "var(--surface-card)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-default)",
    "--hover-bg": "var(--surface-sunken)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
    "--hover-bg": "var(--surface-sunken)"
  }
};
function IconButton({
  children,
  label,
  variant = "soft",
  size = "md",
  disabled = false,
  style,
  ...rest
}) {
  const dim = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.soft;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: dim,
      height: dim,
      borderRadius: "var(--radius-pill)",
      fontSize: FONT[size] || FONT.md,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
      ...v,
      background: hover && !disabled && v["--hover-bg"] ? v["--hover-bg"] : v.background,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/content/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kruger Wild — Badge
 * Status indicator with a leading dot. Built around IUCN conservation
 * statuses but supports generic tones too.
 */
const STATUS = {
  lc: {
    label: "Least Concern",
    dot: "#3C7A4E",
    bg: "var(--green-100)",
    fg: "var(--green-800)"
  },
  nt: {
    label: "Near Threatened",
    dot: "#7A8C2E",
    bg: "var(--green-50)",
    fg: "var(--green-800)"
  },
  vu: {
    label: "Vulnerable",
    dot: "var(--ochre-600)",
    bg: "var(--ochre-100)",
    fg: "var(--ochre-900)"
  },
  en: {
    label: "Endangered",
    dot: "var(--clay-500)",
    bg: "var(--clay-100)",
    fg: "var(--clay-900)"
  },
  cr: {
    label: "Critically Endangered",
    dot: "#8C1F12",
    bg: "var(--clay-100)",
    fg: "var(--clay-900)"
  },
  info: {
    dot: "var(--info)",
    bg: "var(--info-soft)",
    fg: "var(--teal-700)"
  },
  neutral: {
    dot: "var(--sand-500)",
    bg: "var(--surface-sunken)",
    fg: "var(--text-secondary)"
  }
};
function Badge({
  children,
  status = "neutral",
  solid = false,
  style,
  ...rest
}) {
  const s = STATUS[status] || STATUS.neutral;
  const label = children || s.label;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.45rem",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "0.75rem",
      letterSpacing: "0.01em",
      lineHeight: 1.2,
      padding: "0.28rem 0.7rem 0.28rem 0.6rem",
      borderRadius: "var(--radius-sm)",
      background: solid ? s.dot : s.bg,
      color: solid ? "#fff" : s.fg,
      ...style
    }
  }, rest), !solid && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: s.dot,
      flex: "none"
    }
  }), label);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Badge.jsx", error: String((e && e.message) || e) }); }

// components/content/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kruger Wild — Card
 * Editorial content card. Two modes:
 *  - default: media plate on top, content below (species, articles, trails)
 *  - overlay: content sits over a full-bleed media with a protection gradient
 */
function Card({
  media,
  mediaHeight = 200,
  eyebrow,
  title,
  description,
  meta,
  footer,
  overlay = false,
  hoverLift = true,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const shell = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    background: "var(--surface-card)",
    borderRadius: "var(--radius-card)",
    overflow: "hidden",
    border: "1px solid var(--border-subtle)",
    boxShadow: hover && hoverLift ? "var(--shadow-lg)" : "var(--shadow-sm)",
    transform: hover && hoverLift ? "translateY(-3px)" : "none",
    transition: "box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
    ...style
  };
  if (overlay) {
    return /*#__PURE__*/React.createElement("div", _extends({
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        ...shell,
        minHeight: mediaHeight,
        justifyContent: "flex-end"
      }
    }, rest), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0
      }
    }, media), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, rgba(17,32,26,0) 30%, rgba(17,32,26,0.82) 100%)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        padding: "var(--space-5)",
        color: "var(--sand-50)"
      }
    }, eyebrow ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: "0.5rem"
      }
    }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        color: "#fff",
        fontSize: "var(--text-h4)"
      }
    }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "0.4rem 0 0",
        color: "rgba(245,239,226,0.82)",
        fontSize: "var(--text-sm)"
      }
    }, description) : null, children));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: shell
  }, rest), media ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: mediaHeight,
      overflow: "hidden",
      position: "relative"
    }
  }, media) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.55rem",
      padding: "var(--space-5)"
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("div", null, eyebrow) : null, title ? /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-h4)",
      lineHeight: 1.2
    }
  }, title) : null, meta ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.72rem",
      letterSpacing: "0.06em",
      color: "var(--text-muted)"
    }
  }, meta) : null, description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-secondary)",
      fontSize: "var(--text-sm)",
      lineHeight: "var(--leading-normal)"
    }
  }, description) : null, children, footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "0.5rem",
      paddingTop: "var(--space-4)",
      borderTop: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kruger Wild — Eyebrow
 * Mono, uppercase, letter-spaced kicker that sits above headings.
 * Optional leading rule for editorial section openers.
 */
function Eyebrow({
  children,
  rule = false,
  color = "var(--text-accent)",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.6rem",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color,
      ...style
    }
  }, rest), rule ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 1.5,
      background: "currentColor",
      opacity: 0.6
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/content/PhotoPlate.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kruger Wild — PhotoPlate
 * Branded imagery placeholder. Warm duotone wash + a faint Phosphor glyph,
 * standing in for real wildlife/landscape photography. Replace `src` with a
 * real image in production; the plate then renders the photo with a subtle
 * warm overlay to keep it on-palette.
 */
const WASHES = {
  bushveld: "linear-gradient(150deg, #2C4A39 0%, #182D23 70%)",
  savanna: "linear-gradient(150deg, #D6A25A 0%, #A87727 75%)",
  clay: "linear-gradient(150deg, #C66A47 0%, #813620 80%)",
  dawn: "linear-gradient(150deg, #4C7572 0%, #2C4C4A 80%)",
  sand: "linear-gradient(150deg, #EEE7D7 0%, #CCC2AE 85%)"
};
function PhotoPlate({
  src,
  alt = "",
  icon = "image",
  label,
  wash = "bushveld",
  radius,
  style,
  children,
  ...rest
}) {
  const dark = wash !== "sand";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: 120,
      background: WASHES[wash] || WASHES.bushveld,
      overflow: "hidden",
      borderRadius: radius || 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(150deg, rgba(24,45,35,0.10), rgba(24,45,35,0.22))",
      mixBlendMode: "multiply"
    }
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: `ph ph-${icon}`,
    style: {
      fontSize: 44,
      color: dark ? "rgba(245,239,226,0.34)" : "rgba(33,28,20,0.28)"
    }
  }), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 12,
      left: 14,
      fontFamily: "var(--font-mono)",
      fontSize: "0.66rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: dark ? "rgba(245,239,226,0.6)" : "rgba(33,28,20,0.5)"
    }
  }, label) : null), children);
}
Object.assign(__ds_scope, { PhotoPlate });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PhotoPlate.jsx", error: String((e && e.message) || e) }); }

// components/content/StatBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kruger Wild — StatBlock
 * Field-guide figure: a large serif value with a mono uppercase label.
 * Use in stat strips, species vitals, park facts.
 */
function StatBlock({
  value,
  label,
  sub,
  align = "left",
  divider = false,
  inverse = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.35rem",
      textAlign: align,
      paddingLeft: divider ? "var(--space-5)" : 0,
      borderLeft: divider ? `1px solid ${inverse ? "rgba(255,255,255,0.2)" : "var(--border-default)"}` : "none",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "clamp(2rem, 1.2rem + 2vw, 2.9rem)",
      lineHeight: 1,
      letterSpacing: "var(--tracking-tight)",
      color: inverse ? "var(--sand-50)" : "var(--text-primary)"
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.72rem",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: inverse ? "var(--ochre-300)" : "var(--text-accent)"
    }
  }, label), sub ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: inverse ? "rgba(245,239,226,0.7)" : "var(--text-muted)"
    }
  }, sub) : null);
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/content/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kruger Wild — Tag
 * Soft pill for categories, habitats, trail difficulty, filters.
 * Optional leading icon (Phosphor <i/>). Set `interactive` for filter chips.
 */
const TONES = {
  neutral: {
    bg: "var(--surface-sunken)",
    fg: "var(--text-secondary)",
    bd: "var(--border-subtle)"
  },
  green: {
    bg: "var(--green-100)",
    fg: "var(--green-800)",
    bd: "var(--green-200)"
  },
  ochre: {
    bg: "var(--ochre-100)",
    fg: "var(--ochre-900)",
    bd: "var(--ochre-200)"
  },
  clay: {
    bg: "var(--clay-100)",
    fg: "var(--clay-900)",
    bd: "var(--clay-200)"
  },
  teal: {
    bg: "var(--teal-100)",
    fg: "var(--teal-700)",
    bd: "var(--teal-300)"
  }
};
function Tag({
  children,
  tone = "neutral",
  icon,
  interactive = false,
  selected = false,
  size = "md",
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  const pad = size === "sm" ? "0.2rem 0.6rem" : "0.32rem 0.78rem";
  const fs = size === "sm" ? "0.72rem" : "0.8125rem";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-medium)",
      fontSize: fs,
      lineHeight: 1.2,
      padding: pad,
      borderRadius: "var(--radius-pill)",
      background: selected ? "var(--brand)" : t.bg,
      color: selected ? "var(--text-inverse)" : t.fg,
      border: `1px solid ${selected ? "transparent" : t.bd}`,
      cursor: interactive ? "pointer" : "default",
      transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      fontSize: "1.05em"
    }
  }, icon) : null, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kruger Wild — Field
 * Labeled text input with optional leading icon, hint, and error.
 * Soft sand-tinted field; ochre focus ring.
 */
function Field({
  label,
  hint,
  error,
  icon,
  id,
  type = "text",
  required = false,
  value,
  defaultValue,
  placeholder,
  style,
  inputStyle,
  ...rest
}) {
  const reactId = React.useId();
  const fieldId = id || reactId;
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.4rem",
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--text-sm)",
      color: "var(--text-primary)"
    }
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--clay-500)"
    }
  }, " *") : null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      background: "var(--surface-card)",
      border: `1.5px solid ${error ? "var(--danger)" : focus ? "var(--ochre-500)" : "var(--border-default)"}`,
      borderRadius: "var(--radius-md)",
      padding: "0 0.85rem",
      boxShadow: focus ? "0 0 0 3px var(--ochre-100)" : "none",
      transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      fontSize: 18,
      color: "var(--text-muted)"
    }
  }, icon) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    required: required,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      color: "var(--text-primary)",
      padding: "0.7rem 0",
      ...inputStyle
    }
  }, rest))), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--danger)"
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppExplore.jsx
try { (() => {
/* Kruger Wild — App · Explore (species list tab) */
function AppExplore({
  species,
  onOpen
}) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    Field,
    Tag,
    Badge
  } = NS;
  const [q, setQ] = React.useState("");
  const filters = ["All", "Big Five", "Birds"];
  const [f, setF] = React.useState("All");
  const shown = species.filter(s => {
    const inF = f === "All" || f === "Big Five" && s.bigFive || f === "Birds" && s.group === "bird";
    const inQ = !q || (s.name + s.latin).toLowerCase().includes(q.toLowerCase());
    return inF && inQ;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.3rem 1.25rem 96px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "1.6rem",
      margin: "0 0 0.9rem"
    }
  }, "Field guide"), /*#__PURE__*/React.createElement(Field, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-magnifying-glass"
    }),
    placeholder: "Search species\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.5rem",
      margin: "0.9rem 0 1.2rem",
      flexWrap: "wrap"
    }
  }, filters.map(x => /*#__PURE__*/React.createElement(Tag, {
    key: x,
    interactive: true,
    selected: f === x,
    onClick: () => setF(x)
  }, x))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.65rem"
    }
  }, shown.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    onClick: () => onOpen(s),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.9rem",
      background: "var(--surface-card)",
      borderRadius: "var(--radius-md)",
      padding: "0.6rem 0.7rem",
      border: "1px solid var(--border-subtle)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "var(--radius-sm)",
      overflow: "hidden",
      flex: "none",
      background: `linear-gradient(150deg, var(--${s.group === "bird" ? "teal-500" : "green-700"}), var(--green-900))`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph ph-${s.icon}`,
    style: {
      color: "rgba(245,239,226,0.5)",
      fontSize: 22
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: "0.95rem"
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontStyle: "italic",
      fontSize: "0.8rem",
      color: "var(--text-muted)"
    }
  }, s.latin)), /*#__PURE__*/React.createElement(Badge, {
    status: s.iucn
  })))));
}
window.KWA_Explore = AppExplore;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppExplore.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppSpecies.jsx
try { (() => {
/* Kruger Wild — App · Species detail (full screen) */
function AppSpecies({
  species,
  isLogged,
  onLog,
  onBack
}) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    IconButton,
    Button,
    Tag,
    Badge,
    StatBlock,
    PhotoPlate,
    Eyebrow
  } = NS;
  const s = species;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--surface-page)",
      zIndex: 20,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 240
    }
  }, /*#__PURE__*/React.createElement(PhotoPlate, {
    wash: s.wash,
    icon: s.icon,
    label: s.latin
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 14,
      left: 14
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Back",
    variant: "ondark",
    onClick: onBack
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-arrow-left"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 14,
      right: 14
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Share",
    variant: "ondark"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-share-network"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      bottom: 14
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    status: s.iucn,
    solid: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.3rem 1.25rem 110px",
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, s.group === "bird" ? "Bird" : "Mammal"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "1.8rem",
      margin: "0.4rem 0 0.1rem"
    }
  }, s.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-serif)",
      fontStyle: "italic",
      color: "var(--text-muted)",
      margin: 0
    }
  }, s.latin)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      lineHeight: 1.65,
      margin: 0
    }
  }, s.long), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "1.6rem",
      padding: "1rem 0",
      borderTop: "1px solid var(--border-subtle)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: s.weight,
    label: "Weight"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: s.best,
    label: "Best time",
    divider: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: s.activity.split(" ")[0],
    label: "Activity",
    divider: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.64rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: "0.6rem"
    }
  }, "Habitat"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap"
    }
  }, s.habitats.map(h => /*#__PURE__*/React.createElement(Tag, {
    key: h,
    tone: "green",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-tree"
    })
  }, h)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-mono)",
      fontSize: "0.76rem",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-map-pin",
    style: {
      color: "var(--clay-500)"
    }
  }), " ", s.where)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "0.9rem 1.25rem 1.2rem",
      background: "linear-gradient(180deg, rgba(250,246,236,0), var(--surface-page) 30%)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    variant: isLogged ? "secondary" : "accent",
    onClick: () => onLog(s.id),
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: `ph ${isLogged ? "ph-check-circle" : "ph-plus-circle"}`
    })
  }, isLogged ? "Logged on your checklist" : "Log this sighting")));
}
window.KWA_Species = AppSpecies;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppSpecies.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Log.jsx
try { (() => {
/* Kruger Wild — App · Log (my checklist tab) */
function Log({
  species,
  logged,
  onOpen
}) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    Badge,
    StatBlock,
    Button
  } = NS;
  const seen = species.filter(s => logged[s.id]);
  const bigFiveSeen = seen.filter(s => s.bigFive).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.3rem 1.25rem 96px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "1.6rem",
      margin: "0 0 0.2rem"
    }
  }, "My checklist"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "0.88rem",
      margin: "0 0 1.3rem"
    }
  }, "This trip \xB7 Skukuza, Sept 2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "1.6rem",
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding: "1.1rem 1.3rem",
      marginBottom: "1.4rem",
      boxShadow: "var(--shadow-xs)"
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: `${bigFiveSeen}/5`,
    label: "Big Five"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: seen.length,
    label: "Species",
    divider: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "14",
    label: "Sightings",
    divider: true
  })), seen.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "2.5rem 1rem",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-binoculars",
    style: {
      fontSize: 40,
      color: "var(--sand-400)"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0.8rem 0 1.2rem"
    }
  }, "No sightings logged yet."), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-plus"
    })
  }, "Log your first sighting")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.65rem"
    }
  }, seen.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    onClick: () => onOpen(s),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.9rem",
      background: "var(--surface-card)",
      borderRadius: "var(--radius-md)",
      padding: "0.7rem 0.8rem",
      border: "1px solid var(--border-subtle)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-check-circle",
    style: {
      fontSize: 26,
      color: "var(--success)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: "0.95rem"
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.66rem",
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, "Logged ", logged[s.id])), s.bigFive ? /*#__PURE__*/React.createElement(Badge, {
    status: "info"
  }, "Big Five") : null))));
}
window.KWA_Log = Log;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Log.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Map.jsx
try { (() => {
/* Kruger Wild — App · Map (game-drive tab) */
function MapTab({
  onOpen,
  species
}) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    Tag,
    IconButton
  } = NS;
  const pins = [{
    top: "28%",
    left: "32%",
    icon: "paw-print",
    tone: "var(--clay-500)"
  }, {
    top: "44%",
    left: "62%",
    icon: "paw-print",
    tone: "var(--ochre-500)"
  }, {
    top: "62%",
    left: "40%",
    icon: "bird",
    tone: "var(--teal-500)"
  }, {
    top: "70%",
    left: "70%",
    icon: "paw-print",
    tone: "var(--clay-500)"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(160deg,#5C7348 0%,#3C5C49 45%,#2C4A39 100%)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 390 760",
    preserveAspectRatio: "none",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M40 0 C120 160 60 320 160 460 C220 560 180 700 240 760",
    stroke: "#4C7572",
    strokeWidth: "6",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M320 -10 C260 140 340 280 300 420 C270 540 330 660 300 760",
    stroke: "#4C7572",
    strokeWidth: "5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 300 C120 280 240 360 390 330",
    stroke: "#6B8B73",
    strokeWidth: "3",
    fill: "none",
    opacity: "0.6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: "var(--surface-card)",
      borderRadius: "var(--radius-pill)",
      boxShadow: "var(--shadow-md)",
      padding: "0.6rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: "0.85rem",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-magnifying-glass"
  }), " Search the park"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Layers",
    variant: "solid"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-stack"
  }))), pins.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => onOpen(species[i]),
    style: {
      position: "absolute",
      top: p.top,
      left: p.left,
      transform: "translate(-50%,-100%)",
      background: "none",
      border: "none",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 38,
      height: 38,
      borderRadius: "50% 50% 50% 2px",
      background: p.tone,
      transform: "rotate(45deg)",
      boxShadow: "var(--shadow-md)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph ph-${p.icon}`,
    style: {
      transform: "rotate(-45deg)",
      color: "#fff",
      fontSize: 18
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "52%",
      left: "48%",
      transform: "translate(-50%,-50%)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "var(--ochre-400)",
      border: "3px solid #fff",
      boxShadow: "0 0 0 6px rgba(213,162,90,0.3)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 12,
      right: 12,
      bottom: 84,
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-lg)",
      padding: "1rem 1.1rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.64rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ochre-700)"
    }
  }, "Nearby \xB7 last hour"), /*#__PURE__*/React.createElement(Tag, {
    tone: "green",
    size: "sm"
  }, "4 active")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginTop: 6
    }
  }, "Leopard spotted 1.2 km north"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.7rem",
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, "-24.9945\xB0 S \xB7 31.5547\xB0 E \xB7 H1-2 road")));
}
window.KWA_Map = MapTab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Map.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Today.jsx
try { (() => {
/* Kruger Wild — App · Today (home tab) */
function Today({
  species,
  onOpen,
  onLog
}) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    Tag,
    Badge,
    IconButton
  } = NS;
  const feed = [{
    s: species[1],
    t: "08:12",
    dist: "1.2 km",
    who: "Ranger N."
  }, {
    s: species[0],
    t: "07:40",
    dist: "3.8 km",
    who: "You"
  }, {
    s: species[8],
    t: "07:05",
    dist: "0.6 km",
    who: "M. Dlamini"
  }, {
    s: species[4],
    t: "06:30",
    dist: "5.1 km",
    who: "Self-drive"
  }];
  const actions = [{
    icon: "binoculars",
    label: "Log sighting"
  }, {
    icon: "map-trifold",
    label: "Game map"
  }, {
    icon: "first-aid",
    label: "Emergency"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.4rem 1.25rem 1rem",
      background: "var(--green-900)",
      color: "var(--sand-50)",
      borderRadius: "0 0 22px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.62rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--ochre-300)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-map-pin",
    style: {
      marginRight: 5
    }
  }), "Skukuza Rest Camp"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 600,
      fontSize: "1.7rem",
      color: "#fff",
      margin: "0.5rem 0 0"
    }
  }, "Good morning"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "rgba(245,239,226,0.75)",
      fontSize: "0.85rem",
      margin: "0.3rem 0 0"
    }
  }, "Sunrise 06:14 \xB7 6 sightings logged near you today")), /*#__PURE__*/React.createElement(IconButton, {
    label: "Profile",
    variant: "ondark"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-user"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.6rem",
      marginTop: "1.2rem"
    }
  }, actions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.label,
    onClick: a.label === "Log sighting" ? onLog : undefined,
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: "var(--radius-md)",
      padding: "0.8rem 0.4rem",
      cursor: "pointer",
      color: "var(--sand-50)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph ph-${a.icon}`,
    style: {
      fontSize: 22,
      color: "var(--ochre-300)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "0.72rem",
      fontWeight: 600
    }
  }, a.label))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1.4rem 1.25rem 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "0.9rem"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "1.2rem",
      margin: 0
    }
  }, "Recent sightings"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.66rem",
      letterSpacing: "0.08em",
      color: "var(--ochre-700)"
    }
  }, "LIVE")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.7rem"
    }
  }, feed.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: () => onOpen(f.s),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.9rem",
      background: "var(--surface-card)",
      borderRadius: "var(--radius-md)",
      padding: "0.7rem",
      border: "1px solid var(--border-subtle)",
      boxShadow: "var(--shadow-xs)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 54,
      height: 54,
      borderRadius: "var(--radius-sm)",
      overflow: "hidden",
      flex: "none",
      background: "linear-gradient(150deg,#2C4A39,#182D23)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph ph-${f.s.icon}`,
    style: {
      color: "rgba(245,239,226,0.5)",
      fontSize: 24
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: "0.95rem"
    }
  }, f.s.name), /*#__PURE__*/React.createElement(Badge, {
    status: f.s.iucn
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.68rem",
      color: "var(--text-muted)",
      marginTop: 3
    }
  }, f.t, " \xB7 ", f.dist, " away \xB7 ", f.who)), /*#__PURE__*/React.createElement("i", {
    className: "ph ph-caret-right",
    style: {
      color: "var(--text-muted)"
    }
  }))))));
}
window.KWA_Today = Today;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Today.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/app.jsx
try { (() => {
/* Kruger Wild — App · orchestrator + device frame + tab bar */
function TabBar({
  tab,
  setTab
}) {
  const tabs = [{
    id: "today",
    icon: "house",
    label: "Today"
  }, {
    id: "guide",
    icon: "binoculars",
    label: "Guide"
  }, {
    id: "map",
    icon: "map-trifold",
    label: "Map"
  }, {
    id: "log",
    icon: "list-checks",
    label: "Checklist"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "space-around",
      background: "rgba(250,246,236,0.92)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid var(--border-subtle)",
      padding: "0.5rem 0.5rem 1.4rem"
    }
  }, tabs.map(t => {
    const on = tab === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setTab(t.id),
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "0.3rem 0.8rem",
        color: on ? "var(--green-800)" : "var(--text-muted)"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `ph${on ? "-fill" : ""} ph-${t.icon}`,
      style: {
        fontSize: 23
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: "0.62rem",
        fontWeight: on ? 700 : 500
      }
    }, t.label));
  }));
}
function App() {
  const data = window.KW_DATA;
  const [tab, setTab] = React.useState("today");
  const [open, setOpen] = React.useState(null);
  const [logged, setLogged] = React.useState({
    buffalo: "06:30 today",
    giraffe: "Yesterday"
  });
  const toggleLog = id => setLogged(m => {
    const n = {
      ...m
    };
    if (n[id]) delete n[id];else n[id] = "just now";
    return n;
  });
  const screen = {
    today: /*#__PURE__*/React.createElement(window.KWA_Today, {
      species: data.species,
      onOpen: setOpen,
      onLog: () => setTab("guide")
    }),
    guide: /*#__PURE__*/React.createElement(window.KWA_Explore, {
      species: data.species,
      onOpen: setOpen
    }),
    map: /*#__PURE__*/React.createElement(window.KWA_Map, {
      species: data.species,
      onOpen: setOpen
    }),
    log: /*#__PURE__*/React.createElement(window.KWA_Log, {
      species: data.species,
      logged: logged,
      onOpen: setOpen
    })
  }[tab];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background: "radial-gradient(120% 120% at 50% 0%, #2C4A39 0%, #16110A 90%)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      borderRadius: 52,
      background: "#0c0a07",
      padding: 12,
      boxShadow: "0 50px 120px -30px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.06)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      borderRadius: 42,
      overflow: "hidden",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 5,
      background: tab === "today" ? "var(--green-900)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: tab === "today" ? "var(--sand-50)" : "var(--sand-900)"
    }
  }, /*#__PURE__*/React.createElement(StatusBarThemed, {
    dark: tab === "today"
  }))), screen), /*#__PURE__*/React.createElement(TabBar, {
    tab: tab,
    setTab: setTab
  }), open ? /*#__PURE__*/React.createElement(window.KWA_Species, {
    species: open,
    isLogged: !!logged[open.id],
    onLog: toggleLog,
    onBack: () => setOpen(null)
  }) : null)));
}
function StatusBarThemed({
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.55rem 1.6rem 0.25rem",
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: "0.82rem",
      color: dark ? "var(--sand-50)" : "var(--sand-900)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "7:08"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 6,
      fontSize: "0.95rem"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-cell-signal-full"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph ph-wifi-high"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph ph-battery-high"
  })));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
/* Kruger Wild — Website · demo data (fictional copy for a real park) */
window.KW_DATA = {
  species: [{
    id: "lion",
    name: "Lion",
    latin: "Panthera leo",
    iucn: "vu",
    group: "predator",
    bigFive: true,
    wash: "savanna",
    icon: "paw-print",
    activity: "NOCTURNAL · SOCIAL",
    habitat: "Open savanna",
    blurb: "The apex of the lowveld, living in prides across the open grasslands.",
    long: "Kruger's lions live in prides of up to a dozen, defending territories along the seasonal rivers. Most hunting happens after dark; by day they rest in the shade of marula and knobthorn.",
    weight: "190 kg",
    count: "~1,600",
    best: "Dawn",
    habitats: ["Open savanna", "Riverine"],
    where: "Central grasslands · Satara to Olifants"
  }, {
    id: "leopard",
    name: "Leopard",
    latin: "Panthera pardus",
    iucn: "vu",
    group: "predator",
    bigFive: true,
    wash: "bushveld",
    icon: "paw-print",
    activity: "CREPUSCULAR · SOLITARY",
    habitat: "Riverine forest",
    blurb: "The most elusive of the Big Five — secretive, nocturnal, rarely seen by day.",
    long: "Solitary and supremely adaptable, the leopard hauls its kills into the canopy to keep them from lions and hyenas. The dense riverine thickets of the south offer the best chance of a sighting.",
    weight: "60 kg",
    count: "~1,000",
    best: "Dusk",
    habitats: ["Riverine forest", "Rocky koppies"],
    where: "Sabie & Sand River corridors"
  }, {
    id: "elephant",
    name: "African Elephant",
    latin: "Loxodonta africana",
    iucn: "en",
    group: "herbivore",
    bigFive: true,
    wash: "dawn",
    icon: "paw-print",
    activity: "DIURNAL · MATRIARCHAL",
    habitat: "Mopane woodland",
    blurb: "Keystone of the ecosystem, reshaping the landscape as it feeds.",
    long: "Family herds led by an old matriarch range widely between water and forage. As ecosystem engineers, elephants push over trees and open up woodland, creating habitat for countless other species.",
    weight: "6,000 kg",
    count: "~31,000",
    best: "Midday (water)",
    habitats: ["Mopane woodland", "Riverine"],
    where: "Throughout · dense in the north"
  }, {
    id: "rhino",
    name: "White Rhinoceros",
    latin: "Ceratotherium simum",
    iucn: "nt",
    group: "herbivore",
    bigFive: true,
    wash: "clay",
    icon: "paw-print",
    activity: "DIURNAL · GRAZER",
    habitat: "Open grassland",
    blurb: "A grazing giant under heavy guard against poaching.",
    long: "The square-lipped white rhino grazes short grass on the southern plains. Intensive anti-poaching work is central to its survival, and exact locations are never published.",
    weight: "2,100 kg",
    count: "Protected",
    best: "Early morning",
    habitats: ["Open grassland"],
    where: "Location withheld for protection"
  }, {
    id: "buffalo",
    name: "Cape Buffalo",
    latin: "Syncerus caffer",
    iucn: "lc",
    group: "herbivore",
    bigFive: true,
    wash: "bushveld",
    icon: "paw-print",
    activity: "DIURNAL · HERD",
    habitat: "Floodplains",
    blurb: "Unpredictable and formidable, moving in herds many hundreds strong.",
    long: "Buffalo gather in vast herds near water in the dry season, fragmenting into smaller bachelor groups as the rains spread grazing. They are among the most dangerous animals to encounter on foot.",
    weight: "750 kg",
    count: "~40,000",
    best: "Dry season",
    habitats: ["Floodplains", "Open savanna"],
    where: "Rivers & dams park-wide"
  }, {
    id: "giraffe",
    name: "Giraffe",
    latin: "Giraffa giraffa",
    iucn: "lc",
    group: "herbivore",
    bigFive: false,
    wash: "savanna",
    icon: "paw-print",
    activity: "DIURNAL · BROWSER",
    habitat: "Acacia savanna",
    blurb: "Browsing the acacia canopy no other herbivore can reach.",
    long: "The southern giraffe feeds high in the thorn trees, its long neck and prehensile tongue reaching leaves beyond every competitor. Loose herds drift across the open woodland.",
    weight: "1,200 kg",
    count: "~9,000",
    best: "All day",
    habitats: ["Acacia savanna", "Open woodland"],
    where: "Common in the central region"
  }, {
    id: "impala",
    name: "Impala",
    latin: "Aepyceros melampus",
    iucn: "lc",
    group: "herbivore",
    bigFive: false,
    wash: "savanna",
    icon: "paw-print",
    activity: "DIURNAL · HERD",
    habitat: "Ecotone edges",
    blurb: "The lowveld's most abundant antelope — and the bushveld's fast food.",
    long: "Graceful and astonishingly numerous, impala thrive on the edge between woodland and grassland. They are the staple prey of nearly every large predator in the park.",
    weight: "55 kg",
    count: "~150,000",
    best: "All day",
    habitats: ["Ecotone edges", "Riverine"],
    where: "Everywhere — the default sighting"
  }, {
    id: "fish-eagle",
    name: "African Fish Eagle",
    latin: "Haliaeetus vocifer",
    iucn: "lc",
    group: "bird",
    bigFive: false,
    wash: "dawn",
    icon: "bird",
    activity: "DIURNAL · RAPTOR",
    habitat: "Wetland",
    blurb: "Its ringing call is the unmistakable voice of African water.",
    long: "Perched over rivers and dams, the fish eagle drops in a spectacular talon-first strike. Its yelping duet, thrown back over the shoulder, is the iconic soundtrack of the waterways.",
    weight: "3.5 kg",
    count: "Resident",
    best: "Morning",
    habitats: ["Wetland", "Riverine"],
    where: "Major rivers & dams"
  }, {
    id: "secretary-bird",
    name: "Secretary Bird",
    latin: "Sagittarius serpentarius",
    iucn: "en",
    group: "bird",
    bigFive: false,
    wash: "savanna",
    icon: "bird",
    activity: "DIURNAL · TERRESTRIAL",
    habitat: "Open grassland",
    blurb: "A striding raptor that hunts snakes on foot.",
    long: "Unmistakable on its long legs, the secretary bird stamps prey to death across the open veld. Once common, it is now globally endangered and a prized sighting on the southern plains.",
    weight: "4 kg",
    count: "Scarce",
    best: "Mid-morning",
    habitats: ["Open grassland"],
    where: "Southern & central plains"
  }],
  regions: [{
    name: "Southern Rivers",
    tag: "Sabie · Crocodile",
    wash: "bushveld",
    icon: "drop",
    blurb: "Dense riverine bush and the park's richest leopard country."
  }, {
    name: "Central Plains",
    tag: "Satara · Olifants",
    wash: "savanna",
    icon: "sun-horizon",
    blurb: "Open grassland and big-cat territory between two great rivers."
  }, {
    name: "The Far North",
    tag: "Pafuri · Punda Maria",
    wash: "dawn",
    icon: "mountains",
    blurb: "Baobabs, fever-tree forests, and the park's finest birding."
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/Explore.jsx
try { (() => {
/* Kruger Wild — Website · Explore (species directory) */
function Explore({
  species,
  onOpen
}) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    Eyebrow,
    Tag,
    Badge,
    Card,
    PhotoPlate,
    Field
  } = NS;
  const filters = ["All wildlife", "Big Five", "Predators", "Herbivores", "Birds"];
  const [active, setActive] = React.useState("All wildlife");
  const [q, setQ] = React.useState("");
  const shown = species.filter(s => {
    const inFilter = active === "All wildlife" || active === "Big Five" && s.bigFive || active === "Predators" && s.group === "predator" || active === "Herbivores" && s.group === "herbivore" || active === "Birds" && s.group === "bird";
    const inQ = !q || (s.name + " " + s.latin).toLowerCase().includes(q.toLowerCase());
    return inFilter && inQ;
  });
  const wrap = {
    maxWidth: "var(--container-max)",
    margin: "0 auto",
    padding: "0 clamp(1.25rem, 5vw, 4rem)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      paddingTop: "clamp(2.5rem,5vw,4rem)",
      paddingBottom: "var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    rule: true
  }, "Field Guide"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "var(--text-h1)",
      margin: "0.7rem 0 0.4rem"
    }
  }, "Wildlife of Kruger"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-lead)",
      color: "var(--text-secondary)",
      maxWidth: "52ch",
      margin: 0
    }
  }, "Browse the mammals and birds you are most likely to encounter, with habitat, activity, and conservation status for each."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      margin: "2rem 0 1.6rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.6rem",
      flexWrap: "wrap"
    }
  }, filters.map(f => /*#__PURE__*/React.createElement(Tag, {
    key: f,
    tone: "neutral",
    interactive: true,
    selected: active === f,
    onClick: () => setActive(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 280,
      maxWidth: "100%"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-magnifying-glass"
    }),
    placeholder: "Search species\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.72rem",
      letterSpacing: "0.08em",
      color: "var(--text-muted)",
      marginBottom: "1.2rem"
    }
  }, shown.length, " ", shown.length === 1 ? "RESULT" : "RESULTS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "1.4rem"
    }
  }, shown.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    onClick: () => onOpen(s),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    media: /*#__PURE__*/React.createElement(PhotoPlate, {
      wash: s.wash,
      icon: s.icon,
      label: s.latin
    }),
    mediaHeight: 160,
    eyebrow: /*#__PURE__*/React.createElement(Badge, {
      status: s.iucn
    }),
    title: s.name,
    meta: s.activity,
    description: s.blurb,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tag, {
      tone: "green",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ph ph-tree"
      })
    }, s.habitat), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        color: "var(--ochre-700)"
      }
    }, "View \u2192"))
  })))));
}
window.KW_Explore = Explore;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Explore.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
/* Kruger Wild — Website · Footer */
function Footer() {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    Field,
    Button
  } = NS;
  const cols = [{
    h: "Explore",
    links: ["Wildlife", "Big Five", "Birds of Kruger", "Trees & flora", "Maps"]
  }, {
    h: "Visit",
    links: ["Gates & times", "Rest camps", "Guided drives", "Fees", "Accessibility"]
  }, {
    h: "Conservation",
    links: ["Anti-poaching", "Research", "Rewilding", "Support us"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--green-950)",
      color: "var(--sand-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "clamp(2.5rem,5vw,4.5rem) clamp(1.25rem,5vw,4rem) 2rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr repeat(3, 1fr)",
      gap: "2.5rem",
      paddingBottom: "2.5rem",
      borderBottom: "1px solid rgba(255,255,255,0.12)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.7rem",
      marginBottom: "1rem",
      color: "var(--ochre-300)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/kruger-wild-mark-mono.svg",
    width: "40",
    height: "40",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 600,
      fontSize: "1.3rem",
      color: "var(--sand-50)"
    }
  }, "Kruger Wild")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "rgba(245,239,226,0.7)",
      fontSize: "0.9rem",
      lineHeight: 1.6,
      maxWidth: "34ch"
    }
  }, "A living field guide to South Africa's flagship national park. Plan, explore, and help protect the lowveld."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.5rem",
      marginTop: "1.2rem",
      color: "var(--sand-100)",
      fontSize: 22
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-instagram-logo"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph ph-youtube-logo"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph ph-x-logo"
  }))), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.66rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--ochre-300)",
      marginBottom: "1rem"
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "0.65rem"
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "rgba(245,239,226,0.82)",
      textDecoration: "none",
      fontSize: "0.9rem"
    }
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1.5rem",
      paddingTop: "1.6rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.6rem",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "",
    placeholder: "Your email",
    inputStyle: {
      color: "var(--sand-900)"
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "accent"
  }, "Subscribe"))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.66rem",
      letterSpacing: "0.08em",
      color: "rgba(245,239,226,0.5)"
    }
  }, "\xA9 2026 KRUGER WILD \xB7 DEMO BRAND"))));
}
window.KW_Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
/* Kruger Wild — Website · Header */
function Header({
  onNav,
  active
}) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    Button,
    IconButton
  } = NS;
  const links = ["Explore", "Plan Your Visit", "Conservation", "Journal"];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.9rem clamp(1.25rem, 5vw, 4rem)",
      background: "rgba(250,246,236,0.86)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav("home");
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.7rem",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/kruger-wild-mark.svg",
    width: "40",
    height: "40",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 600,
      fontSize: "1.25rem",
      color: "var(--green-900)"
    }
  }, "Kruger Wild"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.52rem",
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: "var(--ochre-700)",
      marginTop: 3
    }
  }, "South Africa"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "2rem"
    }
  }, links.map(l => {
    const key = l === "Explore" ? "explore" : "home";
    const isActive = l === "Explore" && active === "explore";
    return /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNav(l === "Explore" ? "explore" : "home");
      },
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: "0.9rem",
        textDecoration: "none",
        color: isActive ? "var(--green-800)" : "var(--text-secondary)",
        borderBottom: isActive ? "2px solid var(--ochre-500)" : "2px solid transparent",
        paddingBottom: 3
      }
    }, l);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.7rem"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Search",
    variant: "ghost"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-magnifying-glass"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm"
  }, "Book a safari")));
}
window.KW_Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
/* Kruger Wild — Website · Home */
function Home({
  species,
  regions,
  onOpen,
  onExplore
}) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    Button,
    Eyebrow,
    Tag,
    Badge,
    StatBlock,
    Card,
    PhotoPlate
  } = NS;
  const wrap = {
    maxWidth: "var(--container-max)",
    margin: "0 auto",
    padding: "0 clamp(1.25rem, 5vw, 4rem)"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      minHeight: "82vh",
      display: "flex",
      alignItems: "flex-end",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0
    }
  }, /*#__PURE__*/React.createElement(PhotoPlate, {
    wash: "bushveld",
    icon: "paw-print"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(17,32,26,0.45) 0%, rgba(17,32,26,0.18) 35%, rgba(17,32,26,0.86) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      position: "relative",
      paddingBottom: "clamp(2.5rem, 6vw, 5rem)",
      paddingTop: "4rem",
      color: "var(--sand-50)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    rule: true,
    color: "var(--ochre-300)"
  }, "Field Guide to the Lowveld"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 600,
      color: "#fff",
      fontSize: "clamp(2.75rem, 1.6rem + 5.2vw, 5.5rem)",
      lineHeight: 1.02,
      letterSpacing: "-0.02em",
      margin: "1rem 0 0",
      maxWidth: "16ch"
    }
  }, "Where the wild still runs"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-lead)",
      lineHeight: 1.6,
      color: "rgba(245,239,226,0.9)",
      maxWidth: "48ch",
      margin: "1.2rem 0 0"
    }
  }, "Nearly two million hectares of South African bushveld \u2014 home to the Big Five, 507 bird species, and a story written across two billion years of rock."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.9rem",
      marginTop: "2rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-arrow-right"
    }),
    onClick: onExplore
  }, "Explore the wildlife"), /*#__PURE__*/React.createElement(Button, {
    variant: "ondark",
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-map-trifold"
    })
  }, "Plan your visit")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "2rem",
      marginTop: "2.6rem",
      fontFamily: "var(--font-mono)",
      fontSize: "0.72rem",
      letterSpacing: "0.1em",
      color: "rgba(245,239,226,0.7)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", null, "-24.9945\xB0 S, 31.5547\xB0 E"), /*#__PURE__*/React.createElement("span", null, "GATES 05:30\u201418:00"), /*#__PURE__*/React.createElement("span", null, "EST. 1898")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-card)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: "flex",
      gap: "clamp(1.5rem,5vw,4rem)",
      padding: "clamp(2rem,4vw,3rem) clamp(1.25rem,5vw,4rem)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "19,485",
    label: "Park area (km\xB2)"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "147",
    label: "Mammal species",
    divider: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "507",
    label: "Bird species",
    divider: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "336",
    label: "Tree species",
    divider: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "1898",
    label: "Established",
    divider: true
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: "var(--section-y) clamp(1.25rem,5vw,4rem)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "1rem",
      marginBottom: "2.2rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    rule: true
  }, "The Big Five"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-h1)",
      margin: "0.7rem 0 0",
      maxWidth: "18ch"
    }
  }, "Five animals that define the bushveld")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-arrow-right"
    }),
    onClick: onExplore
  }, "All 147 species")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "1.4rem"
    }
  }, species.slice(0, 5).map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    onClick: () => onOpen(s),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    media: /*#__PURE__*/React.createElement(PhotoPlate, {
      wash: s.wash,
      icon: s.icon,
      label: s.latin
    }),
    mediaHeight: 170,
    eyebrow: /*#__PURE__*/React.createElement(Badge, {
      status: s.iucn
    }),
    title: s.name,
    meta: s.activity,
    description: s.blurb,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tag, {
      tone: "green",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "ph ph-tree"
      })
    }, s.habitat), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        color: "var(--ochre-700)"
      }
    }, "View \u2192"))
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-card)",
      borderTop: "1px solid var(--border-subtle)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: "var(--section-y) clamp(1.25rem,5vw,4rem)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    rule: true
  }, "Regions"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-h1)",
      margin: "0.7rem 0 2rem",
      maxWidth: "20ch"
    }
  }, "From the southern rivers to the far north"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "1.4rem"
    }
  }, regions.map(r => /*#__PURE__*/React.createElement(Card, {
    key: r.name,
    overlay: true,
    mediaHeight: 320,
    media: /*#__PURE__*/React.createElement(PhotoPlate, {
      wash: r.wash,
      icon: r.icon
    }),
    eyebrow: /*#__PURE__*/React.createElement(Eyebrow, {
      color: "var(--ochre-300)"
    }, r.tag),
    title: r.name,
    description: r.blurb
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: "var(--section-y) clamp(1.25rem,5vw,4rem)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      gap: "0",
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      boxShadow: "var(--shadow-lg)",
      minHeight: 340
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--green-900)",
      color: "var(--sand-50)",
      padding: "clamp(2rem,4vw,3.4rem)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "var(--ochre-300)"
  }, "Plan your visit"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 600,
      color: "#fff",
      fontSize: "var(--text-h1)",
      margin: "0.8rem 0 0.6rem",
      lineHeight: 1.05
    }
  }, "Nine gates. One unforgettable wilderness."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "rgba(245,239,226,0.82)",
      maxWidth: "42ch",
      lineHeight: 1.6
    }
  }, "Reserve gate entry, book a rest camp, or set out on a guided drive. Everything you need to meet the bushveld on its own terms."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.8rem",
      marginTop: "1.6rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    iconRight: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-arrow-right"
    })
  }, "Book your trip"), /*#__PURE__*/React.createElement(Button, {
    variant: "ondark"
  }, "Gate times & fees"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(PhotoPlate, {
    wash: "savanna",
    icon: "tent"
  })))));
}
window.KW_Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SpeciesDetail.jsx
try { (() => {
/* Kruger Wild — Website · Species detail drawer */
function SpeciesDetail({
  species,
  onClose
}) {
  const NS = window.KrugerWildDesignSystem_6ab219;
  const {
    IconButton,
    Tag,
    Badge,
    Button,
    StatBlock,
    PhotoPlate,
    Eyebrow
  } = NS;
  if (!species) return null;
  const s = species;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(17,32,26,0.5)",
      backdropFilter: "blur(2px)",
      animation: "kwFade var(--dur-base) var(--ease-out)"
    }
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      height: "100%",
      width: "min(520px, 94vw)",
      background: "var(--surface-page)",
      boxShadow: "var(--shadow-xl)",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      animation: "kwSlide var(--dur-slow) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 260,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(PhotoPlate, {
    wash: s.wash,
    icon: s.icon,
    label: s.latin
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 16,
      right: 16
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Close",
    variant: "ondark",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-x"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 20,
      bottom: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    status: s.iucn,
    solid: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "clamp(1.5rem, 4vw, 2.4rem)",
      display: "flex",
      flexDirection: "column",
      gap: "1.4rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, s.group === "bird" ? "Bird" : "Mammal"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-h2)",
      margin: "0.5rem 0 0.2rem"
    }
  }, s.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-serif)",
      fontStyle: "italic",
      color: "var(--text-muted)",
      margin: 0
    }
  }, s.latin)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      lineHeight: 1.65,
      margin: 0
    }
  }, s.long), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "2rem",
      padding: "1.2rem 0",
      borderTop: "1px solid var(--border-subtle)",
      borderBottom: "1px solid var(--border-subtle)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: s.weight,
    label: "Adult weight"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: s.count,
    label: "In the park",
    divider: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: s.best,
    label: "Best viewing",
    divider: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.66rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: "0.6rem"
    }
  }, "Habitat"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap"
    }
  }, s.habitats.map(h => /*#__PURE__*/React.createElement(Tag, {
    key: h,
    tone: "green",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-tree"
    })
  }, h)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      fontFamily: "var(--font-mono)",
      fontSize: "0.78rem",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-map-pin",
    style: {
      color: "var(--clay-500)"
    }
  }), s.where), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.7rem",
      marginTop: "0.4rem",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-bookmark-simple"
    })
  }, "Add to my checklist"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-share-network"
    })
  }, "Share")))));
}
window.KW_SpeciesDetail = SpeciesDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SpeciesDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/app.jsx
try { (() => {
/* Kruger Wild — Website · app orchestrator */
function App() {
  const [view, setView] = React.useState("home"); // home | explore
  const [open, setOpen] = React.useState(null); // species or null
  const data = window.KW_DATA;
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.KW_Header, {
    active: view,
    onNav: v => {
      setView(v);
      window.scrollTo(0, 0);
    }
  }), view === "home" ? /*#__PURE__*/React.createElement(window.KW_Home, {
    species: data.species,
    regions: data.regions,
    onOpen: setOpen,
    onExplore: () => {
      setView("explore");
      window.scrollTo(0, 0);
    }
  }) : /*#__PURE__*/React.createElement(window.KW_Explore, {
    species: data.species,
    onOpen: setOpen
  }), /*#__PURE__*/React.createElement(window.KW_Footer, null), /*#__PURE__*/React.createElement(window.KW_SpeciesDetail, {
    species: open,
    onClose: () => setOpen(null)
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
/* Kruger Wild — Website · demo data (fictional copy for a real park) */
window.KW_DATA = {
  species: [{
    id: "lion",
    name: "Lion",
    latin: "Panthera leo",
    iucn: "vu",
    group: "predator",
    bigFive: true,
    wash: "savanna",
    icon: "paw-print",
    activity: "NOCTURNAL · SOCIAL",
    habitat: "Open savanna",
    blurb: "The apex of the lowveld, living in prides across the open grasslands.",
    long: "Kruger's lions live in prides of up to a dozen, defending territories along the seasonal rivers. Most hunting happens after dark; by day they rest in the shade of marula and knobthorn.",
    weight: "190 kg",
    count: "~1,600",
    best: "Dawn",
    habitats: ["Open savanna", "Riverine"],
    where: "Central grasslands · Satara to Olifants"
  }, {
    id: "leopard",
    name: "Leopard",
    latin: "Panthera pardus",
    iucn: "vu",
    group: "predator",
    bigFive: true,
    wash: "bushveld",
    icon: "paw-print",
    activity: "CREPUSCULAR · SOLITARY",
    habitat: "Riverine forest",
    blurb: "The most elusive of the Big Five — secretive, nocturnal, rarely seen by day.",
    long: "Solitary and supremely adaptable, the leopard hauls its kills into the canopy to keep them from lions and hyenas. The dense riverine thickets of the south offer the best chance of a sighting.",
    weight: "60 kg",
    count: "~1,000",
    best: "Dusk",
    habitats: ["Riverine forest", "Rocky koppies"],
    where: "Sabie & Sand River corridors"
  }, {
    id: "elephant",
    name: "African Elephant",
    latin: "Loxodonta africana",
    iucn: "en",
    group: "herbivore",
    bigFive: true,
    wash: "dawn",
    icon: "paw-print",
    activity: "DIURNAL · MATRIARCHAL",
    habitat: "Mopane woodland",
    blurb: "Keystone of the ecosystem, reshaping the landscape as it feeds.",
    long: "Family herds led by an old matriarch range widely between water and forage. As ecosystem engineers, elephants push over trees and open up woodland, creating habitat for countless other species.",
    weight: "6,000 kg",
    count: "~31,000",
    best: "Midday (water)",
    habitats: ["Mopane woodland", "Riverine"],
    where: "Throughout · dense in the north"
  }, {
    id: "rhino",
    name: "White Rhinoceros",
    latin: "Ceratotherium simum",
    iucn: "nt",
    group: "herbivore",
    bigFive: true,
    wash: "clay",
    icon: "paw-print",
    activity: "DIURNAL · GRAZER",
    habitat: "Open grassland",
    blurb: "A grazing giant under heavy guard against poaching.",
    long: "The square-lipped white rhino grazes short grass on the southern plains. Intensive anti-poaching work is central to its survival, and exact locations are never published.",
    weight: "2,100 kg",
    count: "Protected",
    best: "Early morning",
    habitats: ["Open grassland"],
    where: "Location withheld for protection"
  }, {
    id: "buffalo",
    name: "Cape Buffalo",
    latin: "Syncerus caffer",
    iucn: "lc",
    group: "herbivore",
    bigFive: true,
    wash: "bushveld",
    icon: "paw-print",
    activity: "DIURNAL · HERD",
    habitat: "Floodplains",
    blurb: "Unpredictable and formidable, moving in herds many hundreds strong.",
    long: "Buffalo gather in vast herds near water in the dry season, fragmenting into smaller bachelor groups as the rains spread grazing. They are among the most dangerous animals to encounter on foot.",
    weight: "750 kg",
    count: "~40,000",
    best: "Dry season",
    habitats: ["Floodplains", "Open savanna"],
    where: "Rivers & dams park-wide"
  }, {
    id: "giraffe",
    name: "Giraffe",
    latin: "Giraffa giraffa",
    iucn: "lc",
    group: "herbivore",
    bigFive: false,
    wash: "savanna",
    icon: "paw-print",
    activity: "DIURNAL · BROWSER",
    habitat: "Acacia savanna",
    blurb: "Browsing the acacia canopy no other herbivore can reach.",
    long: "The southern giraffe feeds high in the thorn trees, its long neck and prehensile tongue reaching leaves beyond every competitor. Loose herds drift across the open woodland.",
    weight: "1,200 kg",
    count: "~9,000",
    best: "All day",
    habitats: ["Acacia savanna", "Open woodland"],
    where: "Common in the central region"
  }, {
    id: "impala",
    name: "Impala",
    latin: "Aepyceros melampus",
    iucn: "lc",
    group: "herbivore",
    bigFive: false,
    wash: "savanna",
    icon: "paw-print",
    activity: "DIURNAL · HERD",
    habitat: "Ecotone edges",
    blurb: "The lowveld's most abundant antelope — and the bushveld's fast food.",
    long: "Graceful and astonishingly numerous, impala thrive on the edge between woodland and grassland. They are the staple prey of nearly every large predator in the park.",
    weight: "55 kg",
    count: "~150,000",
    best: "All day",
    habitats: ["Ecotone edges", "Riverine"],
    where: "Everywhere — the default sighting"
  }, {
    id: "fish-eagle",
    name: "African Fish Eagle",
    latin: "Haliaeetus vocifer",
    iucn: "lc",
    group: "bird",
    bigFive: false,
    wash: "dawn",
    icon: "bird",
    activity: "DIURNAL · RAPTOR",
    habitat: "Wetland",
    blurb: "Its ringing call is the unmistakable voice of African water.",
    long: "Perched over rivers and dams, the fish eagle drops in a spectacular talon-first strike. Its yelping duet, thrown back over the shoulder, is the iconic soundtrack of the waterways.",
    weight: "3.5 kg",
    count: "Resident",
    best: "Morning",
    habitats: ["Wetland", "Riverine"],
    where: "Major rivers & dams"
  }, {
    id: "secretary-bird",
    name: "Secretary Bird",
    latin: "Sagittarius serpentarius",
    iucn: "en",
    group: "bird",
    bigFive: false,
    wash: "savanna",
    icon: "bird",
    activity: "DIURNAL · TERRESTRIAL",
    habitat: "Open grassland",
    blurb: "A striding raptor that hunts snakes on foot.",
    long: "Unmistakable on its long legs, the secretary bird stamps prey to death across the open veld. Once common, it is now globally endangered and a prized sighting on the southern plains.",
    weight: "4 kg",
    count: "Scarce",
    best: "Mid-morning",
    habitats: ["Open grassland"],
    where: "Southern & central plains"
  }],
  regions: [{
    name: "Southern Rivers",
    tag: "Sabie · Crocodile",
    wash: "bushveld",
    icon: "drop",
    blurb: "Dense riverine bush and the park's richest leopard country."
  }, {
    name: "Central Plains",
    tag: "Satara · Olifants",
    wash: "savanna",
    icon: "sun-horizon",
    blurb: "Open grassland and big-cat territory between two great rivers."
  }, {
    name: "The Far North",
    tag: "Pafuri · Punda Maria",
    wash: "dawn",
    icon: "mountains",
    blurb: "Baobabs, fever-tree forests, and the park's finest birding."
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.PhotoPlate = __ds_scope.PhotoPlate;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Field = __ds_scope.Field;

})();
