/* @ds-bundle: {"format":3,"namespace":"SecuenceDesignSystem_019e27","components":[],"sourceHashes":{"tokens.js":"effc7f052487","ui_kits/app/Atoms.jsx":"7da19f3a9678","ui_kits/app/Dialog.jsx":"c3701a90941b","ui_kits/app/Forms.jsx":"2d46948e8c24","ui_kits/app/Layout.jsx":"276303433cde","ui_kits/app/List.jsx":"acc8c9ee6302","ui_kits/app/PatientComponents.jsx":"aa2ffe7aee11","ui_kits/app/Screens.jsx":"addf3ac65b7c"},"inlinedExternals":[],"unexposedExports":[{"name":"primitive","sourcePath":"tokens.js"},{"name":"semantic","sourcePath":"tokens.js"},{"name":"size","sourcePath":"tokens.js"},{"name":"typography","sourcePath":"tokens.js"}]} */

(() => {

const __ds_ns = (window.SecuenceDesignSystem_019e27 = window.SecuenceDesignSystem_019e27 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// tokens.js
try { (() => {
/**
 * Secuence design tokens — flat JS export.
 * Hex values pulled verbatim from the four `*.tokens.json` files
 * exported from Figma.  Names mirror the Figma variable paths
 * (incl. the Spanish-spelled "secundary").
 */

const primitive = {
  neutral: {
    0: "#FCFCFC",
    25: "#F7F7F7",
    50: "#F0F0F0",
    100: "#EBEBEB",
    150: "#E3E3E3",
    200: "#D9D9D9",
    250: "#CCCCCC",
    300: "#BEBEBE",
    350: "#A8A8A8",
    400: "#959595",
    450: "#767676",
    500: "#626262",
    550: "#4C4C4C",
    600: "#393939",
    650: "#272727",
    700: "#131313",
    750: "#0B0B0B"
  },
  purple: {
    0: "#FBF3FF",
    50: "#F7EEFC",
    100: "#F3E8F8",
    150: "#EEE0F5",
    200: "#E5D3EE",
    250: "#D1B4DF",
    300: "#B388C9",
    350: "#8D53AA",
    400: "#82439B",
    450: "#77368C",
    500: "#552D78",
    550: "#402465",
    600: "#2D1D51",
    650: "#1E163D",
    700: "#110F2A",
    750: "#080916"
  },
  pink: {
    0: "#FFF0FA",
    50: "#FFEBF8",
    100: "#FFE0F4",
    150: "#FDD8F0",
    200: "#FDC9E8",
    250: "#F8A0D4",
    300: "#EF5CB0",
    350: "#E1007E",
    400: "#C9006F",
    450: "#B10060",
    500: "#990053",
    550: "#800045",
    600: "#680038",
    650: "#50002B",
    700: "#38001E",
    750: "#200011"
  },
  blue: {
    0: "#F0F6FF",
    50: "#E7F0FF",
    100: "#C8DEFF",
    150: "#AACBFF",
    200: "#8BB9FF",
    250: "#6CA6FF",
    300: "#4E94FF",
    350: "#2F82FF",
    400: "#1170FF",
    450: "#0060F1",
    500: "#0054D2",
    550: "#0047B1",
    600: "#003B93",
    650: "#002E74",
    700: "#002255",
    750: "#001637"
  },
  green: {
    0: "#EDFDF7",
    50: "#E3FCF4",
    100: "#C7FAEA",
    150: "#A6F7DD",
    200: "#8AF5D3",
    250: "#6EF2C8",
    300: "#52F0BE",
    350: "#31EDB1",
    400: "#15EAA6",
    450: "#12CE92",
    500: "#10B27F",
    550: "#0D9167",
    600: "#0A7553",
    650: "#08593F",
    700: "#053D2B",
    750: "#021C14"
  },
  yellow: {
    0: "#FDF8EC",
    50: "#FDF2E2",
    100: "#FBE5C6",
    150: "#F8D6A5",
    200: "#F6C888",
    250: "#F4BB6C",
    300: "#F2AE4F",
    350: "#F09F2E",
    400: "#EE9211",
    450: "#D1800F",
    500: "#B56F0D",
    550: "#935A0B",
    600: "#774909",
    650: "#5A3706",
    700: "#3E2604",
    750: "#1D1202"
  }
};
const semantic = {
  bg: {
    surface: {
      primary: primitive.neutral[0],
      "primary-hovered": primitive.neutral[25],
      secundary: primitive.neutral[25],
      "secundary-hovered": primitive.neutral[50],
      "secundary-pressed": primitive.neutral[100],
      tertiary: primitive.neutral[350],
      brand: primitive.purple[0],
      "brand-hovered": primitive.purple[50],
      "brand-selected": primitive.purple[150],
      disabled: primitive.neutral[500],
      invert: primitive.neutral[750],
      "invert-hovered": primitive.neutral[650],
      "invert-secundary": primitive.neutral[600],
      "invert-secundary-hovered": primitive.neutral[650]
    },
    fill: {
      "accent-primary": primitive.purple[400],
      "accent-secundary": primitive.pink[350],
      "accent-hovered": primitive.purple[500],
      "accent-pressed": primitive.purple[550],
      "tonal-primary": primitive.purple[0],
      "tonal-hovered": primitive.purple[50],
      "tonal-pressed": primitive.purple[100],
      disabled: primitive.neutral[25],
      "opacity-80": "rgba(11,11,11,0.80)"
    },
    warning: {
      primary: primitive.yellow[150],
      secundary: primitive.yellow[500],
      tertiary: primitive.yellow[0],
      "tertiary-hovered": primitive.yellow[50],
      "tertiary-pressed": primitive.yellow[100]
    },
    success: {
      primary: primitive.green[150],
      secundary: primitive.green[600],
      tertiary: primitive.green[0],
      "tertiary-hovered": primitive.green[50],
      "tertiary-pressed": primitive.green[100]
    },
    error: {
      primary: primitive.pink[150],
      secundary: primitive.pink[400],
      tertiary: primitive.pink[0],
      "tertiary-hovered": primitive.pink[50],
      "tertiary-pressed": primitive.pink[100]
    },
    info: {
      primary: primitive.blue[150],
      secundary: primitive.blue[500],
      tertiary: primitive.blue[0],
      "tertiary-hovered": primitive.blue[50],
      "tertiary-pressed": primitive.blue[100]
    }
  },
  text: {
    primary: primitive.neutral[750],
    "primary-hovered": primitive.neutral[650],
    secundary: primitive.neutral[600],
    "secundary-hovered": primitive.neutral[550],
    tertiary: primitive.neutral[500],
    disabled: primitive.neutral[450],
    invert: primitive.neutral[0],
    brand: primitive.purple[400],
    "brand-hovered": primitive.purple[300],
    success: primitive.green[650],
    error: primitive.pink[450],
    warning: primitive.yellow[650],
    info: primitive.blue[650]
  },
  icon: {
    primary: primitive.neutral[750],
    "primary-hovered": primitive.neutral[650],
    secundary: primitive.neutral[600],
    "secundary-hovered": primitive.neutral[550],
    tertiary: primitive.neutral[500],
    disabled: primitive.neutral[450],
    invert: primitive.neutral[0],
    brand: primitive.purple[400],
    success: primitive.green[650],
    error: primitive.pink[450],
    warning: primitive.yellow[650],
    info: primitive.blue[650]
  },
  border: {
    primary: primitive.neutral[100],
    secundary: primitive.neutral[200],
    tertiary: primitive.neutral[300],
    brand: primitive.purple[350],
    warning: primitive.yellow[500],
    success: primitive.green[600],
    error: primitive.pink[400],
    info: primitive.blue[500],
    disabled: primitive.neutral[300],
    "invert-primary": primitive.neutral[750],
    "invert-secundary": primitive.neutral[600]
  }
};
const size = {
  space: {
    0: 0,
    "0_25": 1,
    "0_5": 2,
    "0_75": 3,
    1: 4,
    "1_5": 6,
    2: 8,
    "2_5": 10,
    3: 12,
    "3_5": 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    19: 76,
    20: 80,
    23: 92,
    24: 96,
    28: 112,
    32: 128,
    36: 144,
    40: 160,
    60: 240,
    62: 248
  },
  stroke: {
    none: 0,
    default: 1,
    active: 2,
    focused: 4
  },
  radius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
    "2xl": 16,
    "3xl": 20,
    "4xl": 24,
    "5xl": 28,
    full: 99999
  },
  icon: {
    sm: 24,
    md: 32,
    lg: 44,
    xlg: 56,
    xxlg: 112
  }
};
const typography = {
  family: {
    Geist: "Geist"
  },
  weight: {
    Thin: 100,
    ExtraLight: 200,
    Light: 300,
    Regular: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
    ExtraBold: 800,
    Black: 900
  },
  size: {
    xxs: 12,
    xs: 14,
    s: 16,
    m: 20,
    l: 24,
    xl: 28,
    xxl: 32,
    "3xl": 36,
    "4xl": 40,
    "5xl": 44,
    "6xl": 48,
    "7xl": 52,
    "8xl": 56,
    "9xl": 60,
    "10xl": 72
  },
  lineHeight: {
    xxs: 14,
    xs: 16,
    s: 20,
    m: 24,
    l: 30,
    xl: 34,
    xxl: 38,
    "3xl": 44,
    "4xl": 48,
    "5xl": 54,
    "6xl": 58,
    "7xl": 62,
    "8xl": 68,
    "9xl": 72,
    "10xl": 86
  }
};
try {
  void {
    primitive,
    semantic,
    size,
    typography
  };
} catch {}
Object.assign(__ds_scope, { primitive, semantic, size, typography });
})(); } catch (e) { __ds_ns.__errors.push({ path: "tokens.js", error: String((e && e.message) || e) }); }

// ui_kits/app/Atoms.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Atoms — Buttons, Chips, Badges, Avatars, Inputs.
// Each helper is exported to window at the bottom so other Babel
// scripts can pick it up.

const Icon = ({
  name,
  size = 20,
  fill = 0,
  weight = 400,
  style = {},
  className = ""
}) => /*#__PURE__*/React.createElement("span", {
  className: `material-symbols-outlined ${className}`,
  style: {
    fontSize: size,
    lineHeight: `${size}px`,
    width: size,
    height: size,
    fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
    flex: "0 0 auto",
    ...style
  }
}, name);
const Button = ({
  variant = "filled",
  size = "md",
  icon,
  iconAfter,
  children,
  disabled = false,
  style = {},
  ...rest
}) => {
  const heights = {
    sm: 36,
    md: 44,
    lg: 56
  };
  const px = {
    sm: 14,
    md: 16,
    lg: 24
  };
  const fontPx = size === "sm" ? 13 : 14;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const variants = {
    filled: {
      background: "#82439B",
      color: "#FCFCFC"
    },
    "filled-hover": {
      background: "#77368C",
      color: "#FCFCFC"
    },
    // tonal — Figma "Button · Filled tonal icon": bg-fill-tonal-primary on text-primary
    tonal: {
      background: "var(--bg-fill-tonal-primary)",
      color: "var(--text-primary)"
    },
    outlined: {
      background: "transparent",
      color: "var(--text-secundary)",
      border: "1px solid var(--border-secundary)"
    },
    // text — formal Figma "Button text": no fill, color-shift states,
    // focused = 1px brand ring via inset shadow (keeps height exact).
    text: {
      background: "transparent",
      color: "var(--text-primary)"
    },
    "text-brand": {
      background: "transparent",
      color: "var(--color-purple-450)"
    },
    brand: {
      background: "var(--bg-fill-brand-gradient)",
      color: "#FFF"
    },
    destructive: {
      background: "var(--color-pink-400)",
      color: "#FFF"
    }
  };
  // Interactive overrides for the text variant (faithful to the state matrix).
  const textState = variant === "text" ? disabled ? {
    color: "var(--text-disabled)"
  } : focus ? {
    boxShadow: "inset 0 0 0 1px var(--border-brand)"
  } : hover && !active ? {
    color: "var(--text-secundary-hovered)"
  } : {
    color: "var(--text-primary)"
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    disabled: disabled,
    onMouseEnter: e => {
      setHover(true);
      rest.onMouseEnter && rest.onMouseEnter(e);
    },
    onMouseLeave: e => {
      setHover(false);
      setActive(false);
      rest.onMouseLeave && rest.onMouseLeave(e);
    },
    onMouseDown: e => {
      setActive(true);
      rest.onMouseDown && rest.onMouseDown(e);
    },
    onMouseUp: e => {
      setActive(false);
      rest.onMouseUp && rest.onMouseUp(e);
    },
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      height: heights[size],
      padding: `0 ${px[size]}px`,
      borderRadius: 99999,
      border: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: "var(--font-family-geist)",
      fontWeight: 500,
      fontSize: fontPx,
      lineHeight: "20px",
      letterSpacing: "-0.03em",
      cursor: disabled ? "not-allowed" : "pointer",
      outline: "none",
      transition: "background 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
      ...variants[variant],
      ...textState,
      ...style
    }
  }), icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: size === "sm" ? 16 : 18
  }), children, iconAfter && /*#__PURE__*/React.createElement(Icon, {
    name: iconAfter,
    size: size === "sm" ? 16 : 18
  }));
};
const IconButton = ({
  icon,
  variant = "standard",
  style = {},
  size = 40,
  ...rest
}) => {
  const variants = {
    filled: {
      background: "var(--color-purple-400)",
      color: "#FCFCFC"
    },
    tonal: {
      background: "var(--bg-fill-tonal-primary)",
      color: "var(--text-primary)"
    },
    destructive: {
      background: "var(--color-pink-400)",
      color: "#FFF"
    },
    standard: {
      background: "transparent",
      color: "var(--text-secundary)"
    },
    outlined: {
      background: "transparent",
      color: "var(--text-secundary)",
      border: "1px solid var(--border-secundary)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    style: {
      width: size,
      height: size,
      borderRadius: 99999,
      border: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "background 120ms",
      ...variants[variant],
      ...style
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20
  }));
};
const Chip = ({
  tone = "neutral",
  icon,
  children,
  style = {},
  dot = false,
  outlined = false,
  ...rest
}) => {
  const tones = {
    red: {
      bg: "#FDD8F0",
      fg: "#B10060",
      dot: "#C9006F"
    },
    yellow: {
      bg: "#FFF1D6",
      fg: "#5A3706",
      dot: "#935A0B"
    },
    green: {
      bg: "#D8F6E8",
      fg: "#08593F",
      dot: "#0A7553"
    },
    blue: {
      bg: "#DDEAFB",
      fg: "#002C70",
      dot: "#0054D2"
    },
    purple: {
      bg: "#EEE0F5",
      fg: "#4A1F60",
      dot: "#82439B"
    },
    neutral: {
      bg: "#EBEBEB",
      fg: "#393939",
      dot: "#767676"
    }
  };
  const t = tones[tone];
  const base = {
    height: 26,
    padding: "0 10px",
    borderRadius: 99999,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    font: "500 12px/14px var(--font-family-geist)",
    letterSpacing: "-0.02em",
    whiteSpace: "nowrap",
    ...style
  };
  if (outlined) {
    return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
      style: {
        ...base,
        background: "transparent",
        color: t.fg,
        border: "1px solid var(--border-secundary)"
      }
    }), dot && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 99,
        background: t.dot
      }
    }), icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 14
    }), children);
  }
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      ...base,
      background: t.bg,
      color: t.fg
    }
  }), icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 14
  }), children);
};
const Badge = ({
  children,
  tone = "filled",
  style = {}
}) => {
  const tones = {
    filled: {
      background: "var(--color-pink-400)",
      color: "#FCFCFC"
    },
    purple: {
      background: "var(--color-purple-400)",
      color: "#FCFCFC"
    },
    neutral: {
      background: "var(--color-neutral-450)",
      color: "#FCFCFC"
    },
    outlined: {
      background: "transparent",
      color: "var(--text-secundary)",
      border: "1px solid var(--border-secundary)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 18,
      height: 18,
      padding: "0 6px",
      borderRadius: 99999,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      font: "500 11px/100% var(--font-family-geist)",
      ...tones[tone],
      ...style
    }
  }, children);
};
const AVATAR_COLORS = ["#82439B", "#C9006F", "#0A7553", "#0054D2", "#935A0B", "#4A1F60"];
const Avatar = ({
  initials = "?",
  size = 40,
  color,
  style = {}
}) => {
  const c = color ?? AVATAR_COLORS[(initials.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 99999,
      background: c,
      color: "#FCFCFC",
      display: "grid",
      placeItems: "center",
      font: `600 ${Math.round(size * 0.36)}px/100% var(--font-family-geist)`,
      letterSpacing: "-0.02em",
      flex: "0 0 auto",
      ...style
    }
  }, initials);
};
const AvatarGroup = ({
  people,
  size = 32,
  max = 4
}) => {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex"
    }
  }, shown.map((p, i) => /*#__PURE__*/React.createElement(Avatar, {
    key: i,
    initials: p.initials,
    color: p.color,
    size: size,
    style: {
      marginLeft: i === 0 ? 0 : -10,
      border: "2px solid #FFFFFF"
    }
  })), extra > 0 && /*#__PURE__*/React.createElement(Avatar, {
    initials: `+${extra}`,
    color: "#F0F0F0",
    size: size,
    style: {
      marginLeft: -10,
      border: "2px solid #FFFFFF",
      color: "#393939"
    }
  }));
};

