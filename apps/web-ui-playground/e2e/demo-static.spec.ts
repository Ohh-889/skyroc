import { expect, test } from '@playwright/test';
import { demoCardContent, expectNoPageErrors, expectTextVisible, gotoDemo, watchPageErrors } from './helpers';

test.describe('static and display demos', () => {
  test('display components render representative visible content and states', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'alert');
    await expectTextVisible(page, 'Your session has expired. Please log in again.');

    await gotoDemo(page, 'button');
    await expect(demoCardContent(page, 'Disabled').getByRole('button', { name: 'disabled' }).first()).toBeDisabled();
    await expect(
      demoCardContent(page, 'Loading')
        .getByRole('button', { name: /Loading/ })
        .first()
    ).toBeDisabled();

    await gotoDemo(page, 'card');
    await expectTextVisible(page, 'Card Title');
    await expectTextVisible(page, 'Card with Extra');

    await gotoDemo(page, 'progress');
    await expect(demoCardContent(page, 'Basic').getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');

    await gotoDemo(page, 'skeleton');
    await expect(demoCardContent(page, 'Skeleton').locator('[data-slot="skeleton"]').first()).toBeVisible();

    expectNoPageErrors(pageErrors);
  });

  test('media, typography, and metadata-style components render stable content', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'aspect-ratio');
    await expect(page.getByTitle('YouTube video player')).toBeVisible();

    await gotoDemo(page, 'avatar');
    await expectTextVisible(page, 'CN');

    await gotoDemo(page, 'badge');
    await expectTextVisible(page, 'Badge');

    await gotoDemo(page, 'divider');
    await expectTextVisible(page, 'Horizontal');

    await gotoDemo(page, 'keyboard-key');
    await expectTextVisible(page, 'K');

    await gotoDemo(page, 'tag');
    await expectTextVisible(page, 'Tag');

    await gotoDemo(page, 'layout');
    await expectTextVisible(page, 'This is Tab');
    await expectTextVisible(page, 'This is Content');

    expectNoPageErrors(pageErrors);
  });
});
