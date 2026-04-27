# The Learning Warehouse — Design System

**Stack:** HTML + CSS (custom properties). Mobile-first. **Iconos:** Lucide, stroke 1.5px. **Fuentes:** Montserrat (headings/UI) + Inter (body) — Google Fonts.

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

## 1. Tokens de Color

```css
:root {
  /* Brand — Emerald is PRIMARY, others secondary */
  --color-emerald: #096C29;  --color-navy: #171739;
  --color-offwhite: #F7F4EE; --color-lime: #C7F136; --color-purple: #B49AFD;
  /* Neutrals */
  --color-white: #FFFFFF;          --color-surface-muted: #ECE8DF;
  --color-border-default: #D8D2C4; --color-border-subtle: #ECE8DF;
  --color-text-secondary: #3A3A55; --color-text-disabled: #8A8878;
  --color-bg-disabled: #D8D2C4;    --color-navy-on-dark: #9A9AB0;
  /* Surfaces */
  --bg-page: var(--color-offwhite); --bg-card: var(--color-white);
  --bg-brand: var(--color-emerald); --bg-inverse: var(--color-navy);
  --bg-muted: var(--color-surface-muted);
  /* Text */
  --text-primary: var(--color-navy);     --text-secondary: var(--color-text-secondary);
  --text-on-brand: var(--color-offwhite); --text-on-action: var(--color-navy);
  --text-brand: var(--color-emerald);
  /* Action */
  --action-primary: var(--color-lime);
  --action-primary-hover: #D5FB4B; --action-primary-active: #B5DE30;
  --action-secondary: var(--color-navy); --action-secondary-hover: #22224D;
  --brand-hover: #0A7D2F;
  /* Status */
  --color-success: #096C29; --color-warning: #D99A2B;
  --color-error: #B23A3A;   --color-info: #171739;
  /* Focus */
  --focus-ring: var(--color-lime);
}
```

✅ `background: var(--bg-brand); color: var(--text-on-brand);` (6.4:1 AA)
❌ `color: white; background: #B49AFD;` (Purple+white falla; nunca hardcodear)
❌ `background: var(--bg-brand); /* párrafo largo */` (Emerald solo headings/statements cortos)
❌ `background: var(--bg-inverse); color: var(--text-brand);` (Emerald sobre Navy ~2:1, falla)

## 2. Tipografía

```css
:root {
  --font-heading: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
}
```

| Style | Family | Weight | mobile→desktop | LH | Tracking | Uso |
|---|---|---|---|---|---|---|
| `--type-display` | heading | 800 | 44→72px | 1.05 | -0.02em | Hero Home |
| `--type-h1` | heading | 700 | 36→56px | 1.1 | -0.015em | Hero internas |
| `--type-h2` | heading | 700 | 28→40px | 1.15 | -0.01em | Section anchors |
| `--type-h3` | heading | 600 | 22→28px | 1.2 | -0.005em | Bloques internos |
| `--type-h4` | heading | 600 | 18→22px | 1.3 | 0 | Cards / services |
| `--type-h5` | heading | 600 | 16→18px | 1.4 | 0 | Componentes |
| `--type-body-lg` | body | 400 | 18→20px | 1.6 | 0 | Hero intro, leads |
| `--type-body` | body | 400 | 16→17px | 1.65 | 0 | Lectura general |
| `--type-body-sm` | body | 400 | 14→15px | 1.6 | 0 | Captions |
| `--type-overline` | heading | 600 | 12px | 1.4 | 0.08em UPPER | Eyebrows |
| `--type-button` | heading | 600 | 16px | 1 | 0.01em | Botones |
| `--type-nav` | heading | 500 | 15→16px | 1 | 0.01em | Nav links |

✅ `h2 { font-family: var(--font-heading); }`  ❌ `<h2 style="font-family:'Inter';">` (Inter solo body)

## 3. Espaciado

Base 4px. Cualquier valor fuera de la escala es un error.

```css
:root {
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px; --space-32: 128px;
}
```

Card padding `--space-6` (mobile `--space-5`). Form gap `--space-6`. Section padding-block: mobile `--space-16` / tablet `--space-20` / desktop `--space-24`. Entre secciones de narrativa distinta `--space-32`. Título→párrafo: H2 `--space-6`, H3 `--space-3`, H4 `--space-2`.

## 4. Bordes y Radios

```css
:root {
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --radius-xl: 20px; --radius-full: 9999px;
  --border-default: 1px solid var(--color-border-default);
  --border-strong: 1.5px solid var(--color-navy);
  --border-subtle: 1px solid var(--color-border-subtle);
}
```

Asignación: input/textarea/select → `--radius-sm` · button/chip/badge → `--radius-md` · card → `--radius-lg` · featured card/panel → `--radius-xl` · pill/avatar → `--radius-full`.

## 5. Sombras

DS prioriza contraste sobre profundidad. **Un único token, solo overlays.**

```css
:root { --shadow-overlay: 0 12px 32px -8px rgba(23, 23, 57, 0.18); }
```

✅ `.dropdown { box-shadow: var(--shadow-overlay); }`  ❌ `.card { box-shadow: 0 2px 4px rgba(0,0,0,.1); }`

## 6. Breakpoints