// Legacy compact field — used by search bars (no floating label). Untouched.
const InputCompact = ({
  icon,
  iconAfter,
  error = false,
  style = {},
  wrapperStyle = {},
  ...rest
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#FFFFFF",
    border: `1px solid ${error ? "var(--color-pink-400)" : "var(--border-secundary)"}`,
    borderRadius: 4,
    padding: "10px 12px",
    transition: "border 120ms, box-shadow 120ms",
    ...wrapperStyle
  }
}, icon && /*#__PURE__*/React.createElement(Icon, {
  name: icon,
  size: 20,
  style: {
    color: "var(--text-tertiary)"
  }
}), /*#__PURE__*/React.createElement("input", _extends({}, rest, {
  style: {
    border: 0,
    outline: 0,
    flex: 1,
    padding: 0,
    background: "transparent",
    font: "400 14px/20px var(--font-family-geist)",
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
    ...style
  }
})), iconAfter && /*#__PURE__*/React.createElement(Icon, {
  name: iconAfter,
  size: 20,
  style: {
    color: "var(--text-tertiary)"
  }
}));

// Input · Form field — Figma notched outlined input with floating label.
// Outlined 56px container · label floats on focus/fill · no focus glow.
// Pass `label` to opt into this mode; without it you get the compact field.
const Input = ({
  label,
  required = false,
  suffix,
  iconAfter,
  error = false,
  hint,
  disabled = false,
  notchBg = "#FFFFFF",
  value,
  defaultValue,
  onChange,
  placeholder = "",
  style = {},
  wrapperStyle = {},
  ...rest
}) => {
  if (!label) {
    return /*#__PURE__*/React.createElement(InputCompact, _extends({
      iconAfter: iconAfter,
      error: error,
      style: style,
      wrapperStyle: wrapperStyle,
      value: value,
      defaultValue: defaultValue,
      onChange: onChange,
      disabled: disabled,
      placeholder: placeholder || undefined
    }, rest));
  }
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [hasText, setHasText] = React.useState((value ?? defaultValue ?? "") !== "");
  const filled = value != null ? value !== "" : hasText;
  // Label is always floated (notched) in every state by design.

  const border = disabled ? "var(--border-disabled)" : error ? "var(--border-error)" : focused ? "var(--border-brand)" : hovered ? "var(--color-neutral-650)" : "var(--border-secundary)";
  const inputColor = disabled ? "var(--text-disabled)" : hovered && !focused ? "var(--text-secundary-hovered)" : "var(--text-secundary)";
  const labelColor = disabled ? "var(--text-disabled)" : error ? "var(--text-error)" : "var(--text-brand)";
  const iconColor = disabled ? "var(--text-tertiary)" : error ? "var(--color-pink-500)" : hovered && !focused ? "var(--text-secundary-hovered)" : "var(--color-neutral-450)";
  const supportColor = disabled ? "var(--text-disabled)" : error ? "var(--text-error)" : hovered && !focused ? "var(--text-secundary-hovered)" : "var(--text-secundary)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrapperStyle
    }
  }, /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      position: "relative",
      height: 56,
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: "0 16px",
      border: `1px solid ${border}`,
      borderRadius: 4,
      background: disabled ? "var(--bg-surface-secundary)" : "transparent",
      transition: "border-color 120ms ease"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    value: value,
    defaultValue: defaultValue,
    disabled: disabled,
    placeholder: placeholder,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    },
    onChange: e => {
      setHasText(e.target.value !== "");
      onChange && onChange(e);
    },
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      padding: 0,
      background: "transparent",
      font: "400 16px/20px var(--font-family-geist)",
      letterSpacing: "-0.030em",
      color: inputColor,
      ...style
    }
  })), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "0 0 auto",
      font: "400 16px/20px var(--font-family-geist)",
      letterSpacing: "-0.030em",
      color: disabled ? "var(--text-disabled)" : "var(--text-tertiary)"
    }
  }, suffix), iconAfter && /*#__PURE__*/React.createElement(Icon, {
    name: error ? "error" : iconAfter,
    size: 24,
    style: {
      color: iconColor,
      cursor: disabled ? "not-allowed" : "pointer"
    }
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      position: "absolute",
      left: 16,
      top: 0,
      transform: "translateY(-50%)",
      pointerEvents: "none",
      padding: "0 4px",
      background: disabled ? "var(--bg-surface-secundary)" : notchBg,
      font: "400 12px/14px var(--font-family-geist)",
      letterSpacing: "-0.030em",
      color: labelColor,
      whiteSpace: "nowrap"
    }
  }, label, required && " (obligatorio)")), hint && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 16px",
      font: "400 12px/14px var(--font-family-geist)",
      letterSpacing: "-0.030em",
      color: supportColor
    }
  }, hint));
};
const SlideToggle = ({
  on,
  onChange
}) => /*#__PURE__*/React.createElement("button", {
  onClick: () => onChange && onChange(!on),
  style: {
    position: "relative",
    width: 44,
    height: 24,
    background: on ? "var(--color-purple-450)" : "var(--color-neutral-200)",
    border: 0,
    borderRadius: 99999,
    cursor: "pointer",
    transition: "background 120ms"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    left: 2,
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 99999,
    background: "#FFF",
    boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
    transform: on ? "translateX(20px)" : "translateX(0)",
    transition: "transform 120ms"
  }
}));
const Divider = ({
  vertical = false,
  style = {}
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--border-primary)",
    flex: "0 0 auto",
    ...(vertical ? {
      width: 1,
      alignSelf: "stretch"
    } : {
      height: 1,
      width: "100%"
    }),
    ...style
  }
});
Object.assign(window, {
  Icon,
  Button,
  IconButton,
  Chip,
  Badge,
  Avatar,
  AvatarGroup,
  Input,
  SlideToggle,
  Divider,
  AVATAR_COLORS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Atoms.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Dialog.jsx
try { (() => {
// SystemStatusDialog — Figma "Dialog · System status"
// Modal status dialog with 4 types (warning / alert / success / info).
// Header: two-tone status icon + headline + close. Body: description.
// Footer: Button text (neutral) + Button filled · Tonal (per design spec).
//
// Usage:
//   <SystemStatusDialog
//     type="success"
//     title="Seguimiento creado correctamente"
//     description="El paciente recibirá la notificación en los próximos minutos."
//     confirmText="Ver seguimiento"
//     cancelText="Cerrar"
//     onConfirm={...}
//     onClose={...}
//   />
// Render it conditionally (e.g. {open && <SystemStatusDialog .../>}).

const DIALOG_TYPES = {
  warning: {
    icon: "back_hand",
    border: "var(--border-error)",
    outer: "var(--bg-error-tertiary)",
    inner: "var(--bg-error-primary)",
    glyph: "var(--color-pink-400)"
  },
  alert: {
    icon: "warning",
    border: "var(--border-warning)",
    outer: "var(--bg-warning-tertiary)",
    inner: "var(--bg-warning-primary)",
    glyph: "var(--color-yellow-650)"
  },
  success: {
    icon: "check_circle",
    border: "var(--color-green-500)",
    outer: "var(--bg-success-tertiary)",
    inner: "var(--bg-success-primary)",
    glyph: "var(--color-green-650)"
  },
  info: {
    icon: "info",
    border: "var(--border-info)",
    outer: "var(--bg-info-tertiary)",
    inner: "var(--bg-info-primary)",
    glyph: "var(--color-blue-650)"
  }
};
const SystemStatusDialog = ({
  type = "info",
  title = "Title text goes here",
  description = "Description text goes here",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  showCancel = true,
  onConfirm,
  onClose
}) => {
  const t = DIALOG_TYPES[type] || DIALOG_TYPES.info;
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      background: "var(--bg-fill-opacity-80)",
      display: "grid",
      placeItems: "center",
      zIndex: 120,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "alertdialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      boxSizing: "border-box",
      width: 746,
      maxWidth: "100%",
      background: "var(--bg-surface-primary)",
      borderRadius: 28,
      overflow: "hidden",
      boxShadow: `inset 4px 0 0 0 ${t.border}, 0 8px 24px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "32px 32px 8px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: 56,
      height: 56,
      borderRadius: 99999,
      background: t.outer,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 99999,
      background: t.inner,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 24,
    style: {
      color: t.glyph
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      font: "700 32px/38px var(--font-family-geist)",
      letterSpacing: "-0.030em",
      color: "var(--text-primary)",
      textWrap: "pretty"
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Cerrar",
    style: {
      flex: "none",
      alignSelf: "flex-start",
      width: 56,
      height: 56,
      border: 0,
      background: "transparent",
      borderRadius: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 24
  }))), description && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 32px 16px 96px",
      font: "400 16px/20px var(--font-family-geist)",
      letterSpacing: "-0.030em",
      color: "var(--text-secundary)",
      textWrap: "pretty"
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 16,
      padding: "16px 32px 32px 32px"
    }
  }, showCancel && /*#__PURE__*/React.createElement(Button, {
    variant: "text",
    size: "lg",
    onClick: onClose
  }, cancelText), /*#__PURE__*/React.createElement(Button, {
    variant: "tonal",
    size: "lg",
    onClick: onConfirm || onClose
  }, confirmText))));
};
Object.assign(window, {
  SystemStatusDialog,
  DIALOG_TYPES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Dialog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Forms.jsx
try { (() => {
// Form & feedback components — Accordion, FileUploader, ProgressBar,
// SlideToggle (refined). Each matches the Figma component spec
// (font sizes, paddings, borders, states).

// ─── Accordion ────────────────────────────────────────────────
// Figma: Title 20/24 Bold, Subtitle 16/20 Regular, 56 px icon button,
// 1 px hairline border between items, 8 px gap.
const AccordionItem = ({
  title,
  subtitle,
  children,
  defaultOpen = false
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: "1px solid var(--border-secundary)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "16px 0",
      background: "transparent",
      border: 0,
      textAlign: "left",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 20px/24px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 16px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-secundary)"
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "var(--radius-full)",
      display: "grid",
      placeItems: "center",
      color: "var(--icon-primary)",
      transition: "background 120ms",
      background: "transparent"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--bg-surface-secundary)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "expand_more",
    size: 24,
    style: {
      transform: `rotate(${open ? 180 : 0}deg)`,
      transition: "transform 200ms"
    }
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 16,
      font: "400 14px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-secundary)"
    }
  }, children));
};
const Accordion = ({
  items,
  defaultOpenIndex = 0
}) => /*#__PURE__*/React.createElement("div", null, items.map((it, i) => /*#__PURE__*/React.createElement(AccordionItem, {
  key: i,
  title: it.title,
  subtitle: it.subtitle,
  defaultOpen: i === defaultOpenIndex
}, it.body)));

// ─── Progress bar ─────────────────────────────────────────────
// Figma: 8 px tall track on bg-fill-tonal-primary (#FBF3FF), fill is
// purple-400. "Step" variant divides the fill with 1-px gaps every 10%.
// Label is Geist 12/14 (xxs) regardless of value alignment.
const ProgressBar = ({
  value = 0,
  type = "continuous",
  // "continuous" | "step"
  steps = 10,
  labelAlign = "right",
  // "right" | "left" | "none"
  width = "100%"
}) => {
  const pct = Math.max(0, Math.min(100, value));
  const bar = /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 8,
      background: "var(--bg-fill-tonal-primary)",
      borderRadius: type === "continuous" ? 99999 : 0,
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${pct}%`,
      background: "var(--bg-fill-accent-primary)",
      borderRadius: type === "continuous" ? 99999 : 0,
      transition: "width 200ms cubic-bezier(0.4,0,0.2,1)"
    }
  }), type === "step" && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      gridTemplateColumns: `repeat(${steps - 1}, 1fr) 1px`,
      pointerEvents: "none"
    }
  }, Array.from({
    length: steps - 1
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderRight: "1px solid var(--bg-fill-tonal-primary)"
    }
  }))));
  const label = labelAlign !== "none" && /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 34,
      textAlign: "right",
      font: "400 12px/14px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-secundary)"
    }
  }, Math.round(pct), "%");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      width
    }
  }, labelAlign === "left" && label, bar, labelAlign === "right" && label);
};

