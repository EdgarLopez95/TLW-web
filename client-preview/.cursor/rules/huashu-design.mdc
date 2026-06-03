# Huashu Design — AI Design Agent Standards

Source: https://github.com/alchaincyf/huashu-design (MIT License)

Apply these rules whenever producing visual design output (HTML/CSS, slides, diagrams, or any UI deliverable).

---

## Anti AI-Slop Rules

The following patterns are banned — they signal low-quality, generic AI output:

- ❌ Purple/violet gradients as background (the #1 AI cliché)
- ❌ Emoji used as icons or bullet decorators
- ❌ CSS-drawn silhouette illustrations as "design"
- ❌ Generic sans-serif on everything (Inter/Roboto/Arial as the only font)
- ❌ "Glassy" frosted-glass effects without purpose
- ❌ Centered everything on a white background with no visual hierarchy
- ❌ Randomly colored section backgrounds with no color system

---

## Typography Standards

- Use distinctive, purposeful font pairings — not just system-ui
- Always set: `font-size`, `line-height`, `letter-spacing`, `font-weight` explicitly
- Establish 3 levels of hierarchy minimum: display/h1, body, caption
- Use `font-variant-numeric: tabular-nums` for data/numbers
- Avoid mixing more than 2 typefaces

---

## Layout Principles

- Prefer CSS Grid for 2D layouts, Flexbox for 1D alignment
- Build on a consistent column grid (8 or 12 columns)
- Generous whitespace communicates confidence
- Information hierarchy must be visible at a glance — 3-second rule

---

## Color System

- Always define a color system before applying colors
- Use CSS custom properties (`--color-*`) for every value
- Primary brand color must appear on every page as structural anchor
- Limit decorative accent colors to ≤ 2 per design
- Every combination must pass WCAG AA contrast

---

## Brand Asset Protocol

Before designing anything brand-specific:
1. Ask the client for official brand assets (logos, colors, fonts)
2. Never invent or approximate brand colors from memory
3. Verify logo files are the correct variant (dark/light/mono)
4. Document confirmed brand specs before proceeding

---

## Iterative Workflow (Junior Designer Mindset)

1. **Assumptions first** — state what you're assuming before designing
2. **Show early** — share rough direction before full polish
3. **One revision round** — gather feedback on structure before perfecting details
4. **Verify facts** — any specific product/company detail gets checked, not assumed

---

## HTML/CSS Output Quality

All HTML/CSS deliverables must be:
- Production-grade — no placeholder content or `TODO` comments in shipped code
- Semantic — correct HTML elements, ARIA where needed
- Responsive — mobile-first, tested at 375px / 768px / 1280px
- Performant — no unnecessary DOM depth, no layout thrashing in animations
- Accessible — keyboard navigable, focus states visible, contrast passing

---

## Design Review Checklist

- [ ] No banned AI-slop patterns present
- [ ] Color system defined and used consistently
- [ ] Typography hierarchy clear at all breakpoints
- [ ] Brand assets verified (not approximated)
- [ ] CSS Grid used for layout structure
- [ ] All colors via CSS custom properties
- [ ] Responsive and accessible
