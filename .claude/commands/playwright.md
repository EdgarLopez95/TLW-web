# Playwright — End-to-End Testing

You are a Playwright testing expert. When invoked, write, run, and debug end-to-end tests using Playwright best practices.

## Setup

```bash
npm init playwright@latest
# or add to existing project:
npm install -D @playwright/test
npx playwright install
```

## Config (`playwright.config.ts`)

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Core Patterns

### Basic test
```ts
import { test, expect } from '@playwright/test'

test('page loads and shows hero title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
```

### Locator priority (use in this order)
```ts
// 1. Role (most resilient)
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'Home' })
page.getByRole('heading', { name: 'How We Help' })

// 2. Label / placeholder
page.getByLabel('Email address')
page.getByPlaceholder('Search...')

// 3. Text content
page.getByText('Work with us')

// 4. Test ID (last resort — add data-testid to HTML)
page.getByTestId('hero-cta')

// Avoid: CSS selectors, XPath, nth-child
```

### Navigation & interaction
```ts
await page.goto('/about')
await page.click('button')
await page.fill('input[name="email"]', 'test@example.com')
await page.selectOption('select', 'value')
await page.check('input[type="checkbox"]')
await page.keyboard.press('Escape')
await page.keyboard.press('Tab')
```

### Assertions
```ts
await expect(page).toHaveTitle('Home — The Learning Warehouse')
await expect(page).toHaveURL('/about')
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
await expect(locator).toBeEnabled()
await expect(locator).toBeDisabled()
await expect(locator).toHaveText('Expected text')
await expect(locator).toContainText('partial text')
await expect(locator).toHaveAttribute('aria-expanded', 'true')
await expect(locator).toHaveClass(/active/)
await expect(locator).toHaveCount(3)
await expect(locator).toBeInViewport()
```

### Waiting (never use `page.waitForTimeout`)
```ts
// Good — wait for condition
await expect(locator).toBeVisible()
await page.waitForLoadState('networkidle')
await page.waitForSelector('.hero__title')
await page.waitForURL('/dashboard')

// Bad — arbitrary sleep
await page.waitForTimeout(1000) // never do this
```

### Screenshots for visual testing
```ts
await expect(page).toHaveScreenshot('home.png')
await expect(page.locator('.hero')).toHaveScreenshot('hero.png')

// Update snapshots:
// npx playwright test --update-snapshots
```

### Mobile & viewport
```ts
test('mobile nav works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('navigation')).toBeVisible()
})
```

## Page Object Model

```ts
// pages/HomePage.ts
import { type Page, type Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly heroTitle: Locator
  readonly navToggle: Locator

  constructor(page: Page) {
    this.page = page
    this.heroTitle = page.getByRole('heading', { level: 1 })
    this.navToggle = page.getByRole('button', { name: 'Open menu' })
  }

  async goto() {
    await this.page.goto('/')
  }

  async openMobileNav() {
    await this.navToggle.click()
  }
}

// tests/home.spec.ts
import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

test('hero is visible', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()
  await expect(home.heroTitle).toBeVisible()
})
```

## Accessibility Testing
```ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
```

Install: `npm install -D @axe-core/playwright`

## Keyboard Navigation
```ts
test('nav is keyboard navigable', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Home' })).toBeFocused()
  await page.keyboard.press('Escape')
})
```

## Common CLI Commands

```bash
npx playwright test                        # run all tests
npx playwright test home.spec.ts           # run specific file
npx playwright test --headed               # show browser
npx playwright test --ui                   # open UI mode
npx playwright test --debug                # step through
npx playwright test --project=chromium     # single browser
npx playwright show-report                 # open HTML report
npx playwright codegen http://localhost:3000  # record test
npx playwright screenshot http://localhost:3000 out.png  # quick screenshot
```

## Static HTML Testing (no server)

For this project (static HTML files), use `file://` protocol or a local server:

```ts
// Option 1: file:// 
await page.goto(`file://${process.cwd()}/index.html`)

// Option 2: spin up static server in config
webServer: {
  command: 'npx serve .',
  url: 'http://localhost:3000',
}
```

## Test Organization

```
tests/
  home.spec.ts         ← home page tests
  about.spec.ts        ← about page tests
  navigation.spec.ts   ← nav/header tests
  accessibility.spec.ts ← a11y tests
  visual.spec.ts       ← screenshot tests
pages/
  HomePage.ts
  AboutPage.ts
```

## Best Practices

1. Use role-based locators — they survive markup changes
2. Never `waitForTimeout` — always wait for conditions
3. One assertion per concept — don't cram multiple checks in one test
4. Tests must be independent — no shared state between tests
5. Use `test.describe` to group related tests
6. Use `test.beforeEach` for repeated setup, not `test.beforeAll` unless truly shared
7. Use `data-testid` only as last resort — prefer semantic locators
8. Always test mobile viewports for responsive layouts
