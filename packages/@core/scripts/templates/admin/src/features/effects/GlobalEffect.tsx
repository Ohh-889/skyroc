import { LangEffect } from '@shell/i18n';
import { ThemeEffect } from '@shell/theme';

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
