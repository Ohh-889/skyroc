import { COVERAGE_EXCLUDE, COVERAGE_PROVIDER, SOURCE_PATTERNS, TEST_ENVIRONMENT } from '@skyroc/config/vitest';
import { defineConfig } from 'vitest/config';

/**
 * 根目录 Vitest 配置
 *
 * 所有子包的测试统一由根目录配置管理， 各子包通过 include 模式自动发现测试文件。
 */

// ==================== 常量配置 ====================

/** 测试文件匹配模式（根目录视角，排除 native 包使用 Jest） */
const TEST_PATTERNS = ['packages/**/__tests__/**/*.test.ts', 'packages/**/__tests__/**/*.test.tsx'];

/** 排除 native 包（使用 Jest + react-native preset） */
const TEST_EXCLUDE = ['packages/native/**'];

/** 测试前置文件 */
const SETUP_FILES = [
  './packages/hooks/vitest.setup.ts',
  './packages/@core/utils/vitest.setup.ts',
  './packages/@core/state/vitest.setup.ts'
];

/**
 * 源文件匹配模式（根目录视角）
 *
 * 只覆盖有测试的包，避免无测试包产生大量 0% 噪音。 新包加测试后，在这里加一行即可。
 */
const TESTED_PACKAGES = [
  'packages/hooks',
  'packages/@core/utils',
  'packages/@core/color',
  'packages/@core/axios',
  'packages/@core/state',
  'packages/@core/scheduler',
  'packages/@core/service',
  'packages/web/admin-notification'
];
const ROOT_SOURCE_PATTERNS = TESTED_PACKAGES.flatMap(pkg => SOURCE_PATTERNS.map(p => `${pkg}/${p}`));

// ==================== Vitest 配置 ====================

export default defineConfig({
  test: {
    globals: true,
    environment: TEST_ENVIRONMENT,
    include: TEST_PATTERNS,
    exclude: TEST_EXCLUDE,
    setupFiles: SETUP_FILES,
    coverage: {
      provider: COVERAGE_PROVIDER,
      enabled: true,
      include: ROOT_SOURCE_PATTERNS,
      exclude: COVERAGE_EXCLUDE
    }
  }
});
