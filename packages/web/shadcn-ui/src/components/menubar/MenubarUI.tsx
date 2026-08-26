'use client';

import MenubarCheckboxGroup from './MenubarCheckboxGroup';
import MenubarMenuComposed from './MenubarMenuComposed';
import MenubarOption from './MenubarOption';
import MenubarRadioGroup from './MenubarRadioGroup';
import MenubarRoot from './MenubarRoot';
import type { MenubarOption as MenubarOptionType, MenubarProps } from './types';

const isCheckboxMenu = (item: MenubarOptionType): item is Extract<MenubarOptionType, { type: 'checkbox' }> => {
  return item.type === 'checkbox';
};

const isRadioMenu = (item: MenubarOptionType): item is Extract<MenubarOptionType, { type: 'radio' }> => {
  return item.type === 'radio';
};

const MenubarUI = (props: MenubarProps) => {
  const { classNames, items, size, ...rest } = props;

  return (
    <MenubarRoot {...rest}>
      {items.map((item, index) => {
        const { label } = item;

        // Checkbox menu
        if (isCheckboxMenu(item)) {
          const { checks, children, onChecksChange, type: _type, ...checkboxRest } = item;
          return (
            <MenubarMenuComposed
              classNames={classNames}
              key={String(index)}
              size={size}
              {...checkboxRest}
              trigger={label}
            >
              <MenubarCheckboxGroup
                checks={checks}
                classNames={classNames}
                items={children}
                size={size}
                onChecksChange={onChecksChange}
              />
            </MenubarMenuComposed>
          );
        }

        // Radio menu
        if (isRadioMenu(item)) {
          const { children, onValueChange, type: _type, value, ...radioRest } = item;
          return (
            <MenubarMenuComposed
              classNames={classNames}
              key={String(index)}
              size={size}
              {...radioRest}
              trigger={label}
            >
              <MenubarRadioGroup
                classNames={classNames}
                items={children}
                size={size}
                value={value}
                onValueChange={onValueChange}
              />
            </MenubarMenuComposed>
          );
        }

        // Normal menu (default)
        const { children, type: _type, ...normalRest } = item;
        return (
          <MenubarMenuComposed
            classNames={classNames}
            key={String(index)}
            size={size}
            {...normalRest}
            trigger={label}
          >
            {Boolean(children)
              && children.length > 0
              ? children.map((child, childIndex) => {
                return (
                  <MenubarOption
                    classNames={classNames}
                    item={child}
                    key={String(childIndex)}
                    size={size}
                  />
                );
              })
              : null}
          </MenubarMenuComposed>
        );
      })}
    </MenubarRoot>
  );
};

MenubarUI.displayName = 'MenubarUI';

export default MenubarUI;