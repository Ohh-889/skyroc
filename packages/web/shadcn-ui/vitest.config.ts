import { fileURLToPath } from 'node:url';
import { COVERAGE_EXCLUDE, baseCoverageConfig, baseTestConfig } from '@skyroc/config/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    ...baseTestConfig,
    pool: 'forks',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      ...baseCoverageConfig,
      exclude: [...COVERAGE_EXCLUDE, '**/types.ts', '**/types/**/*', '**/components/virtualizer/origin.ts']
    }
  }
});
