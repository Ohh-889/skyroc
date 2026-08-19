import { FloatingButton, Portal, Text } from '@skyroc/native-ui';
import type { FloatingButtonOffset } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FloatingButtonMagnetic = () => {
  const [magneticOffset, setMagneticOffset] = useState<FloatingButtonOffset | null>(null);

  function handleMagneticChange(offset: FloatingButtonOffset) {
    setMagneticOffset(offset);
  }

  return (
    <View className="bg-background px-4">
      <Text className="mb-2 text-sm text-muted-foreground">
        橙色按钮 magnetic=&quot;x&quot;，松手后自动吸到左右最近的一侧，走临界阻尼的弹簧：有减速手感但不会冲出 gap
        边界再退回来。onOffsetChange 拿到的是吸附的目标坐标，此刻落位动画才刚开始，不是动画结束的回调。
      </Text>
      <Text className="mb-6 text-sm text-muted-foreground">
        最近一次落位：
        {magneticOffset ? ` x=${Math.round(magneticOffset.x)}, y=${Math.round(magneticOffset.y)}` : ' —'}
      </Text>

      {/* 边界按窗口尺寸算，渲染却是相对父容器的 absolute：套一层铺满屏幕的 PortalHost，位置才对得上 */}
      <Portal>
        <FloatingButton
          axis="xy"
          className="bg-warning"
          magnetic="x"
          onOffsetChange={handleMagneticChange}
        >
          <Text className="text-xs font-bold text-warning-foreground">MG</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonMagnetic };
