import { expect, test } from '@playwright/test';
import { expectNoPageErrors, getDemoModuleCoverage, gotoDemo, watchPageErrors } from './helpers';

const moduleCoverage = getDemoModuleCoverage();

test.describe('demo module coverage', () => {
  for (const demo of moduleCoverage) {
    test(`${demo.name} renders documented module cards`, async ({ page }) => {
      const pageErrors = watchPageErrors(page);

      await gotoDemo(page, demo.name);

      await Promise.all(
        demo.titles.map(title =>
          expect(page.locator('[data-slot="card-title"]').filter({ hasText: title }).first()).toBeVisible()
        )
      );

      expectNoPageErrors(pageErrors);
    });
  }
});
