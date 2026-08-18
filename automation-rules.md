Follow the Page Object Model (POM) design pattern.

Create stable, reusable, and unique Playwright locators. Prefer getByRole, getByLabel, getByPlaceholder, data-testid, and other reliable selectors. Avoid brittle XPath and CSS selectors based on classes or indexes.

Create all locators and methods in the corresponding page object class and call those methods from the test file. Do not write business logic directly in the test class.

Keep methods reusable, readable, and maintainable. Avoid duplicate code and follow Playwright best practices.

Use meaningful method names and test names.

Add proper assertions and wait for elements only when necessary.

Do not hardcode specific data.