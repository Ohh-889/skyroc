import { ButtonIcon } from '@shell/ui/antd';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { useLang } from '../../hooks/use-lang';

interface LangSwitchProps {
  /** Extra class name applied to the icon button. */
  className?: string;
  /** Whether to show the language switch tooltip. */
  showTooltip?: boolean;
  /** Whether the language switch should be rendered by the host admin layout. */
  visible?: boolean;
}

const LangSwitch = (props: LangSwitchProps) => {
  const { className, showTooltip = true, visible = true } = props;

  const { t } = useTranslation();

  const { locale, localeOptions, setLocale } = useLang();

  const tooltipContent = showTooltip ? t('icon.lang') : '';
  const localeItems: MenuProps['items'] = localeOptions.map(item => ({
    key: item.key,
    label: item.label
  }));

  function changeLocales({ key }: Parameters<NonNullable<MenuProps['onClick']>>[0]) {
    setLocale(key as I18n.LangType);
  }

  if (!visible) return null;

  return (
    <Dropdown menu={{ items: localeItems, onClick: changeLocales, selectedKeys: [locale] }}>
      <ButtonIcon
        className={className}
        hoverAnimation="scale"
        icon="heroicons:language"
        tooltipContent={tooltipContent}
        tooltipPlacement="left"
      />
    </Dropdown>
  );
};

export default LangSwitch;
