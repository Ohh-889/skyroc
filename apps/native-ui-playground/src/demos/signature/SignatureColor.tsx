import type { SignatureVariantProps } from '@skyroc/native-ui';
import { Button, Signature, Text } from '@skyroc/native-ui';
import { useState } from 'react';
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

/**
 * 八种语义色共用一块画布，靠上方按钮切换。
 *
 * 不是为了省地方：每块 Signature 在 web 上都要独占一个 WebGL 上下文（Skia 的画布是 GPU 表面），
 * 而浏览器每页只给 16 个，超出后最早创建的那几块会被静默回收 —— 表现为画布还在、笔却画不上去。
 * 八个语义色摊成八块画布，光这一节就吃掉半个额度，文档站整页必然溢出。
 */
const SignatureColor = (props: SignatureColorProps) => {
  const { onSigningChange } = props;

  const [color, setColor] = useState<NonNullable<SignatureVariantProps['color']>>('carbon');

  return (
    <View className="gap-4 bg-background p-4">
      <View className="flex-row flex-wrap gap-2">
        {COLORS.map(item => (
          <Button
            key={item}
            color="primary"
            size="sm"
            variant={item === color ? 'solid' : 'outline'}
            onPress={() => setColor(item)}
          >
            {item}
          </Button>
        ))}
      </View>

      <Text className="text-sm font-medium text-foreground">color={color}</Text>

      {/* 笔色是整块画布一支笔，切换颜色时已经写下的笔迹会一起换色，正好用来对比 */}
      <Signature
        color={color}
        showFooter={false}
        tips={`${color} 笔色`}
        onEnd={() => onSigningChange?.(false)}
        onStart={() => onSigningChange?.(true)}
      />
    </View>
  );
};

export { SignatureColor };
