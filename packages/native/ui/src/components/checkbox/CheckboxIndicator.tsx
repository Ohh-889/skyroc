import Feather from '@expo/vector-icons/Feather';
import type { ThemeColor } from '@skyroc/ui-types';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';
import { checkboxVariants } from './checkbox-variants';
import type { CheckboxSizes } from './checkbox-variants';
import type { CheckboxShape } from './types';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让勾选色跟随主题 token */
const StateIcon = withUniwind(Feather);

interface CheckboxIndicatorProps {
  /** 是否选中 */
  checked: boolean;

  /** 选中态自定义图标，提供后替换控件内的默认勾 */
  checkedIcon?: ReactNode;

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
  const { checked, checkedIcon, color, indeterminate, indeterminateIcon, shape, sizes } = props;

  const active = checked || indeterminate;

  const { control: controlCls, indicator: indicatorCls } = checkboxVariants({ active, color, shape });

  function renderInner() {
    if (!active) return null;

    if (indeterminate && indeterminateIcon) return indeterminateIcon;

    if (checked && checkedIcon) return checkedIcon;

    return (
      <StateIcon
        colorClassName={indicatorCls()}
        name={indeterminate ? 'minus' : 'check'}
        size={sizes.innerIcon}
      />
    );
  }

  return (
    <View
      className={controlCls()}
      style={{ height: sizes.control, width: sizes.control }}
    >
      {renderInner()}
    </View>
  );
};

export { CheckboxIndicator };
