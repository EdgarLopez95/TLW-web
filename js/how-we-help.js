document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof gsap === 'undefined' || reducedMotion) return

  gsap.timeline({ delay: 0.15 })
    .from('.hwh-hero__overline', {
      y: 14, opacity: 0, duration: 0.5, ease: 'power2.out'
    })
    .from('.hwh-hero__title', {
      y: 28, opacity: 0, duration: 0.85, ease: 'power3.out'
    }, '-=0.25')
    .from('.hwh-hero__title-accent', {
      opacity: 0, duration: 0.6, ease: 'power2.out'
    }, '-=0.45')

  gsap.from('.hwh-values__header > *', {
    scrollTrigger: { trigger: '.hwh-values', start: 'top 82%' },
    y: 28, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out'
  })

  gsap.utils.toArray('.value-card').forEach((card, idx) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      y: 34,
      opacity: 0,
      duration: 0.62,
      delay: idx * 0.04,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    })
  })

  gsap.timeline({ scrollTrigger: { trigger: '.hwh-values__close', start: 'top 88%' } })
    .from('.hwh-values__close', { y: 36, opacity: 0, duration: 0.75, ease: 'power3.out' })
    .from('.hwh-values__close > *', { y: 18, opacity: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out' }, '-=0.45')

  gsap.utils.toArray('.hwh-split').forEach(section => {
    const sidebar = section.querySelector('.hwh-split__sidebar')
    const bodyParts = section.querySelectorAll(
      '.hwh-split__lead, .hwh-split__para, .hwh-split__closing, .hwh-split__cta'
    )

    if (sidebar) {
      gsap.from(sidebar.children, {
        scrollTrigger: { trigger: section, start: 'top 80%' },
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out'
      })
    }

    if (bodyParts.length) {
      gsap.from(bodyParts, {
        scrollTrigger: { trigger: section, start: 'top 82%' },
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.09,
        ease: 'power2.out'
      })
    }
  })

  gsap.utils.toArray('.cap-atlas').forEach(atlas => {
    const bands = atlas.querySelectorAll('.cap-band')
    if (!bands.length) return
    const isLddAtlas = atlas.classList.contains('cap-atlas--ldd')
    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches

    if (isLddAtlas && isMobileViewport) {
      gsap.set(bands, { clearProps: 'transform,opacity' })
      return
    }

    gsap.from(bands, {
      scrollTrigger: { trigger: atlas, start: 'top 82%', once: true },
      y: 26,
      opacity: 0,
      duration: 0.58,
      stagger: { amount: 0.3, from: 'start' },
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    })
  })

  gsap.from('.hwh-caps__footer > *', {
    scrollTrigger: { trigger: '.hwh-caps__footer', start: 'top 88%' },
    y: 20, opacity: 0, duration: 0.6, stagger: 0.14, ease: 'power2.out'
  })

  window.addEventListener('load', () => ScrollTrigger.refresh())
})