// ─── SlideToggle (refined to Figma spec) ──────────────────────
// Figma: 52×32 track, 16×16 thumb at 8 px inset → 12 px gap → label
// (Geist 14/20). Track color = neutral-350 off, purple-400 on.
const FigmaSlideToggle = ({
  on,
  onChange,
  label,
  disabled = false
}) => /*#__PURE__*/React.createElement("label", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1
  }
}, /*#__PURE__*/React.createElement("button", {
  type: "button",
  role: "switch",
  "aria-checked": !!on,
  onClick: () => !disabled && onChange && onChange(!on),
  style: {
    position: "relative",
    width: 52,
    height: 32,
    background: on ? "var(--bg-fill-accent-primary)" : "var(--bg-surface-tertiary)",
    border: 0,
    borderRadius: 99999,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 160ms cubic-bezier(0.4,0,0.2,1)",
    flex: "0 0 auto"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 16,
    height: 16,
    borderRadius: 99999,
    background: "var(--bg-surface-primary)",
    transform: on ? "translateX(20px)" : "translateX(0)",
    transition: "transform 160ms cubic-bezier(0.4,0,0.2,1)"
  }
})), label && /*#__PURE__*/React.createElement("span", {
  style: {
    font: "400 14px/20px var(--font-family-geist)",
    letterSpacing: "var(--letter-spacing-tight)",
    color: "var(--text-primary)"
  }
}, label));

