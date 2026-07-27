import { LangEffect } from '@skyroc/web-admin-i18n';
import { ThemeEffect } from '@skyroc/web-admin-theme';

import { syncLocales } from '@/locales/sync';

const GlobalEffect = () => {
  return (
    <>
      <ThemeEffect />
      <LangEffect onLocaleChange={syncLocales} />
    </>
  );
};

export default GlobalEffect;
