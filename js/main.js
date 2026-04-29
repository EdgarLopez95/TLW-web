/* The Learning Warehouse  Main Script */

document.addEventListener('DOMContentLoaded', () => {

  /*  Icons  */
  if (typeof lucide !== 'undefined') lucide.createIcons()

  /*  GSAP setup  */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /*  Nav: scrolled state (home = tiny scroll → solid bar; other pages = scroll offset)  */
  const header = document.getElementById('site-header')
  const isHomePage = document.body.classList.contains('page-home')

  /** Home only: switch header background after a small vertical scroll (still inside hero). */
  const HOME_NAV_SCROLL_SOLID_PX = 12

  const applyNonHomeNavScroll = () => {
    if (!header) return
    header.classList.toggle('nav--scrolled', window.scrollY > 40)
  }

  const applyHomeNavScroll = () => {
    if (!header || !isHomePage) return
    header.classList.toggle('nav--scrolled', window.scrollY > HOME_NAV_SCROLL_SOLID_PX)
  }

  if (isHomePage) {
    applyHomeNavScroll()
    window.addEventListener('scroll', applyHomeNavScroll, { passive: true })
  } else {
    window.addEventListener('scroll', applyNonHomeNavScroll, { passive: true })
    applyNonHomeNavScroll()
  }

  /*  Nav: mobile toggle  */
  const navToggle = document.getElementById('nav-toggle')
  const navMenu = document.getElementById('nav-menu')

  const isMobileViewport = () => window.matchMedia('(max-width: 1023px)').matches

  const renderNavIcon = isOpen => {
    navToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}" aria-hidden="true"></i>`
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu')
    if (typeof lucide !== 'undefined') lucide.createIcons()
  }

  const closeMobileNav = () => {
    document.body.classList.remove('mobile-nav-open')
    navToggle.setAttribute('aria-expanded', 'false')
    navMenu.querySelectorAll('.dropdown--open').forEach(el => {
      el.classList.remove('dropdown--open')
      el.querySelector('.nav__dropdown-toggle')?.setAttribute('aria-expanded', 'false')
    })
    renderNavIcon(false)
  }

  const openMobileNav = () => {
    document.body.classList.add('mobile-nav-open')
    navToggle.setAttribute('aria-expanded', 'true')
    renderNavIcon(true)
  }

  navToggle.addEventListener('click', () => {
    if (document.body.classList.contains('mobile-nav-open')) {
      closeMobileNav()
      return
    }
    openMobileNav()
  })

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isMobileViewport()) closeMobileNav()
    })
  })

  /*  Nav: dropdown toggle (mobile + keyboard)  */
  document.querySelectorAll('.nav__dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!isMobileViewport()) return
      const isOpen = btn.getAttribute('aria-expanded') === 'true'
      btn.setAttribute('aria-expanded', !isOpen)
      btn.closest('.nav__item--dropdown').classList.toggle('dropdown--open', !isOpen)
    })
  })

  /*  Close menu on outside click  */
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-header')) {
      closeMobileNav()
    }
  })

  window.addEventListener('resize', () => {
    if (!isMobileViewport()) closeMobileNav()
  }, { passive: true })

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileNav()
  })

  /*  Hero slider — load background images (always)  */
  const heroSlides = Array.from(document.querySelectorAll('.hero__slide'))
  heroSlides.forEach(el => {
    const url = el.dataset.slideImg
    if (url) el.style.backgroundImage = `url('${url}')`
  })

  /* 
     GSAP ANIMATIONS
      */
  if (typeof gsap === 'undefined' || reducedMotion) return

  /*  Hero entrance  */
  const heroTl = gsap.timeline({ delay: 0.2 })

  heroTl
    .from('.hero__title', {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
    })
    .from('.hero__lead', {
      y: 24, opacity: 0, duration: 0.7, ease: 'power2.out'
    }, '-=0.5')
    .from('.hero__ctas .btn', {
      y: 16, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
    }, '-=0.4')

  /*  Hero slider — Ken Burns + crossfade  */
  if (heroSlides.length > 0) {
    const SLIDE_DURATION = 7
    const FADE_DURATION  = 1.5
    const START_SCALE    = 1.12
    const END_SCALE      = 1.0

    const animateSlide = (slide, isFirst = false) => {
      const tl = gsap.timeline()
      tl.fromTo(slide,
        { opacity: isFirst ? 1 : 0, scale: START_SCALE },
        { opacity: 1, duration: isFirst ? 0 : FADE_DURATION, ease: 'power2.out' }, 0)
      tl.to(slide, { scale: END_SCALE, duration: SLIDE_DURATION + FADE_DURATION, ease: 'none' }, 0)
      tl.to(slide, { opacity: 0, duration: FADE_DURATION, ease: 'power2.in' }, SLIDE_DURATION)
    }

    let idx = 0
    animateSlide(heroSlides[0], true)
    setInterval(() => {
      idx = (idx + 1) % heroSlides.length
      animateSlide(heroSlides[idx])
    }, SLIDE_DURATION * 1000)
  }

  /*  You + We  */
  gsap.from('.you-we__statement', {
    scrollTrigger: { trigger: '.you-we', start: 'top 82%' },
    y: 24, opacity: 0, duration: 0.7, ease: 'power2.out'
  })

  gsap.from('.you-we__list .you-we__item', {
    scrollTrigger: { trigger: '.you-we__grid', start: 'top 85%' },
    y: 16, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out'
  })

  /*  Video section  */
  gsap.from('.video-frame', {
    scrollTrigger: { trigger: '.video-section', start: 'top 82%' },
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
  })

  /*  Section header (how we help)  */
  gsap.from('.how-we-help .section-header', {
    scrollTrigger: { trigger: '.how-we-help', start: 'top 82%' },
    y: 40, opacity: 0, duration: 0.8, ease: 'power2.out'
  })

  /*  Cards  */
  gsap.from('.card--how', {
    scrollTrigger: { trigger: '.cards-grid', start: 'top 82%' },
    opacity: 0, duration: 0.8, stagger: 0.18, ease: 'power2.out'
  })

  /*  Global page decor: lively desktop-only motion  */
  const decorMotion = gsap.matchMedia()

  decorMotion.add('(min-width: 1100px)', () => {
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
      { y: 32, dur: 5.7, breathe: 1.07, breatheDur: 3.8, rot: -5, delay: 0.7 },
    ]

    gsap.set('.page-decor__circle', { transformOrigin: '50% 50%' })

    gsap.utils.toArray('.page-decor__circle').forEach((circle, i) => {
      const cfg = floatConfig[i] || floatConfig[0]

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
  })

  /*  Partners heading  */
  gsap.from('.partners__header > *', {
    scrollTrigger: { trigger: '.partners', start: 'top 82%' },
    y: 32, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out'
  })


  /*  CTA Banner  */
  gsap.from('.cta-banner__text', {
    scrollTrigger: { trigger: '.cta-banner', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.9, ease: 'power2.out'
  })

  gsap.from('.cta-banner__btn', {
    scrollTrigger: { trigger: '.cta-banner', start: 'top 76%' },
    y: 20, opacity: 0, duration: 0.6, delay: 0.25, ease: 'power2.out'
  })

  /*  Footer  */
  gsap.from('.footer__brand, .footer__col', {
    scrollTrigger: { trigger: '.site-footer', start: 'top 90%' },
    y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out'
  })

})
