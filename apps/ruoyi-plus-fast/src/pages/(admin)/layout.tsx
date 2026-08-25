import { AdminLayout as WebAdminLayout } from '@shell/layouts';
import { NotificationButton } from '@shell/notification';
import { DarkModeContainer } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import SystemLogo from '@/components/SystemLogo';
import UserAvatar from '@/features/auth/components/UserAvatar';
import { guardAdminRoute } from '@/features/router/guard';

const AdminFooter = () => {
  return (
    <DarkModeContainer className="h-full flex-center">
      <a
        href="https://github.com/Ohh-889/skyroc-admin/blob/main/LICENSE"
        rel="noopener noreferrer"
        target="_blank"
      >
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

export const Route = createFileRoute('/(admin)')({
  component: AdminLayout,
  beforeLoad: async options => {
    await guardAdminRoute(options);
  }
});
