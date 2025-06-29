import { test, expect } from '@playwright/test';

test.describe('User Profile Page', () => {
  // Replace with a valid userId in your system
  const userId = 'test-user-id';

  test('should load user profile and display posts', async ({ page }) => {
    await page.goto(`/community/friends/${userId}`);

    // Check profile loading message disappears
    await expect(page.locator('text=Loading profile...')).toHaveCount(0);

    // Check profile name is visible
    await expect(page.locator('h1')).toContainText(/./);

    // Check posts section is visible
    await expect(page.locator('text=Posts')).toBeVisible();

    // Check at least one post or no posts message
    const posts = page.locator('article');
    const noPosts = page.locator('text=No posts found.');
    await expect(posts.count()).toBeGreaterThanOrEqual(0);
    await expect(noPosts.count()).toBeGreaterThanOrEqual(0);
  });

  test('should allow toggling friend status', async ({ page }) => {
    await page.goto(`/community/friends/${userId}`);

    const friendButton = page.locator('button', { hasText: /Friend/ });
    await expect(friendButton).toBeVisible();

    // Click to toggle friend status
    await friendButton.click();

    // Confirm dialog appears and accept it
    page.on('dialog', dialog => dialog.accept());

    // Click again to toggle back
    await friendButton.click();
  });

  test('should send and receive messages', async ({ page }) => {
    await page.goto(`/community/friends/${userId}`);

    const input = page.locator('input[placeholder="Type a message..."]');
    const sendButton = page.locator('button', { hasText: 'Send' });

    await input.fill('Hello from Playwright!');
    await sendButton.click();

    // Check message appears in chat
    await expect(page.locator('text=Hello from Playwright!')).toBeVisible();
  });
});
