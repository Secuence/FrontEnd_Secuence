# Secuence Design System

> **Secuence** es una plataforma healthtech impulsada por inteligencia artificial que ayuda a médicos y clínicas a monitorear la evolución de sus pacientes de forma estructurada, automatizada y basada en datos clínicos relevantes.

This repository is the **source of truth** for Secuence's visual language: tokens, components, voice, and UI kits. It is built for designers and AI design agents to produce on-brand interfaces, prototypes, and assets.

The token system below is sourced **verbatim** from the four `*.tokens.json` exports of the Figma variable collections:

- `primitivecolors.tokens.json` — 6 ramps × 16–17 steps (neutral, purple, pink, blue, green, yellow)
- `semantic.tokens.json` — `bg.*`, `text.*`, `icon.*`, `border.*` aliases that resolve to primitives
- `typography.tokens.json` — Geist family, 9 weights, 15-step size & line-height scales
- `size.tokens.json` — spacing (28 steps), radii (10), stroke widths (5), icon container sizes (5)

> **Note on spelling.** The Figma variables use **"secundary"** (Spanish-influenced spelling). The system preserves that spelling on token names — e.g. `--text-secundary`, `--bg-fill-accent-secundary`. Treat it as the canonical name, not a typo.

---

## Product context

Secuence is a B2B SaaS platform for clinics and individual doctors. Its core jobs:

- **Patient follow-up** — structured, automated post-consultation follow-ups (banners, follow-up cards, patient timelines).
- **Clinical insights & alerts** — AI-generated insights surfaced as cards, with risk-level alerts (Low / Medium / High).
- **Operational dashboards** — performance metrics for doctors, adherence metrics for patients, real-time clinical indicators.
- **Clinic management** — user/role management, supervision of active patients, permissions.

Two primary personas drive the navigation drawer: **Doctor** and **Patient**. The product is **Spanish-language first** (`es-CO` / `es-419`).

**Mission** — reduce the disconnection that occurs after a medical consultation, strengthening continuity of care and helping build healthcare systems that are more preventive, efficient, and patient-centered.

### Sources used to build this system

| Source | Reference |
| --- | --- |
| Figma library | `ScWebkit14May2026.fig` (mounted) — 83 pages, 114 top-level frames |
| Figma variable exports | `uploads/{primitivecolors,semantic,typography,size}.tokens.json` |
| Marketing site | <https://www.secuence.co> |
| Fonts | Geist (uploaded TTFs, 9 weights) |
| Brand assets | `secuence_logo-horizontal.svg`, `secuence_logo-vertical.svg`, `secuence_favicon.svg` |

---

## Index — what's in this folder

```
README.md                 ← you are here
SKILL.md                  ← Agent Skill entry point (Claude Code-compatible)
colors_and_type.css       ← all design tokens (CSS custom properties)
tokens.js                 ← same tokens as a JS module (ESM)
fonts/                    ← Geist TTFs (Light, Regular, Medium, SemiBold, Bold, ExtraBold)
assets/                   ← logos, favicon
preview/                  ← cards rendered in the Design System tab
ui_kits/
  app/                    ← Secuence app (clinical platform) UI kit
    README.md
    index.html            ← interactive prototype: nav, patient view, follow-up
    Atoms.jsx             ← Icon, Button, Chip, Badge, Avatar, Input, …
    List.jsx              ← List, ListItem (Material list-item variants)
    Layout.jsx            ← Sidebar, TopBar
    PatientComponents.jsx ← Card, StatCard, InsightCard, PatientRow, …
    Screens.jsx           ← Indicadores, Pacientes, PatientDetail, FollowupDialog
```

### Quick links

| Path | What |
| --- | --- |
| [`colors_and_type.css`](./colors_and_type.css) | All design tokens — primitives + semantic aliases. |
| [`tokens.js`](./tokens.js) | Same tokens as a JS module (default export + named: `primitive`, `semantic`, `size`, `typography`). |
| [`preview/`](./preview/) | 30+ design-system cards (Brand, Colors, Type, Spacing, Components). Rendered in the Design System tab. |
| [`ui_kits/app/index.html`](./ui_kits/app/index.html) | Interactive Secuence app prototype. |
| [`SKILL.md`](./SKILL.md) | Agent Skill entry — instructions for AI design agents using this system. |
| [`assets/`](./assets/) | Logos and favicon (SVG). |
| [`fonts/`](./fonts/) | Geist TTFs (Light → ExtraBold). |

