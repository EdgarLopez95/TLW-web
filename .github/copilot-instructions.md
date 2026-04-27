# GitHub Copilot Instructions — The Learning Warehouse

## Project
Website for **The Learning Warehouse (TWH)**, an educational platform. Always write code aligned with the brand and design standards below.

---

## Brand
- Name: The Learning Warehouse (TWH)
- Tone: approachable, encouraging, clear, inclusive
- Educational content is the hero — UI must not compete with it
- Trust signals (credentials, reviews, bios) must be prominent
- Full brand details: `.cursor/rules/brand-guidelines.mdc`

---

## Design Standards

### Layout & Spacing
- 12-column grid, `max-w-7xl` container, centered
- Spacing: 4px base scale only (`4, 8, 12, 16, 24, 32, 48, 64, 96, 128px`)
- Mobile-first at 375px, breakpoints: sm 640 / md 768 / lg 1024 / xl 1280

### Components
- Buttons: `rounded-md px-6 py-3 font-medium` — primary (filled), secondary (outlined), ghost
- Inputs: `h-10`, label always above, inline validation on blur
- Cards: `rounded-lg shadow-sm p-6`, `shadow-md` on hover

### Animations (GSAP)
- Only animate `transform` and `opacity`
- Always check `prefers-reduced-motion` before running GSAP
- Use `ScrollTrigger` for scroll-based animations

### Accessibility (WCAG 2.1 AA)
- Contrast ≥ 4.5:1 body text, ≥ 3:1 large text
- Keyboard navigation on all interactive elements
- Focus ring always visible
- `alt` text on all images

### Performance
- `loading="lazy"` on all images except above-the-fold
- WebP images with JPEG fallback
- Target: LCP < 2.5s, CLS < 0.1, Lighthouse ≥ 90

---

## Code Conventions
- No arbitrary Tailwind values (`mt-[13px]` → use scale)
- No comments unless the WHY is non-obvious
- Validate only at boundaries (user input, external APIs)
- Don't add features beyond what's requested

---

## Assets Location
```
assets/images/logos/   ← brand logos
assets/images/photos/  ← photography
assets/videos/         ← video files
assets/fonts/          ← custom fonts
assets/icons/          ← SVG icons
```
