import { Divider as ADivider } from 'antd';
import { useTranslation } from 'react-i18next';

import ContentSettings from './ContentSettings';
import FooterSettings from './FooterSettings';
import HeaderSettings from './HeaderSettings';
import LayoutMode from './LayoutMode';
import SiderSettings from './SiderSettings';
import TabSettings from './TabSettings';

const ThemeLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-col-stretch gap-16px">
      <ADivider>{t('theme.layout.layoutMode.title')}</ADivider>
      <LayoutMode />
      <ADivider>{t('theme.layout.tab.title')}</ADivider>
      <TabSettings />
      <ADivider>{t('theme.layout.header.title')}</ADivider>
      <HeaderSettings />
      <ADivider>{t('theme.layout.sider.title')}</ADivider>
      <SiderSettings />
      <ADivider>{t('theme.layout.footer.title')}</ADivider>
      <FooterSettings />
      <ADivider>{t('theme.layout.content.title')}</ADivider>
      <ContentSettings />
    </div>
  );
};

export default ThemeLayout;
