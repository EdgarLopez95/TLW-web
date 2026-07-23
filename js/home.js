document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const heroSliderUtils = window.TWHHeroSliderUtils || {
    pickResponsiveSlideSource: (sources, viewportWidth) => {
      if (viewportWidth <= 768 && sources.slideImgMobile) return sources.slideImgMobile
      if (viewportWidth <= 1280 && sources.slideImgTablet) return sources.slideImgTablet
      return sources.slideImgDesktop || sources.slideImg
    },
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

  const heroSlides = Array.from(document.querySelectorAll('.hero__slide'))
  heroSlides.forEach(slide => {
    const url = heroSliderUtils.pickResponsiveSlideSource(slide.dataset, window.innerWidth)
    if (!url) return
    slide.dataset.activeSlideImg = url
    slide.style.backgroundImage = `url('${url}')`
  })

  if (typeof gsap === 'undefined' || reducedMotion) return

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
      const url = slide.dataset.activeSlideImg
      preloadHeroImage(url).then(isReady => {
        heroSlideReadyStates[index] = isReady
        if (isReady && !reducedMotion) scheduleNextTransition()
      })
    })
  }

  gsap.from('.you-we__statement', {
    scrollTrigger: { trigger: '.you-we', start: 'top 82%' },
    y: 24, opacity: 0, duration: 0.7, ease: 'power2.out'
  })

  gsap.from('.you-we__list .you-we__item', {
    scrollTrigger: { trigger: '.you-we__grid', start: 'top 85%' },
    y: 16, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out'
  })

  gsap.from('.video-frame', {
    scrollTrigger: { trigger: '.video-section', start: 'top 82%' },
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
  })

  gsap.from('.how-we-help .section-header', {
    scrollTrigger: { trigger: '.how-we-help', start: 'top 82%' },
    y: 40, opacity: 0, duration: 0.8, ease: 'power2.out'
  })

  gsap.from('.card--how', {
    scrollTrigger: { trigger: '.cards-grid', start: 'top 82%' },
    opacity: 0, duration: 0.8, stagger: 0.18, ease: 'power2.out'
  })

  gsap.from('.partners__header > *', {
    scrollTrigger: { trigger: '.partners', start: 'top 82%' },
    y: 32, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out'
  })

  gsap.from('.cta-banner__text', {
    scrollTrigger: { trigger: '.cta-banner', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.9, ease: 'power2.out'
  })

  gsap.from('.cta-banner__btn', {
    scrollTrigger: { trigger: '.cta-banner', start: 'top 76%' },
    y: 20, opacity: 0, duration: 0.6, delay: 0.25, ease: 'power2.out'
  })
})
