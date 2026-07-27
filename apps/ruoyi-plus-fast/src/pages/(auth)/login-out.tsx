import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

const LoginOut = () => {
  return null;
};

const LoginSearchSchema = z.object({
  redirect: z.string().startsWith('/').optional()
});

export const Route = createFileRoute('/(auth)/login-out')({
  component: LoginOut,
  validateSearch: LoginSearchSchema,
  staticData: {
    title: 'login-out',
    i18nKey: 'route.login-out'
  },
  beforeLoad: ({ context, search }) => {
    const redirectPath = search.redirect;

    context.clearAuth();

    throw redirect({ to: '/login', search: redirectPath ? { redirect: redirectPath } : undefined });
  }
});
