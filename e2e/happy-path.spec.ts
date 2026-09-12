import { test, expect } from '@playwright/test';

test('flujo feliz: login, crear tarea, verla en la lista', async ({ page, request }) => {
  const email = `e2e_${Date.now()}@test.com`;
  const password = '123456';

  // Registro vía API directamente contra el backend, sin pasar por la UI
  const registerResponse = await request.post('http://localhost:3000/register', {
    data: { email, password },
  });
  expect(registerResponse.ok()).toBeTruthy();

  await page.goto('/');
  await page.getByPlaceholder('admin@test.com').fill(email);
  await page.getByPlaceholder('123456').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  const nombreTarea = `Tarea E2E ${Date.now()}`;
  await page.getByPlaceholder('Escribir una nueva tarea').fill(nombreTarea);
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByText(nombreTarea)).toBeVisible();
});