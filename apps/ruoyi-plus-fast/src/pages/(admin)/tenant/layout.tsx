import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/tenant')({
  component: Outlet,
  staticData: {
    menu: {
      icon: 'ph:city',
      order: 12
    },
    title: '租户管理'
  }
});
