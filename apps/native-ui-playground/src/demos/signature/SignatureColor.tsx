import type { SignatureVariantProps } from '@skyroc/native-ui';
import { Signature, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const COLORS: NonNullable<SignatureVariantProps['color']>[] = [
  'carbon',
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'destructive',
  'info'
];

/** SignatureColor 组件属性 */
interface SignatureColorProps {
  /** 书写状态变化：外层是滚动容器时据此临时锁掉滚动，单独使用可以不传 */
  onSigningChange?: (signing: boolean) => void;
}

const SignatureColor = (props: SignatureColorProps) => {
  const { onSigningChange } = props;

  return (
    <View className="gap-4 bg-background p-4">
      {COLORS.map(color => (
        <View
          key={color}
          className="gap-2"
        >
          <Text className="text-sm font-medium text-foreground">color={color}</Text>
          <Signature
            classNames={{ canvas: 'h-24' }}
            color={color}
            showFooter={false}
            size="sm"
            tips={`${color} 笔色`}
            onEnd={() => onSigningChange?.(false)}
            onStart={() => onSigningChange?.(true)}
          />
        </View>
      ))}
    </View>
  );
};

export { SignatureColor };
