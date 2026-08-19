import { Button, FloatingButton, Portal, Text } from '@skyroc/native-ui';
import type { FloatingButtonMagnetic as FloatingButtonMagneticValue, FloatingButtonOffset } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FloatingButtonMagnetic = () => {
  const [magnetic, setMagnetic] = useState<FloatingButtonMagneticValue>('x');
  const [magneticOffset, setMagneticOffset] = useState<FloatingButtonOffset | null>(null);

  function handleMagneticChange(offset: FloatingButtonOffset) {
    setMagneticOffset(offset);
  }

  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row gap-2">
        <Button
          size="sm"
          variant={magnetic === 'x' ? 'solid' : 'outline'}
          onPress={() => setMagnetic('x')}
        >
          吸附左右
        </Button>
        <Button
          size="sm"
          variant={magnetic === 'y' ? 'solid' : 'outline'}
          onPress={() => setMagnetic('y')}
        >
          吸附上下
        </Button>
      </View>
      <Text className="text-sm text-muted-foreground">
        最近一次落位：
        {magneticOffset ? ` x=${Math.round(magneticOffset.x)}, y=${Math.round(magneticOffset.y)}` : ' —'}
      </Text>

      {/* 边界按窗口尺寸算，渲染却是相对父容器的 absolute：套一层铺满屏幕的 PortalHost，位置才对得上 */}
      <Portal>
        <FloatingButton
          key={magnetic}
          axis="xy"
          className="bg-warning"
          magnetic={magnetic}
          onOffsetChange={handleMagneticChange}
        >
          <Text className="text-xs font-bold uppercase text-warning-foreground">{magnetic}</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonMagnetic };
