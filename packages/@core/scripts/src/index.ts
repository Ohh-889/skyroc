import type { CliOption } from './types';

export * from './commands';
export * from './config';
export * from './locales';
export * from './types';

/**
 * 定义 `skyroc.config.ts`，仅为配置文件提供类型推导。
 *
 * 库入口不再顺带把 CLI 跑起来——CLI 在 `src/cli.ts`。
 */
export function defineConfig(config: Partial<CliOption>) {
  return config;
}
