const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to login page...');
  await page.goto('https://staging2025.rensup.com/login', { waitUntil: 'domcontentloaded' });
  
  await page.waitForTimeout(2000);

  console.log('Filling in invalid credentials...');
  // Use invalid credentials from data
  await page.locator('input[name="email" i], input[type="email" i]').first().fill('invalid@example.com');
  await page.locator('input[name="password" i]').fill('WrongPassword123!');
  
  console.log('Clicking login...');
  await page.waitForTimeout(1000);
  
  // Intercept the API call to see the response
  page.on('response', async (response) => {
    if (response.url().includes('/api/customerLogin') || response.url().includes('login')) {
      console.log(`Response from ${response.url()}: ${response.status()}`);
      try {
        const text = await response.text();
        console.log(`Response body: ${text.substring(0, 200)}...`);
      } catch (e) {
        // ignore
      }
    }
  });

  const btn = page.getByRole('button', { name: 'Login', exact: true });
  await btn.evaluate(node => node.click());

  console.log('Waiting for network/UI to settle...');
  await page.waitForTimeout(5000);
  
  // Dump page text
  const bodyText = await page.locator('body').innerText();
  console.log('--- Page text content ---');
  console.log(bodyText);
  
  // Take screenshot
  await page.screenshot({ path: 'invalid_login_result.png' });
  
  await browser.close();
})();
