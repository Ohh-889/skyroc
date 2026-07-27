import type { SetupAppVersionNotificationOptions } from '@skyroc/web-admin-runtime';

import { destroyNotification, globalConfig, showNotification } from '@/config';
import { router } from '@/features/router';

import { $t } from '../locales';

const UPDATE_NOTIFICATION_KEY = 'update-notification';

export function createAdminAppVersionNotificationPluginOptions(): SetupAppVersionNotificationOptions {
  return {
    baseUrl: import.meta.env.VITE_BASE_URL || '/',
    currentBuildTime: BUILD_TIME,
    enabled: globalConfig.automaticallyDetectUpdate && import.meta.env.PROD,
    onError(error) {
      // oxlint-disable-next-line no-console
      console.error('Failed to get HTML build time:', error);
    },
    onUpdateAvailable({ markPromptClosed }) {
      const handleCancel = () => {
        destroyNotification(UPDATE_NOTIFICATION_KEY);
        markPromptClosed();
      };

      const handleOk = () => {
        router.navigate({ to: '.' });
      };

      showNotification({
        actions: (
          <div className="w-325px flex justify-end gap-3">
            <AButton key="cancel" onClick={handleCancel}>
              {$t('system.updateCancel')}
            </AButton>
            <AButton key="ok" type="primary" onClick={handleOk}>
              {$t('system.updateConfirm')}
            </AButton>
          </div>
        ),
        description: $t('system.updateContent'),
        key: UPDATE_NOTIFICATION_KEY,
        onClose: markPromptClosed,
        title: $t('system.updateTitle')
      });
    }
  };
}
