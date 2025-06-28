import { test, expect } from '@playwright/test';
import path from 'path';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Здесь я намеренно не мокаю API вызов генерации CSV
// Потому что этот e2e-тест проверяет ключевой пользовательский сценарий end-to-end:
// 1. Пользователь нажимает кнопку генерации
// 2. Система делает реальный запрос к серверу
// 3. После получения URL файла — браузер запускает загрузку
// 
// Мокать API здесь нецелесообразно, потому что:
// - мы не сможем гарантировать корректность поведения <a download> без настоящего файла
// - реальная генерация занимает доли секунды и не нагружает систему
// - тест изолирован, не создаёт побочных эффектов, не требует сложных данных
//
// В случае падения теста - включите сервер и тест отработает

test('user can generate and download CSV file', async ({ page, context }) => {
  await page.goto('/generation');

  const generateBtn = await page.getByTestId('idle-btn');
  await expect(generateBtn).toBeVisible();
  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    generateBtn.click(),
  ]);

  const suggestedFilename = download.suggestedFilename();
  expect(suggestedFilename).toBe('report.csv');

  const downloadPath = path.join(__dirname, '../downloads', suggestedFilename);
  await download.saveAs(downloadPath);
});
