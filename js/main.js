
document.addEventListener('DOMContentLoaded', () => {

  if (typeof lucide !== 'undefined') lucide.createIcons()

  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }

  if (window.location.hash) {
    window.addEventListener('load', () => {
      const target = document.getElementById(window.location.hash.slice(1))
      if (!target) return
      const navHeight = header ? header.offsetHeight : 72
      const y = target.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top: y, behavior: 'instant' })
    }, { once: true })
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const header = document.getElementById('site-header')
  const isHomePage = document.body.classList.contains('page-home')

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
      el.querySelector('.nav__dropdown-chevron')?.setAttribute('aria-expanded', 'false')
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

  document.querySelectorAll('.nav__dropdown-chevron').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!isMobileViewport()) return
      const isOpen = btn.getAttribute('aria-expanded') === 'true'
      btn.setAttribute('aria-expanded', String(!isOpen))
      btn.closest('.nav__item--dropdown').classList.toggle('dropdown--open', !isOpen)
    })
  })

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

  if (typeof gsap !== 'undefined' && !reducedMotion) {
    gsap.from('.footer__brand, .footer__col', {
      scrollTrigger: { trigger: '.site-footer', start: 'top 90%' },
      y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out'
    })
  }
})