// ─── File uploader ────────────────────────────────────────────
// Figma: dashed border container 1 dashed border-secundary, 16 px pad,
// cloud icon, Geist 16/20 medium purple-400 link text, Geist 12/14
// secondary support text. Hovered = bg-surface-brand-hovered, no dash.
const FileUploader = ({
  label = "Documentos clínicos",
  accept = "PDF, JPG o JPEG (máximo 10MB)",
  onFiles
}) => {
  const [hover, setHover] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const inputRef = React.useRef();
  const addMock = () => {
    const mock = [{
      name: "examen_sangre.pdf",
      size: 234567,
      type: "pdf",
      progress: 100
    }, {
      name: "radiografia.jpg",
      size: 1240000,
      type: "jpg",
      progress: 64
    }];
    setFiles(mock);
    onFiles && onFiles(mock);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 16px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-secundary)"
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: addMock,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      padding: "16px",
      borderRadius: "var(--radius-md)",
      background: hover ? "var(--bg-surface-brand-hovered)" : "var(--bg-surface-primary)",
      border: hover ? "1px solid transparent" : "1px dashed var(--border-secundary)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      transition: "background 120ms",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cloud_upload",
    size: 24,
    style: {
      color: "var(--icon-tertiary)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 16px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-brand)"
    }
  }, "Haga click para subir archivos o arrastre archivos aqu\xED"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 12px/14px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-secundary)"
    }
  }, "S\xF3lo archivos ", accept)), files.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginTop: 8
    }
  }, files.map((f, i) => /*#__PURE__*/React.createElement(FileCard, {
    key: i,
    file: f,
    onRemove: () => setFiles(fs => fs.filter((_, j) => j !== i))
  }))));
};

// Card rendering one uploaded document — matches Figma's
// CardFileUploaderDocument anatomy: icon thumbnail + name + size +
// progress + dismiss.
const FILE_THUMBS = {
  pdf: {
    bg: "#FFE0F4",
    fg: "#B10060",
    label: "PDF"
  },
  jpg: {
    bg: "#C8DEFF",
    fg: "#0054D2",
    label: "JPG"
  },
  jpeg: {
    bg: "#C8DEFF",
    fg: "#0054D2",
    label: "JPEG"
  },
  error: {
    bg: "#FDD8F0",
    fg: "#B10060",
    label: "ERR"
  }
};
const FileCard = ({
  file,
  onRemove
}) => {
  const t = FILE_THUMBS[file.type] || FILE_THUMBS.pdf;
  const error = file.type === "error";
  const kb = file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 12,
      background: "var(--bg-surface-primary)",
      border: `1px solid ${error ? "var(--border-error)" : "var(--border-primary)"}`,
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 48,
      borderRadius: 4,
      background: t.bg,
      color: t.fg,
      display: "grid",
      placeItems: "center",
      font: "700 10px/100% var(--font-family-geist)",
      letterSpacing: "0.06em",
      flex: "0 0 40px"
    }
  }, t.label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 14px/18px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: error ? "var(--text-error)" : "var(--text-primary)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, file.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 6
    }
  }, file.progress < 100 && !error ? /*#__PURE__*/React.createElement(ProgressBar, {
    value: file.progress,
    labelAlign: "right"
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 12px/14px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-tertiary)"
    }
  }, error ? "Error al subir el archivo" : kb))), /*#__PURE__*/React.createElement(IconButton, {
    icon: error ? "refresh" : "close",
    variant: "standard",
    size: 32,
    onClick: onRemove
  }));
};
Object.assign(window, {
  Accordion,
  AccordionItem,
  ProgressBar,
  FigmaSlideToggle,
  FileUploader,
  FileCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Forms.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Layout.jsx
try { (() => {
// Layout — Sidebar, TopBar, Page shell.

const SidebarSectionHeader = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "14px 24px 8px",
    font: "500 11px/16px var(--font-family-geist)",
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    color: "var(--text-tertiary)"
  }
}, children);
const NavItem = ({
  icon,
  label,
  badge,
  active,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    height: 48,
    width: "calc(100% - 12px)",
    marginRight: 12,
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: active ? "var(--color-purple-150)" : "transparent",
    color: active ? "var(--color-purple-550)" : "var(--text-secundary)",
    border: 0,
    borderRadius: "0 28px 28px 0",
    cursor: "pointer",
    font: `${active ? 700 : 500} 14px/20px var(--font-family-geist)`,
    letterSpacing: "-0.02em",
    textAlign: "left",
    transition: "background 120ms"
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: icon,
  size: 22,
  fill: active ? 1 : 0,
  style: {
    color: active ? "var(--color-purple-450)" : "var(--text-tertiary)"
  }
}), /*#__PURE__*/React.createElement("span", {
  style: {
    flex: 1
  }
}, label), badge != null && /*#__PURE__*/React.createElement(Badge, {
  tone: active ? "purple" : "outlined"
}, badge));
const Sidebar = ({
  active,
  onNavigate
}) => /*#__PURE__*/React.createElement("aside", {
  style: {
    width: 264,
    minWidth: 264,
    background: "#FFFFFF",
    borderRight: "1px solid var(--border-primary)",
    display: "flex",
    flexDirection: "column",
    paddingBottom: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "20px 28px 8px",
    display: "flex",
    alignItems: "center",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("img", {
  src: "../../assets/logo-horizontal.svg",
  alt: "Secuence",
  style: {
    height: 26
  }
})), /*#__PURE__*/React.createElement(SidebarSectionHeader, null, "Gesti\xF3n"), /*#__PURE__*/React.createElement(NavItem, {
  icon: "monitor_heart",
  label: "Indicadores",
  badge: "12",
  active: active === "indicadores",
  onClick: () => onNavigate("indicadores")
}), /*#__PURE__*/React.createElement(NavItem, {
  icon: "groups",
  label: "Pacientes",
  badge: "128",
  active: active === "pacientes",
  onClick: () => onNavigate("pacientes")
}), /*#__PURE__*/React.createElement(NavItem, {
  icon: "event_available",
  label: "Seguimientos",
  badge: "04",
  active: active === "seguimientos",
  onClick: () => onNavigate("seguimientos")
}), /*#__PURE__*/React.createElement(NavItem, {
  icon: "auto_awesome",
  label: "Insights",
  active: active === "insights",
  onClick: () => onNavigate("insights")
}), /*#__PURE__*/React.createElement(NavItem, {
  icon: "chat",
  label: "Mensajes",
  badge: "3",
  active: active === "mensajes",
  onClick: () => onNavigate("mensajes")
}), /*#__PURE__*/React.createElement(SidebarSectionHeader, null, "Configuraciones"), /*#__PURE__*/React.createElement(NavItem, {
  icon: "widgets",
  label: "Componentes",
  active: active === "componentes",
  onClick: () => onNavigate("componentes")
}), /*#__PURE__*/React.createElement(NavItem, {
  icon: "badge",
  label: "Equipo",
  active: active === "equipo",
  onClick: () => onNavigate("equipo")
}), /*#__PURE__*/React.createElement(NavItem, {
  icon: "settings",
  label: "Ajustes",
  active: active === "ajustes",
  onClick: () => onNavigate("ajustes")
}), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    margin: "0 16px",
    padding: 12,
    background: "var(--color-purple-0)",
    border: "1px solid var(--border-primary)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 10
  }
}, /*#__PURE__*/React.createElement(Avatar, {
  initials: "DR",
  size: 36,
  color: "#82439B"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    font: "600 13px/16px var(--font-family-geist)",
    color: "var(--text-primary)",
    letterSpacing: "-0.02em"
  }
}, "Dra. Camila Rojas"), /*#__PURE__*/React.createElement("div", {
  style: {
    font: "400 11px/14px var(--font-family-geist)",
    color: "var(--text-tertiary)"
  }
}, "Cardiolog\xEDa \xB7 IPS Salud")), /*#__PURE__*/React.createElement(Icon, {
  name: "more_vert",
  size: 18,
  style: {
    color: "var(--text-tertiary)"
  }
})));
const TopBar = ({
  title,
  breadcrumb,
  search = true
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "20px 32px",
    borderBottom: "1px solid var(--border-primary)",
    background: "#FFFFFF"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, breadcrumb && /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    font: "400 12px/14px var(--font-family-geist)",
    color: "var(--text-tertiary)",
    marginBottom: 4,
    letterSpacing: "-0.02em"
  }
}, breadcrumb.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
  key: i
}, i > 0 && /*#__PURE__*/React.createElement("span", {
  style: {
    opacity: 0.6
  }
}, "/"), /*#__PURE__*/React.createElement("span", {
  style: {
    color: i === breadcrumb.length - 1 ? "var(--text-secundary)" : "inherit",
    fontWeight: i === breadcrumb.length - 1 ? 500 : 400
  }
}, c)))), /*#__PURE__*/React.createElement("h1", {
  style: {
    margin: 0,
    font: "600 24px/28px var(--font-family-geist)",
    letterSpacing: "-0.03em",
    color: "var(--text-primary)"
  }
}, title)), search && /*#__PURE__*/React.createElement("div", {
  style: {
    width: 320
  }
}, /*#__PURE__*/React.createElement(Input, {
  icon: "search",
  placeholder: "Buscar paciente, DNI o seguimiento"
})), /*#__PURE__*/React.createElement(IconButton, {
  icon: "notifications",
  variant: "standard"
}), /*#__PURE__*/React.createElement(IconButton, {
  icon: "help",
  variant: "standard"
}));
Object.assign(window, {
  Sidebar,
  TopBar,
  NavItem
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Layout.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/List.jsx
try { (() => {
// List — Material-style list item with line/alignment variants.
// Mirrors the Figma "List variants" component: a leading icon rail,
// a title + secondary line(s), and a trailing icon button.
//   lines:  1 | 2 | 3 | "3+"   → secondary-line budget & layout
//   align:  "left" | "right"
// Exported to window at the bottom for other Babel scripts.

const LI_HOVER = "var(--bg-surface-secundary)"; // #F7F7F7
const LI_PRESS = "var(--color-neutral-100)"; // #EBEBEB
const LI_FOCUS = "0 0 0 4px rgba(130,67,155,0.20)";
const ListItemAction = ({
  icon = "edit",
  onClick,
  disabled = false,
  label = "Editar"
}) => {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      flex: "0 0 36px",
      width: 36,
      height: 36,
      border: 0,
      padding: 0,
      borderRadius: 99999,
      display: "grid",
      placeItems: "center",
      cursor: disabled ? "not-allowed" : "pointer",
      color: disabled ? "var(--text-disabled)" : "var(--text-primary)",
      background: disabled ? "transparent" : active ? LI_PRESS : hover ? LI_HOVER : "transparent",
      transition: "background-color 120ms cubic-bezier(0.4,0,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 24
  }));
};
const ListItem = ({
  lines = 2,
  align = "left",
  icon,
  title,
  value,
  action = "edit",
  onAction,
  onClick,
  disabled = false,
  divider = false,
  state,
  // "hovered" | "pressed" | "focused" — force a state (for docs)
  style = {}
}) => {
  const right = align === "right";
  const inline = String(lines) === "1";
  const clamp = inline ? 1 : lines === 2 ? 1 : lines === 3 ? 3 : 4;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const bg = state === "pressed" || active ? LI_PRESS : state === "hovered" || hover ? LI_HOVER : "transparent";
  const focusRing = state === "focused" ? LI_FOCUS : "none";
  const txt = disabled ? "var(--text-disabled)" : "var(--text-secundary)";
  const leadIcon = icon && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "0 0 24px",
      width: 24,
      padding: inline ? 0 : "6px 0",
      display: "flex",
      justifyContent: "center",
      alignItems: inline ? "center" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 24,
    fill: 0,
    style: {
      color: txt
    }
  }));
  const actionBtn = action && /*#__PURE__*/React.createElement(ListItemAction, {
    icon: action,
    onClick: onAction,
    disabled: disabled
  });

  // ── main content ──
  const titleEl = /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "1 1 auto",
      minWidth: 0,
      font: "700 16px/20px var(--font-family-geist)",
      letterSpacing: "-0.030em",
      color: txt,
      textAlign: right ? "right" : "left"
    }
  }, title);
  const valueEl = value != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 16px/20px var(--font-family-geist)",
      letterSpacing: "-0.030em",
      color: txt,
      textAlign: right ? "right" : "left",
      textWrap: "pretty",
      ...(inline ? {
        flex: "1 1 auto",
        minWidth: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      } : {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: clamp,
        overflow: "hidden"
      })
    }
  }, value);
  let main;
  if (inline) {
    main = /*#__PURE__*/React.createElement("div", {
      style: {
        flex: "1 1 auto",
        minWidth: 0,
        display: "flex",
        flexDirection: right ? "row-reverse" : "row",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "0 0 auto",
        font: "700 16px/20px var(--font-family-geist)",
        letterSpacing: "-0.030em",
        color: txt
      }
    }, title), valueEl);
  } else {
    main = /*#__PURE__*/React.createElement("div", {
      style: {
        flex: "1 1 auto",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: right ? "row-reverse" : "row",
        gap: 8,
        alignItems: "center",
        minHeight: 36
      }
    }, titleEl, actionBtn), valueEl);
  }
  return /*#__PURE__*/React.createElement("div", {
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => !disabled && setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => !disabled && setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: "flex",
      flexDirection: right ? "row-reverse" : "row",
      gap: 4,
      padding: "8px 0",
      borderRadius: 4,
      background: bg,
      boxShadow: focusRing,
      borderTop: divider ? "1px solid var(--border-primary)" : undefined,
      cursor: disabled ? "not-allowed" : onClick ? "pointer" : "default",
      transition: "background-color 120ms cubic-bezier(0.4,0,0.2,1)",
      ...style
    }
  }, leadIcon, main, inline && actionBtn);
};

