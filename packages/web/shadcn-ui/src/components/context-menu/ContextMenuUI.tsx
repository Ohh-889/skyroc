'use client';

import { Root, Trigger } from '@radix-ui/react-context-menu';
import ContextMenuCheckboxGroup from './ContextMenuCheckboxGroup';
import ContextMenuContent from './ContextMenuContent';
import ContextMenuOption from './ContextMenuOption';
import ContextMenuRadioGroup from './ContextMenuRadioGroup';
import type { ContextMenuOption as ContextMenuOptionType, ContextMenuProps } from './types';

const isCheckboxMenu = (item: ContextMenuOptionType): item is Extract<ContextMenuOptionType, { type: 'checkbox' }> => {
  return item.type === 'checkbox';
};

const isRadioMenu = (item: ContextMenuOptionType): item is Extract<ContextMenuOptionType, { type: 'radio' }> => {
  return item.type === 'radio';
};

const ContextMenuUI = (props: ContextMenuProps) => {
  const { children, classNames, contentProps, dir, items, modal, onOpenChange, size } = props;

  return (
    <Root
      dir={dir}
      modal={modal}
      onOpenChange={onOpenChange}
    >
      <Trigger asChild>{children}</Trigger>

      <ContextMenuContent {...contentProps}>
        {items.map((item, index) => {
          // Checkbox menu
          if (isCheckboxMenu(item)) {
            const { checks, children: checkboxItems, onChecksChange, type: _type, ...checkboxRest } = item;
            return (
              <ContextMenuCheckboxGroup
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
              <ContextMenuRadioGroup
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
            <ContextMenuOption
              classNames={classNames}
              item={item}
              key={String(index)}
              size={size}
            />
          );
        })}
      </ContextMenuContent>
    </Root>
  );
};

ContextMenuUI.displayName = 'ContextMenuUI';

export default ContextMenuUI;