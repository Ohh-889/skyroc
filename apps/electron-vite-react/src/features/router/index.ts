import { createHashHistory, createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

const hashHistory = createHashHistory();

export const router = createRouter({
  defaultPendingMinMs: 300,
  defaultPendingMs: 100,
  defaultPreload: 'intent',
  history: hashHistory,
  notFoundMode: 'root',
  routeTree,
  scrollRestoration: true
});

export type RouterConfig = typeof router;

declare module '@tanstack/react-router' {
  interface Register {
    router: RouterConfig;
  }
}
