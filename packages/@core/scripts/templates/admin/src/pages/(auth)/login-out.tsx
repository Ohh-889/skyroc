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
  beforeLoad: async ({ context, search }) => {
    const redirectPath = search.redirect;

    // 等它走完再跳，否则跳到 /login 时本地令牌可能还没清掉
    await context.logout();

    throw redirect({ to: '/login', search: redirectPath ? { redirect: redirectPath } : undefined });
  }
});