```css
:root { --bp-tablet: 768px; --bp-desktop: 1024px; --bp-wide: 1440px; }
.section { padding-block: var(--space-16); } /* mobile-first */
@media (min-width: 768px)  { .section { padding-block: var(--space-20); } }
@media (min-width: 1024px) { .section { padding-block: var(--space-24); } }
```

Grid: mobile 4 cols/16 gutter/20 margin · tablet 8/20/32 · desktop 12/24/48. Max-width contenido `1200px`.

## 7. Componentes Base

### Button

```html
<button class="btn btn--primary">Start a conversation</button>
```

| Variante | Background | Texto | Border |
|---|---|---|---|
| `btn--primary` | `--action-primary` | `--text-on-action` | none |
| `btn--secondary` | `--action-secondary` | `--text-on-brand` | none |
| `btn--tertiary` | transparent | `--text-primary` | `--border-strong` |
| `btn--ghost` | transparent | `--text-primary` | none, underline en hover |

`min-height: 48px`, padding `var(--space-4) var(--space-6)`, `border-radius: var(--radius-md)`, `font-family: var(--font-heading)`. Máx 1 primary por viewport.
**Estados:** `:hover` → `--action-primary-hover`/`--action-secondary-hover`. `:active` → `--action-primary-active`. `:focus-visible` → `outline: 2px solid var(--focus-ring); outline-offset: 2px`. `:disabled` → `background: var(--color-bg-disabled); color: var(--color-text-disabled); cursor: not-allowed`.

### Input / Textarea

```html
<label class="field"><span class="field__label">Email</span>
  <input type="email" class="input" required>
  <span class="field__helper">We'll reply within 2 business days.</span></label>
```

`background: var(--bg-card)`, `border: var(--border-default)`, `border-radius: var(--radius-sm)`, padding `var(--space-3) var(--space-4)`, `min-height: 48px`, `font-family: var(--font-body)`, `color: var(--text-primary)`.
**Estados:** `:focus` → `border: 1.5px solid var(--color-navy)` + focus-ring. `.input--error` → border `var(--color-error)` + helper en `var(--color-error)`. `:disabled` → `background: var(--color-bg-disabled); color: var(--color-text-disabled)`.

### Card

```html
<article class="card"><h4>Learning design and delivery</h4><p>…</p><a href="#">Learn more →</a></article>
```

| Variante | Background | Border | Radius | Padding |
|---|---|---|---|---|
| `card` | `--bg-card` | `--border-default` | `--radius-lg` | `--space-6` |
| `card--featured` | `--bg-brand` | none | `--radius-xl` | `--space-10` |
| `card--accent` | `--color-purple` | none | `--radius-xl` | `--space-8` |

✅ `card--accent` máx 1 por página, texto siempre Navy.  ❌ `card--featured` con texto Purple, o accent Emerald sobre `card--accent` (no mezclar colores de marca).

### Navigation

**Top nav:** `background: var(--bg-page)`, height 72px (mobile 64px), logo Emerald 32px alto, links Navy con underline Lime 2px en activo/hover, CTA Primary derecha.
**Footer:** `background: var(--bg-inverse)`, logo Off-white, links Off-white con underline Lime en hover, copyright `var(--color-navy-on-dark)`.

### Section Header

```html
<header class="section-header"><span class="overline">How we help</span>
  <h2>Learning that leads to real change</h2><p class="lead">…</p></header>
```

Overline `var(--text-brand)`, H2 `var(--text-primary)`, lead usa `--type-body-lg`. Separación al contenido siguiente: `--space-12` desktop / `--space-8` mobile.

## 8. Reglas Generales

- **Logo:** dos colorways únicos — Emerald sobre fondos claros u Off-white sobre Emerald/Navy. Nunca recoloreado, deformado, con efectos.
- **Emerald aparece en cada página** como ancla estructural (Hero, section anchor, CTA block o logo). Sin Emerald visible no cumple el sistema.
- **Nunca hardcodear** colores, tamaños, espaciados o radios. Siempre `var(--token)`.
- **Lime ≤ 5–10% por página.** Nunca body text. Solo CTAs, highlights, underlines, data points, focus rings.
- **Purple nunca sobre Emerald ni Navy.** Nunca como texto sobre Off-white. Solo fondo de acento puntual con texto Navy.
- **Texto sobre Emerald:** solo Off-white (6.4:1). Sobre Navy: Off-white o `--color-navy-on-dark` para small. Sobre Lime/Purple: solo Navy.
- **No body text largo sobre Emerald ni Navy.** Reservados para headings, statements cortos, footer, CTA blocks.
- **Contraste mínimo WCAG AA:** 4.5:1 small, 3:1 large/UI. Validar combinaciones fuera de tabla antes de usar.
- **`:focus-visible` obligatorio:** `outline: 2px solid var(--focus-ring); outline-offset: 2px`. Nunca `outline: none` sin reemplazo.
- **Transición default:** `transition: background-color 150ms ease-out, color 150ms ease-out, border-color 150ms ease-out`. Respetar `@media (prefers-reduced-motion: reduce)`.
- **Sin sombras en elementos estáticos.** Solo `--shadow-overlay` para dropdowns, tooltips, modales.
- **Iconos Lucide stroke 1.5px**, color Emerald o Navy. Lime solo en iconos activos/estado. Funcionales con `aria-label`, decorativos con `aria-hidden="true"`.
- **Touch targets ≥ 48×48px** en mobile, separados ≥ 8px. **Un solo H1 por página**, no saltar niveles de heading hacia abajo.
