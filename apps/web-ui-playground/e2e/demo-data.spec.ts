import { expect, test } from '@playwright/test';
import { demoCardContent, expectNoPageErrors, expectTextVisible, gotoDemo, watchPageErrors } from './helpers';

test.describe('data, scroll, and drag demos', () => {
  test('tree, scroll-area, and virtualizer expose offscreen or selected content', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'tree');
    await demoCardContent(page, 'Basic').getByText('use-auth.ts').click();
    await expectTextVisible(demoCardContent(page, 'Basic'), 'Selected:auth');

    await gotoDemo(page, 'scroll-area');
    const vertical = demoCardContent(page, 'Vertical');
    await vertical.getByText('v1.2.0-beta.50').scrollIntoViewIfNeeded();
    await expectTextVisible(vertical, 'v1.2.0-beta.50');

    await gotoDemo(page, 'virtualizer');
    const virtualList = demoCardContent(page, '基础虚拟列表');
    await expectTextVisible(virtualList, 'Item 1');
    await virtualList
      .locator('[style*="overflow"]')
      .first()
      .evaluate(element => {
        element.scrollTo(0, 1600);
      });
    await expect(virtualList.getByText(/Item [3-9][0-9]/).first()).toBeVisible();

    expectNoPageErrors(pageErrors);
  });

  test('slider and resizable controls respond to pointer or keyboard input', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'slider');
    const slider = demoCardContent(page, 'Basic').getByRole('slider').first();
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveAttribute('aria-valuenow', '41');

    await gotoDemo(page, 'resizable');
    const separator = demoCardContent(page, 'Horizontal').getByRole('separator').first();
    const before = await separator.boundingBox();
    expect(before).not.toBeNull();
    await separator.dragTo(demoCardContent(page, 'Horizontal'), {
      targetPosition: {
        x: 320,
        y: 100
      }
    });
    const after = await separator.boundingBox();
    expect(after).not.toBeNull();
    expect(after!.x).not.toBe(before!.x);

    expectNoPageErrors(pageErrors);
  });
});