// List — container that frames a set of <ListItem>s.
//   surface: "brand" (#FBF3FF) | "paper" (#FFF) | "none"
//   divided: insert hairline dividers between items
const List = ({
  children,
  surface = "paper",
  divided = false,
  style = {}
}) => {
  const bg = surface === "brand" ? "var(--bg-surface-brand)" : surface === "none" ? "transparent" : "#FFFFFF";
  const items = React.Children.toArray(children).filter(Boolean);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      border: "1px solid var(--border-primary)",
      borderRadius: 4,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: divided ? 0 : 16,
      ...style
    }
  }, items.map((child, i) => React.cloneElement(child, {
    divider: divided && i > 0
  })));
};
Object.assign(window, {
  List,
  ListItem,
  ListItemAction
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/List.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/PatientComponents.jsx
try { (() => {
// Patient-domain components: stat cards, insight cards, follow-up cards,
// patient row, follow-up timeline.

const Card = ({
  children,
  style = {},
  padded = true,
  hoverable = false,
  onClick
}) => /*#__PURE__*/React.createElement("div", {
  onClick: onClick,
  style: {
    background: "#FFFFFF",
    border: "1px solid var(--border-primary)",
    borderRadius: 8,
    padding: padded ? 20 : 0,
    cursor: hoverable ? "pointer" : "default",
    transition: "box-shadow 120ms, border-color 120ms",
    ...style
  },
  onMouseEnter: hoverable ? e => {
    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)";
    e.currentTarget.style.borderColor = "var(--border-secundary)";
  } : undefined,
  onMouseLeave: hoverable ? e => {
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.borderColor = "var(--border-primary)";
  } : undefined
}, children);
const StatCard = ({
  label,
  value,
  delta,
  deltaTone = "neutral",
  icon
}) => {
  const tones = {
    up: "var(--text-success)",
    down: "var(--text-error)",
    neutral: "var(--text-tertiary)"
  };
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 12
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: "var(--bg-surface-brand)",
      display: "grid",
      placeItems: "center",
      color: "var(--icon-brand)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 12px/16px var(--font-family-geist)",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: "var(--text-tertiary)"
    }
  }, label)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 40px/48px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)"
    }
  }, value), delta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      font: "500 12px/16px var(--font-family-geist)",
      color: tones[deltaTone],
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: deltaTone === "up" ? "trending_up" : deltaTone === "down" ? "trending_down" : "trending_flat",
    size: 14
  }), delta));
};
const InsightCard = ({
  title,
  body,
  severity = "medium",
  onReview,
  onDismiss
}) => {
  const tones = {
    high: {
      chip: "red",
      label: "Riesgo alto"
    },
    medium: {
      chip: "yellow",
      label: "Riesgo medio"
    },
    low: {
      chip: "green",
      label: "Riesgo bajo"
    }
  };
  const t = tones[severity];
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      color: "var(--color-purple-450)",
      font: "600 11px/14px var(--font-family-geist)",
      letterSpacing: "0.08em",
      textTransform: "uppercase"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "auto_awesome",
    size: 14
  }), "Insight cl\xEDnico"), /*#__PURE__*/React.createElement(Chip, {
    tone: t.chip,
    icon: "priority_high"
  }, t.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 20px/24px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)",
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-secundary)",
      marginBottom: 16
    }
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    size: "sm",
    onClick: onDismiss
  }, "Descartar"), /*#__PURE__*/React.createElement(Button, {
    variant: "text-brand",
    size: "sm",
    iconAfter: "arrow_forward",
    onClick: onReview
  }, "Revisar paciente")));
};
const PatientRow = ({
  patient,
  onClick
}) => /*#__PURE__*/React.createElement("div", {
  onClick: onClick,
  style: {
    display: "grid",
    gridTemplateColumns: "44px 2fr 1fr 1fr 1fr 120px 40px",
    alignItems: "center",
    gap: 16,
    padding: "12px 20px",
    borderBottom: "1px solid var(--border-primary)",
    cursor: "pointer",
    transition: "background 120ms"
  },
  onMouseEnter: e => e.currentTarget.style.background = "var(--color-neutral-0)",
  onMouseLeave: e => e.currentTarget.style.background = "transparent"
}, /*#__PURE__*/React.createElement(Avatar, {
  initials: patient.initials,
  size: 36,
  color: patient.color
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    font: "600 14px/18px var(--font-family-geist)",
    letterSpacing: "-0.02em",
    color: "var(--text-primary)"
  }
}, patient.name), /*#__PURE__*/React.createElement("div", {
  style: {
    font: "400 12px/14px var(--font-family-geist)",
    color: "var(--text-tertiary)"
  }
}, "DNI ", patient.dni, " \xB7 ", patient.age, " a\xF1os")), /*#__PURE__*/React.createElement("div", {
  style: {
    font: "400 13px/16px var(--font-family-geist)",
    color: "var(--text-secundary)"
  }
}, patient.condition), /*#__PURE__*/React.createElement("div", null, patient.alert === "alta" && /*#__PURE__*/React.createElement(Chip, {
  tone: "red",
  icon: "priority_high"
}, "Alerta alta"), patient.alert === "media" && /*#__PURE__*/React.createElement(Chip, {
  tone: "yellow",
  icon: "warning"
}, "Alerta media"), patient.alert === "estable" && /*#__PURE__*/React.createElement(Chip, {
  tone: "green",
  icon: "check_circle"
}, "Estable"), patient.alert === "alta-medica" && /*#__PURE__*/React.createElement(Chip, {
  tone: "neutral"
}, "Dado de alta")), /*#__PURE__*/React.createElement("div", {
  style: {
    font: "400 12px/16px var(--font-family-geist)",
    color: "var(--text-tertiary)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    color: "var(--text-secundary)",
    fontWeight: 500
  }
}, patient.lastVisit), /*#__PURE__*/React.createElement("div", null, "\xFAltimo seguimiento")), /*#__PURE__*/React.createElement("div", null, patient.adherence != null && /*#__PURE__*/React.createElement(Adherence, {
  pct: patient.adherence
})), /*#__PURE__*/React.createElement(Icon, {
  name: "chevron_right",
  size: 20,
  style: {
    color: "var(--text-tertiary)"
  }
}));
const Adherence = ({
  pct
}) => {
  const color = pct >= 80 ? "var(--text-success)" : pct >= 60 ? "var(--text-warning)" : "var(--text-error)";
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 14px/20px var(--font-family-geist)",
      color: color,
      letterSpacing: "var(--letter-spacing-tight)"
    }
  }, pct, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: "var(--color-neutral-50)",
      borderRadius: 99,
      overflow: "hidden",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: color
    }
  })));
};
const FollowupItem = ({
  event
}) => {
  const dotColors = {
    completed: "#0A7553",
    pending: "#935A0B",
    scheduled: "#0054D2",
    missed: "#B10060"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      paddingBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 99,
      background: dotColors[event.status] || "var(--color-neutral-300)",
      border: "2px solid #FFF",
      boxShadow: `0 0 0 1px ${dotColors[event.status]}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      width: 2,
      background: "var(--border-primary)",
      marginTop: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      paddingBottom: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 14px/18px var(--font-family-geist)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, event.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 12px/14px var(--font-family-geist)",
      color: "var(--text-tertiary)"
    }
  }, event.date)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px/18px var(--font-family-geist)",
      color: "var(--text-secundary)"
    }
  }, event.body), event.tags && event.tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginTop: 8
    }
  }, event.tags.map((tag, i) => /*#__PURE__*/React.createElement(Chip, {
    key: i,
    tone: tag.tone || "neutral"
  }, tag.label)))));
};
const Banner = ({
  kind = "followup",
  title,
  body,
  action
}) => {
  const tones = {
    followup: {
      bg: "var(--color-purple-0)",
      fg: "var(--color-purple-550)",
      border: "var(--color-purple-150)",
      icon: "schedule"
    },
    discharge: {
      bg: "var(--bg-success-tertiary)",
      fg: "var(--color-green-700)",
      border: "var(--border-success)",
      icon: "check_circle"
    }
  };
  const t = tones[kind];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 16px",
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.border}`,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 22
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 14px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      opacity: 0.85,
      marginTop: 2
    }
  }, body)), action);
};
Object.assign(window, {
  Card,
  StatCard,
  InsightCard,
  PatientRow,
  Adherence,
  FollowupItem,
  Banner
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/PatientComponents.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Screens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Screens for the Secuence app prototype.

// ----------------- Mock data -----------------

const PATIENTS = [{
  id: 1,
  initials: "PP",
  color: "#82439B",
  name: "Pedro Pepito Pérez",
  dni: "1 234 567 890",
  age: 42,
  condition: "Hipertensión arterial",
  alert: "media",
  lastVisit: "Hace 12 días",
  adherence: 72
}, {
  id: 2,
  initials: "MR",
  color: "#C9006F",
  name: "Marta Restrepo Ávila",
  dni: "9 876 543 210",
  age: 58,
  condition: "Diabetes tipo 2",
  alert: "alta",
  lastVisit: "Hace 4 días",
  adherence: 48
}, {
  id: 3,
  initials: "SC",
  color: "#0A7553",
  name: "Santiago Castro",
  dni: "5 432 109 876",
  age: 34,
  condition: "Asma persistente",
  alert: "estable",
  lastVisit: "Hace 23 días",
  adherence: 92
}, {
  id: 4,
  initials: "JF",
  color: "#0054D2",
  name: "Juliana Fernández",
  dni: "3 210 987 654",
  age: 67,
  condition: "Insuficiencia cardiaca",
  alert: "media",
  lastVisit: "Hace 2 días",
  adherence: 81
}, {
  id: 5,
  initials: "RA",
  color: "#935A0B",
  name: "Ramón Aguilar",
  dni: "7 654 321 098",
  age: 71,
  condition: "EPOC",
  alert: "alta",
  lastVisit: "Ayer",
  adherence: 55
}, {
  id: 6,
  initials: "LC",
  color: "#4A1F60",
  name: "Lucía Cárdenas",
  dni: "2 109 876 543",
  age: 29,
  condition: "Embarazo · seguimiento",
  alert: "estable",
  lastVisit: "Hace 8 días",
  adherence: 96
}, {
  id: 7,
  initials: "EM",
  color: "#82439B",
  name: "Esteban Mora",
  dni: "6 543 210 987",
  age: 50,
  condition: "Post-operatorio cardiaco",
  alert: "alta-medica",
  lastVisit: "Hace 30 días",
  adherence: 88
}];

// ----------------- Indicadores (dashboard) -----------------

const Indicadores = ({
  onSelectPatient
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "24px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 20
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14
  }
}, /*#__PURE__*/React.createElement(StatCard, {
  label: "Pacientes activos",
  value: "128",
  delta: "+8 esta semana",
  deltaTone: "up",
  icon: "groups"
}), /*#__PURE__*/React.createElement(StatCard, {
  label: "Alertas abiertas",
  value: "12",
  delta: "3 cr\xEDticas",
  deltaTone: "down",
  icon: "priority_high"
}), /*#__PURE__*/React.createElement(StatCard, {
  label: "Adherencia promedio",
  value: "78%",
  delta: "+4 pts vs. mes pasado",
  deltaTone: "up",
  icon: "trending_up"
}), /*#__PURE__*/React.createElement(StatCard, {
  label: "Seguimientos hoy",
  value: "04",
  delta: "2 completados",
  deltaTone: "neutral",
  icon: "event_available"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: 14
  }
}, /*#__PURE__*/React.createElement(Card, {
  padded: false
}, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-primary)"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    font: "600 16px/20px var(--font-family-geist)",
    letterSpacing: "-0.02em",
    color: "var(--text-primary)"
  }
}, "Alertas activas"), /*#__PURE__*/React.createElement("div", {
  style: {
    font: "400 12px/16px var(--font-family-geist)",
    color: "var(--text-tertiary)",
    marginTop: 2
  }
}, "Detectadas autom\xE1ticamente por la plataforma")), /*#__PURE__*/React.createElement(Button, {
  variant: "text-brand",
  size: "sm",
  iconAfter: "arrow_forward"
}, "Ver todas")), PATIENTS.filter(p => p.alert === "alta" || p.alert === "media").map(p => /*#__PURE__*/React.createElement(PatientRow, {
  key: p.id,
  patient: p,
  onClick: () => onSelectPatient(p)
}))), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 14
  }
}, /*#__PURE__*/React.createElement(InsightCard, {
  severity: "high",
  title: "Aumento sostenido de presi\xF3n arterial",
  body: "Detectamos una elevaci\xF3n > 15 mmHg en las \xFAltimas 3 mediciones de Marta Restrepo. Considere ajustar la dosis de losart\xE1n.",
  onReview: () => onSelectPatient(PATIENTS[1])
}), /*#__PURE__*/React.createElement(InsightCard, {
  severity: "medium",
  title: "Baja adherencia terap\xE9utica",
  body: "Ram\xF3n Aguilar report\xF3 5 de 14 dosis en los \xFAltimos 7 d\xEDas. Sugerimos un seguimiento telef\xF3nico esta semana.",
  onReview: () => onSelectPatient(PATIENTS[4])
}))), /*#__PURE__*/React.createElement(Card, {
  padded: false
}, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-primary)"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    font: "600 16px/20px var(--font-family-geist)",
    letterSpacing: "-0.02em",
    color: "var(--text-primary)"
  }
}, "Seguimientos programados \u2014 hoy"), /*#__PURE__*/React.createElement("div", {
  style: {
    font: "400 12px/16px var(--font-family-geist)",
    color: "var(--text-tertiary)",
    marginTop: 2
  }
}, "14 may. 2026 \xB7 4 pacientes")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 8
  }
}, /*#__PURE__*/React.createElement(Button, {
  variant: "outlined",
  size: "sm",
  icon: "filter_list"
}, "Filtrar"), /*#__PURE__*/React.createElement(Button, {
  variant: "filled",
  size: "sm",
  icon: "add"
}, "Nuevo seguimiento"))), PATIENTS.slice(0, 4).map(p => /*#__PURE__*/React.createElement(PatientRow, {
  key: p.id,
  patient: p,
  onClick: () => onSelectPatient(p)
}))));

