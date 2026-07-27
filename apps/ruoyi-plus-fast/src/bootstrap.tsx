// oxlint-disable import/no-unassigned-import
import { setupAdminLayouts } from '@skyroc/web-admin-layouts';
import { setupTheme } from '@skyroc/web-admin-theme';
import { ErrorBoundary as FallbackRender } from '@skyroc/web-ui-antd';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import { globalConfig } from '@/config';
import { loadAdminDynamicRoutes } from '@/features/menus/dynamic-routes';
import { menuExtras } from '@/features/menus/extras';
import { menuCategories } from '@/features/menus/menu-category';
import { menuNodeCallback } from '@/features/menus/menu-config';
import { routeTree } from '@/features/router/routeTree.gen';
import { localStg } from '@/utils/storage';

import App from './App';
import { setupI18n } from './locales';
import { setupAdminPlugins } from './plugins';
import './plugins/assets';

async function setupApp() {
  const container = document.getElementById('app');

  if (!container) return;

  /**
   * 主题初始化（模块级别，仅执行一次）
   *
   * 在任何组件读取主题 atom 之前完成： - 默认配置加载 - localStorage 缓存读取（生产环境） - 版本覆盖检测
   */
  setupTheme({
    buildTime: BUILD_TIME
  });

  setupAdminLayouts({
    defaultHome: globalConfig.defaultHome,
    defaultIcon: globalConfig.defaultIcon,
    loadDynamicRoutes: loadAdminDynamicRoutes,
    menuCategories,
    extras: menuExtras,
    menuNodeCallback,
    permissionSuperRole: import.meta.env.VITE_STATIC_SUPER_ROLE,
    routeMode: globalConfig.routeMode,
    routeTree,
    storage: localStg
  });

  setupAdminPlugins();

  await setupI18n();

  const root = createRoot(container);
  root.render(
    <ErrorBoundary FallbackComponent={FallbackRender}>
      <App />
    </ErrorBoundary>
  );
}

setupApp();
