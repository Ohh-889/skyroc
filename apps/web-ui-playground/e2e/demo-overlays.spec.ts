import { expect, test } from '@playwright/test';
import { demoCardContent, expectNoPageErrors, expectTextVisible, gotoDemo, watchPageErrors } from './helpers';

test.describe('overlay demos', () => {
  test('dialog and drawer open portal content and close from keyboard', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'dialog');
    await demoCardContent(page, 'Default').getByRole('button', { name: 'Open' }).click();
    await expect(page.getByRole('dialog', { name: 'Dialog Title' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Dialog Title' })).toBeHidden();

    await gotoDemo(page, 'drawer');
    await demoCardContent(page, 'Side').getByRole('button', { name: 'left' }).click();
    await expect(page.getByRole('dialog', { name: 'Drawer Title' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Drawer Title' })).toBeHidden();

    expectNoPageErrors(pageErrors);
  });

  test('alert dialog and bottom sheet expose confirm surfaces', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'alert-dialog');
    await demoCardContent(page, 'Destructive').getByRole('button', { name: 'Show Dialog' }).click();
    await expect(page.getByRole('alertdialog', { name: 'Are you sure delete?' })).toBeVisible();
    await expectTextVisible(page, 'This action will delete all data');
    await page.keyboard.press('Escape');

    await gotoDemo(page, 'bottom-sheet');
    await page.getByRole('button', { name: 'Open BottomSheet' }).click();
    await expect(page.getByRole('dialog', { name: 'BottomSheet Title' })).toBeVisible();
    await expectTextVisible(page, 'This is a basic drawer with a title and description.');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog', { name: 'BottomSheet Title' })).toBeHidden();

    expectNoPageErrors(pageErrors);
  });

  test('popover, hover card, and tooltip render floating content', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'popover');
    await page.getByRole('button', { name: 'Open Popover' }).click();
    await expectTextVisible(page, 'Popover Title');
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Open with close' }).click();
    await expectTextVisible(page, 'Closable Popover');
    await page.keyboard.press('Escape');

    await gotoDemo(page, 'hover-card');
    await page.getByRole('button', { name: '@skyroc' }).first().hover();
    await expectTextVisible(page, 'Skyroc is a front-end technology team, built by Skyroc.');

    await gotoDemo(page, 'tooltip');
    await page.getByRole('button', { name: 'Hover me' }).focus();
    await expectTextVisible(page, 'Save your changes');

    expectNoPageErrors(pageErrors);
  });

  test('sonner message, notification, and toast root mounts render output', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'sonner');
    await demoCardContent(page, 'Message')
      .getByRole('button', { name: /^Success$/ })
      .click();
    await expectTextVisible(page, 'This is a success message');

    await demoCardContent(page, 'Notification').getByRole('button', { name: 'Double Buttons' }).click();
    await expectTextVisible(page, 'Confirm Action');
    await expectTextVisible(page, 'Are you sure you want to perform this action?');

    await demoCardContent(page, 'Toast').getByRole('button', { name: 'Default' }).click();
    await expectTextVisible(page, 'Default toast');

    expectNoPageErrors(pageErrors);
  });
});
