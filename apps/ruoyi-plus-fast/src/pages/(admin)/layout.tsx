import { AdminLayout as WebAdminLayout } from '@skyroc/web-admin-layouts';
import { NotificationButton } from '@skyroc/web-admin-notification';
import { DarkModeContainer } from '@skyroc/web-ui-compose';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import SystemLogo from '@/components/SystemLogo';
import UserAvatar from '@/features/auth/components/UserAvatar';
import { guardAdminRoute } from '@/features/router/guard';
import type { AdminRouteGuardOptions, AdminRouteGuardResult } from '@/features/router/guard';

const AdminFooter = () => {
  return (
    <DarkModeContainer className="h-full flex-center">
      <a href="https://github.com/Ohh-889/skyroc-admin/blob/main/LICENSE" rel="noopener noreferrer" target="_blank">
        Copyright MIT © 2021 Skyroc
      </a>
    </DarkModeContainer>
  );
};

const AdminLayout = () => {
  const { t } = useTranslation();

  return (
    <WebAdminLayout
      footer={<AdminFooter />}
      headerMiddleActions={<NotificationButton className="px-12px" />}
      headerRightActions={<UserAvatar />}
      logo={<SystemLogo className="text-32px text-primary" />}
      logoTitle={t('system.title')}
    />
  );
};

function beforeLoadAdminRoute(options: AdminRouteGuardOptions): AdminRouteGuardResult {
  return guardAdminRoute(options);
}

export const Route = createFileRoute('/(admin)')({
  component: AdminLayout,
  beforeLoad: beforeLoadAdminRoute as any
});
