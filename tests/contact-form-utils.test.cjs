const test = require('node:test')
const assert = require('node:assert/strict')

const {
  buildContactPayload,
  validateContactValues,
  getContactStatusMessage,
  getContactStatusState
} = require('../js/contact-form-utils.js')

test('buildContactPayload trims contact values', () => {
  const payload = buildContactPayload({
    name: '  David  ',
    organisation: '  The Learning Warehouse ',
    email: '  david@example.com ',
    message: '  Hello there.  '
  })

  assert.deepEqual(payload, {
    name: 'David',
    organisation: 'The Learning Warehouse',
    email: 'david@example.com',
    message: 'Hello there.'
  })
})

test('validateContactValues reports the required contact errors', () => {
  const errors = validateContactValues({
    name: ' ',
    email: 'invalid-email',
    message: ''
  })

  assert.deepEqual(errors, {
    'contact-name': 'Add your name.',
    'contact-email': 'Enter a valid email address.',
    'contact-message': 'Share a short message so we know how to help.'
  })
})

test('getContactStatusMessage returns the success copy', () => {
  assert.equal(
    getContactStatusMessage('success'),
    'Thanks. We received your message and will get back to you in the next 24 hours.'
  )
})

test('getContactStatusMessage falls back to the generic error copy', () => {
  assert.equal(
    getContactStatusMessage('unexpected-value'),
    'Something went wrong while sending your message. Please try again.'
  )
})

test('getContactStatusState returns a rich success state', () => {
  assert.deepEqual(getContactStatusState('success'), {
    tone: 'success',
    title: 'Message sent',
    message: 'Thanks. We received your message and will get back to you in the next 24 hours.',
    dismissOnInput: true
  })
})

test('getContactStatusState falls back to a generic error state', () => {
  assert.deepEqual(getContactStatusState('unexpected-value'), {
    tone: 'error',
    title: 'Something went wrong',
    message: 'Something went wrong while sending your message. Please try again.',
    dismissOnInput: false
  })
})
