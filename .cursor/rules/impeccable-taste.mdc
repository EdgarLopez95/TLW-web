# Impeccable Taste — Design Quality Standard

Apply these principles to every design and code decision. "Impeccable taste" means zero compromise on detail — every spacing value, every color combination, every transition has a deliberate reason.

---

## The Standard

> If you have to ask "is this good enough?", it isn't.

Every element on the page must pass this test:
1. **Intention** — why is it here?
2. **Proportion** — does it feel right at every size?
3. **Consistency** — does it match everything around it?
4. **Accessibility** — does it work for everyone?

---

## Typography

- Maximum 2 typefaces per project. One for headings, one for body.
- Heading weights: 700–800. Body weights: 400–500. Never use 300 for reading text.
- Line height: body 1.6–1.7, headings 1.05–1.2, UI labels 1.0–1.3.
- Letter spacing: headings −0.01 to −0.02em, overlines/caps +0.06 to +0.12em, body 0.
- **Never** set body text smaller than 15px.
- **Never** set line lengths longer than 75 characters for prose.
- Use `text-wrap: balance` on headings and CTAs.

---

## Spacing

Use a strict 4px base scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px.

```
No arbitrary values. "mt-[13px]" is a code smell.
```

- Section padding: 64px mobile → 80px tablet → 96px desktop.
- Card padding: 24px (mobile 20px).
- Between related elements: 8–16px. Between sections: 48–80px.
- The more important the element, the more breathing room it deserves.

---

## Color

- Every color has a purpose. No decorative gradients without function.
- Maximum 3 brand colors + neutrals in use at once per page.
- Never use more than one `action` / CTA color per viewport.
- Contrast ratios: body text 4.5:1 min, large text/UI 3:1 min.
- Test every combination before shipping — never assume.

**Color anti-patterns:**
- ❌ Purple gradient on white background (the most common AI-generated cliché)
- ❌ Too many accent colors competing
- ❌ Low-opacity text on colored backgrounds (often fails contrast)
- ❌ Pure black (#000) on pure white (#fff) — use near-black on near-white

---

## Borders, Radius, Shadows

- Border radius: pick one primary radius and use it consistently.
  - Small UI (inputs, badges): 4–6px
  - Cards: 8–12px
  - Featured/hero cards: 16–20px
  - Pills/avatars: 9999px
- Shadows: 1 shadow style per elevation level. No decorative shadows.
- Borders: use either border OR shadow, rarely both on the same element.

---

## Icons

- Use one icon library per project. Never mix libraries.
- Stroke-based icons: always `stroke-width: 1.5`. Never filled + outlined mixed.
- Icon size must be consistent: 16px UI, 20px default, 24px prominent.
- Decorative icons: `aria-hidden="true"`. Functional icons: `aria-label`.

---

## Layout

- Every layout decision must have a reason visible in the grid.
- Whitespace is not empty — it is structure.
- Mobile-first: design for 375px, add complexity at 768px, 1024px, 1440px.
- Never break from the spacing scale to "make something fit".

---

## Quality Checklist (before marking done)

- [ ] Every spacing value is on the 4px scale
- [ ] No hardcoded hex colors — all use design tokens
- [ ] Every interactive element has hover + focus + active states
- [ ] Text contrast passes WCAG AA at all breakpoints
- [ ] No layout shift at any viewport size
- [ ] Reduced motion respected
- [ ] No orphaned words in headings (use `text-wrap: balance`)
- [ ] Images have correct aspect ratios — no distortion

---

## The Taste Test

Before shipping, zoom to 150%, then shrink to 50%. Good design holds at both.
Look at the design on a phone. Look at it in dark mode. Look at it with a screen reader.
If something feels "off" but you can't articulate why — fix it. Your instinct is right.
