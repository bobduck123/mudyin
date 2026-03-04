import { test, expect } from '@playwright/test'

test.describe('Moderation and Safety APIs', () => {
  test('crisis resources endpoint returns data', async ({ request }) => {
    const response = await request.get('/api/crisis-resources')
    expect(response.ok()).toBeTruthy()

    const body = await response.json()
    expect(Array.isArray(body.resources)).toBeTruthy()
    expect(typeof body.count).toBe('number')
  })

  test('report endpoint validates payload', async ({ request }) => {
    const response = await request.post('/api/moderation/report', {
      data: {
        contentType: 'post',
      },
    })

    expect(response.status()).toBe(400)
  })

  test('report endpoint accepts valid report payload', async ({ request }) => {
    const response = await request.post('/api/moderation/report', {
      data: {
        contentType: 'post',
        contentId: 'demo-post-123',
        reason: 'harmful',
        description: 'Potentially harmful language in this post.',
      },
    })

    expect(response.status()).toBe(201)
  })

  test('moderation queue route is reachable', async ({ request }) => {
    const response = await request.get('/api/moderation/queue?status=pending')
    expect(response.status()).toBe(200)
  })
})

test.describe('Safety UI Smoke', () => {
  test('community feed renders without admin-only route assumptions', async ({ page }) => {
    await page.goto('/community/feed')
    await expect(page.getByRole('heading', { name: /Community Feed/i })).toBeVisible()
    await expect(page.getByPlaceholder('Search posts...')).toBeVisible()
  })
})
