import { COVERAGE_EXCLUDE, baseCoverageConfig, baseTestConfig } from '@skyroc/config/vitest';
import { defineConfig } from 'vitest/config';

/**
 * @skyroc/utils 测试配置
 *
 * 继承根目录的共享配置，保持配置一致性。
 *
 * `./type` 出口几乎只有类型，主力断言写在 `__tests__/*.test-d.ts` 里靠 `expectTypeOf`
 * 校验，因此开启 vitest 的 typecheck 模式；`__tests__/*.test.ts` 是常规运行时用例。
 * typecheck 走 `tsconfig.web.json`（带 DOM lib），因为 `web-form.test-d.ts` 断言的是
 * `./web` 出口的表单元素类型。
 */
export default defineConfig({
  test: {
    ...baseTestConfig,
    setupFiles: ['./vitest.setup.ts'],
    typecheck: {
      enabled: true,
      include: ['__tests__/**/*.test-d.ts'],
      tsconfig: './tsconfig.web.json'
    },
    coverage: {
      ...baseCoverageConfig,
      exclude: [
        ...COVERAGE_EXCLUDE,
        '**/klona.ts',
        '**/nanoid.ts',
        '**/path.ts',
        '**/radash.ts',
        '**/scheduler/types.ts',
        '**/type/**',
        '**/web/form.ts'
      ]
    }
  }
});
