import { tanstackRouter } from '@tanstack/router-plugin/vite';

export function setupRouterPlugin() {
  return tanstackRouter({
    autoCodeSplitting: true,
    generatedRouteTree: './src/features/router/routeTree.gen.ts',
    routeFileIgnorePattern: '(?:^|/)(components|modules)(?:/|$)|(?:^|/)(loading|error|not-found)(?:.tsx?|$)',
    routesDirectory: './src/pages',
    routeToken: 'layout',
    target: 'react'
  });
}
