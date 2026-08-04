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

    // 这里是所有登出的唯一出口：点退出登录、以及后端回登出码时 adapter 的 redirectToLogin
    // 都走到这条路由。等它走完再跳，否则跳到 /login 时令牌可能还没清掉。
    await context.logout();

    throw redirect({ to: '/login', search: redirectPath ? { redirect: redirectPath } : undefined });
  }
});
