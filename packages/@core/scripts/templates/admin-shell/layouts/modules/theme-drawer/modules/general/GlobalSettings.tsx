import { useSettingsTheme } from '@shell/theme';
import { Switch as ASwitch } from 'antd';
import { useTranslation } from 'react-i18next';

import SettingItem from '../../components/SettingItem';

const GlobalSettings = () => {
  const { t } = useTranslation();

  const { header, setSettings } = useSettingsTheme();

  const updateMultilingual = (patch: Partial<typeof header.multilingual>) => {
    setSettings({
      header: {
        ...header,
        multilingual: {
          ...header.multilingual,
          ...patch
        }
      }
    });
  };

  const updateGlobalSearch = (patch: Partial<typeof header.globalSearch>) => {
    setSettings({
      header: {
        ...header,
        globalSearch: {
          ...header.globalSearch,
          ...patch
        }
      }
    });
  };

  const handleMultilingualVisibleChange = (visible: boolean) => {
    updateMultilingual({ visible });
  };

  const handleGlobalSearchVisibleChange = (visible: boolean) => {
    updateGlobalSearch({ visible });
  };

  return (
    <>
      <SettingItem label={t('theme.general.multilingual.visible')}>
        <ASwitch checked={header.multilingual.visible} onChange={handleMultilingualVisibleChange} />
      </SettingItem>

      <SettingItem label={t('theme.general.globalSearch.visible')}>
        <ASwitch checked={header.globalSearch.visible} onChange={handleGlobalSearchVisibleChange} />
      </SettingItem>
    </>
  );
};

export default GlobalSettings;
