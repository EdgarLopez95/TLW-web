document.addEventListener('DOMContentLoaded', () => {
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

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof gsap === 'undefined' || reducedMotion) return

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
})
