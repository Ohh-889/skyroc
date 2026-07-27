import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.isLoggedIn) {
      throw redirect({ to: context.getHomeRoute() });
    }

    throw redirect({ to: '/login' });
  },
  staticData: {
    title: 'SkyrocAdmin'
  }
});
