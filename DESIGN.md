---
version: 1.0.0
name: Alumni-Design-System
description: An inspired synthesis of RunwayML's gallery-grade editorial restraint and Apple's museum-grade product clarity. Crisp white and parchment reading surfaces, tight display typography with negative letter-spacing, frosted glassmorphism navigation, hairline structural dividers, and pure pill CTAs create a serene, premium academic and career ecosystem.

colors:
  # Base & Canvas (Runway pure canvas + Apple parchment)
  canvas: "#ffffff"
  canvas-parchment: "#f8fafc"
  canvas-subtle: "#f1f5f9"
  
  # Neutrals Ladder (Apple ink & Runway monochrome)
  ink: "#0f172a"
  ink-soft: "#1e293b"
  graphite: "#334155"
  slate: "#475569"
  slate-soft: "#64748b"
  stone: "#94a3b8"
  hairline: "#e2e8f0"
  hairline-soft: "#f1f5f9"
  hairline-focus: "#cbd5e1"
  
  # Primary Brand (Apple action precision + refined digital indigo)
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  primary-light: "#eef2ff"
  on-primary: "#ffffff"

  # Module Harmonious Pastels
  users-accent: "#3b82f6"
  users-surface: "#eff6ff"
  jobs-accent: "#10b981"
  jobs-surface: "#ecfdf5"
  apps-accent: "#8b5cf6"
  apps-surface: "#f5f3ff"
  announcements-accent: "#f59e0b"
  announcements-surface: "#fffbeb"
  api-accent: "#06b6d4"
  api-surface: "#ecfeff"

  # System Guardians & Status
  status-active: "#22c55e"
  status-active-bg: "#f0fdf4"
  status-active-border: "#bbf7d0"
  guardian-error: "#ef4444"
  guardian-error-bg: "#fef2f2"
  dark-surface: "#0f172a"
  dark-tile: "#1e293b"

typography:
  display:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  display-sm:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  heading-lg:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  heading-md:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  heading-sm:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  body:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  body-strong:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14.5px"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "0em"
  caption:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0em"
  button:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
  eyebrow:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "11.5px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.05em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4

rounded:
  none: "0px"
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"
  full: "9999px"

spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  section: "64px"
  section-lg: "96px"

shadows:
  subtle: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  card: "0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.04)"
  card-hover: "0 12px 24px -6px rgba(15, 23, 42, 0.09), 0 4px 10px -2px rgba(15, 23, 42, 0.03)"
  glow-primary: "0 4px 14px rgba(79, 70, 229, 0.3)"
  glow-primary-hover: "0 6px 18px rgba(79, 70, 229, 0.4)"

components:
  nav-inner:
    background: "rgba(255, 255, 255, 0.85)"
    backdropFilter: "blur(12px)"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary:
    background: "{colors.primary}"
    color: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    shadow: "{shadows.glow-primary}"
  button-secondary:
    background: "{colors.canvas}"
    color: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
    shadow: "{shadows.subtle}"
  module-card:
    background: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "28px 24px"
    shadow: "{shadows.card}"
  badge-tag:
    typography: "{typography.eyebrow}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# 📐 DESIGN.MD — Alumni Tracking & Career Ecosystem

> **Design System Architecture**  
> *A Harmonious Union of RunwayML's Curatorial Editorial Restraint and Apple's Museum-Grade Functional Clarity.*

---

## 🏛️ 1. Design Philosophy: The Runway + Apple Synthesis

This design system synthesizes two of the most distinguished modern digital aesthetics:

