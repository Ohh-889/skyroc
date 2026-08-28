import { createFileRoute } from '@tanstack/react-router';

import LoginPage from '@/features/auth/components/LoginPage';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage
});
