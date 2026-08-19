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

      {/* 边界按窗口尺寸算，渲染却是相对父容器的 absolute：套一层铺满屏幕的 PortalHost，位置才对得上 */}
      <Portal>
        <FloatingButton onPress={handlePress}>
          <Text className="text-xs font-bold text-primary-foreground">+1</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonBasic };
