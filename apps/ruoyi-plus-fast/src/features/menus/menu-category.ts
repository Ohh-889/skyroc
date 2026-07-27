import type { AdminLayoutMenuCategory } from '@skyroc/web-admin-layouts';

export const menuCategories = {
  admin: {
    key: 'admin',
    layout: '/(admin)'
  }
} as const satisfies Record<string, AdminLayoutMenuCategory>;

type MenuCategories = typeof menuCategories;

export type MenuCategoryKey = keyof MenuCategories;

export const menuCategoryKeys = Object.keys(menuCategories) as MenuCategoryKey[];