---

## Content fundamentals

**Language.** Spanish (Colombia / LatAm). Examples lifted from the Figma: *"Indicadores", "Configuraciones", "Última alerta: Media", "Documento/DNI", "Sin registrar", "Grupo sanguíneo", "Pedro Pepito Pérez"*. Translations into English should preserve the formal-but-warm clinical register.

**Voice.** Professional, calm, clinical. Speaks to doctors as peers — never patronizing, never overly sales-y. Empathetic when surfacing patient-side messages. Never alarmist, even when reporting High-risk alerts: the *signal* does the alerting; the copy is matter-of-fact.

**Tone matrix.**

| Surface | Voice |
| --- | --- |
| Dashboards, navigation | Neutral, terse, label-like. ALL-CAPS section eyebrows (`GESTIÓN`, `CONFIGURACIONES`) at 12 px with +0.10 em tracking. |
| Alerts & banners | Matter-of-fact title + one-line context. Exclamation only for genuinely positive moments (success, medical discharge). |
| Insight cards | Short headline → 1–2 sentence finding → CTA. Favor calibrated certainty ("Detectamos un cambio significativo"). |
| Empty states | Helpful, not cute. *"Aún no hay alertas para este paciente."* |

**Casing.**

- UI labels and buttons: **Sentence case** (`Agendar seguimiento`, `Nuevo paciente`), not Title Case.
- Section eyebrows: **ALL CAPS** (`GESTIÓN`, `INDICADORES`).
- Patient names, place names, brand: **Proper case**.
- Acronyms (`DNI`, `IPS`, `EPS`, `AI`) stay capitalised.

**Address.** Doctors are addressed in **formal *usted/su*** form (default in clinical/B2B Colombian context). Patients are addressed in **second person *tú*** when copy is patient-facing. Never first-person plural for the product ("Secuence detecta…", not "Nosotros detectamos…").

**Emoji.** Not used in product UI. The icon set carries all symbolic weight.

**Numbers, units, dates.**

- Spanish thousands separator: `1.250` not `1,250`. Decimals: comma.
- Dates: `15 may. 2026` or `15/05/2026`.
- Vitals: SI units (`mmHg`, `mg/dL`, `kg`, `°C`).
- Ages: `42 años`. Never decimals on age.

**Specific copy examples (lifted verbatim from Figma):**

- Nav sections: *GESTIÓN*, *CONFIGURACIONES*
- Nav items: *Indicadores*, *Pacientes*, *Seguimientos*, *Equipo*
- Patient fields: *Documento/DNI*, *Edad*, *Grupo sanguíneo*, *Última alerta*
- Status chips: *Última alerta: Media*, *Sin registrar*, *Activo*, *Dado de alta*

---

## Visual foundations

### Color

The palette is **warm-neutral + brand purple + magenta accent + four semantic ramps**. See `colors_and_type.css` for the full set and `preview/color-*.html` for visual swatches.

**Primitive ramps** (16–17 steps each — designed for full tonal range so future light/dark surfaces stay within-system):

| Ramp | Role | Base step | Hex |
| --- | --- | --- | --- |
| `neutral` | Text, surfaces, borders | 750 (text) / 0 (page) | `#0B0B0B` / `#FCFCFC` |
| `purple` | Brand primary | 400 | `#82439B` |
| `pink` | Brand secondary + error | 350 / 400 | `#E1007E` / `#C9006F` |
| `blue` | Info | 500 | `#0054D2` |
| `green` | Success | 600 | `#0A7553` |
| `yellow` | Warning | 500 | `#B56F0D` |

**Semantic aliases.** Always prefer these in product code — they encode intent and stay correct as the primitives evolve.

