import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/system')({
  component: Outlet,
  staticData: {
    menu: {
      icon: 'ph:users-four',
      order: 10
    },
    title: '组织与用户'
  }
});
