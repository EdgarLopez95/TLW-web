const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8')

const pageScripts = {
  'index.html': 'js/home.js',
  'about/index.html': '../js/about.js',
  'how-we-help/index.html': '../js/how-we-help.js',
  'contact/index.html': '../js/contact.js',
  'learning-we-trust/index.html': '../js/learning-we-trust.js'
}

test('page-specific JavaScript is split into focused files', () => {
  const expectedFiles = [
    'js/main.js',
    'js/page-decor.js',
    'js/home.js',
    'js/about.js',
    'js/how-we-help.js',
    'js/contact.js',
    'js/learning-we-trust.js'
  ]

  expectedFiles.forEach(relativePath => {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, `${relativePath} should exist`)
  })
})

test('each page loads the shared scripts and its own script', () => {
  Object.entries(pageScripts).forEach(([htmlPath, pageScript]) => {
    const html = read(htmlPath)
    const sharedPrefix = htmlPath === 'index.html' ? 'js/' : '../js/'

    assert.match(html, new RegExp(`src="${sharedPrefix}main\\.js[^"\\s]*"`))
    assert.match(html, new RegExp(`src="${sharedPrefix}page-decor\\.js[^"\\s]*"`))
    assert.match(html, new RegExp(`src="${pageScript.replaceAll('.', '\\.')}[^"\\s]*"`))
  })
})

test('shared JavaScript does not contain page-only behavior', () => {
  const main = read('js/main.js')

  assert.doesNotMatch(main, /contact-form|heroSlides|page-about|page-how-we-help|page-contact/)
  assert.doesNotMatch(main, /TWHPrivacyPolicyUtils|privacy-policy-modal/)
})

test('removed components do not leave stale selectors behind', () => {
  const source = [
    read('js/main.js'),
    read('css/main.css'),
    read('css/home.css')
  ].join('\n')

  assert.doesNotMatch(source, /hwh-list__num/)
  assert.doesNotMatch(source, /section-deco-legacy|section-deco--legacy-disabled/)
  assert.doesNotMatch(source, /\.marquee(?:__|\s*\{)/)
})