1. **From RunwayML ([getdesign.md/runwayml](https://getdesign.md/runwayml/design-md)):**
   - **Editorial Restraint & Pacing:** The interface reads like a curated exhibition programme rather than a bloated SaaS tool.
   - **Monochrome Neutral Foundation:** Pure white canvas (`#FFFFFF`) framed by precise grey ink tones (`#0F172A` down to `#94A3B8`) and subtle hairline rules (`#E2E8F0`).
   - **Pure Solid Pill Geometry:** CTAs, status badges, and navigation links favor mathematically pure pill geometries (`border-radius: 9999px`).
   - **Air & Whitespace:** Generous vertical rhythm that allows typography and key data points to breathe.

2. **From Apple ([getdesign.md/apple](https://getdesign.md/apple/design-md)):**
   - **Museum-Grade Content Focus:** The UI chrome deliberately recedes so the actual content — alumni achievements, career postings, and application statuses — commands the spotlight.
   - **Frosted Glass Navigation:** Translucent navigation with backdrop blur (`backdrop-filter: blur(12px)`), hairline borders, and subtle elevation.
   - **Tight Display Typographic Rhythm:** Negative letter-spacing (`-0.035em`) on display headlines for the signature confident headline cadence.
   - **Quiet Utility Cards:** Edge-defined 16px/18px rounded utility cards with soft micro-shadows, eliminating heavy distracting drop-shadows.
   - **Alternating Tonal Surfaces:** Light parchment (`#F8FAFC`) transitions smoothly into pure card white (`#FFFFFF`) and dark architectural accent tiles (`#0F172A`).

---

## 🎨 2. Color Palette & Harmonic Tokens

### 2.1. Canvas & Structural Neutrals
```css
--canvas:           #ffffff; /* Pure paper-white content background */
--canvas-parchment: #f8fafc; /* Soft ambient slate environment */
--canvas-subtle:    #f1f5f9; /* Recessed input and secondary surface */
--hairline:         #e2e8f0; /* Crisp 1px structural dividers */
--hairline-hover:   #cbd5e1; /* Active/hover divider highlight */
```

### 2.2. Typographic Contrast Ladder
```css
--ink:              #0f172a; /* Slate 900 - Display & primary titles */
--ink-soft:         #1e293b; /* Slate 800 - Section headers & cards */
--graphite:         #334155; /* Slate 700 - Subheadings & labels */
--slate:            #475569; /* Slate 600 - Standard body text */
--stone:            #94a3b8; /* Slate 400 - Muted captions & metadata */
```

### 2.3. Interactive Brand & Semantic Accents
```css
/* Primary Action (Apple Action Precision x Runway Solid Pill) */
--brand-primary:    #4f46e5; /* Refined Indigo */
--brand-hover:      #4338ca; /* Deepened Indigo */
--brand-light:      #eef2ff; /* 5% Soft Tint for Badges */

/* Domain Modules (Soft Pastel Badges + High-Contrast Type) */
--mod-users:        #3b82f6; --mod-users-bg:        #eff6ff;
--mod-jobs:         #10b981; --mod-jobs-bg:         #ecfdf5;
--mod-apps:         #8b5cf6; --mod-apps-bg:         #f5f3ff;
--mod-announcements:#f59e0b; --mod-announcements-bg:#fffbeb;
--mod-api:          #06b6d4; --mod-api-bg:          #ecfeff;

/* Status & Guardian */
--status-active:    #22c55e; --status-active-bg:    #f0fdf4;
--guardian-alert:   #ef4444; --guardian-alert-bg:   #fef2f2;
```

---

## 🔤 3. Typography Architecture

We adopt **Plus Jakarta Sans** (supported by Apple's SF Pro fallback stack) for an elegant balance of modern geometric precision and humanist legibility.

### 3.1. Typographic Scale & Rhythm
| Token | Size | Weight | Line Height | Tracking | Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | `48px` | `800` | `1.12` | `-0.035em` | Hero main statements |
| `heading-lg`| `28px` | `700` | `1.25` | `-0.025em` | Page & module headers |
| `heading-md`| `22px` | `700` | `1.30` | `-0.02em` | Section headers |
| `heading-sm`| `18px` | `700` | `1.35` | `-0.01em` | Card titles |
| `lead` | `17px` | `400` | `1.65` | `0em` | Hero introductory copy |
| `body` | `14.5px` | `400` | `1.60` | `0em` | Standard reading text |
| `button` | `14px` | `600` | `1.20` | `+0.01em` | Pill buttons & actions |
| `eyebrow` | `11.5px`| `700` | `1.20` | `+0.05em` | All-caps micro badges |
| `mono` | `13px` | `500` | `1.40` | `0em` | Code, paths & API tags |

---

## 🧱 4. Component Standards

### 4.1. Frosted Navigation Bar
- **Form:** Floated island with `border-radius: 9999px`.
- **Glass Effect:** `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px);`
- **Border:** `1px solid var(--hairline);`
- **Live Dot Indicator:** `7px` green pulsing indicator for system health.

### 4.2. Action Buttons (Runway Solid Pill + Apple Hover)
- **Primary:** Solid `#4F46E5` pill with subtle glow `box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3)`.
- **Secondary:** White surface with 1px border `#E2E8F0`, hovering to `#F1F5F9`.
- **Micro-Interaction:** `transform: translateY(-2px);` on hover with cubic-bezier transition.

### 4.3. Module & Utility Cards
- **Form:** 16px border-radius (`var(--radius-lg)`), crisp white background.
- **Elevation:** Layered ambient shadow (`0 2px 8px -2px rgba(15, 23, 42, 0.06)`).
- **Hover:** Lifts by `-4px` with expanding diffused shadow and subtle border color transition.
- **Top Row:** Icon box (48x48px with 12px radius in module pastel) + Micro-caps eyebrow pill.
- **Bottom Row:** Contextual action link with animated sliding arrow (`→`).

### 4.4. Architectural Banner (Guardian Infrastructure)
- **Dark Slate Tile:** `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)` reminiscent of Apple's dark product showcase modules.
- **High-Contrast Text:** Crisp white titles with muted slate-blue copy (`#94A3B8`).
- **Frosted CTAs:** Semitransparent white buttons (`rgba(255, 255, 255, 0.1)`).

---

## 📏 5. Spacing Ladder & Grid System

All layouts adhere to a clean 4px/8px-based spacing rhythm:
```
4px (xxs) → 8px (xs) → 12px (sm) → 16px (md) → 24px (lg) → 32px (xl) → 48px (xxl) → 64px (section)
```
- **Max Content Container Width:** `1120px` (Golden ratio readability).
- **Grid Layout:** 3 columns on desktop, 2 on tablet, 1 on mobile.
- **Card Gaps:** `20px` on desktop, `16px` on mobile.

---

## ⚖️ 6. Design Principles & Best Practices

### ✅ DO:
1. **Prioritize generous whitespace:** Give elements breathing room; avoid cluttered layouts.
2. **Use subtle, layered shadows:** Never use heavy, dark, or saturated drop shadows.
3. **Respect the typography scale:** Never alter font sizes arbitrarily; adhere to the defined scale.
4. **Use pill shapes for all primary interactions:** Maintain geometry consistency across views.
5. **Keep borders hairline-thin:** `1px solid var(--hairline)` keeps cards sharp and modern.

### ❌ DON'T:
1. **Never use saturated neon or rainbow colors** across main UI containers.
2. **Never apply multiple competing bright accents** in the same view.
3. **Never place dark borders** around light cards (`#E2E8F0` is the standard).
4. **Never use decorative gradients** behind text blocks that impede contrast and readability.
