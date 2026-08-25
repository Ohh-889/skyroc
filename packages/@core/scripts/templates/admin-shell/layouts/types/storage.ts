// oxlint-disable unicorn/require-module-specifiers
declare global {
  namespace StorageType {
    interface Local {
      /** Layout settings cached before switching to mobile mode. */
      backupThemeSettingBeforeIsMobile: {
        layout: UnionKey.ThemeLayoutMode;
        siderCollapse: boolean;
      };
      /** Persisted admin layout tabs. */
      globalTabs: App.Global.Tab[];
      /** Whether the mixed menu sider is fixed. */
      mixSiderFixed: Common.YesOrNo;
    }
  }
}

export {};
