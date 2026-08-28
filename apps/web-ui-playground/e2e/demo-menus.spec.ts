import { expect, test } from '@playwright/test';
import { demoCardContent, expectNoPageErrors, expectTextVisible, gotoDemo, watchPageErrors } from './helpers';

test.describe('menu and select demos', () => {
  test('dropdown menu, context menu, and menubar expose nested menu items', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'dropdown-menu');
    await demoCardContent(page, 'Basic').getByRole('button', { name: 'Open Dropdown' }).click();
    await expect(page.getByRole('menuitem', { name: /Profile/ })).toBeVisible();
    await page.getByRole('menuitem', { name: /Invite Users/ }).hover();
    await expect(page.getByRole('menuitem', { name: /Email/ })).toBeVisible();

    await gotoDemo(page, 'context-menu');
    await demoCardContent(page, 'Basic').getByText('Right click here').click({ button: 'right' });
    await expect(page.getByRole('menuitem', { name: /Profile/ })).toBeVisible();
    await page.getByRole('menuitem', { name: /Invite Users/ }).hover();
    await expect(page.getByRole('menuitem', { name: /Email/ })).toBeVisible();
    await page.getByRole('menuitem', { name: 'More' }).hover();
    await expect(page.getByRole('menuitem', { name: /Message/ })).toBeVisible();

    await gotoDemo(page, 'menubar');
    await demoCardContent(page, 'Menubar').getByRole('menuitem', { name: 'File', exact: true }).click();
    await expect(page.getByRole('menuitem', { name: /New Tab/ })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Share', exact: true }).hover();
    await expect(page.getByRole('menuitem', { name: 'Email link' })).toBeVisible();

    expectNoPageErrors(pageErrors);
  });

  test('select and combobox choose values and keep disabled options unavailable', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'select');
    await demoCardContent(page, 'Basic').getByRole('combobox').click();
    await page.getByRole('option', { name: /Banana/ }).click();
    await expect(demoCardContent(page, 'Basic').getByRole('combobox')).toContainText('Banana');

    await demoCardContent(page, 'Controlled').getByRole('combobox').click();
    await page.getByRole('option', { name: 'Orange' }).click();
    await expectTextVisible(demoCardContent(page, 'Controlled'), 'Selected: orange');

    await demoCardContent(page, 'Disabled option').getByRole('combobox').click();
    await expect(page.getByRole('option', { name: /Cherry/ })).toBeDisabled();
    await page.keyboard.press('Escape');

    await gotoDemo(page, 'combobox');
    await page.getByRole('combobox').click();
    await page.locator('[data-slot="command-input"]').fill('React');
    await expect(page.locator('[data-slot="command-item"]').filter({ hasText: 'React' })).toBeVisible();

    expectNoPageErrors(pageErrors);
  });

  test('command, navigation menu, and breadcrumb dropdown reveal command surfaces', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'command');
    await demoCardContent(page, 'Command').locator('[data-slot="command-input"]').fill('mail');
    await expect(
      demoCardContent(page, 'Command').locator('[data-slot="command-item"]').filter({ hasText: 'Mail' })
    ).toBeVisible();
    await demoCardContent(page, 'Command Dialog').getByRole('button', { name: 'Open command' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByPlaceholder('Type a command or search...')).toBeVisible();
    await page.keyboard.press('Escape');

    await gotoDemo(page, 'navigation-menu');
    await page.getByRole('button', { name: /Guide/ }).hover();
    await expectTextVisible(page, 'Introduction');

    await gotoDemo(page, 'breadcrumb');
    await demoCardContent(page, 'Item Custom Dropdown').getByText('Dropdown').click();
    await expect(page.getByRole('menuitem', { name: 'Documentation' })).toBeVisible();

    expectNoPageErrors(pageErrors);
  });
});
