'use client';

import { NavigationMenu } from '@skyroc/web-ui';
import {
  BookOpen,
  Box,
  CircleHelp,
  CloudDownload,
  Code2,
  Database,
  FileText,
  House,
  Palette,
  Smile,
  SwatchBook
} from 'lucide-react';
import Link from 'next/link';

const menus = [
  {
    value: 'guide',
    label: 'Guide',
    leading: <BookOpen className="h-4 w-4" />,
    children: [
      {
        value: 'introduction',
        label: 'Introduction',
        href: 'https://nextjs.org/docs',
        target: '_blank',
        rel: 'noopener noreferrer',
        description: 'Fully styled and customizable components for Next.',
        leading: <House />
      },
      {
        value: 'installation',
        label: 'Installation',
        description: 'Learn how to install and configure Nuxt UI in your application.',
        leading: <CloudDownload />
      },
      {
        value: 'icons',
        label: 'Icons',
        leading: <Smile />,
        description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
      },
      {
        value: 'colors',
        label: 'Colors',
        leading: <Palette />,
        description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
      },
      {
        value: 'theme',
        label: 'Theme',
        leading: <SwatchBook />,
        description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
      }
    ]
  },
  {
    value: 'composables',
    label: 'Composables',
    leading: <Database className="h-4 w-4" />,
    children: [
      {
        value: 'defineShortcuts',
        label: 'defineShortcuts',
        leading: <FileText />,
        description: 'Define shortcuts for your application.'
      },
      {
        value: 'useModal',
        label: 'useModal',
        leading: <FileText />,
        description: 'Display a modal within your application.'
      },
      {
        value: 'useSlideover',
        label: 'useSlideover',
        leading: <FileText />,
        description: 'Display a slideover within your application.'
      },
      {
        value: 'useToast',
        label: 'useToast',
        leading: <FileText />,
        description: 'Display a toast within your application.'
      }
    ]
  },
  {
    value: 'components',
    label: 'Components',
    leading: <Box className="h-4 w-4" />,
    children: [
      {
        value: 'icon',
        label: 'Icon',
        component: Link,
        href: '/icon',
        leading: <FileText />,
        description: 'Use NuxtLink with superpowers.'
      },
      {
        value: 'modal',
        label: 'Modal',
        component: Link,
        href: '/dialog',
        leading: <FileText />,
        description: 'Display a modal within your application.'
      },
      {
        value: 'navigation-menu',
        label: 'NavigationMenu',
        component: Link,
        href: '/navigation-menu',
        leading: <FileText />,
        description: 'Display a list of links.'
      },
      {
        value: 'pagination',
        label: 'Pagination',
        component: Link,
        href: '/pagination',
        leading: <FileText />,
        description: 'Display a list of pages.'
      },
      {
        value: 'popover',
        label: 'Popover',
        component: Link,
        href: '/popover',
        leading: <FileText />,
        description: 'Display a non-modal dialog that floats around a trigger element.'
      },
      {
        value: 'progress',
        label: 'Progress',
        component: Link,
        href: '/progress',
        leading: <FileText />,
        description: 'Show a horizontal bar to indicate task progression.'
      }
    ]
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Ohh-889/skyroc-ui',
    value: 'github',
    target: '_blank',
    rel: 'noopener noreferrer',
    leading: <Code2 className="h-4 w-4" />
  },
  {
    label: 'Help',
    value: 'help',
    href: 'https://github.com/Ohh-889/skyroc-ui/issues',
    target: '_blank',
    rel: 'noopener noreferrer',
    leading: <CircleHelp className="h-4 w-4" />,
    disabled: true
  }
];

const NavigationBasic = () => {
  return (
    <NavigationMenu
      classNames={{ subLink: 'w-80' }}
      items={menus}
    />
  );
};

export default NavigationBasic;
