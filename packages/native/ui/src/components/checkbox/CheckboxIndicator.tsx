import Feather from '@expo/vector-icons/Feather';
import type { ThemeColor } from '@skyroc/ui-types';
import { cn } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';
import type { SlotClassNames } from '../../types';
import { checkboxVariants } from './checkbox-variants';
import type { CheckboxSizes } from './checkbox-variants';
import type { CheckboxIndicatorSlots, CheckboxShape } from './types';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让勾选色跟随主题 token */
const StateIcon = withUniwind(Feather);

interface CheckboxIndicatorProps {
  /** 是否选中 */
  checked: boolean;

  /** 选中态自定义图标，提供后替换控件内的默认勾 */
  checkedIcon?: ReactNode;

  /** 覆盖指示器各 slot 的类名，直接接收 Checkbox / CheckboxCard 的 classNames，多余的键会被忽略 */
  classNames?: SlotClassNames<CheckboxIndicatorSlots>;

  /** 主题色 */
  color: ThemeColor;

  /** 是否半选，优先级高于选中 */
  indeterminate: boolean;

  /** 半选态自定义图标，提供后替换控件内的默认横线 */
  indeterminateIcon?: ReactNode;

  /** 指示器形状 */
  shape: CheckboxShape;

  /** 已解析的像素尺寸 */
  sizes: CheckboxSizes;
}

/** Checkbox 与 CheckboxCard 共用的指示器，保证两者选中态渲染与自定义图标行为完全一致 */
const CheckboxIndicator = (props: CheckboxIndicatorProps) => {
  const { checked, checkedIcon, classNames, color, indeterminate, indeterminateIcon, shape, sizes } = props;

  const active = checked || indeterminate;

  const variantSlots = checkboxVariants({ active, color, shape });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落类名计算 */
  function resolveSlotClassNames() {
    // tv 的 control / indicator 对应对外的 indicator / indicatorIcon 两个 slot
    return {
      control: cn(variantSlots.control(), classNames?.indicator),
      indicator: cn(variantSlots.indicator(), classNames?.indicatorIcon)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function renderInner() {
    if (!active) return null;

    if (indeterminate && indeterminateIcon) return indeterminateIcon;

    if (checked && checkedIcon) return checkedIcon;

    return (
      <StateIcon
        colorClassName={slotClassNames.indicator}
        name={indeterminate ? 'minus' : 'check'}
        size={sizes.innerIcon}
      />
    );
  }

  return (
    <View
      className={slotClassNames.control}
      style={{ height: sizes.control, width: sizes.control }}
    >
      {renderInner()}
    </View>
  );
};

export { CheckboxIndicator };
