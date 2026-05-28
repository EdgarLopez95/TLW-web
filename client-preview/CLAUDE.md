# The Learning Warehouse — Web Project

## LEER SIEMPRE AL INICIO
Antes de responder cualquier tarea, leer completo: **`DESIGN_SYSTEM.md`**
Ese archivo contiene los tokens de color, tipografía, espaciado, componentes y reglas visuales del proyecto. Toda decisión de diseño y código debe respetar lo definido ahí.

---

## What is this project
Website for **The Learning Warehouse (TWH)**, an educational platform. Every decision — visual, technical, and editorial — must align with the brand and design system defined in this repo.

---

## Skills to apply on every task
These rules are always active. Read and follow them before writing any code or design:

- **Brand** → `.cursor/rules/brand-guidelines.mdc`
- **Web design standards** → `.cursor/rules/web-design-guidelines.mdc`

These are invoked on demand:
- **shadcn/ui components** → `/shadcn` or `.cursor/rules/shadcn.mdc`
- **UX audit** → `/ui-ux-pro-max` or `.cursor/rules/ui-ux-pro-max.mdc`
- **GSAP animations** → `/gsap` or `.cursor/rules/gsap.mdc`

---

## Assets
All brand assets live here — use them, never generate placeholders for production:
```
assets/
  images/
    logos/     ← brand logos (SVG preferred)
    photos/    ← site photography
  videos/      ← hero and promo videos
  fonts/       ← custom typefaces (.woff2)
  icons/       ← SVG icons
```

---

## Non-negotiable rules

### Brand
- Always write copy in TWH tone: approachable, encouraging, clear, inclusive
- Educational content is the hero — UI must not compete with it
- Trust signals (credentials, reviews, instructor bios) must be prominent

### Layout
- 12-column grid, `max-w-7xl` (1280px) container, centered
- Mobile-first — start at 375px
- Spacing: 4px base scale only. No arbitrary values like `mt-[13px]`

### Accessibility
- WCAG 2.1 AA minimum on everything
- Contrast ≥ 4.5:1 for body text
- All interactive elements keyboard-navigable
- Focus ring always visible

### Performance
- Images: WebP + lazy loading (except above-the-fold)
- Animate only `transform` and `opacity` (GSAP rule)
- Always wrap GSAP with `prefers-reduced-motion` check
- Lighthouse score target: ≥ 90

### Code quality
- No arbitrary Tailwind values
- No comments unless the WHY is non-obvious
- Don't add features beyond what's requested
- Validate only at system boundaries (user input, external APIs)

---

## Stack
> Update as decisions are made.
- HTML / CSS / JavaScript (current baseline)
- Tailwind CSS
- GSAP (animations)
- shadcn/ui (components, if applicable)
- *(add framework here: Next.js, Astro, etc.)*
