import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly invalidCredentialsAlert: Locator;
    readonly requiredErrorMessage: Locator;
    readonly loginHeading: Locator;
    readonly companyBrandingImage: Locator;
    readonly forgotPasswordLink: Locator;

    constructor(page: Page) {
        this.page = page;
        // Using preferred locators as per automation rules
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: /login/i });
        this.invalidCredentialsAlert = page.getByRole('alert');
        this.requiredErrorMessage = page.getByText('Required');
        this.loginHeading = page.getByRole('heading', { name: 'Login' });
        this.companyBrandingImage = page.getByAltText('company-branding');
        this.forgotPasswordLink = page.getByText('Forgot your password?');
    }

    /**
     * Navigates to the given URL
     * @param url The URL to navigate to
     */
    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Enters the username into the username field
     * @param username The user's username
     */
    async enterUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    /**
     * Enters the password into the password field
     * @param password The user's password
     */
    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    /**
     * Clicks the login button
     */
    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }

    /**
     * Performs a full login operation
     * @param username The user's username
     * @param password The user's password
     */
    async login(username: string, password: string): Promise<void> {
        if (username) await this.enterUsername(username);
        if (password) await this.enterPassword(password);
        await this.clickLogin();
    }

    /**
     * Gets the invalid credentials alert locator
     * @returns Locator for the invalid credentials alert
     */
    getInvalidCredentialsAlert(): Locator {
        return this.invalidCredentialsAlert;
    }

    /**
     * Gets the required error message locator
     * @returns Locator for the required error messages
     */
    getRequiredErrorMessages(): Locator {
        return this.requiredErrorMessage;
    }

    /**
     * Gets the login heading locator
     * @returns Locator for the login heading
     */
    getLoginHeading(): Locator {
        return this.loginHeading;
    }

    /**
     * Gets the company branding image locator
     * @returns Locator for the company branding image
     */
    getCompanyBrandingImage(): Locator {
        return this.companyBrandingImage;
    }

    /**
     * Clicks the 'Forgot your password?' link
     */
    async clickForgotPassword(): Promise<void> {
        await this.forgotPasswordLink.click();
    }
}
