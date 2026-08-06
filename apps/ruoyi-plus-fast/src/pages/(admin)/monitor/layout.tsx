import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/monitor')({
  component: Outlet,
  staticData: {
    menu: {
      icon: 'ph:gauge',
      order: 11
    },
    title: '系统监控'
  }
});
