import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // 与 admin-vite 的 DEFAULT_SINGLETON_DEDUPE 保持一致：pnpm 会因为 peer 解析分叉
    // 给 admin-layouts 和 @core/state 各装一份 jotai，两份 jotai 就是两个 React context，
    // <JotaiProvider> 对另一份的 useAtom 不可见。测试环境必须和构建产物一样只留一份。
    dedupe: ['react', 'react-dom', 'jotai']
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts']
  }
});