// ----------------- Pacientes (list) -----------------

const Pacientes = ({
  onSelectPatient
}) => {
  const [q, setQ] = React.useState("");
  const [tab, setTab] = React.useState("activos");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 32px",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    placeholder: "Buscar por nombre o DNI",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    icon: "filter_list"
  }, "Filtros"), /*#__PURE__*/React.createElement(Button, {
    variant: "filled",
    icon: "add"
  }, "Nuevo paciente")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, [{
    id: "activos",
    label: "Activos",
    count: 128
  }, {
    id: "alertas",
    label: "Con alertas",
    count: 12
  }, {
    id: "alta",
    label: "Dados de alta",
    count: 34
  }, {
    id: "todos",
    label: "Todos",
    count: 174
  }].map(t => {
    const on = tab === t.id;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      onClick: () => setTab(t.id),
      style: {
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 44,
        padding: "0 14px",
        border: `1px solid ${on ? "var(--border-brand)" : "var(--border-secundary)"}`,
        borderRadius: "var(--radius-md)",
        background: on ? "var(--bg-surface-brand-selected)" : "var(--bg-surface-primary)",
        color: on ? "var(--text-brand)" : "var(--text-primary)",
        font: `${on ? 600 : 500} 14px/20px var(--font-family-geist)`,
        letterSpacing: "-0.03em",
        cursor: "pointer",
        transition: "background 120ms, border-color 120ms, color 120ms"
      }
    }, t.label, /*#__PURE__*/React.createElement(Badge, {
      tone: on ? "purple" : "outlined"
    }, t.count));
  })), /*#__PURE__*/React.createElement(Card, {
    padded: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "44px 2fr 1fr 1fr 1fr 120px 40px",
      alignItems: "center",
      gap: 16,
      padding: "10px 20px",
      background: "var(--bg-surface-primary)",
      borderBottom: "1px solid var(--border-primary)",
      font: "500 11px/14px var(--font-family-geist)",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: "var(--text-tertiary)"
    }
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null, "Paciente"), /*#__PURE__*/React.createElement("div", null, "Condici\xF3n"), /*#__PURE__*/React.createElement("div", null, "Estado"), /*#__PURE__*/React.createElement("div", null, "\xDAltima visita"), /*#__PURE__*/React.createElement("div", null, "Adherencia"), /*#__PURE__*/React.createElement("div", null)), PATIENTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.dni.includes(q)).filter(p => {
    if (tab === "alertas") return p.alert === "alta" || p.alert === "media";
    if (tab === "alta") return p.alert === "alta-medica";
    if (tab === "activos") return p.alert !== "alta-medica";
    return true;
  }).map(p => /*#__PURE__*/React.createElement(PatientRow, {
    key: p.id,
    patient: p,
    onClick: () => onSelectPatient(p)
  }))));
};

