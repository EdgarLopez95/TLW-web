# Playwright — Browser Testing Standards

Apply these patterns for all end-to-end and UI integration tests in this project.

---

## Selector Priority (accessibility-first)

Use in this order — stop at the first one that works:

```js
// 1. Role (most robust)
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'About' })

// 2. Label (form elements)
page.getByLabel('Email address')

// 3. Placeholder (inputs only)
page.getByPlaceholder('Search...')

// 4. Text content
page.getByText('Start a conversation')

// 5. Test ID (last resort — only when above don't work)
page.getByTestId('hero-cta')
```

❌ Never use: `page.$('.nav__link')`, `page.locator('div > span:nth-child(2)')`, CSS selector chains

---

## Waiting — Never Arbitrary Sleeps

```js
// ✅ Correct — wait for state
await expect(page.getByRole('dialog')).toBeVisible()
await expect(page.getByText('Success')).toBeVisible()
await page.waitForURL('**/contact/')

// ❌ Wrong — arbitrary wait
await page.waitForTimeout(2000)
```

---

## Test Structure

```js
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    const toggle = page.getByRole('button', { name: 'Open menu' })
    await toggle.click()
    await expect(page.getByRole('navigation')).toBeVisible()

    await toggle.click()
    await expect(page.getByRole('navigation')).toBeHidden()
  })
})
```

---

## Assertions — Be Specific

```js
// ✅ Specific, readable
await expect(page.getByRole('heading', { level: 1 })).toContainText('Learning Warehouse')
await expect(page.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about/')
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled()

// ❌ Too broad
await expect(page.locator('h1')).toBeTruthy()
```

---

## What to Test

**Do test:**
- User-visible flows (navigation, form submission, CTA clicks)
- Responsive behaviour (mobile menu, layout changes at breakpoints)
- Accessibility landmarks (nav, main, headings hierarchy)
- Error states (form validation messages)

**Don't test:**
- CSS implementation details (exact pixel values)
- Internal class names
- Animation timing

---

## Configuration (`playwright.config.ts`)

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
  ],
})
```

---

## Page Object Model (for complex flows)

```js
// pages/ContactPage.ts
export class ContactPage {
  constructor(private page: Page) {}

  async fillForm(name: string, email: string, message: string) {
    await this.page.getByLabel('Name').fill(name)
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByLabel('Message').fill(message)
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Send message' }).click()
    await expect(this.page.getByText('Message sent')).toBeVisible()
  }
}
```
