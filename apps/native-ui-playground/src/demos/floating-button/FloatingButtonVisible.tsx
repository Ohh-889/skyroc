import { Button, FloatingButton, Portal, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

const FloatingButtonVisible = () => {
  const [visibleFlag, setVisibleFlag] = useState(true);

  const visible = useSharedValue(true);

  function toggleVisible() {
    const nextVisible = !visibleFlag;

    setVisibleFlag(nextVisible);
    visible.value = nextVisible;
  }

  return (
    <View className="bg-background p-4">
      <View className="gap-3">
        <Text className="text-sm text-muted-foreground">
          本例直接传 SharedValue&lt;boolean&gt;，显隐更新留在 UI 线程。
        </Text>
        <Button
          color="primary"
          variant="solid"
          onPress={toggleVisible}
        >
          {visibleFlag ? '隐藏悬浮按钮' : '显示悬浮按钮'}
        </Button>
      </View>

      {/* 边界按父容器实测尺寸算；这里套一层铺满屏幕的 PortalHost，让按钮浮在整页之上而不是被示例卡片框住 */}
      <Portal>
        <FloatingButton
          className="bg-destructive"
          visible={visible}
        >
          <Text className="text-xs font-bold text-destructive-foreground">HI</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonVisible };
