// oxlint-disable import/no-unassigned-import
// oxlint-disable unicorn/require-module-specifiers
// oxlint-disable import/no-empty-named-blocks
import type {} from '@tanstack/react-router';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption extends Router.Meta {}
}

export {};
