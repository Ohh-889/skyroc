import { baseTestConfig } from '@skyroc/config/vitest';
import { defineConfig } from 'vitest/config';

/**
 * @skyroc/type-utils 测试配置
 *
 * 本包几乎只有类型，主力断言写在 `__tests__/*.test-d.ts` 里靠 `expectTypeOf` 校验， 因此必须开启 vitest 的 typecheck
 * 模式；`__tests__/*.test.ts` 保留给源码静态检查 （如平台边界守卫）这类真正需要运行时的用例。
 */
export default defineConfig({
  test: {
    ...baseTestConfig,
    typecheck: {
      enabled: true,
      include: ['__tests__/**/*.test-d.ts'],
      tsconfig: './tsconfig.json'
    }
  }
});
