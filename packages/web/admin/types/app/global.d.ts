// oxlint-disable unicorn/require-module-specifiers
/** The global namespace */
declare global {
  namespace App.Global {
    /**
     * - The global dropdown key
     * - CloseAll: close all tabs
     * - CloseCurrent: close current tab
     * - CloseLeft: close left tabs
     * - CloseOther: close other tabs
     * - CloseRight: close right tabs
     * - Pin: pin tab
     * - Unpin: unpin tab
     */
    type DropdownKey = 'closeAll' | 'closeCurrent' | 'closeLeft' | 'closeOther' | 'closeRight' | 'pin' | 'unpin';

    type AntdMenu = NonNullable<import('antd').MenuProps['items']>[number];

    /** The global tab */
    type Tab = {
      /** The tab fixed index */
      fixedIndex?: number | null;
      /** The tab route full path */
      fullPath: string;
      /** I18n key */
      i18nKey?: I18n.I18nKey | null;
      /**
       * Tab icon
       *
       * Iconify icon
       */
      icon?: string | null;
      /** The tab id */
      id: string;
      /** Whether the tab route should keep its page instance alive */
      keepAlive?: boolean | null;
      /** The tab label */
      label: string;
      /**
       * Tab local icon
       *
       * Local icon
       */
      localIcon?: string | null;

      /**
       * The old tab label
       *
       * When reset the tab label, the tab label will be replaced by this value
       */
      oldLabel?: string | null;
      /** The tab route path */
      routePath: Router.RoutePath;
    };

    /** The global admin layout menu */

    namespace AdminLayout {
      interface HeaderProps {
        /** Whether to show the logo */
        showLogo?: boolean;
        /** Whether to show the menu */
        showMenu?: boolean;
        /** Whether to show the menu toggler */
        showMenuToggler?: boolean;
      }
    }
  }
}

export {};
