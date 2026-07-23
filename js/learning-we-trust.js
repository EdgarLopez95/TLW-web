document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof gsap === 'undefined' || reducedMotion) return

  gsap.timeline({ delay: 0.15 })
    .from('.lwt-hero__overline', {
      opacity: 0,
      y: 18,
      duration: 0.5,
      ease: 'power2.out'
    })
    .from('.lwt-hero__title', {
      opacity: 0,
      y: 28,
      duration: 0.65,
      ease: 'power3.out'
    }, '-=0.28')
    .from('.lwt-hero__lead', {
      opacity: 0,
      y: 20,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.14
    }, '-=0.32')

  const isDesktop = window.matchMedia('(min-width: 1024px)').matches

  document.querySelectorAll('.lwt-sub').forEach(section => {
    const header = section.querySelector('.lwt-sub__header')
    const body = section.querySelector('.lwt-sub__body')

    if (isDesktop) {
      gsap.from(header, {
        opacity: 0,
        x: -36,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
          once: true
        }
      })
      gsap.from(body, {
        opacity: 0,
        x: 36,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
          once: true
        }
      })
      return
    }

    gsap.from([header, body], {
      opacity: 0,
      y: 28,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: section,
        start: 'top 84%',
        toggleActions: 'play none none none',
        once: true
      }
    })
  })

  const logoCards = document.querySelectorAll('.lwt-logo-card')
  if (logoCards.length) {
    ScrollTrigger.batch('.lwt-logo-card', {
      onEnter: batch => {
        gsap.from(batch, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.07
        })
      },
      start: 'top 86%',
      once: true
    })
  }

  const resourceCard = document.querySelector('.lwt-resource-card')
  if (resourceCard) {
    gsap.from(resourceCard, {
      opacity: 0,
      y: 24,
      scale: 0.97,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: resourceCard,
        start: 'top 86%',
        toggleActions: 'play none none none',
        once: true
      }
    })
  }
})
