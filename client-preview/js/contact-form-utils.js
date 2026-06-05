(function initContactFormUtils (global) {
  function trimContactValue (value) {
    return String(value ?? '').trim()
  }

  function buildContactPayload (values) {
    return {
      name: trimContactValue(values?.name),
      organisation: trimContactValue(values?.organisation),
      email: trimContactValue(values?.email),
      message: trimContactValue(values?.message)
    }
  }

  function validateContactValues (values) {
    const payload = buildContactPayload(values)
    const errors = {}

    if (!payload.name) {
      errors['contact-name'] = 'Add your name.'
    }

    if (!payload.email) {
      errors['contact-email'] = 'Enter your email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      errors['contact-email'] = 'Enter a valid email address.'
    }

    if (!payload.message) {
      errors['contact-message'] = 'Share a short message so we know how to help.'
    }

    return errors
  }

  function getContactStatusMessage (status) {
    const messages = {
      invalid: 'Please correct the highlighted fields and try again.',
      success: 'Thanks. We received your message and will get back to you in the next 24 hours.',
      server: 'We could not send your message just now. Please try again shortly.',
      network: 'We could not reach the server. Please check your connection and try again.',
      setup: 'The contact form is still being set up. Please email us directly for now.'
    }

    return messages[status] || 'Something went wrong while sending your message. Please try again.'
  }

  const api = {
    buildContactPayload,
    validateContactValues,
    getContactStatusMessage
  }

  global.TWHContactFormUtils = api

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api
  }
})(typeof window !== 'undefined' ? window : globalThis)
