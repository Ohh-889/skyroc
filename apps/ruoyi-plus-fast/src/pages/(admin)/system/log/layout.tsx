import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/system/log')({
  component: Outlet,
  staticData: {
    menu: {
      icon: 'ph:notebook',
      order: 6
    },
    title: '日志管理'
  }
});
