const { chromium } = require('playwright');
const loginData = require('./data/loginData.json');
const fs = require('fs');

(async () => {
  const config = fs.readFileSync('config.properties', 'utf8');
  let username = '';
  let password = '';
  config.split('\n').forEach(line => {
    if (line.startsWith('USERNAME=')) username = line.split('=')[1].trim();
    if (line.startsWith('PASSWORD=')) password = line.split('=')[1].trim();
  });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username, password }
  });
  const page = await context.newPage();
  
  page.on('response', async (response) => {
    if (response.request().method() === 'POST') {
      console.log('POST Response URL:', response.url());
      console.log('POST Response Status:', response.status());
      try {
        const body = await response.json();
        console.log('POST Response Body:', JSON.stringify(body).substring(0, 500));
      } catch(e) {
        console.log('POST Response Body (text):', (await response.text()).substring(0, 500));
      }
    }
  });

  await page.goto('https://staging2025.rensup.com/login');
  
  await page.locator('input[type="email" i]').first().fill(loginData.validUser.email);
  await page.locator('input[name="password" i]').fill(loginData.validUser.password);
  
  await page.waitForTimeout(1000);
  console.log('Clicking login...');
  await page.getByRole('button', { name: 'Login', exact: true }).click({ force: true });
  console.log('Clicked login.');
  
  await page.waitForTimeout(5000);
  await browser.close();
})();
