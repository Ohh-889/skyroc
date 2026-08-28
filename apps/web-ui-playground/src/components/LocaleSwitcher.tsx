'use client';

import { ButtonIcon, DropdownMenu, Icon } from '@skyroc/web-ui';
import { useLocale, useTranslations } from 'next-intl';
import { type Locale, localeNames, locales } from '../i18n/config';
import { usePathname, useRouter } from '../i18n/navigation';

const LocaleSwitcher = () => {
  const t = useTranslations('header');

  const router = useRouter();

  const pathname = usePathname();

  const locale = useLocale();

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu
      items={[
        {
          type: 'radio',
          value: locale,
          children: locales.map(loc => ({
            label: localeNames[loc],
            value: loc
          })),
          onValueChange: (value: string) => handleLocaleChange(value as Locale)
        }
      ]}
    >
      <ButtonIcon
        aria-label={t('switchLanguage')}
        size="lg"
        variant="ghost"
      >
        <Icon icon="lucide:languages" />
      </ButtonIcon>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
