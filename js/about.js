document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof gsap === 'undefined' || reducedMotion) return

  gsap.timeline({ delay: 0.15 })
    .from('.about-hero__overline', {
      y: 14, opacity: 0, duration: 0.5, ease: 'power2.out'
    })
    .from('.about-hero__title', {
      y: 28, opacity: 0, duration: 0.85, ease: 'power3.out'
    }, '-=0.25')
    .from('.about-hero__lead', {
      y: 18, opacity: 0, duration: 0.6, ease: 'power2.out'
    }, '-=0.55')

  gsap.from('.team__header > *', {
    scrollTrigger: { trigger: '.team', start: 'top 82%' },
    y: 32, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out'
  })

  gsap.utils.toArray('.bio').forEach(bio => {
    const headerChildren = bio.querySelectorAll('.bio__photo, .bio__intro > *')
    const tableHead = bio.querySelectorAll('.bio__table-head span')
    const items = bio.querySelectorAll('.bio-item')
    const itemNumbers = bio.querySelectorAll('.bio-item__num')
    const itemResume = bio.querySelectorAll('.bio-item__resume')
    const itemVoice = bio.querySelectorAll('.bio-item__voice')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bio,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.from(headerChildren, {
      y: 22, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out'
    })
      .from(tableHead, {
        y: 10, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out'
      }, '-=0.2')
      .from(items, {
        y: 14, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out'
      }, '-=0.18')
      .from(itemNumbers, {
        scale: 0.96, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out'
      }, '-=0.35')
      .from(itemResume, {
        y: 10, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out'
      }, '-=0.35')
      .from(itemVoice, {
        y: 10, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out'
      }, '-=0.35')
  })

  gsap.from('.team__action', {
    scrollTrigger: { trigger: '.team__action', start: 'top 90%' },
    y: 20, opacity: 0, duration: 0.6, ease: 'power2.out'
  })

  gsap.from('.about-cta__title', {
    scrollTrigger: { trigger: '.about-cta', start: 'top 82%' },
    y: 32, opacity: 0, duration: 0.8, ease: 'power3.out'
  })

  gsap.from('.about-cta__copy', {
    scrollTrigger: { trigger: '.about-cta', start: 'top 80%' },
    y: 24, opacity: 0, duration: 0.7, delay: 0.15, ease: 'power2.out'
  })

  gsap.from('.about-cta__btn', {
    scrollTrigger: { trigger: '.about-cta', start: 'top 78%' },
    y: 20, opacity: 0, duration: 0.6, delay: 0.3, ease: 'power2.out'
  })
})
