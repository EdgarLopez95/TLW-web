# Emil Kowalski — Micro-interaction Standards

Apply these principles whenever implementing hover states, click feedback, transitions, or any interactive UI element. Emil Kowalski is known for obsessive attention to micro-interactions (sonner, vaul, cmdk).

---

## Core Philosophy

Every interactive element must feel **alive and tactile**. Micro-interactions should be:
- **Fast** — 100–250ms. Never slow or dramatic.
- **Spring-based** — deceleration that feels physical, not linear.
- **Purposeful** — feedback tied directly to the action, not decoration.
- **Consistent** — every button, card, and input behaves predictably.

---

## Hover States

```css
/* Minimal lift — the baseline for all interactive elements */
.interactive {
  transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity   150ms ease-out,
              box-shadow 150ms ease-out;
}
.interactive:hover  { transform: translateY(-1px); }
.interactive:active { transform: translateY(0) scale(0.98); }
```

Cards: `scale(1.015)` on hover, `scale(0.985)` on press.
Buttons: `scale(1.02)` hover, `scale(0.97)` active.
Icon buttons: `scale(1.1)` hover, `scale(0.9)` active.
Links: underline animates left-to-right, not instant.

---

## Spring Config (GSAP / Framer Motion)

```js
// GSAP — spring feel via elastic ease
gsap.to(el, { scale: 1.02, duration: 0.25, ease: 'back.out(1.4)' })

// Framer Motion
{ type: 'spring', stiffness: 400, damping: 28, mass: 0.8 }

// CSS cubic-bezier equivalents
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);  /* overshoot */
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);       /* snappy decel */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);       /* smooth decel */
```

---

## Stagger Reveals

```js
// Lists, cards, grid items — stagger in from below
gsap.from(items, {
  y: 16, opacity: 0,
  duration: 0.4, stagger: 0.06,
  ease: 'power2.out',
  clearProps: 'all'
})
```

Rule: stagger delay ≤ 80ms. If there are more than 8 items, cap stagger at 40ms.

---

## Press / Active Feedback

All clickable elements must have a visible `:active` state:

```css
button:active, a:active, [role="button"]:active {
  transform: scale(0.97);
  transition-duration: 80ms;
}
```

Touch targets: minimum 44×44px. On mobile, `:active` is the primary feedback state.

---

## Transitions — Default Values

```css
:root {
  --transition-fast:   100ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-base:   150ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow:   250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  --transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Default on all interactive elements */
a, button, [role="button"], input, select, textarea {
  transition: background-color var(--transition-fast),
              color            var(--transition-fast),
              border-color     var(--transition-fast),
              transform        var(--transition-base),
              opacity          var(--transition-base),
              box-shadow       var(--transition-base);
}
```

---

## Accessibility — Always Required

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  // Remove all transforms and transitions, keep opacity fades ≤ 150ms
  document.documentElement.style.setProperty('--transition-base', '0ms')
}
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## What NOT to Do

- ❌ `transition: all 0.3s ease` — too broad, too slow
- ❌ Linear easing on spatial movement — feels robotic
- ❌ Scale beyond 1.05 on hover — too dramatic
- ❌ Animations longer than 350ms for micro-interactions
- ❌ Bounce/elastic on destructive actions (delete, close)
- ❌ Hover state without matching active/focus state
