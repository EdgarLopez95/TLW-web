const test = require('node:test')
const assert = require('node:assert/strict')

const {
  buildPrivacyPolicyContent
} = require('../js/privacy-policy-utils.js')

test('privacy policy content lists the contact data collected on the site', () => {
  const content = buildPrivacyPolicyContent()

  assert.match(content, /name/i)
  assert.match(content, /organisation/i)
  assert.match(content, /email/i)
  assert.match(content, /message/i)
})

test('privacy policy content includes current contact channels for enquiries', () => {
  const content = buildPrivacyPolicyContent()

  assert.match(content, /admin@thelearningwarehouse\.com/i)
  assert.match(content, /\+61 418 935 724/)
})

test('privacy policy content is clearly marked as a draft for review', () => {
  const content = buildPrivacyPolicyContent()

  assert.match(content, /draft/i)
  assert.match(content, /review/i)
})
