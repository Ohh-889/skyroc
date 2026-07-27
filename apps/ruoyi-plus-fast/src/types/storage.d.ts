// oxlint-disable unicorn/require-module-specifiers
declare global {
  namespace StorageType {
    interface Local {
      /** The i18n language selected by the admin app. */
      lang: I18n.LangType;
      /** The last login user id, used to reset cached tabs after account changes. */
      lastLoginUserId: string;
      /** The refresh token owned by the admin auth flow. */
      refreshToken: string;
      /** The access token owned by the admin auth flow. */
      token: string;
    }
  }
}

export {};
