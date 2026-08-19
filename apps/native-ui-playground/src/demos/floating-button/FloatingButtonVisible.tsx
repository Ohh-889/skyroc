import { Button, FloatingButton, Portal, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FloatingButtonVisible = () => {
  const [visible, setVisible] = useState(true);

  return (
    <View className="bg-background px-4">
      <View className="mb-6 gap-3">
        <Text className="text-sm text-muted-foreground">
          红色按钮进出都是 180ms 的缩放缓动，两个方向都不用弹簧，不会有回弹。 另外挂载时不会先闪一下再收回去，scale
          的初值直接取自当前可见性。
        </Text>
        <Button
          color="primary"
          variant="solid"
          onPress={() => setVisible(prev => !prev)}
        >
          {visible ? '隐藏红色按钮' : '显示红色按钮'}
        </Button>
      </View>

      {/* 边界按窗口尺寸算，渲染却是相对父容器的 absolute：套一层铺满屏幕的 PortalHost，位置才对得上 */}
      <Portal>
        <FloatingButton
          className="bg-destructive"
          offset={{ x: 96, y: 180 }}
          visible={visible}
        >
          <Text className="text-xs font-bold text-destructive-foreground">HI</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonVisible };
