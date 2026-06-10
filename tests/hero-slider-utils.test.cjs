const test = require('node:test')
const assert = require('node:assert/strict')

const {
  hasEnoughSlidesToAutoplay,
  getNextReadySlideIndex
} = require('../js/hero-slider-utils.js')

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
