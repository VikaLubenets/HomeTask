import { test, expect } from '@playwright/test';

test('navigates to CSV Аналитик (home) via nav', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'CSV Аналитик' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('analitics-page')).toBeVisible();
});

test('navigates to CSV Генератор page via nav', async ({ page }) => {
  await page.goto('/generation');
  await page.getByRole('link', { name: 'CSV Генератор' }).click();
  await expect(page).toHaveURL(/.*generation/);
  await expect(page.getByTestId('generator-page')).toBeVisible();
});

test('navigates to История page via nav', async ({ page }) => {
  await page.goto('/history');
  await page.getByRole('link', { name: 'История' }).click();
  await expect(page).toHaveURL(/.*history/);
  await expect(page.getByTestId('history-page')).toBeVisible();
});
