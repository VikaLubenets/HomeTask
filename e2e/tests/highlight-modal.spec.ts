import { test, expect } from '@playwright/test';

const historyRow = {
  id: '1750432752050',
  fileName: 'report (7).csv',
  date: '2025-06-20T15:19:12.050Z',
  status: 'success',
  result: {
    total_spend_galactic: 1432542813.5,
    rows_affected: 2862809,
    less_spent_at: 166,
    big_spent_at: 302,
    less_spent_value: 3759426.5,
    big_spent_value: 4140109,
    average_spend_galactic: 500.3976211825518,
    big_spent_civ: 'monsters',
    less_spent_civ: 'humans',
  },
};

test('opens modal with highlights on history entry click', async ({ page }) => {
  await page.goto('/');

  await page.evaluate(([key, value]) => {
    localStorage.setItem(key, value);
  }, ['analitics_history', JSON.stringify([historyRow])]);

  await page.goto('/history');

  const firstItem = page.getByTestId('data-row').first();
  await expect(firstItem).toBeVisible();

  await firstItem.click();

  await expect(page.getByTestId('show-modal')).toBeVisible();
  await expect(page.getByText('monsters')).toBeVisible();
});
