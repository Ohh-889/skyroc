import { cn } from '@skyroc/utils';
import { View } from 'react-native';
import { Text } from '../text/Typography';
import type { FieldLabelProps } from './types';

/**
 * 字段标签行（内部组件）
 *
 * 只负责「必填星号 + 标签文本」这一段结构，样式全部由调用方以类名传入， 因此 FieldItem 的纵向布局与 FormItem 的 Cell 布局能共用同一份 DOM 结构。
 *
 * 星号无论必填与否都占位，只在必填时可见：星号只在必填行渲染的话， 同一组表单里带星号的行标签会整体右移，一列标签的左边缘对不齐。
 */
const FieldLabel = (props: FieldLabelProps) => {
  const { className, label, labelClassName, required = false, requiredClassName, width } = props;

  if (!label) return null;

  return (
    <View
      className={className}
      style={width ? { width } : undefined}
    >
      <Text
        accessibilityElementsHidden={!required}
        className={cn(requiredClassName, !required && 'opacity-0')}
        importantForAccessibility={required ? 'auto' : 'no-hide-descendants'}
      >
        *
      </Text>
      <Text className={labelClassName}>{label}</Text>
    </View>
  );
};

export { FieldLabel };
