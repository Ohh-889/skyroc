import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@shell': import.meta.dirname
    },
    // pnpm 会因为 peer 解析分叉装出两份 jotai / react，两份就是两个 context，
    // <JotaiProvider> 对另一份的 useAtom 不可见。与 admin-vite 的 DEFAULT_SINGLETON_DEDUPE 保持一致。
    dedupe: ['react', 'react-dom', 'jotai']
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts']
  }
});
