import { View } from 'react-native';
import { Text } from '../text/Typography';
import type { FieldExtraProps } from './types';

/**
 * 字段提示区（内部组件）
 *
 * 错误文案与描述文本共用一块区域：错误在上、描述在下，两者都为空时整块不渲染。 与 FieldLabel 一样只提供结构，样式由调用方以类名传入。
 */
const FieldExtra = (props: FieldExtraProps) => {
  const { className, description, descriptionClassName, message, messageClassName } = props;

  if (!message && !description) return null;

  return (
    <View className={className}>
      {message ? <Text className={messageClassName}>{message}</Text> : null}
      {description ? <Text className={descriptionClassName}>{description}</Text> : null}
    </View>
  );
};

export { FieldExtra };
