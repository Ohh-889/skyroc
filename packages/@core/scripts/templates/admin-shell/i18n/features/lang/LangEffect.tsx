import { useEffect } from 'react';

import type { LangType } from '../../types';

import { useLang } from '../../hooks/use-lang';

interface LangEffectProps {
  /** Extra effect that should run after the active admin locale changes. */
  onLocaleChange?: (locale: LangType) => void;
}

const LangEffect = (props: LangEffectProps) => {
  const { onLocaleChange } = props;

  const { locale } = useLang();

  useEffect(() => {
    document.documentElement.lang = locale;
    onLocaleChange?.(locale);
  }, [locale, onLocaleChange]);

  return null;
};

export default LangEffect;
