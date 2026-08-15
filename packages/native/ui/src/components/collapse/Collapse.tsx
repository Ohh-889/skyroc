import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { collapseVariants } from './collapse-variants';
import { CollapseContext } from './CollapseContext';
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
    value: valueProp
  } = props;

  const defaultVal = defaultValue ?? (accordion ? '' : []);

  const [value, setValue] = useControllableState<CollapseItemName | CollapseItemName[]>({
    caller: 'Collapse',
    defaultProp: defaultVal,
    onChange,
    prop: valueProp
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
    }
  }));

  const variantSlots = collapseVariants({ border });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn(variantSlots.root(), className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  return (
    <CollapseContext.Provider value={{ isExpanded, register, toggle }}>
      <View className={slotClassNames.root}>{children}</View>
    </CollapseContext.Provider>
  );
};

export { Collapse };