// ----------------- Patient detail -----------------

const PatientDetail = ({
  patient,
  onBack,
  onOpenFollowup
}) => {
  const [tab, setTab] = React.useState("indicadores");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 32px",
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Banner, {
    kind: patient.alert === "alta-medica" ? "discharge" : "followup",
    title: patient.alert === "alta-medica" ? "Paciente dado de alta" : "Próximo seguimiento — 18 may. 2026",
    body: patient.alert === "alta-medica" ? "Continúa monitoreo pasivo. El paciente recibió alta médica hace 30 días." : "Cuestionario automatizado de adherencia y síntomas, enviado por WhatsApp.",
    action: patient.alert !== "alta-medica" && /*#__PURE__*/React.createElement(Button, {
      variant: "filled",
      size: "sm",
      onClick: onOpenFollowup
    }, "Ver seguimiento")
  }), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: patient.initials,
    color: patient.color,
    size: 72
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 20px/24px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)"
    }
  }, patient.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-tertiary)",
      marginTop: 4
    }
  }, "DNI ", patient.dni, " \xB7 ", patient.age, " a\xF1os \xB7 ", patient.condition)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    icon: "phone"
  }, "Llamar"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    icon: "chat"
  }, "Mensaje"), /*#__PURE__*/React.createElement(Button, {
    variant: "filled",
    icon: "add"
  }, "Agendar seguimiento"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      padding: 16,
      background: "var(--color-purple-0)",
      borderRadius: 8,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16
    }
  }, [{
    label: "Documento/DNI",
    value: patient.dni
  }, {
    label: "Edad",
    value: `${patient.age} años`
  }, {
    label: "Grupo sanguíneo",
    value: "O+"
  }, {
    label: "Aseguradora",
    value: "EPS Sura"
  }, {
    label: "Última alerta",
    value: "Media · presión arterial"
  }, {
    label: "Adherencia",
    value: `${patient.adherence}%`
  }, {
    label: "Tratamiento",
    value: "Losartán 50 mg / día"
  }, {
    label: "Médico asignado",
    value: "Dra. Camila Rojas"
  }].map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 11px/14px var(--font-family-geist)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-tertiary)",
      marginBottom: 4
    }
  }, f.label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 14px/18px var(--font-family-geist)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, f.value))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, [{
    id: "indicadores",
    label: "Indicadores"
  }, {
    id: "historial",
    label: "Historial"
  }, {
    id: "seguimientos",
    label: "Seguimientos"
  }, {
    id: "documentos",
    label: "Documentos"
  }].map(t => {
    const on = tab === t.id;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      onClick: () => setTab(t.id),
      style: {
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 44,
        padding: "0 16px",
        border: `1px solid ${on ? "var(--border-brand)" : "var(--border-secundary)"}`,
        borderRadius: "var(--radius-md)",
        background: on ? "var(--bg-surface-brand-selected)" : "var(--bg-surface-primary)",
        color: on ? "var(--text-brand)" : "var(--text-primary)",
        font: `${on ? 600 : 500} 14px/20px var(--font-family-geist)`,
        letterSpacing: "-0.03em",
        cursor: "pointer",
        transition: "background 120ms, border-color 120ms, color 120ms"
      }
    }, t.label);
  })), tab === "indicadores" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px/20px var(--font-family-geist)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, "Presi\xF3n arterial"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 12px/16px var(--font-family-geist)",
      color: "var(--text-tertiary)"
    }
  }, "\xDAltimas 8 semanas")), /*#__PURE__*/React.createElement(Chip, {
    tone: "yellow",
    icon: "warning"
  }, "Tendencia al alza")), /*#__PURE__*/React.createElement(BPChart, null)), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px/20px var(--font-family-geist)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)",
      marginBottom: 12
    }
  }, "Indicadores cl\xEDnicos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Presi\xF3n arterial",
    value: "142 / 92",
    unit: "mmHg",
    tone: "warn"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Frecuencia cardiaca",
    value: "78",
    unit: "lpm",
    tone: "ok"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Glucemia (ayuno)",
    value: "98",
    unit: "mg/dL",
    tone: "ok"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Peso",
    value: "76,4",
    unit: "kg",
    tone: "ok"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "IMC",
    value: "26,1",
    unit: "kg/m\xB2",
    tone: "warn"
  })))), tab === "seguimientos" && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px/20px var(--font-family-geist)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, "Historial de seguimientos"), /*#__PURE__*/React.createElement(Button, {
    variant: "text-brand",
    size: "sm",
    icon: "add"
  }, "Nuevo seguimiento")), [{
    date: "14 may. 2026",
    status: "pending",
    title: "Seguimiento programado",
    body: "Cuestionario de adherencia y síntomas. Envío automático por WhatsApp a las 09:00.",
    tags: [{
      label: "Automatizado",
      tone: "purple"
    }]
  }, {
    date: "02 may. 2026",
    status: "completed",
    title: "Seguimiento completado",
    body: "Paciente reportó dolor de cabeza ocasional y adherencia parcial al tratamiento.",
    tags: [{
      label: "12/14 dosis reportadas",
      tone: "yellow"
    }]
  }, {
    date: "20 abr. 2026",
    status: "completed",
    title: "Consulta presencial",
    body: "Ajuste de dosis de losartán a 50 mg. Solicitud de exámenes de laboratorio.",
    tags: [{
      label: "Ajuste terapéutico",
      tone: "purple"
    }]
  }, {
    date: "05 abr. 2026",
    status: "missed",
    title: "Seguimiento no respondido",
    body: "Paciente no completó el cuestionario en la ventana de 48 horas.",
    tags: [{
      label: "Sin respuesta",
      tone: "red"
    }]
  }].map((e, i) => /*#__PURE__*/React.createElement(FollowupItem, {
    key: i,
    event: e
  }))), tab === "historial" && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px/20px var(--font-family-geist)",
      color: "var(--text-tertiary)"
    }
  }, "Historial cl\xEDnico \u2014 vista detallada disponible en la versi\xF3n completa del prototipo.")), tab === "documentos" && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px/20px var(--font-family-geist)",
      color: "var(--text-tertiary)"
    }
  }, "Documentos del paciente \u2014 placeholder.")));
};

// Small metric row
const Metric = ({
  label,
  value,
  unit,
  tone = "ok"
}) => {
  const colors = {
    ok: "var(--text-primary)",
    warn: "#935A0B",
    bad: "#B10060"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px/16px var(--font-family-geist)",
      color: "var(--text-secundary)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 18px/22px var(--font-family-geist)",
      letterSpacing: "-0.02em",
      color: colors[tone]
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 12px/14px var(--font-family-geist)",
      color: "var(--text-tertiary)"
    }
  }, unit)));
};

