import { Button, FloatingButton, Portal, Text } from '@skyroc/native-ui';
import type { FloatingButtonAxis as FloatingButtonAxisValue } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const AXIS_OPTIONS: { label: string; value: FloatingButtonAxisValue }[] = [
  { label: '横向', value: 'x' },
  { label: '纵向', value: 'y' },
  { label: '自由', value: 'xy' },
  { label: '锁定', value: 'lock' }
];

const FloatingButtonAxis = () => {
  const [axis, setAxis] = useState<FloatingButtonAxisValue>('xy');

  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row flex-wrap gap-2">
        {AXIS_OPTIONS.map(option => (
          <Button
            key={option.value}
            size="sm"
            variant={axis === option.value ? 'solid' : 'outline'}
            onPress={() => setAxis(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </View>
      <Text className="text-sm text-muted-foreground">当前 axis=&quot;{axis}&quot;</Text>

      {/* 边界按窗口尺寸算，渲染却是相对父容器的 absolute：套一层铺满屏幕的 PortalHost，位置才对得上 */}
      <Portal>
        <FloatingButton
          axis={axis}
          className="bg-success"
        >
          <Text className="text-xs font-bold uppercase text-success-foreground">{axis}</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonAxis };
