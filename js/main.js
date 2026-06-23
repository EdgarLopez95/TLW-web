/* The Learning Warehouse  Main Script */

document.addEventListener('DOMContentLoaded', () => {

  /*  Icons  */
  if (typeof lucide !== 'undefined') lucide.createIcons()

  /*  GSAP setup  */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }

  /*  Anchor hash scroll — re-apply on load so the fixed header doesn't cover the target  */
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

  /*  Nav: dropdown chevron toggle (mobile only)  */
  document.querySelectorAll('.nav__dropdown-chevron').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!isMobileViewport()) return
      const isOpen = btn.getAttribute('aria-expanded') === 'true'
      btn.setAttribute('aria-expanded', String(!isOpen))
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

  const heroSliderUtils = window.TWHHeroSliderUtils || {
    hasEnoughSlidesToAutoplay: readyStates => readyStates.filter(Boolean).length > 1,
    getNextReadySlideIndex: (currentIndex, readyStates) => {
      if (!Array.isArray(readyStates) || readyStates.length === 0) return -1

      for (let step = 1; step <= readyStates.length; step++) {
        const nextIndex = (currentIndex + step) % readyStates.length
        if (readyStates[nextIndex]) return nextIndex
      }

      return currentIndex
    }
  }

  const privacyPolicyUtils = window.TWHPrivacyPolicyUtils || {
    buildPrivacyPolicyContent: () => ''
  }

  /*  Shared privacy policy modal  */
  const privacyPolicyTriggers = Array.from(document.querySelectorAll('[data-modal-trigger="privacy-policy"]'))
  if (privacyPolicyTriggers.length > 0) {
    const modal = document.createElement('div')
    modal.className = 'site-modal'
    modal.id = 'privacy-policy-modal'
    modal.setAttribute('hidden', '')
    modal.innerHTML = `
      <div class="site-modal__backdrop" data-modal-close="privacy-policy"></div>
      <div class="site-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="privacy-policy-title" tabindex="-1">
        <div class="site-modal__header">
          <div>
            <p class="site-modal__eyebrow">Privacy Policy</p>
            <h2 class="site-modal__title" id="privacy-policy-title">How we handle website enquiries</h2>
          </div>
          <button class="site-modal__close" type="button" aria-label="Close privacy policy" data-modal-close="privacy-policy">
            <i data-lucide="x" aria-hidden="true"></i>
          </button>
        </div>
        <div class="site-modal__body">
          ${privacyPolicyUtils.buildPrivacyPolicyContent()}
        </div>
      </div>
    `

    document.body.appendChild(modal)
    if (typeof lucide !== 'undefined') lucide.createIcons()

    const dialog = modal.querySelector('.site-modal__dialog')
    const closeButtons = modal.querySelectorAll('[data-modal-close="privacy-policy"]')
    let lastFocusedElement = null

    const closePrivacyPolicyModal = () => {
      modal.setAttribute('hidden', '')
      document.body.classList.remove('modal-open')
      lastFocusedElement?.focus()
    }

    const openPrivacyPolicyModal = trigger => {
      lastFocusedElement = trigger
      modal.removeAttribute('hidden')
      document.body.classList.add('modal-open')
      dialog.focus()
    }

    privacyPolicyTriggers.forEach(trigger => {
      trigger.addEventListener('click', event => {
        event.preventDefault()
        openPrivacyPolicyModal(trigger)
      })
    })

    closeButtons.forEach(button => {
      button.addEventListener('click', closePrivacyPolicyModal)
    })

    modal.addEventListener('click', event => {
      if (event.target === modal) closePrivacyPolicyModal()
    })

    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closePrivacyPolicyModal()
      }
    })
  }

  /*  Hero slider — load responsive background images (always)  */
  const pickSlideSrc = el => {
    const w = window.innerWidth
    const d = el.dataset
    if (w <= 768 && d.slideImgMobile) return d.slideImgMobile
    if (w <= 1280 && d.slideImgTablet) return d.slideImgTablet
    return d.slideImgDesktop || d.slideImg
  }

  const heroSlides = Array.from(document.querySelectorAll('.hero__slide'))
  heroSlides.forEach(el => {
    const url = pickSlideSrc(el)
    if (url) el.style.backgroundImage = `url('${url}')`
  })

  /*  Contact form validation (client-side only)  */
  const contactForm = document.getElementById('contact-form')
  if (contactForm) {
    const statusEl = document.getElementById('contact-form-status')
    const contactFormUtils = window.TWHContactFormUtils || {}
    const buildContactPayload = contactFormUtils.buildContactPayload || (values => values)
    const validateContactValues = contactFormUtils.validateContactValues || (() => ({}))
    const getContactStatusMessage = contactFormUtils.getContactStatusMessage || (status => status)
    const getContactStatusState = contactFormUtils.getContactStatusState || (status => ({
      tone: status === 'success' ? 'success' : 'error',
      title: status === 'success' ? 'Message sent' : 'Something went wrong',
      message: getContactStatusMessage(status),
      dismissOnInput: status === 'success'
    }))
    const statusTitleEl = statusEl?.querySelector('.contact-form__status-title')
    const statusMessageEl = statusEl?.querySelector('.contact-form__status-message')
    let activeStatusState = null
    const fields = [
      {
        id: 'contact-name'
      },
      {
        id: 'contact-email'
      },
      {
        id: 'contact-message'
      }
    ]

    const setFieldError = (fieldEl, message) => {
      const errorEl = document.getElementById(`${fieldEl.id}-error`)
      fieldEl.setAttribute('aria-invalid', message ? 'true' : 'false')
      if (errorEl) errorEl.textContent = message
    }

    const getCurrentContactValues = () => buildContactPayload({
      name: document.getElementById('contact-name')?.value,
      organisation: document.getElementById('contact-organisation')?.value,
      email: document.getElementById('contact-email')?.value,
      message: document.getElementById('contact-message')?.value
    })

    const applyValidationState = errors => {
      fields.forEach(field => {
        const fieldEl = document.getElementById(field.id)
        if (!fieldEl) return
        setFieldError(fieldEl, errors[field.id] || '')
      })
    }

    const clearStatus = () => {
      activeStatusState = null
      if (!statusEl) return
      statusEl.setAttribute('data-visible', 'false')
      statusEl.setAttribute('data-tone', 'neutral')
      if (statusTitleEl) statusTitleEl.textContent = ''
      if (statusMessageEl) statusMessageEl.textContent = ''
    }

    const showStatus = (statusKey, overrideMessage) => {
      activeStatusState = getContactStatusState(statusKey)
      if (!statusEl) return
      statusEl.setAttribute('data-visible', 'true')
      statusEl.setAttribute('data-tone', activeStatusState.tone)
      if (statusTitleEl) statusTitleEl.textContent = activeStatusState.title
      if (statusMessageEl) statusMessageEl.textContent = overrideMessage || activeStatusState.message
    }

    const validateField = field => {
      const fieldEl = document.getElementById(field.id)
      if (!fieldEl) return true
      const errors = validateContactValues(getCurrentContactValues())
      const message = errors[field.id] || ''
      setFieldError(fieldEl, message)
      return !message
    }

    contactForm.querySelectorAll('input, textarea, select').forEach(fieldEl => {
      if (!fieldEl) return
      const trackedField = fields.find(field => field.id === fieldEl.id)
      fieldEl.addEventListener('blur', () => {
        if (trackedField) validateField(trackedField)
      })
      fieldEl.addEventListener('input', () => {
        if (activeStatusState?.dismissOnInput) {
          clearStatus()
        }
        if (fieldEl.getAttribute('aria-invalid') === 'true') {
          setFieldError(fieldEl, '')
        }
      })
    })

    const submitBtn = contactForm.querySelector('.contact-form__submit')

    contactForm.addEventListener('submit', async e => {
      e.preventDefault()
      const payload = getCurrentContactValues()
      const errors = validateContactValues(payload)
      applyValidationState(errors)
      const isValid = Object.keys(errors).length === 0

      if (!isValid) {
        showStatus('invalid')
        const firstInvalid = contactForm.querySelector('[aria-invalid="true"]')
        firstInvalid?.focus()
        return
      }

      const originalText = submitBtn.textContent
      const endpoint = contactForm.getAttribute('data-contact-endpoint') || contactForm.getAttribute('action')
      submitBtn.setAttribute('data-loading', '')
      submitBtn.textContent = 'Sending…'
      submitBtn.disabled = true
      clearStatus()

      try {
        const response = await window.fetch(endpoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        const result = await response.json().catch(() => null)
        const backendErrors = result?.errors && typeof result.errors === 'object' ? result.errors : null

        if (backendErrors) {
          applyValidationState(backendErrors)
        }

        if (!response.ok || !result?.ok) {
          const statusKey = result?.status || 'server'
          showStatus(statusKey, result?.message)
          const firstInvalid = contactForm.querySelector('[aria-invalid="true"]')
          firstInvalid?.focus()
          return
        }

        showStatus('success', result?.message)
        contactForm.reset()
        applyValidationState({})
      } catch (error) {
        showStatus('network')
      } finally {
        submitBtn.removeAttribute('data-loading')
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }
    })
  }

  /* 
     GSAP ANIMATIONS
      */
  if (typeof gsap === 'undefined' || reducedMotion) return

  if (document.body.classList.contains('page-home')) {
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
      const heroSlideReadyStates = heroSlides.map(() => false)
      let activeSlideIndex = 0
      let sliderTimerId = null
      let activeSlideTween = null
      let isTransitioning = false

      const preloadHeroImage = url => new Promise(resolve => {
        if (!url) {
          resolve(false)
          return
        }

        const img = new Image()
        let isResolved = false

        const finish = status => {
          if (isResolved) return
          isResolved = true
          resolve(status)
        }

        const decodeIfPossible = () => {
          if (typeof img.decode === 'function') {
            return img.decode().catch(() => {})
          }
          return Promise.resolve()
        }

        img.onload = () => {
          decodeIfPossible().finally(() => finish(true))
        }
        img.onerror = () => finish(false)
        img.decoding = 'async'
        img.src = url

        if (img.complete) {
          decodeIfPossible().finally(() => finish(true))
        }
      })

      const stopSliderTimer = () => {
        if (sliderTimerId) {
          window.clearTimeout(sliderTimerId)
          sliderTimerId = null
        }
      }

      const startActiveSlideMotion = () => {
        if (activeSlideTween) activeSlideTween.kill()
        activeSlideTween = gsap.fromTo(heroSlides[activeSlideIndex],
          { scale: START_SCALE },
          { scale: END_SCALE, duration: SLIDE_DURATION + FADE_DURATION, ease: 'none', overwrite: true })
      }

      const scheduleNextTransition = () => {
        stopSliderTimer()

        if (reducedMotion) return
        if (!heroSliderUtils.hasEnoughSlidesToAutoplay(heroSlideReadyStates)) return

        sliderTimerId = window.setTimeout(() => {
          if (isTransitioning) return

          const nextSlideIndex = heroSliderUtils.getNextReadySlideIndex(activeSlideIndex, heroSlideReadyStates)
          if (nextSlideIndex < 0 || nextSlideIndex === activeSlideIndex) {
            scheduleNextTransition()
            return
          }

          const currentSlide = heroSlides[activeSlideIndex]
          const nextSlide = heroSlides[nextSlideIndex]

          isTransitioning = true
          if (activeSlideTween) activeSlideTween.kill()

          gsap.killTweensOf([currentSlide, nextSlide])
          gsap.set(nextSlide, { opacity: 0, scale: START_SCALE })

          gsap.timeline({
            defaults: { overwrite: true },
            onComplete: () => {
              gsap.set(currentSlide, { opacity: 0, scale: START_SCALE })
              activeSlideIndex = nextSlideIndex
              isTransitioning = false
              startActiveSlideMotion()
              scheduleNextTransition()
            }
          })
            .to(currentSlide, { opacity: 0, duration: FADE_DURATION, ease: 'power2.inOut' }, 0)
            .fromTo(nextSlide,
              { opacity: 0, scale: START_SCALE },
              { opacity: 1, scale: END_SCALE, duration: FADE_DURATION, ease: 'power2.out' }, 0)
        }, SLIDE_DURATION * 1000)
      }

      gsap.set(heroSlides, { opacity: 0, scale: START_SCALE })
      gsap.set(heroSlides[activeSlideIndex], { opacity: 1, scale: START_SCALE })
      startActiveSlideMotion()

      heroSlides.forEach((slide, index) => {
        const url = slide.dataset.slideImg
        preloadHeroImage(url).then(isReady => {
          heroSlideReadyStates[index] = isReady
          if (isReady && !reducedMotion) scheduleNextTransition()
        })
      })
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
  }

  /*  Global page decor: lively desktop-only motion.
      animateDecorCircles() is invoked from initPageDecor() after the circles
      are dynamically generated (and re-invoked on resize).
      Exposed on window so the late call can reach it. */
  window.animateDecorCircles = function animateDecorCircles () {
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

  if (document.body.classList.contains('page-home')) {
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
  }

  /*  Footer  */
  gsap.from('.footer__brand, .footer__col', {
    scrollTrigger: { trigger: '.site-footer', start: 'top 90%' },
    y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out'
  })

  /* 
     ABOUT PAGE ANIMATIONS
      */
  if (document.body.classList.contains('page-about')) {

    /*  About hero entrance — text-only banner  */
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

    /*  Team section header  */
    gsap.from('.team__header > *', {
      scrollTrigger: { trigger: '.team', start: 'top 82%' },
      y: 32, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out'
    })

    /*  Each bio reveals on scroll: header in, then numbered story items stagger.  */
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

    /*  Download bios button  */
    gsap.from('.team__action', {
      scrollTrigger: { trigger: '.team__action', start: 'top 90%' },
      y: 20, opacity: 0, duration: 0.6, ease: 'power2.out'
    })

    /*  About CTA  */
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
  }

  /*
     HOW WE HELP PAGE ANIMATIONS
      */
  if (document.body.classList.contains('page-how-we-help')) {

    /*  HWH Hero entrance  */
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

    /*  Our Approach section header  */
    gsap.from('.hwh-values__header > *', {
      scrollTrigger: { trigger: '.hwh-values', start: 'top 82%' },
      y: 28, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out'
    })

    /*  Value cards: per-card trigger for reliable reveal on all 4 cards  */
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

    /*  Values CTA card: card slides in, then content staggers  */
    gsap.timeline({ scrollTrigger: { trigger: '.hwh-values__close', start: 'top 88%' } })
      .from('.hwh-values__close', { y: 36, opacity: 0, duration: 0.75, ease: 'power3.out' })
      .from('.hwh-values__close > *', { y: 18, opacity: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out' }, '-=0.45')

    /*  Split sections: sidebar in from left/right, list items stagger  */
    gsap.utils.toArray('.hwh-split').forEach(section => {
      const sidebar  = section.querySelector('.hwh-split__sidebar')
      const listItems = section.querySelectorAll('.hwh-list__item')
      const bodyParts = section.querySelectorAll('.hwh-split__lead, .hwh-split__para, .hwh-split__closing, .hwh-split__cta')
      const isMirror = section.classList.contains('hwh-split--mirror')

      if (sidebar) {
        gsap.from(sidebar.children, {
          scrollTrigger: { trigger: section, start: 'top 80%' },
          y: 24, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out'
        })
      }

      if (bodyParts.length) {
        gsap.from(bodyParts, {
          scrollTrigger: { trigger: section, start: 'top 82%' },
          y: 18, opacity: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out'
        })
      }

      if (listItems.length) {
        if (section.classList.contains('hwh-split--ldd')) {
          gsap.utils.toArray(section.querySelectorAll('.hwh-list__item--ldd')).forEach((item, idx) => {
            gsap.from(item, {
              scrollTrigger: { trigger: item, start: 'top 88%', once: true },
              x: 22,
              opacity: 0,
              duration: 0.52,
              delay: idx * 0.03,
              ease: 'power2.out',
              clearProps: 'transform,opacity'
            })
          })
        } else if (section.classList.contains('hwh-split--tools')) {
          gsap.utils.toArray(section.querySelectorAll('.hwh-list__item')).forEach((item, idx) => {
            gsap.from(item, {
              scrollTrigger: { trigger: item, start: 'top 90%', once: true },
              y: 16,
              opacity: 0,
              duration: 0.48,
              delay: idx * 0.03,
              ease: 'power2.out',
              clearProps: 'transform,opacity'
            })
          })
        } else {
          const listEl = section.querySelector('.hwh-list')
          gsap.from(listItems, {
            scrollTrigger: { trigger: listEl || section, start: 'top 85%' },
            x: isMirror ? -14 : 14, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out'
          })
        }
      }

      if (section.classList.contains('hwh-split--ldd')) {
        gsap.from(section.querySelectorAll('.hwh-list__num'), {
          scrollTrigger: { trigger: section, start: 'top 82%' },
          scale: 0.94, opacity: 0, duration: 0.42, stagger: 0.06, ease: 'power2.out'
        })
      }
    })

    /*  Capability-style bands, animated per atlas so reused layouts stay in sync  */
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

    /*  Caps footer CTA  */
    gsap.from('.hwh-caps__footer > *', {
      scrollTrigger: { trigger: '.hwh-caps__footer', start: 'top 88%' },
      y: 20, opacity: 0, duration: 0.6, stagger: 0.14, ease: 'power2.out'
    })

    /* Recalculate trigger positions after fonts/images load and browser anchor scroll settles */
    window.addEventListener('load', () => ScrollTrigger.refresh())
  }

  /*
     CONTACT PAGE ANIMATIONS
  */
  if (document.body.classList.contains('page-contact')) {

    gsap.timeline({ delay: 0.15 })
      .from('.contact-hero__overline', {
        y: 14, opacity: 0, duration: 0.45, ease: 'power2.out'
      })
      .from('.contact-hero__title', {
        y: 28, opacity: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.2')

    gsap.from('.contact-form-shell > *', {
      scrollTrigger: { trigger: '.contact-form-shell', start: 'top 82%' },
      y: 24, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out'
    })

    gsap.from('.contact-form__row', {
      scrollTrigger: { trigger: '.contact-form', start: 'top 82%' },
      y: 18, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out'
    })
  }

  /* ─────────────────────────────────────────────────────────────────────
     PAGE DECOR — dynamic decorative circles
     Generates a balanced, well-distributed set of <span> circles inside
     <main> respecting min-distance, color, side and type constraints.
     Tokens read from the DOM:
       <main data-decor-palette="base|rich" data-decor-density="auto|N">
       <section data-decor-bg="offwhite|navy|dark-emerald">

     Per-circle manual overrides (1-indexed, only the keys you set are forced;
     the algorithm still computes the rest):
       <main data-decor-override-3="color:navy"
             data-decor-override-5="color:purple;type:watermark;side:L"
             data-decor-override-7="y:62">
     Allowed keys: color (lime|emerald|navy|purple), type (solid|watermark),
                   side (L|R), y (0-100, vertical % within <main>).

     Disabled in viewports < 1100px and when reduced-motion is on.
     ───────────────────────────────────────────────────────────────────── */
  initPageDecor()

  function initPageDecor () {
    const main = document.querySelector('main[data-decor-palette]')
    if (!main) return

    const DECOR_RULES = {
      minPxAny:           220, // any two circles
      minPxSameSide:      380, // same side (L-L or R-R)
      minPxSameColor:     320, // same color
      minPxWatermarkPair: 520, // two large watermarks
      minPxHorizPair:     180  // opposite sides too close vertically
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

    /* ── Core generator ──────────────────────────────────────────────── */
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
        const jitter = ((i * 37) % 5) - 2 // -2..+2
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
      if (typeof window.animateDecorCircles === 'function') {
        window.animateDecorCircles()
      }
    }

    /* ── Init + resize handling ───────────────────────────────────────── */
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
