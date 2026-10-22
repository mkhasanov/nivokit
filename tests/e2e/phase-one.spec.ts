import { expect, test } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test.beforeEach(async ({ page }) => {
  page.on('pageerror', error => console.error(`Browser error: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(`Browser console: ${message.text()}`)
  })
  page.on('requestfailed', request => console.error(`Browser request failed: ${request.url()} — ${request.failure()?.errorText}`))
})

test('resizes and downloads a generated PNG in the browser', async ({ page }) => {
  await page.goto('/en/image/resize-image')
  await page.waitForLoadState('networkidle')
  await page.locator('input[type="file"]').setInputFiles({
    name: 'fixture.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })

  const width = page.getByLabel('Width (px)')
  const height = page.getByLabel('Height (px)')
  await expect(width).toHaveValue('1')
  await expect(height).toHaveValue('1')

  await width.fill('2')
  await width.press('Tab')
  await expect(height).toHaveValue('2')
  await page.getByRole('button', { name: 'Resize image', exact: true }).click()

  const downloadLink = page.getByRole('link', { name: 'Download' })
  await expect(downloadLink).toBeVisible()
  const objectUrl = await downloadLink.getAttribute('href')
  expect(objectUrl).toBeTruthy()

  const dimensions = await page.evaluate(async (url) => {
    const blob = await fetch(url!).then(response => response.blob())
    const image = await createImageBitmap(blob)
    const result = [image.width, image.height]
    image.close()
    return result
  }, objectUrl)
  expect(dimensions).toEqual([2, 2])

  const downloadPromise = page.waitForEvent('download')
  await downloadLink.click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('fixture-2x2.png')
})

test('opens command search from the keyboard and navigates by synonym', async ({ page }) => {
  await page.goto('/en/')
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Control+K')
  const dialog = page.getByRole('dialog', { name: 'What do you need to do?' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('combobox').fill('scale picture')
  await expect(dialog.getByRole('option', { name: /Resize image/ })).toBeVisible()
  await dialog.getByRole('combobox').press('Enter')
  await expect(page).toHaveURL(/\/en\/image\/resize-image$/)
})
