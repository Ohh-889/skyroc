import Feather from '@expo/vector-icons/Feather';
import type { ThemeColor } from '@skyroc/tailwind-plugin/ui';
import { cn } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';
import type { SlotClassNames } from '../../types';
import { radioVariants } from './radio-variants';
import type { RadioSizes } from './radio-variants';
import type { RadioIndicatorSlots, RadioShape } from './types';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让勾选色跟随主题 token */
const CheckIcon = withUniwind(Feather);

interface RadioIndicatorProps {
  /** 是否选中 */
  checked: boolean;

  /** 选中态自定义图标，提供后完全替换默认的勾/圆点 */
  checkedIcon?: ReactNode;

  /** 覆盖指示器各 slot 的类名，直接接收 Radio / RadioCard 的 classNames，多余的键会被忽略 */
  classNames?: SlotClassNames<RadioIndicatorSlots>;

  /** 主题色 */
  color: ThemeColor;

  /** 指示器形状 */
  shape: RadioShape;

  /** 已解析的像素尺寸 */
  sizes: RadioSizes;
}

/** Radio 与 RadioCard 共用的指示器，保证两者选中态渲染与 checkedIcon 行为完全一致 */
const RadioIndicator = (props: RadioIndicatorProps) => {
  const { checked, checkedIcon, classNames, color, shape, sizes } = props;

  const variantSlots = radioVariants({
    active: checked,
    color,
    shape
  });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落类名计算 */
  function resolveSlotClassNames() {
    // tv 的 control / indicator 对应对外的 indicator / indicatorIcon 两个 slot
    return {
      control: cn(variantSlots.control(), classNames?.indicator),
      dot: cn(variantSlots.dot(), classNames?.dot),
      indicator: cn(variantSlots.indicator(), classNames?.indicatorIcon)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function renderInner() {
    if (!checked) return null;

    if (checkedIcon) return checkedIcon;

    if (shape === 'square') {
      return (
        <CheckIcon
          colorClassName={slotClassNames.indicator}
          name="check"
          size={sizes.innerIcon}
        />
      );
    }

    return (
      <View
        className={slotClassNames.dot}
        style={{ height: sizes.dot, width: sizes.dot }}
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

export { RadioIndicator };
