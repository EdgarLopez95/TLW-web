# Agent Instructions — The Learning Warehouse Website

This file guides AI coding agents (OpenAI Codex, etc.) working on this project.

---

## Project Overview
Website for **The Learning Warehouse (TWH)** — an educational platform.

## Tech Stack
> Update as the stack is defined.
- HTML / CSS / JavaScript (current baseline)
- *(add framework, e.g. Next.js, Astro, etc.)*
- Tailwind CSS
- GSAP for animations
- shadcn/ui for components (if applicable)

## Assets
```
assets/
  images/
    logos/     ← SVG and PNG logos
    photos/    ← site photography
  videos/      ← hero and promo videos
  fonts/       ← custom typefaces (.woff2)
  icons/       ← SVG icons
```

---

## Brand Rules (always apply)
- Primary brand: The Learning Warehouse / TWH
- Tone: approachable, encouraging, clear, inclusive
- Educational content is the hero — UI must never compete with it
- Trust signals (credentials, reviews, instructor bios) should be prominent
- Colors, fonts and tagline: see `.cursor/rules/brand-guidelines.mdc`

---

## Design & Code Standards

### Layout
- 12-column grid, `max-w-7xl` (1280px) centered container
- Mobile-first: design for 375px, scale up
- Spacing: 4px base scale only — no arbitrary pixel values

### Components
- Buttons: primary (filled), secondary (outlined), ghost
- Forms: labels always above inputs, inline validation on blur
- Cards: `rounded-lg`, `shadow-sm`, `p-6` internal padding

### Animations (GSAP)
- Animate only `transform` and `opacity` — never `width/height/top/left`
- Always wrap animations with `prefers-reduced-motion` check:
  ```js
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion) { /* gsap code */ }
  ```

### Accessibility
- WCAG 2.1 AA minimum
- Contrast ratio ≥ 4.5:1 for body text
- All interactive elements keyboard-navigable
- Never `outline: none` without a replacement focus style

### Performance Targets
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| Lighthouse | ≥ 90 |

---

## What NOT to Do
- Don't use arbitrary Tailwind values like `mt-[13px]`
- Don't animate layout properties (width, height, top, left)
- Don't use placeholder-only form labels
- Don't add features beyond what's explicitly requested
- Don't commit files from `assets/` to git (add them to `.gitignore`)

---

## Full Guidelines
Detailed rules live in `.cursor/rules/`:
- `brand-guidelines.mdc` — colors, typography, voice
- `web-design-guidelines.mdc` — layout, components, page structure
- `shadcn.mdc` — shadcn/ui component patterns
- `ui-ux-pro-max.mdc` — UX audit checklist
- `gsap.mdc` — animation patterns
