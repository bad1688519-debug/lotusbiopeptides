// Actual Chromium smoke tests for the staged, static second-site build.
// No form is submitted and no external WhatsApp message is sent.
import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';

const browser = await chromium.launch({ headless: true });
const origin = 'http://127.0.0.1:8765';
async function testViewport(label, contextOptions) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + '/', { waitUntil: 'load' });
  const gate = page.locator('#age-confirmation');
  if (await gate.isVisible()) await page.locator('#age-continue').click();
  await page.locator('header nav a[href="https://lbiopeptides.com/"]').waitFor();
  await page.locator('.lb-shopping-steps').waitFor();
  const overflows = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth
  }));
  assert.ok(overflows.document <= overflows.viewport + 4, label + ' home horizontal overflow: ' + JSON.stringify(overflows));
  await page.goto(origin + '/wholesale-peptides/', { waitUntil: 'load' });
  await page.locator('#catalog-search').fill('retatrutide');
  await page.locator('[data-catalog-item]:visible').first().waitFor();
  await page.goto(origin + '/products/retatrutide/', { waitUntil: 'load' });
  const rt = page.locator('#quote-spec');
  await rt.selectOption({ label: '30 mg × 10 vials · RT30' });
  await page.locator('#listed-price-display').getByText('$182.00', { exact: false }).waitFor();
  await page.locator('#quote-qty').fill('2');
  await page.locator('#add-quote').click();
  await page.locator('[data-count]').first().getByText('1').waitFor();
  await page.locator('[data-review]').first().click();
  await page.locator('#quote-items').getByText('$364.00', { exact: false }).waitFor();
  const whatsapp = await page.locator('#quote-whatsapp').getAttribute('href');
  assert.ok(whatsapp.includes('RT30'), label + ': WhatsApp link missing SKU');
  assert.ok(whatsapp.includes('%24364.00'), label + ': WhatsApp link missing total');
  assert.equal(errors.length, 0, label + ' page errors: ' + errors.join(' | '));
  await context.close();
  console.log('PASS ' + label + ': home/catalog/product/cart/WhatsApp link, no horizontal homepage overflow');
}
try {
  await testViewport('desktop', { viewport: { width: 1440, height: 900 } });
  await testViewport('mobile', { ...devices['iPhone 13'], browserName: undefined });
} finally {
  await browser.close();
}
