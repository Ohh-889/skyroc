'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Group as _Group } from '@radix-ui/react-menu';
import { cn } from '@skyroc/utils';
import _MenuCheckboxItem from './MenuCheckboxItem';
import MenuLabel from './MenuLabel';
import MenuSeparator from './MenuSeparator';
import { isLabel, isSeparator } from './shared';
import type { MenuCheckboxGroupProps } from './types';

const MenuCheckboxGroup = forwardRef<ComponentRef<typeof _Group>, MenuCheckboxGroupProps>((props, ref) => {
  const {
    checks,
    className,
    classNames,
    component: MenuCheckboxItem = _MenuCheckboxItem,
    groupComponent: Group = _Group,
    items,
    labelComponent: Label = MenuLabel,
    onChecksChange,
    separatorComponent: Separator = MenuSeparator,
    size,
    ...rest
  } = props;

  return (
    <Group
      className={cn(className || classNames?.group)}
      ref={ref}
      {...rest}
    >
      {items.map((item, index) => {
        if (isLabel(item)) {
          return (
            <Label
              classNames={classNames}
              key={String(index)}
              size={size}
              {...item}
            >
              {item.label}
            </Label>
          );
        }

        if (isSeparator(item)) {
          return (
            <Separator
              className={classNames?.separator}
              key={String(index)}
              size={size}
            />
          );
        }

        return (
          <MenuCheckboxItem
            key={String(index)}
            {...item}
            checked={item.checked || checks?.includes(item?.value || '')}
            classNames={classNames}
            size={size}
            onCheckedChange={(checked) => {
              item.onCheckedChange?.(checked);

              if (checked) {
                onChecksChange?.([...(checks || []), item?.value || '']);
              }
              else {
                onChecksChange?.([...(checks || []).filter(check => check !== item?.value)]);
              }
            }}
          >
            {item.label}
          </MenuCheckboxItem>
        );
      })}
    </Group>
  );
});

MenuCheckboxGroup.displayName = 'MenuCheckboxGroup';

export default MenuCheckboxGroup;
