import { test, expect } from '@playwright/test'

test.describe('Core Navigation Smoke', () => {
  test('homepage renders key sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText(/Momentum|Warmth|Healing/i)
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  })

  test('community hub route is available', async ({ page }) => {
    await page.goto('/community')
    await expect(page.locator('h1')).toContainText('Community Hub')
    await expect(page.getByRole('link', { name: /Community Feed/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Share a Story/i })).toBeVisible()
  })

  test('community feed filters render', async ({ page }) => {
    await page.goto('/community/feed')
    await expect(page.getByPlaceholder('Search posts...')).toBeVisible()
    await expect(page.getByRole('button', { name: /Create Post/i })).toBeVisible()
  })

  test('gallery page renders discovery controls', async ({ page }) => {
    await page.goto('/gallery')
    await expect(page.getByRole('heading', { name: /Community Gallery/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Upload/i })).toBeVisible()
  })

  test('marketplace page is integrated', async ({ page }) => {
    await page.goto('/marketplace')
    await expect(page.getByRole('heading', { name: /Marketplace/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Cart \(\d+\)$/i })).toBeVisible()
  })
})
