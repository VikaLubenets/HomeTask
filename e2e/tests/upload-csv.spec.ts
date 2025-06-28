import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('uploads csv file via file input', async ({ page }) => {
  await page.goto('/');

  const fileInput = await page.getByTestId('upload-input');
  const filePath = path.resolve(__dirname, '../fixtures/test.csv');

  await fileInput.setInputFiles(filePath);

  await expect(page.getByText('test.csv')).toBeVisible();
});

test('drag and drop csv file to upload', async ({ page }) => {
  await page.goto('/');

  const dropArea = await page.getByTestId('drop-area');
  await expect(dropArea).toBeVisible();

  const fileContent = 'one,two\nthree,four';
  const dataTransfer = await page.evaluateHandle((csv) => {
    const dt = new DataTransfer();
    const file = new File([csv], 'test.csv', { type: 'text/csv' });
    dt.items.add(file);
    return dt;
  }, fileContent);

  const dropAreaHandle = await dropArea.elementHandle();
  if (!dropAreaHandle) throw new Error('Drop area not found');

  for (const eventName of ['dragenter', 'dragover', 'drop']) {
    await dropAreaHandle.dispatchEvent(eventName, {
      dataTransfer,
    });
  }

  await expect(page.getByText('test.csv')).toBeVisible();
});



