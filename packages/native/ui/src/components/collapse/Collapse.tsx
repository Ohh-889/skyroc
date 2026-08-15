import { useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { CollapseContext } from './CollapseContext';
import { collapseVariants } from './collapse-variants';
import type { CollapseItemName, CollapseItemRegistration, CollapseProps, CollapseToggleAllOptions } from './types';

const Collapse = (props: CollapseProps) => {
  const {
    accordion = false,
    border = true,
    children,
    className,
    defaultValue,
    onChange,
    ref,
    value: valueProp,
  } = props;

  const defaultVal = defaultValue ?? (accordion ? '' : []);

  const [value, setValue] = useControllableState<CollapseItemName | CollapseItemName[]>({
    caller: 'Collapse',
    defaultProp: defaultVal,
    onChange,
    prop: valueProp,
  });

  const itemsRef = useRef<CollapseItemRegistration[]>([]);

  function isExpanded(name: CollapseItemName): boolean {
    if (accordion) {
      return value === name;
    }
    return Array.isArray(value) && value.includes(name);
  }

  function toggle(name: CollapseItemName, expanded: boolean) {
    if (accordion) {
      setValue(expanded ? name : '');
    } else {
      const current = Array.isArray(value) ? value : [];
      if (expanded) {
        setValue([...current, name]);
      } else {
        setValue(current.filter(n => n !== name));
      }
    }
  }

  function register(item: CollapseItemRegistration) {
    itemsRef.current.push(item);
    return () => {
      itemsRef.current = itemsRef.current.filter(i => i.name !== item.name);
    };
  }

  useImperativeHandle(ref, () => ({
    toggleAll: (options: CollapseToggleAllOptions | boolean = {}) => {
      if (accordion) return;

      const opts = typeof options === 'boolean' ? { expanded: options } : options;
      const { expanded, skipDisabled } = opts;

      const names = itemsRef.current
        .filter(item => {
          if (item.disabled && skipDisabled) {
            return item.expanded;
          }
          return expanded ?? !item.expanded;
        })
        .map(item => item.name);

      setValue(names);
    },
  }));

  const slots = collapseVariants({ border });

  return (
    <CollapseContext.Provider value={{ isExpanded, register, toggle }}>
      <View className={cn(slots.root(), className)}>{children}</View>
    </CollapseContext.Provider>
  );
};

export { Collapse };
