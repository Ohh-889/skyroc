// oxlint-disable unicorn/require-module-specifiers
/** Shared i18n type primitives and extension points */
declare global {
  namespace I18n {
    interface LangRegistry {
      'en-US': true;
      'zh-CN': true;
    }

    type LangType = keyof LangRegistry extends never ? string : Extract<keyof LangRegistry, string>;

    type LangOption = {
      key: LangType;
      label: string;
    };

    interface LocaleMessages {
      common: Common;
      datatable: Datatable;
      dropdown: Record<App.Global.DropdownKey, string>;
      form: Form;
      icon: Icon;
      page: Page;
      request: Request;
      route: Route;
      system: System;
      theme: Theme;
    }

    interface Schema {
      translation: LocaleMessages;
    }

    type GetI18nKey<T extends object, K extends keyof T = keyof T> = K extends string
      ? T[K] extends object
        ? `${K}.${GetI18nKey<Extract<T[K], object>>}`
        : K
      : never;

    type I18nKey = GetI18nKey<Schema['translation']>;

    type TranslateOptions<Locales extends string> = import('react-i18next').TranslationProps<Locales>;

    interface $T {
      (key: I18nKey): string;
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], plural: number): string;
      (key: I18nKey, list: unknown[], defaultMsg: string): string;
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, named: Record<string, unknown>, plural: number): string;
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }

    interface Common {
      action: string;
      add: string;
      addSuccess: string;
      backToHome: string;
      batchDelete: string;
      cancel: string;
      check: string;
      close: string;
      columnSetting: string;
      config: string;
      confirm: string;
      confirmDelete: string;
      createTime: string;
      delete: string;
      deleteSuccess: string;
      detail: string;
      edit: string;
      error: string;
      errorHint: string;
      expandColumn: string;
      index: string;
      keywordSearch: string;
      logout: string;
      logoutConfirm: string;
      lookForward: string;
      modify: string;
      modifySuccess: string;
      noData: string;
      operate: string;
      pleaseCheckValue: string;
      refresh: string;
      reset: string;
      search: string;
      selectAll: string;
      switch: string;
      tip: string;
      trigger: string;
      tryAlign: string;
      update: string;
      updateTime: string;
      updateSuccess: string;
      userCenter: string;
      warning: string;
      yesOrNo: {
        no: string;
        yes: string;
      };
    }

    type RouteKey = Router.RoutePath;

    type ReplaceSlash<S extends string> = S extends `${infer A}/${infer B}` ? `${A}_${ReplaceSlash<B>}` : S;

    type TransformPath<P extends string> = P extends '/'
      ? 'home'
      : P extends `/${infer Rest}`
        ? ReplaceSlash<Rest>
        : never;

    type I18nRouteKey = string extends RouteKey ? string : TransformPath<RouteKey>;

    type I18nRouteMap = Record<I18nRouteKey, string>;

    interface Route extends I18nRouteMap {
      notFound: string;
      root: string;
    }

    interface Datatable {}
    interface Form {}
    interface Icon {}
    interface Page {}
    interface Request {}
    interface System {}
    interface Theme extends Record<string, unknown> {}
  }
}

export {};
