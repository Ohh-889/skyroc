import { baseCoverageConfig, baseTestConfig } from '@skyroc/config/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    ...baseTestConfig,
    coverage: baseCoverageConfig
  }
});
