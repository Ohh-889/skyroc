import { ThemeSchemaSwitch, useSettingsTheme } from '@shell/theme';
import { FlipText } from '@shell/ui/compose';

import { LangSwitch } from '@shell/i18n';
import SystemLogo from '@/components/SystemLogo';

const Header = memo(() => {
  const { t } = useTranslation();
  const { header } = useSettingsTheme();

  return (
    <header className="flex-y-center justify-between">
      <SystemLogo className="size-5xl text-primary lt-sm:size-4xl" />

      <FlipText
        className="text-3xl text-primary font-500 lt-sm:text-2xl"
        word={t('system.title')}
      />

      <div className="i-flex-col">
        <ThemeSchemaSwitch
          className="text-xl lt-sm:text-lg"
          showTooltip={false}
        />
        <LangSwitch
          showTooltip={false}
          visible={header.multilingual.visible}
        />
      </div>
    </header>
  );
});

export default Header;
