(function initPrivacyPolicyUtils (global) {
  function buildPrivacyPolicyContent () {
    return [
      '<p><strong>Draft privacy policy.</strong> This is a general website privacy notice prepared from the contact details currently collected on this site. It should be reviewed and approved by The Learning Warehouse before publication.</p>',
      '<h3>What we collect</h3>',
      '<p>When you contact The Learning Warehouse through this website, we may collect the personal information you choose to provide, including your name, organisation, email address, and the contents of your message.</p>',
      '<h3>How we use your information</h3>',
      '<p>We use this information to respond to your enquiry, manage follow-up communication, understand the kind of support you are seeking, and improve how we handle client enquiries.</p>',
      '<h3>When we may share information</h3>',
      '<p>We do not sell your personal information. We may share it with trusted service providers who help us operate the website or manage communications, where that is reasonably necessary and subject to appropriate safeguards.</p>',
      '<h3>Storage and retention</h3>',
      '<p>We take reasonable steps to protect the information you send to us and keep it only for as long as reasonably necessary to manage enquiries, maintain business records, and meet any legal obligations.</p>',
      '<h3>Your choice</h3>',
      '<p>Please do not send sensitive personal information through the website contact form unless it is genuinely necessary for your enquiry.</p>',
      '<h3>Contact us</h3>',
      '<p>If you have questions about this draft privacy policy or how your information is handled, please contact us at <a href="mailto:admin@thelearningwarehouse.com">admin@thelearningwarehouse.com</a> or call <a href="tel:+61418935724">+61 418 935 724</a>.</p>'
    ].join('')
  }

  const api = {
    buildPrivacyPolicyContent
  }

  global.TWHPrivacyPolicyUtils = api

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api
  }
})(typeof window !== 'undefined' ? window : globalThis)
