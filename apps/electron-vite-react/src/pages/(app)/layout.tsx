import { Outlet, createFileRoute } from '@tanstack/react-router';

import AppShell from '@/features/app-shell/components/AppShell';

interface AppLayoutProps {}

const AppLayout = (_props: AppLayoutProps) => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export const Route = createFileRoute('/(app)')({
  component: AppLayout
});
