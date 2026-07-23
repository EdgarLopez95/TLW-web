document.addEventListener('DOMContentLoaded', () => {
  function animateDecorCircles () {
    if (typeof gsap === 'undefined') return
    if (!window.matchMedia('(min-width: 1100px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const circles = gsap.utils.toArray('.page-decor__circle')
    if (!circles.length) return

    gsap.killTweensOf(circles)
    gsap.set(circles, { clearProps: 'y,rotation,scale', transformOrigin: '50% 50%' })

    const floatConfig = [
      { y: 34, dur: 5.2, breathe: 1.09, breatheDur: 3.4, rot:  4, delay: 0   },
      { y: 42, dur: 6.0, breathe: 1.07, breatheDur: 3.9, rot: -4, delay: 0.4 },
      { y: 30, dur: 5.5, breathe: 1.1,  breatheDur: 3.6, rot:  5, delay: 0.8 },
      { y: 46, dur: 6.4, breathe: 1.08, breatheDur: 4.1, rot: -5, delay: 0.2 },
      { y: 36, dur: 5.8, breathe: 1.07, breatheDur: 3.7, rot:  3, delay: 1.0 },
      { y: 50, dur: 6.8, breathe: 1.11, breatheDur: 4.4, rot: -3, delay: 0.6 },
      { y: 44, dur: 6.2, breathe: 1.1,  breatheDur: 4.0, rot:  5, delay: 1.2 },
      { y: 28, dur: 5.1, breathe: 1.06, breatheDur: 3.5, rot: -4, delay: 0.9 },
      { y: 40, dur: 6.6, breathe: 1.08, breatheDur: 4.2, rot:  4, delay: 1.4 },
      { y: 32, dur: 5.7, breathe: 1.07, breatheDur: 3.8, rot: -5, delay: 0.7 }
    ]

    circles.forEach((circle, i) => {
      const cfg = floatConfig[i % floatConfig.length]

      gsap.to(circle, {
        y: cfg.y,
        rotation: cfg.rot,
        duration: cfg.dur,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: cfg.delay
      })

      gsap.to(circle, {
        scale: cfg.breathe,
        duration: cfg.breatheDur,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: cfg.delay + 0.35
      })
    })
  }

  /* Generates balanced desktop decoration from the data attributes on <main>. */
  initPageDecor()

  function initPageDecor () {
    const main = document.querySelector('main[data-decor-palette]')
    if (!main) return

    const DECOR_RULES = {
      minPxAny:           220,
      minPxSameSide:      380,
      minPxSameColor:     320,
      minPxWatermarkPair: 520,
      minPxHorizPair:     180
    }

    const PALETTES = {
      base: ['lime', 'emerald'],
      rich: ['lime', 'emerald', 'navy', 'purple']
    }

    /* Background → list of colors NOT allowed for a circle whose centre
       falls inside a section with that background. */
    const BG_FORBID = {
      offwhite:      [],
      'light-tint':  [],
      navy:          ['navy', 'purple'],
      'dark-emerald':['emerald', 'navy']
    }

    const desktopMq = window.matchMedia('(min-width: 1100px)')
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    let scheduled = null
    const schedule = () => {
      if (scheduled) cancelAnimationFrame(scheduled)
      scheduled = requestAnimationFrame(render)
    }

    const render = () => {
      scheduled = null
      let container = main.querySelector(':scope > .page-decor')
      if (!desktopMq.matches || reducedMq.matches) {
        if (container) container.innerHTML = ''
        return
      }
      if (!container) {
        container = document.createElement('div')
        container.className = 'page-decor'
        container.setAttribute('aria-hidden', 'true')
        main.prepend(container)
      }
      const circles = generate(main)
      paint(container, circles)
    }

    /* Core generator */
    function generate (mainEl) {
      const palette = PALETTES[mainEl.dataset.decorPalette] || PALETTES.base
      const densityToken = mainEl.dataset.decorDensity || 'auto'
      const mainH = mainEl.offsetHeight
      if (mainH < 600) return []

      const n = densityToken === 'auto'
        ? Math.max(4, Math.min(10, Math.round(mainH / 700)))
        : Math.max(2, Math.min(12, parseInt(densityToken, 10) || 6))

      const nWatermark = Math.max(1, Math.min(3, Math.round(n / 3)))

      /* Decide which indices will be watermarks: spaced evenly. */
      const watermarkIdx = new Set()
      if (nWatermark === 1) {
        watermarkIdx.add(Math.floor(n / 2))
      } else {
        for (let w = 0; w < nWatermark; w++) {
          const pos = Math.round((w + 0.5) * (n / nWatermark))
          watermarkIdx.add(Math.max(0, Math.min(n - 1, pos)))
        }
      }

      /* Build Y positions with a deterministic micro-jitter (no randomness
         per render, so resize doesn't shuffle the layout). */
      const stepY = 100 / (n + 1)
      const ys = []
      for (let i = 1; i <= n; i++) {
        const jitter = ((i * 37) % 5) - 2
        ys.push(Math.max(2, Math.min(98, stepY * i + jitter)))
      }

      /* Map of sections with their vertical range in %, for color filtering. */
      const mainRect = mainEl.getBoundingClientRect()
      const sections = []
      mainEl.querySelectorAll('[data-decor-bg]').forEach(sec => {
        const r = sec.getBoundingClientRect()
        sections.push({
          bg: sec.dataset.decorBg,
          topPct: ((r.top - mainRect.top) / mainH) * 100,
          botPct: ((r.bottom - mainRect.top) / mainH) * 100
        })
      })
      const bgAt = (yPct) => {
        const sec = sections.find(s => yPct >= s.topPct && yPct <= s.botPct)
        return sec ? sec.bg : 'offwhite'
      }

      const chosen = []

      for (let i = 0; i < n; i++) {
        const y = ys[i]
        const yPx = (y / 100) * mainH
        const type = watermarkIdx.has(i) ? 'watermark' : 'solid'

        const forbidden = BG_FORBID[bgAt(y)] || []
        const colorsAllowed = palette.filter(c => !forbidden.includes(c))

        let candidates = []
        for (const side of ['L', 'R']) {
          for (const color of colorsAllowed) {
            candidates.push({ y, yPx, side, color, type })
          }
        }

        const passesHard = (cand) => {
          for (const prev of chosen) {
            const d = Math.abs(cand.yPx - prev.yPx)
            if (d < DECOR_RULES.minPxAny) return false
            if (cand.side === prev.side && d < DECOR_RULES.minPxSameSide) return false
            if (cand.color === prev.color && d < DECOR_RULES.minPxSameColor) return false
            if (cand.type === 'watermark' && prev.type === 'watermark' &&
                d < DECOR_RULES.minPxWatermarkPair) return false
            if (cand.side !== prev.side && d < DECOR_RULES.minPxHorizPair) return false
          }
          if (chosen.length >= 2) {
            const lastTwo = chosen.slice(-2)
            if (lastTwo.every(c => c.side === cand.side)) return false
            if (lastTwo.every(c => c.color === cand.color)) return false
          }
          return true
        }

        let valid = candidates.filter(passesHard)

        /* Progressive relaxation: drop the strictest rules in order
           rather than failing outright on tight pages. */
        const relaxOrder = [
          () => { DECOR_RULES.minPxHorizPair = 0 },
          () => { DECOR_RULES.minPxSameColor = 220 },
          () => { DECOR_RULES.minPxSameSide  = 260 },
          () => { DECOR_RULES.minPxAny       = 160 }
        ]
        const snapshot = { ...DECOR_RULES }
        let step = 0
        while (valid.length === 0 && step < relaxOrder.length) {
          relaxOrder[step]()
          valid = candidates.filter(passesHard)
          step++
        }
        Object.assign(DECOR_RULES, snapshot)

        if (valid.length === 0) {
          chosen.push(candidates[0])
          continue
        }

        const scored = valid.map(c => ({ ...c, score: scoreCandidate(c, chosen, palette, n) }))
        scored.sort((a, b) => b.score - a.score)
        chosen.push(scored[0])
      }

      applyOverrides(chosen, mainEl)
      return chosen
    }

    /* Per-circle manual overrides via data-decor-override-N on <main>.
       NOTE: We read via getAttribute() (not dataset) because dataset
       mangles attribute names that have a digit after the final dash. */
    function applyOverrides (chosen, mainEl) {
      const validColors = ['lime', 'emerald', 'navy', 'purple']
      const validTypes  = ['solid', 'watermark']
      const mainH = mainEl.offsetHeight
      for (let i = 0; i < chosen.length; i++) {
        const n = i + 1
        const raw = mainEl.getAttribute('data-decor-override-' + n)
                 || mainEl.getAttribute('data-decor-override' + n)
        if (!raw) continue
        raw.split(';').forEach(part => {
          const [rawKey, rawVal] = part.split(':')
          if (!rawKey || !rawVal) return
          const key = rawKey.trim().toLowerCase()
          const val = rawVal.trim()
          if (key === 'color' && validColors.includes(val.toLowerCase())) {
            chosen[i].color = val.toLowerCase()
          } else if (key === 'type' && validTypes.includes(val.toLowerCase())) {
            chosen[i].type = val.toLowerCase()
          } else if (key === 'side') {
            const s = val.toUpperCase()
            if (s === 'L' || s === 'R') chosen[i].side = s
          } else if (key === 'y') {
            const num = parseFloat(val)
            if (!isNaN(num) && num >= 0 && num <= 100) {
              chosen[i].y = num
              chosen[i].yPx = (num / 100) * mainH
            }
          }
        })
      }
    }

    function scoreCandidate (cand, chosen, palette, n) {
      let s = 0
      const prev = chosen[chosen.length - 1]
      if (prev && prev.side !== cand.side) s += 3

      const recentColors = chosen.slice(-3).map(c => c.color)
      if (!recentColors.includes(cand.color)) s += 2

      const dists = chosen.map(c => Math.abs(cand.yPx - c.yPx))
      const minD = dists.length ? Math.min.apply(null, dists) : 1000
      s += Math.min(5, minD / 200)

      /* Global ratio control: keep counts close to the ideal share per color.
         Reward under-used colors, penalise over-used ones. */
      const usedCount = chosen.filter(c => c.color === cand.color).length
      const idealShare = 1 / palette.length
      const currentShare = chosen.length === 0 ? 0 : usedCount / chosen.length
      s += (idealShare - currentShare) * 6

      /* In rich palettes, give a small push to non-lime so accents (navy/purple)
         actually show up — lime tends to dominate otherwise. */
      if (palette.length > 2 && cand.color !== 'lime') s += 0.8

      return s
    }

    function paint (container, circles) {
      container.innerHTML = ''
      circles.forEach(c => {
        const span = document.createElement('span')
        span.className = [
          'page-decor__circle',
          c.side === 'L' ? 'page-decor__circle--left' : 'page-decor__circle--right',
          'page-decor__circle--' + c.color,
          'page-decor__circle--' + c.type
        ].join(' ')
        span.style.setProperty('--decor-y', c.y.toFixed(2) + '%')
        container.appendChild(span)
      })
      animateDecorCircles()
    }

    /* Init + resize handling */
    schedule()
    window.addEventListener('load', schedule, { once: true })

    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(schedule, 180)
    })

    if (desktopMq.addEventListener) desktopMq.addEventListener('change', schedule)
    else if (desktopMq.addListener) desktopMq.addListener(schedule)
  }

})
