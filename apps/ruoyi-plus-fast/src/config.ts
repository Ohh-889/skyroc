import type { AdminDevtoolsConfig } from '@skyroc/web-admin-devtools';
import { defaultThemeSettings } from '@skyroc/web-admin-theme';
import type { NProgress } from 'nprogress';

import { menuCategoryKeys } from './features/menus/menu-category';
import { localStg } from './utils/storage';

// ============================================================================
// Re-export antd UI helpers from admin-theme package
// （保持 auto-import 兼容，所有 showXxx 函数可继续作为全局变量使用）
// ============================================================================
export {
  destroyMessage,
  destroyNotification,
  showConfirmModal,
  showErrorMessage,
  showErrorModal,
  showErrorNotification,
  showInfoMessage,
  showInfoModal,
  showInfoNotification,
  showLoadingMessage,
  showMessage,
  showModal,
  showNotification,
  showSuccessMessage,
  showSuccessModal,
  showSuccessNotification,
  showWarningMessage,
  showWarningModal,
  showWarningNotification
} from '@skyroc/web-admin-theme';

// ============================================================================
// NProgress
// ============================================================================

const _nprogress = { instance: null as NProgress | null };

export function initNProgress(nprogress: NProgress) {
  _nprogress.instance = nprogress;
}

// ============================================================================
// Global Config
// ============================================================================

function createConfig() {
  return {
    // ======System Config======
    /** - 是否自动检测更新 */
    automaticallyDetectUpdate: true,

    /** - 是否开发环境 */
    isDev: import.meta.env.DEV,
    /** - 开发工具配置 */
    devtools: {
      jotai: {
        name: import.meta.env.VITE_APP_TITLE,
        panel: true,
        position: 'bottom-left',
        timeline: true,
        triggerOffset: {
          left: defaultThemeSettings.sider.width + 8
        }
      },
      position: 'bottom-right',
      query: true,
      router: true
    } satisfies AdminDevtoolsConfig,
    /** - 生成菜单的分类 key，来源于 setupAdminLayouts 使用的 menuCategories。 */
    genMenuLayouts: menuCategoryKeys,
    /** - 默认首页 */
    defaultHome: import.meta.env.VITE_ROUTE_HOME,

    localIconPrefix: import.meta.env.VITE_ICON_LOCAL_PREFIX,

    defaultIcon: import.meta.env.VITE_MENU_ICON,

    routeMode: import.meta.env.VITE_AUTH_ROUTE_MODE,

    /** - Nprogress 实例 */
    get nprogress(): NProgress {
      if (!_nprogress.instance) {
        console.error('nprogress is not initialized, please call initNProgress function first');
        throw new Error('nprogress is not initialized');
      }
      return _nprogress.instance;
    },

    /// //////////////////////////////////////////////////////////////////////////////
    // ======Theme Config======
    /// //////////////////////////////////////////////////////////////////////////////
    /** - 默认主题配置 */
    get defaultThemeColor(): string {
      return localStg.get('themeColor') || defaultThemeSettings.themeColor;
    },
    get defaultDarkMode(): boolean {
      return localStg.get('darkMode') ?? defaultThemeSettings.themeScheme === 'dark';
    },

    /// //////////////////////////////////////////////////////////////////////////////
    // ======Lang Config======
    /// //////////////////////////////////////////////////////////////////////////////
    /** - 默认语言配置 */
    get defaultLang(): I18n.LangType {
      return localStg.get('lang') || 'zh-CN';
    },
    /** - 默认语言选项 */
    get defaultLangOptions(): I18n.LangOption[] {
      return [
        {
          key: 'zh-CN',
          label: '中文'
        },
        {
          key: 'en-US',
          label: 'English'
        }
      ];
    }
  } as const;
}

export const globalConfig = createConfig();
