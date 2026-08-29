import { createFileRoute } from '@tanstack/react-router';

import SettingsPage from '@/features/settings/components/SettingsPage';

export const Route = createFileRoute('/(app)/settings/')({
  component: SettingsPage
});
