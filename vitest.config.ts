import { COVERAGE_EXCLUDE, COVERAGE_PROVIDER, SOURCE_PATTERNS, TEST_ENVIRONMENT } from '@skyroc/config/vitest';
import { configDefaults, defineConfig } from 'vitest/config';

/**
 * 根目录 Vitest 配置
 *
 * 所有子包的测试统一由根目录配置管理， 各子包通过 include 模式自动发现测试文件。
 */

// ==================== 常量配置 ====================

/** 测试文件匹配模式（根目录视角，排除 native 包使用 Jest） */
const TEST_PATTERNS = ['packages/**/__tests__/**/*.test.ts', 'packages/**/__tests__/**/*.test.tsx'];

/** 排除 native 包（使用 Jest + react-native preset） */
// 自定义 exclude 会整体替换 vitest 默认值（node_modules/dist 等），必须显式带上
const TEST_EXCLUDE = [...configDefaults.exclude, 'packages/native/**'];

/** 测试前置文件 */
const SETUP_FILES = [
  './packages/web/admin/vitest.setup.ts',
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
  'packages/@core/service',
  'packages/web/admin'
];
const ROOT_SOURCE_PATTERNS = TESTED_PACKAGES.flatMap(pkg => SOURCE_PATTERNS.map(p => `${pkg}/${p}`));

// ==================== Vitest 配置 ====================

export default defineConfig({
  resolve: {
    alias: {
      '@shell': `${import.meta.dirname}/packages/web/admin`
    },
    // 与 packages/web/admin/vitest.config.ts 一致：防止 pnpm peer 分叉装出两份 jotai/react
    dedupe: ['react', 'react-dom', 'jotai']
  },
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
