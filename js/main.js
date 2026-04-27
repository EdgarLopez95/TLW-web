/* The Learning Warehouse  Main Script */

document.addEventListener('DOMContentLoaded', () => {

  /*  Icons  */
  if (typeof lucide !== 'undefined') lucide.createIcons()

  /*  GSAP setup  */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /*  Nav: scrolled state  */
  const header = document.getElementById('site-header')

  window.addEventListener('scroll', () => {
    header.classList.toggle('nav--scrolled', window.scrollY > 40)
  }, { passive: true })

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

  /* 
     GSAP ANIMATIONS
      */
  if (typeof gsap === 'undefined' || reducedMotion) return

  /*  Hero entrance  */
  const heroTl = gsap.timeline({ delay: 0.1 })

  heroTl
    .from('.hero__overline', {
      y: 20, opacity: 0, duration: 0.6, ease: 'power2.out'
    })
    .from('.hero__line', {
      y: 54, opacity: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out'
    }, '-=0.3')
    .from('.hero__lead', {
      y: 24, opacity: 0, duration: 0.6, ease: 'power2.out'
    }, '-=0.4')
    .from('.hero__bullets li', {
      y: 16, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out'
    }, '-=0.4')
    .from('.hero__ctas .btn', {
      y: 16, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
    }, '-=0.3')
    .from('.hero__img-wrap--1', {
      x: window.innerWidth >= 1024 ? 50 : 0,
      y: window.innerWidth >= 1024 ? 0 : 30,
      opacity: 0, duration: 0.9, ease: 'power3.out'
    }, 0.3)
    .from('.hero__img-wrap--2', {
      x: window.innerWidth >= 1024 ? 70 : 0,
      y: window.innerWidth >= 1024 ? 0 : 30,
      opacity: 0, duration: 0.9, ease: 'power3.out'
    }, 0.5)
    .from('.hero__deco--lime', {
      scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(1.7)'
    }, 0.8)
    .from('.hero__deco--purple', {
      scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(1.7)'
    }, 0.95)

  /*  You + We  */
  gsap.from('.you-we__list li', {
    scrollTrigger: { trigger: '.you-we', start: 'top 82%' },
    x: -18, opacity: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out'
  })

  gsap.from('.you-we__plus', {
    scrollTrigger: { trigger: '.you-we', start: 'top 78%' },
    scale: 0, opacity: 0, duration: 0.65, ease: 'back.out(1.7)'
  })

  /*  Quote section  */
  gsap.from('.quote-mark', {
    scrollTrigger: { trigger: '.quote-video', start: 'top 82%' },
    y: -30, opacity: 0, duration: 0.7, ease: 'power2.out'
  })

  gsap.from('blockquote', {
    scrollTrigger: { trigger: '.quote-video', start: 'top 78%' },
    y: 40, opacity: 0, duration: 0.9, ease: 'power2.out'
  })

  gsap.from('.quote-tagline', {
    scrollTrigger: { trigger: '.quote-video', start: 'top 74%' },
    y: 20, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power2.out'
  })

  gsap.from('.video-placeholder', {
    scrollTrigger: { trigger: '.quote-video', start: 'top 78%' },
    x: 60, opacity: 0, duration: 0.9, ease: 'power3.out'
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

  /*  Page deco circles: float + parallax  */
  const floatConfig = [
    { yFloat: 18, dur: 3.8, scale: 1.05, rot:  2, delay: 0    },
    { yFloat: 14, dur: 4.4, scale: 1.04, rot: -2, delay: 0.6  },
    { yFloat: 22, dur: 3.2, scale: 1.06, rot:  3, delay: 1.1  },
    { yFloat: 16, dur: 5.0, scale: 1.03, rot: -1, delay: 0.3  },
    { yFloat: 20, dur: 4.1, scale: 1.05, rot:  2, delay: 0.9  },
    { yFloat: 12, dur: 3.6, scale: 1.04, rot: -3, delay: 0.5  },
    { yFloat: 24, dur: 4.7, scale: 1.06, rot:  1, delay: 1.4  },
  ]

  gsap.utils.toArray('.section-deco').forEach((circle, i) => {
    const cfg = floatConfig[i] || floatConfig[0]

    /* Float Y */
    gsap.to(circle, {
      y: cfg.yFloat,
      duration: cfg.dur,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: cfg.delay
    })

    /* Subtle scale pulse  offset timing so it doesn't sync with float */
    gsap.to(circle, {
      scale: cfg.scale,
      duration: cfg.dur * 1.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: cfg.delay + 0.5
    })

    /* Gentle rotation oscillation */
    gsap.to(circle, {
      rotation: cfg.rot,
      duration: cfg.dur * 2.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: cfg.delay + 0.2
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

