const test = require('node:test')
const assert = require('node:assert/strict')

const {
  hasEnoughSlidesToAutoplay,
  getNextReadySlideIndex,
  pickResponsiveSlideSource
} = require('../js/hero-slider-utils.js')

test('picks the responsive hero image source for the current viewport', () => {
  const sources = {
    slideImgMobile: 'mobile.webp',
    slideImgTablet: 'tablet.webp',
    slideImgDesktop: 'desktop.webp'
  }

  assert.equal(pickResponsiveSlideSource(sources, 375), 'mobile.webp')
  assert.equal(pickResponsiveSlideSource(sources, 1024), 'tablet.webp')
  assert.equal(pickResponsiveSlideSource(sources, 1440), 'desktop.webp')
})

test('does not autoplay when only one slide is ready', () => {
  assert.equal(hasEnoughSlidesToAutoplay([true, false]), false)
})

test('autoplay starts when at least two slides are ready', () => {
  assert.equal(hasEnoughSlidesToAutoplay([true, true]), true)
})

test('picks the next ready slide index', () => {
  assert.equal(getNextReadySlideIndex(0, [true, false, true]), 2)
})

test('stays on the current slide when no other slide is ready', () => {
  assert.equal(getNextReadySlideIndex(0, [true, false, false]), 0)
})
