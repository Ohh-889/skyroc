import { FloatingButton, Portal, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FloatingButtonBasic = () => {
  const [pressCount, setPressCount] = useState(0);

  function handlePress() {
    setPressCount(current => current + 1);
  }

  return (
    <View className="bg-background p-4">
      <Text className="text-sm text-muted-foreground">
        已点击 {pressCount} 次；默认 axis=&quot;y&quot;，可上下拖动。
      </Text>

      {/* 边界按父容器实测尺寸算；这里套一层铺满屏幕的 PortalHost，让按钮浮在整页之上而不是被示例卡片框住 */}
      <Portal>
        <FloatingButton onPress={handlePress}>
          <Text className="text-xs font-bold text-primary-foreground">+1</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonBasic };
