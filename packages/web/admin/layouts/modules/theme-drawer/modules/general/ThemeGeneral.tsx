import { Divider as ADivider } from 'antd';
import { useTranslation } from 'react-i18next';

import GlobalSettings from './GlobalSettings';
import WatermarkSettings from './WatermarkSettings';

const ThemeGeneral = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-col-stretch gap-16px">
      <ADivider>{t('theme.general.title')}</ADivider>
      <GlobalSettings />
      <ADivider>{t('theme.general.watermark.title')}</ADivider>
      <WatermarkSettings />
    </div>
  );
};

export default ThemeGeneral;