- `bg.surface.*` → page / card backgrounds. `primary` = `#FCFCFC`, `secundary` = `#F7F7F7`, `brand` = `#FBF3FF`, `brand-selected` = `#EEE0F5`, `invert` = `#0B0B0B`.
- `bg.fill.*` → solid action fills. `accent-primary` = purple-400, `accent-hovered` = purple-500, `accent-pressed` = purple-550, `accent-secundary` = pink-350.
- `bg.{warning,success,error,info}.{primary,secundary,tertiary,tertiary-hovered,tertiary-pressed}` → status surface stacks. `tertiary` is the lightest tint used for inline banners.
- `text.*` and `icon.*` — `primary` (#0B0B0B), `secundary` (#393939), `tertiary` (#626262), `disabled` (#767676), `invert` (#FCFCFC), `brand` (#82439B) + per-status colours.
- `border.*` — `primary` (#EBEBEB), `secundary` (#D9D9D9), `tertiary` (#BEBEBE), plus brand & per-status.

**Brand gradient.** `linear-gradient(135deg, #6E368C → #E1007E)` — reserved for the favicon glyph and the rare hero/CTA. Do not over-use.

**Surfaces are paper, not pure white.** `bg.surface.primary` is `#FCFCFC`. Avoid `#FFFFFF` for full-page backgrounds.

### Type

**Geist** is the only product typeface (`family.Geist`). Inter is **not** used.

- Tracking is **`-0.030em`** on every display/title/body class. ALL-CAPS eyebrow labels use **`+0.100em`**.
- Weights in use: **Regular (400) / Medium (500) / SemiBold (600) / Bold (700)**. Light, ExtraBold and Black are reserved.
- The size scale runs **xxs (12)** → **10xl (72)**; line-height runs **xxs (14)** → **10xl (86)**. Index pairs 1:1 — `size.xxl` (32) goes with `lineHeight.xxl` (38).
- Utility classes mirror the Figma "style-set" page: `.sc-display-*`, `.sc-headline-*`, `.sc-title-*`, `.sc-body-*`, `.sc-caption`, `.sc-overline`.

### Spacing & layout

Strict 4 px grid. Tokens are named by **multiple of 4** (`space.1` = 4, `space.10` = 40). Fractional steps exist for hairlines: `space.0,25` = 1 px (default stroke), `space.0,5` = 2 px (active stroke), `space.1` = 4 px (focused stroke).

The full 28-token scale: `0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 19, 20, 23, 24, 28, 32, 36, 40, 60, 62`. Pages typically use `space.12` (48 px) for outer padding; cards use `space.4` (16 px) inner padding; section spacing uses `space.10` (40 px).

### Radii

Ten tokens: `none` (0), `sm` (2), `md` (4), `lg` (8), `xl` (12), `2xl` (16), `3xl` (20), `4xl` (24), `5xl` (28), `full` (99999).

- `md` (4 px) — inputs, default cards
- `lg` (8 px) — outer card containers
- `xl` (12 px) — nested cards
- `2xl` (16 px) — surface frames
- `5xl` (28 px) on the **right side only** of selected nav items (flat left edge, rounded right)
- `full` — buttons, chips, badges, dots

### Stroke widths

Four tokens: `stroke.none` (0), `stroke.default` (1), `stroke.active` (2), `stroke.focused` (4). Focus ring uses `stroke.focused` at 20 % brand-purple alpha as a `box-shadow`.

### Backgrounds & imagery

- No full-bleed photography. No gradients on backgrounds (gradient is brand-treatment only).
- Page background is `bg.surface.primary` (`#FCFCFC`). Elevated cards sit on `#FFFFFF`.
- Brand-tinted surfaces — `bg.surface.brand` (`#FBF3FF`) — frame component previews and brand moments.
- No textures, patterns, or noise. The surface is clean and medical.
- Imagery, when present, is photographic, calm, daylit, slightly warm — focused on hands/devices rather than faces (per marketing site).

### Borders

Hairline `1 px` (`stroke.default`) throughout. Three neutral tokens:

- `border.primary` (`#EBEBEB`) — default card/divider (soft).
- `border.secundary` (`#D9D9D9`) — input borders, chips outlined.
- `border.tertiary` (`#BEBEBE`) — emphasised divider, disabled control border.

Plus brand & semantic equivalents (`border.brand`, `border.success`, `border.warning`, `border.error`, `border.info`).

### Shadows / elevation

Three steps, **always neutral black at very low opacity** (never coloured shadows). These are codified from Figma usage, not from the token file:

- `shadow-1` — `0 1px 2px rgba(0,0,0,0.06)` — hovered list rows.
- `shadow-2` — `0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` — default elevated card / menu.
- `shadow-3` — `0 8px 24px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)` — modal, dialog, dropdown.
- `shadow-focus` — `0 0 0 4px rgba(130,67,155,0.20)` — focus ring on focusable elements.

### Hover / press / focus

- **Hover** — surfaces shift one neutral step (`primary → primary-hovered`); brand-filled buttons darken from `#82439B → #552D78`; tonal buttons fill with `#F7EEFC`.
- **Active/press** — additional one-step darken (`#402465` for accent-pressed), no shrink/scale.
- **Focus** — visible 4 px brand-purple ring (`shadow-focus`). Inputs additionally upgrade their border to `border.brand`.
- **Disabled** — text shifts to `text.disabled` (`#767676`); fill becomes `bg.fill.disabled` (`#F7F7F7`); cursor `not-allowed`.

### Motion

Quiet and short.

- Default easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard easing).
- Durations: **120 ms** for hover/state, **200 ms** for menus/popovers, **300 ms** for dialog/drawer.
- No bounces, no overshoots. Fades + 4–8 px translates.

### Transparency & blur

Used sparingly. Modal scrims use `bg.fill.opacity-80%` (`rgba(11, 11, 11, 0.80)`) with no blur. The product itself is opaque.

### Cards

- Outer card: `1 px solid #EBEBEB`, `border-radius: 8 px`, `bg: #FFFFFF`, padding **16 px**, no shadow at rest.
- Nested card inside a card: bumps to `border-radius: 12 px` and (sometimes) `bg: #FBF3FF` for brand sections, `#F7F7F7` for neutral sections.
- Hovered card: optional `shadow-1` lift; never a coloured border.
- **No** card has a coloured left-border-only accent. Status is communicated by chips/badges inside the card.

---

## Iconography

Confirmed: **Material Symbols Outlined** at 24 px, weight 400. The Figma organises icons into 18 categories that map 1-to-1 to the Material Symbols set (`action, alert, av, communication, content, device, editor, file, hardware, home, image, maps, navigation, notification, places, search, social, toggle`).

**Implementation.** Load the variable-font CDN once per page:

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0">
```

```html
<span class="material-symbols-outlined">monitor_heart</span>
```

**Defaults.**

- Style: **Outlined** (the product never uses Rounded or Sharp).
- Optical size: **24** at default density. Drop to 20 inside dense cells, 18 inside chips.
- Weight: **400**. Tonal/filled icons can switch to `FILL 1` for selected states.
- Container sizes (icon backplate, not glyph): `icons.sm 24`, `icons.md 32`, `icons.lg 44`, `icons.xlg 56`, `icons.xxlg 112`.
- Color: `currentColor`. Icons inherit text color — never hard-coded.

**Emoji.** Never. Use icons.
**Unicode glyphs.** Avoid as a substitute for icons. Acceptable for typographic punctuation only (`–`, `…`, `·`).

**Logo / favicon.** See `assets/`. The favicon is the standalone "S" mark with the full brand gradient applied.

---

## How to use this system

In any HTML artifact:

```html
<link rel="stylesheet" href="colors_and_type.css">
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0">
<body class="sc-scope">
  <h1 class="sc-display-md">Secuence</h1>
  <button style="background: var(--bg-fill-accent-primary); color: var(--text-invert); ...">…</button>
</body>
```

In JS (e.g. a React prototype):

```js
import tokens, { primitive, semantic, size, typography } from "./tokens.js";

const brandBg = semantic.bg.fill["accent-primary"]; // "#82439B"
const radiusLg = size.radius.lg;                    // 8
```

Component-level recreations live in `ui_kits/app/`. See its README for what's covered.

---

## Token cross-reference

A few of the most-used aliases and their primitive resolution:

| Semantic token | → Primitive | Hex |
| --- | --- | --- |
| `bg.surface.primary` | `neutral.0` | `#FCFCFC` |
| `bg.surface.secundary` | `neutral.25` | `#F7F7F7` |
| `bg.surface.brand` | `purple.0` | `#FBF3FF` |
| `bg.surface.brand-selected` | `purple.150` | `#EEE0F5` |
| `bg.surface.invert` | `neutral.750` | `#0B0B0B` |
| `bg.fill.accent-primary` | `purple.400` | `#82439B` |
| `bg.fill.accent-hovered` | `purple.500` | `#552D78` |
| `bg.fill.accent-pressed` | `purple.550` | `#402465` |
| `bg.fill.accent-secundary` | `pink.350` | `#E1007E` |
| `text.primary` | `neutral.750` | `#0B0B0B` |
| `text.secundary` | `neutral.600` | `#393939` |
| `text.brand` | `purple.400` | `#82439B` |
| `border.primary` | `neutral.100` | `#EBEBEB` |
| `border.brand` | `purple.350` | `#8D53AA` |
