(function initHeroSliderUtils (global) {
  function pickResponsiveSlideSource (sources, viewportWidth) {
    if (viewportWidth <= 768 && sources.slideImgMobile) return sources.slideImgMobile
    if (viewportWidth <= 1280 && sources.slideImgTablet) return sources.slideImgTablet
    return sources.slideImgDesktop || sources.slideImg
  }

  function getReadySlideCount (readyStates) {
    return readyStates.filter(Boolean).length
  }

  function hasEnoughSlidesToAutoplay (readyStates) {
    return getReadySlideCount(readyStates) > 1
  }

  function getNextReadySlideIndex (currentIndex, readyStates) {
    if (!Array.isArray(readyStates) || readyStates.length === 0) return -1

    for (let step = 1; step <= readyStates.length; step++) {
      const nextIndex = (currentIndex + step) % readyStates.length
      if (readyStates[nextIndex]) return nextIndex
    }

    return currentIndex
  }

  const api = {
    pickResponsiveSlideSource,
    getReadySlideCount,
    hasEnoughSlidesToAutoplay,
    getNextReadySlideIndex
  }

  global.TWHHeroSliderUtils = api

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api
  }
})(typeof window !== 'undefined' ? window : globalThis)
