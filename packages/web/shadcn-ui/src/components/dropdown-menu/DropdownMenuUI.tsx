'use client';

import { Root, Trigger } from '@radix-ui/react-dropdown-menu';
import DropdownMenuCheckboxGroup from './DropdownMenuCheckboxGroup';
import DropdownMenuContent from './DropdownMenuContent';
import DropdownMenuOption from './DropdownMenuOption';
import DropdownMenuRadioGroup from './DropdownMenuRadioGroup';
import type { DropdownMenuOption as DropdownMenuOptionType, DropdownMenuProps } from './types';

const isCheckboxMenu = (item: DropdownMenuOptionType | any): item is Extract<DropdownMenuOptionType, { type: 'checkbox' }> => {
  return item.type === 'checkbox';
};

const isRadioMenu = (item: DropdownMenuOptionType | any): item is Extract<DropdownMenuOptionType, { type: 'radio' }> => {
  return item.type === 'radio';
};

const DropdownMenuUI = (props: DropdownMenuProps) => {
  const { children, className, classNames, contentProps, defaultOpen, dir, items, modal, onOpenChange, open, size } = props;

  return (
    <Root
      defaultOpen={defaultOpen}
      dir={dir}
      modal={modal}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Trigger asChild>{children}</Trigger>

      <DropdownMenuContent
        arrowClass={classNames?.arrow}
        className={className || classNames?.content}
        size={size}
        {...contentProps}
      >
        {items.map((item, index) => {
          // Checkbox menu
          if (isCheckboxMenu(item)) {
            const { checks, children: checkboxItems, onChecksChange, type: _type, ...checkboxRest } = item;
            return (
              <DropdownMenuCheckboxGroup
                checks={checks}
                classNames={classNames}
                items={checkboxItems}
                key={String(index)}
                size={size}
                onChecksChange={onChecksChange}
                {...checkboxRest}
              />
            );
          }

          // Radio menu
          if (isRadioMenu(item)) {
            const { children: radioItems, onValueChange, type: _type, value, ...radioRest } = item;
            return (
              <DropdownMenuRadioGroup
                classNames={classNames}
                items={radioItems}
                key={String(index)}
                size={size}
                value={value}
                onValueChange={onValueChange}
                {...radioRest}
              />
            );
          }

          // Normal menu item
          return (
            <DropdownMenuOption
              classNames={classNames}
              item={item}
              key={String(index)}
              size={size}
            />
          );
        })}
      </DropdownMenuContent>
    </Root>
  );
};

DropdownMenuUI.displayName = 'DropdownMenuUI';

export default DropdownMenuUI;