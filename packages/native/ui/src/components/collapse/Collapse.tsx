import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { Children, isValidElement, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { collapseVariants } from './collapse-variants';
import { CollapseContext, CollapseIndexContext } from './CollapseContext';
import type {
  CollapseItemName,
  CollapseItemRegistration,
  CollapseProps,
  CollapseToggleAllOptions,
  CollapseValue
} from './types';

/** 非手风琴模式的空值，提到组件外，避免每次渲染都新建数组 */
const EMPTY_NAMES: CollapseItemName[] = [];

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

  const [value, setValue] = useControllableState<CollapseValue>({
    caller: 'Collapse',
    defaultProp: defaultValue ?? (accordion ? null : EMPTY_NAMES),
    onChange,
    prop: valueProp
  });

  /** 已挂载的面板，按子元素顺序排列，只服务于 toggleAll */
  const itemsRef = useRef<CollapseItemRegistration[]>([]);

  const variantSlots = collapseVariants({ border });

  function isExpanded(name: CollapseItemName): boolean {
    if (accordion) {
      return value === name;
    }
    return Array.isArray(value) && value.includes(name);
  }

  function toggle(name: CollapseItemName, expanded: boolean) {
    if (accordion) {
      setValue(expanded ? name : null);
      return;
    }

    const current = Array.isArray(value) ? value : EMPTY_NAMES;

    // 去重：通过 ref 调用 toggle(true) 时面板可能已经是展开态
    if (current.includes(name) === expanded) return;

    setValue(expanded ? [...current, name] : current.filter(itemName => itemName !== name));
  }

  function register(item: CollapseItemRegistration) {
    itemsRef.current.push(item);
    return () => {
      itemsRef.current = itemsRef.current.filter(registered => registered !== item);
    };
  }

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn(variantSlots.root(), className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 逐个下发面板序号，作为未显式传 name 时的默认标识，同时让首项之外画出顶部分隔线 */
  function renderChildren() {
    return Children.map(children, (child, index) =>
      isValidElement(child) ? (
        <CollapseIndexContext.Provider value={index}>{child}</CollapseIndexContext.Provider>
      ) : (
        child
      )
    );
  }

  useImperativeHandle(ref, () => ({
    toggleAll: (options: CollapseToggleAllOptions | boolean = {}) => {
      if (accordion) return;

      const opts = typeof options === 'boolean' ? { expanded: options } : options;
      const { expanded, skipDisabled } = opts;

      const names = itemsRef.current
        .filter(item => {
          const itemExpanded = isExpanded(item.name);

          // 跳过禁用面板时保留其当前状态，不参与批量切换
          if (item.disabled && skipDisabled) {
            return itemExpanded;
          }
          return expanded ?? !itemExpanded;
        })
        .map(item => item.name);

      setValue(names);
    }
  }));

  return (
    <CollapseContext value={{ isExpanded, register, toggle }}>
      <View className={slotClassNames.root}>{renderChildren()}</View>
    </CollapseContext>
  );
};

export { Collapse };