// SVG line chart for blood pressure
const BPChart = () => {
  const data = [130, 132, 128, 134, 138, 136, 140, 142];
  const W = 520,
    H = 160,
    PAD = 24;
  const max = 160,
    min = 110;
  const stepX = (W - PAD * 2) / (data.length - 1);
  const points = data.map((v, i) => {
    const x = PAD + i * stepX;
    const y = PAD + (1 - (v - min) / (max - min)) * (H - PAD * 2);
    return [x, y];
  });
  const path = points.map((p, i) => i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`).join(" ");
  const area = `${path} L${points[points.length - 1][0]},${H - PAD} L${points[0][0]},${H - PAD} Z`;
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${W} ${H}`,
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "bpgrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#82439B",
    stopOpacity: "0.18"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#82439B",
    stopOpacity: "0"
  }))), [0, 0.25, 0.5, 0.75, 1].map((t, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: PAD,
    x2: W - PAD,
    y1: PAD + t * (H - PAD * 2),
    y2: PAD + t * (H - PAD * 2),
    stroke: "#F0F0F0"
  })), /*#__PURE__*/React.createElement("line", {
    x1: PAD,
    x2: W - PAD,
    y1: PAD + (1 - (140 - min) / (max - min)) * (H - PAD * 2),
    y2: PAD + (1 - (140 - min) / (max - min)) * (H - PAD * 2),
    stroke: "#C9006F",
    strokeDasharray: "4 4",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: W - PAD,
    y: PAD + (1 - (140 - min) / (max - min)) * (H - PAD * 2) - 4,
    textAnchor: "end",
    fontFamily: "Geist",
    fontSize: "10",
    fill: "#C9006F"
  }, "Umbral 140 mmHg"), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#bpgrad)"
  }), /*#__PURE__*/React.createElement("path", {
    d: path,
    fill: "none",
    stroke: "#77368C",
    strokeWidth: "2"
  }), points.map(([x, y], i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x,
    cy: y,
    r: "3.5",
    fill: "#FFF",
    stroke: "#77368C",
    strokeWidth: "2"
  })), ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"].map((lbl, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: PAD + i * stepX,
    y: H - 6,
    textAnchor: "middle",
    fontFamily: "Geist",
    fontSize: "10",
    fill: "#767676"
  }, lbl)));
};

// ----------------- Follow-up dialog (modal) -----------------

const FollowupDialog = ({
  patient,
  onClose
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    position: "fixed",
    inset: 0,
    background: "rgba(11,11,11,0.45)",
    display: "grid",
    placeItems: "center",
    zIndex: 100
  },
  onClick: onClose
}, /*#__PURE__*/React.createElement("div", {
  onClick: e => e.stopPropagation(),
  style: {
    width: 560,
    background: "#FFFFFF",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)",
    overflow: "hidden"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "20px 24px",
    borderBottom: "1px solid var(--border-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    font: "700 20px/24px var(--font-family-geist)",
    letterSpacing: "var(--letter-spacing-tight)",
    color: "var(--text-primary)"
  }
}, "Nuevo seguimiento"), /*#__PURE__*/React.createElement("div", {
  style: {
    font: "400 14px/20px var(--font-family-geist)",
    letterSpacing: "var(--letter-spacing-tight)",
    color: "var(--text-tertiary)",
    marginTop: 2
  }
}, patient.name, " \xB7 ", patient.condition)), /*#__PURE__*/React.createElement(IconButton, {
  icon: "close",
  variant: "standard",
  onClick: onClose
})), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 16
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    font: "600 14px/20px var(--font-family-geist)",
    letterSpacing: "var(--letter-spacing-tight)",
    color: "var(--text-secundary)",
    marginBottom: 6
  }
}, "Tipo de seguimiento"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 8
  }
}, /*#__PURE__*/React.createElement(Chip, {
  tone: "purple"
}, "Cuestionario adherencia"), /*#__PURE__*/React.createElement(Chip, {
  tone: "neutral"
}, "Signos vitales"), /*#__PURE__*/React.createElement(Chip, {
  tone: "neutral"
}, "Telef\xF3nico"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    font: "600 14px/20px var(--font-family-geist)",
    letterSpacing: "var(--letter-spacing-tight)",
    color: "var(--text-secundary)",
    marginBottom: 6
  }
}, "Fecha programada"), /*#__PURE__*/React.createElement(Input, {
  icon: "event",
  defaultValue: "18 may. 2026 \xB7 09:00"
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    font: "600 14px/20px var(--font-family-geist)",
    letterSpacing: "var(--letter-spacing-tight)",
    color: "var(--text-secundary)",
    marginBottom: 6
  }
}, "Canal de env\xEDo"), /*#__PURE__*/React.createElement(Input, {
  icon: "chat",
  defaultValue: "WhatsApp +57 312 \u2022\u2022\u2022 4892"
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    font: "600 14px/20px var(--font-family-geist)",
    letterSpacing: "var(--letter-spacing-tight)",
    color: "var(--text-secundary)",
    marginBottom: 6
  }
}, "Notas (opcional)"), /*#__PURE__*/React.createElement("textarea", {
  placeholder: "Indique cualquier instrucci\xF3n adicional\u2026",
  style: {
    width: "100%",
    minHeight: 80,
    background: "#FFFFFF",
    border: "1px solid var(--border-secundary)",
    borderRadius: 4,
    padding: "10px 12px",
    font: "400 14px/20px var(--font-family-geist)",
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
    resize: "vertical",
    outline: "none"
  }
}))), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 24px",
    borderTop: "1px solid var(--border-primary)",
    display: "flex",
    justifyContent: "flex-end",
    gap: 8
  }
}, /*#__PURE__*/React.createElement(Button, {
  variant: "text",
  onClick: onClose
}, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
  variant: "filled",
  onClick: onClose
}, "Agendar seguimiento"))));

// ----------------- Componentes (showcase) -----------------

const DIALOG_DEMOS = {
  warning: {
    title: "No se pudo guardar el seguimiento",
    description: "Hay campos obligatorios sin completar. Revísalos e inténtalo de nuevo.",
    cancelText: "Cancelar",
    confirmText: "Revisar campos"
  },
  alert: {
    title: "El paciente tiene una alerta activa",
    description: "Su última medición de presión arterial supera el rango objetivo.",
    cancelText: "Descartar",
    confirmText: "Ver paciente"
  },
  success: {
    title: "Seguimiento creado correctamente",
    description: "El paciente recibirá la notificación en los próximos minutos.",
    cancelText: "Cerrar",
    confirmText: "Ver seguimiento"
  },
  info: {
    title: "Nueva versión disponible",
    description: "Actualizamos el panel de indicadores con nuevas métricas clínicas.",
    cancelText: "Ahora no",
    confirmText: "Actualizar"
  }
};
const Componentes = () => {
  const [toggle1, setToggle1] = React.useState(true);
  const [toggle2, setToggle2] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 32px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)",
      marginBottom: 16
    }
  }, "Dialog \xB7 system status"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    size: "md",
    onClick: () => setDialogType("warning")
  }, "Warning"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    size: "md",
    onClick: () => setDialogType("alert")
  }, "Alert"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    size: "md",
    onClick: () => setDialogType("success")
  }, "Success"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    size: "md",
    onClick: () => setDialogType("info")
  }, "Info"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)",
      marginBottom: 16
    }
  }, "Accordion"), /*#__PURE__*/React.createElement(Accordion, {
    items: [{
      title: "Antecedentes médicos",
      subtitle: "Hipertensión arterial, dx feb 2023",
      body: "Paciente con hipertensión arterial controlada con losartán 50 mg. Antecedentes familiares de cardiopatía isquémica. Sin alergias medicamentosas conocidas."
    }, {
      title: "Medicación actual",
      subtitle: "3 medicamentos activos",
      body: "Losartán 50 mg / día · Atorvastatina 20 mg / noche · Aspirina 100 mg / día."
    }, {
      title: "Resultados de laboratorio",
      subtitle: "Última actualización: 02 may. 2026",
      body: "Hemograma dentro de rangos normales. Perfil lipídico con LDL ligeramente elevado (132 mg/dL)."
    }]
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)",
      marginBottom: 16
    }
  }, "Slide toggle"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(FigmaSlideToggle, {
    on: toggle1,
    onChange: setToggle1,
    label: "Alertas autom\xE1ticas"
  }), /*#__PURE__*/React.createElement(FigmaSlideToggle, {
    on: toggle2,
    onChange: setToggle2,
    label: "Recibir resumen semanal"
  }), /*#__PURE__*/React.createElement(FigmaSlideToggle, {
    on: true,
    disabled: true,
    label: "Modo de demostraci\xF3n"
  }), /*#__PURE__*/React.createElement(FigmaSlideToggle, {
    on: false,
    disabled: true,
    label: "Acceso experimental"
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)",
      marginBottom: 16
    }
  }, "Progress bar"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 12px/14px var(--font-family-geist)",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: "var(--text-tertiary)",
      marginBottom: 6
    }
  }, "Adherencia \xB7 continuous"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 72
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 12px/14px var(--font-family-geist)",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: "var(--text-tertiary)",
      marginBottom: 6
    }
  }, "Onboarding \xB7 step / 10"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 40,
    type: "step",
    steps: 10
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 12px/14px var(--font-family-geist)",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: "var(--text-tertiary)",
      marginBottom: 6
    }
  }, "Subida \xB7 label left"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 88,
    labelAlign: "left"
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px/20px var(--font-family-geist)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)",
      marginBottom: 16
    }
  }, "File uploader"), /*#__PURE__*/React.createElement(FileUploader, {
    label: "Documentos cl\xEDnicos"
  })), dialogType && /*#__PURE__*/React.createElement(SystemStatusDialog, _extends({
    type: dialogType
  }, DIALOG_DEMOS[dialogType], {
    onClose: () => setDialogType(null),
    onConfirm: () => setDialogType(null)
  })));
};
Object.assign(window, {
  PATIENTS,
  Indicadores,
  Pacientes,
  PatientDetail,
  FollowupDialog,
  Componentes
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Screens.jsx", error: String((e && e.message) || e) }); }

})();
