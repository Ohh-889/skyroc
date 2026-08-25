/* eslint-disable react-hooks/exhaustive-deps */
import { useSettingsTheme } from '@shell/theme';
import { useEffect } from 'react';

import { LAYOUT_MODE_VERTICAL } from '../constant';
import { getAdminLayoutsOptions } from '../setup';
import AdminTabEffect from './AdminTabEffect';
import { useAdminState } from './use-admin-state';

const AdminEffect = () => {
  const { isMobile, mixSiderFixed, setSiderCollapse, siderCollapse } = useAdminState();

  const { layout, setThemeLayout } = useSettingsTheme();
  const { storage } = getAdminLayoutsOptions();

  useEffect(() => {
    if (isMobile) {
      // backup theme setting before is mobile
      storage.set('backupThemeSettingBeforeIsMobile', {
        layout: layout.mode,
        siderCollapse
      });

      setThemeLayout(LAYOUT_MODE_VERTICAL);

      setSiderCollapse(true);
    } else {
      // when is not mobile, recover the backup theme setting
      const backup = storage.get('backupThemeSettingBeforeIsMobile');

      if (backup) {
        setThemeLayout(backup.layout);

        setSiderCollapse(backup.siderCollapse);

        storage.remove('backupThemeSettingBeforeIsMobile');
      }
    }
  }, [isMobile]);

  useEffect(() => {
    function handleBeforeUnload() {
      storage.set('mixSiderFixed', mixSiderFixed ? 'Y' : 'N');
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [mixSiderFixed]);

  return <AdminTabEffect />;
};

export default AdminEffect;
