import { expect, test } from '@playwright/test';
import {
  demoCardContent,
  exactText,
  expectNoPageErrors,
  expectTextVisible,
  gotoDemo,
  watchPageErrors
} from './helpers';

test.describe('navigation demos', () => {
  test('accordion, collapsible, and tabs reveal hidden content', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'accordion');
    await demoCardContent(page, 'Single')
      .getByRole('button', { name: /Is it accessible/ })
      .first()
      .click();
    await expectTextVisible(demoCardContent(page, 'Single'), 'Yes. It adheres to the WAI-ARIA design pattern.');

    await gotoDemo(page, 'collapsible');
    const collapsible = demoCardContent(page, 'Collapsible');
    await expect(collapsible.getByText('@skyroc-ui/colors')).toBeHidden();
    await collapsible.getByRole('button').click();
    await expectTextVisible(collapsible, '@skyroc-ui/colors');

    await gotoDemo(page, 'tabs');
    await demoCardContent(page, 'Horizontal').getByRole('tab', { name: 'Tab 2' }).click();
    await expectTextVisible(demoCardContent(page, 'Horizontal'), 'The Tab Content: Tab 2');

    expectNoPageErrors(pageErrors);
  });

  test('pagination and carousel controls move active content', async ({ page }) => {
    const pageErrors = watchPageErrors(page);

    await gotoDemo(page, 'pagination');
    await expectTextVisible(demoCardContent(page, 'Controlled'), 'Current Page: 5');
    await demoCardContent(page, 'Controlled').getByRole('button', { name: '6' }).click();
    await expectTextVisible(demoCardContent(page, 'Controlled'), 'Current Page: 6');

    await gotoDemo(page, 'carousel');
    const carouselCard = demoCardContent(page, 'Basic');
    const firstSlide = carouselCard
      .getByRole('group')
      .filter({ hasText: exactText('1') })
      .first();
    const firstSlideBox = await firstSlide.boundingBox();
    expect(firstSlideBox).not.toBeNull();
    await carouselCard.getByRole('button', { name: 'Next slide' }).click();
    await expect.poll(async () => (await firstSlide.boundingBox())?.x).not.toBe(firstSlideBox!.x);

    expectNoPageErrors(pageErrors);
  });
});
