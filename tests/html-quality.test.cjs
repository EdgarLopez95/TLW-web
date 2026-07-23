const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const htmlFiles = [
  'index.html',
  '404.html',
  'about/index.html',
  'how-we-help/index.html',
  'contact/index.html',
  'learning-we-trust/index.html'
]

const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8')

test('line breaks preserve readable spacing in continuous text', () => {
  assert.match(read('index.html'), /them\.<br>\s+To succeed/)
})

test('content images declare intrinsic dimensions', () => {
  htmlFiles.forEach(relativePath => {
    const imageTags = read(relativePath).match(/<img\b[^>]*>/g) || []

    imageTags.forEach(tag => {
      assert.match(tag, /\bwidth="\d+"/, `${relativePath}: ${tag}`)
      assert.match(tag, /\bheight="\d+"/, `${relativePath}: ${tag}`)
    })
  })
})

test('font preloads use the same cache version as the font faces', () => {
  const mainCss = read('css/main.css')
  const versionMatch = mainCss.match(/aptos-regular\.woff2\?v=(\d+)/)

  assert.ok(versionMatch, 'Aptos regular font version should be declared')
  const expectedUrl = `aptos-regular.woff2?v=${versionMatch[1]}`

  htmlFiles.forEach(relativePath => {
    const html = read(relativePath)
    if (html.includes('aptos-regular.woff2')) {
      assert.ok(html.includes(expectedUrl), relativePath)
    }
  })
})
