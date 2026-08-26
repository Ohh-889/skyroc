'use client';

import { useMemo } from 'react';
import { ConfigContext } from './context';
import type { ComponentConfig, ConfigProviderProps } from './types';

const COMPONENT_KEYS = [
  'accordion',
  'alert',
  'alertDialog',
  'aspectRatio',
  'avatar',
  'badge',
  'breadcrumb',
  'bottomSheet',
  'button',
  'card',
  'carousel',
  'checkbox',
  'collapsible',
  'command',
  'contextMenu',
  'dialog',
  'divider',
  'drawer',
  'dropdownMenu',
  'formField',
  'hoverCard',
  'icon',
  'input',
  'inputOtp',
  'keyboardKey',
  'label',
  'layout',
  'list',
  'numberInput',
  'pagination',
  'popover',
  'password',
  'progress',
  'radio',
  'scrollArea',
  'segment',
  'select',
  'slider',
  'sonner',
  'switch',
  'tabs',
  'tag',
  'textarea',
  'toggle',
  'tooltip',
  'tree'
] satisfies (keyof ComponentConfig)[];

const ConfigProvider = (props: ConfigProviderProps) => {
  const { children, direction = 'ltr', size = 'md', theme = { color: 'default' }, ...rest } = props;

  const componentConfig = useMemo(() => {
    return Object.fromEntries(
      COMPONENT_KEYS.map(key => [
        key,
        {
          color: theme.color,
          dir: direction,
          size,
          ...rest[key]
        }
      ])
    );
  }, [direction, size, rest, theme.color]);

  return (
    <ConfigContext.Provider value={componentConfig}>

      {children}

    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
