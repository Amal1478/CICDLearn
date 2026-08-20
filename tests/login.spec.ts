import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Git practice - first change

// Test data configuration to avoid hardcoding specific data directly in the test logic.
// In a real project, this might come from a .env file, a config file, or test parameters.
const TEST_DATA = {
    url: process.env.TEST_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    username: process.env.TEST_USERNAME || 'Admin',
    password: process.env.TEST_PASSWORD || 'admin123'
};

test.describe('OrangeHRM Login Feature', () => {

    test('should login successfully with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Act
        await loginPage.navigate(TEST_DATA.url);
        await loginPage.login(TEST_DATA.username, TEST_DATA.password);

        // Assert
        // We wait for the dashboard route to verify a successful login.
        // Playwright's expect automatically waits until the condition is met.
        await expect(page).toHaveURL(/.*dashboard/);

        // Additional assertion to ensure the dashboard page has loaded successfully by checking for a typical dashboard element
        // Since we don't have the exact dashboard DOM, validating the URL is a safe and reliable assertion.
    });

    test('should display error with invalid username', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Act
        await loginPage.navigate(TEST_DATA.url);
        await loginPage.login('InvalidUser', TEST_DATA.password);

        // Assert
        await expect(loginPage.getInvalidCredentialsAlert()).toBeVisible();
        await expect(loginPage.getInvalidCredentialsAlert()).toContainText('Invalid credentials');
    });

    test('should display error with invalid password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Act
        await loginPage.navigate(TEST_DATA.url);
        await loginPage.login(TEST_DATA.username, 'InvalidPassword123');

        // Assert
        await expect(loginPage.getInvalidCredentialsAlert()).toBeVisible();
        await expect(loginPage.getInvalidCredentialsAlert()).toContainText('Invalid credentials');
    });

    test('should require username and password fields', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Act
        await loginPage.navigate(TEST_DATA.url);
        // Leaving both fields empty
        await loginPage.login('', '');

        // Assert - Expect two 'Required' messages
        await expect(loginPage.getRequiredErrorMessages()).toHaveCount(2);
    });

    test('should require password field when username is provided', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Act
        await loginPage.navigate(TEST_DATA.url);
        await loginPage.login(TEST_DATA.username, '');

        // Assert - Expect one 'Required' message
        await expect(loginPage.getRequiredErrorMessages()).toHaveCount(1);
    });

    test('should display Login heading', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Act
        await loginPage.navigate(TEST_DATA.url);

        // Assert
        await expect(loginPage.getLoginHeading()).toBeVisible();
    });

    test('should display company branding image', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Act
        await loginPage.navigate(TEST_DATA.url);

        // Assert
        await expect(loginPage.getCompanyBrandingImage()).toBeVisible();
    });

    test('should navigate to forgot password page when link is clicked', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Act
        await loginPage.navigate(TEST_DATA.url);
        await loginPage.clickForgotPassword();

        // Assert
        // The URL should change to request password reset code page
        await expect(page).toHaveURL(/.*requestPasswordResetCode/);
    });
});
