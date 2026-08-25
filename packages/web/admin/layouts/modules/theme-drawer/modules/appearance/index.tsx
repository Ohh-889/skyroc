import { Divider as ADivider } from 'antd';
import { useTranslation } from 'react-i18next';

import ThemeColor from './ThemeColor';
import ThemeSchema from './ThemeSchema';
import ThemeToken from './ThemeToken';

const Appearance = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-col-stretch gap-16px">
      <ADivider>{t('theme.appearance.themeSchema.title')}</ADivider>
      <ThemeSchema />
      <ADivider>{t('theme.appearance.themeBase.title')}</ADivider>
      <ThemeToken />
      <ADivider>{t('theme.appearance.themeColor.title')}</ADivider>
      <ThemeColor />
    </div>
  );
};

export default Appearance;
