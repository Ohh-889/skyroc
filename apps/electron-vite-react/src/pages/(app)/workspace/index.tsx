import { createFileRoute } from '@tanstack/react-router';

import WorkspacePage from '@/features/workspace/components/WorkspacePage';

export const Route = createFileRoute('/(app)/workspace/')({
  component: WorkspacePage
});
