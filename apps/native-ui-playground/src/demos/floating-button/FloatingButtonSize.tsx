import { FloatingButton, Portal, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const FloatingButtonSize = () => {
  return (
    <View className="bg-background px-4">
      <Text className="mb-6 text-sm text-muted-foreground">
        灰色按钮 size=64，className 覆盖底色，children 可以放任意节点。
      </Text>

      {/* 边界按窗口尺寸算，渲染却是相对父容器的 absolute：套一层铺满屏幕的 PortalHost，位置才对得上 */}
      <Portal>
        <FloatingButton
          axis="xy"
          className="bg-carbon"
          offset={{ x: 168, y: 180 }}
          size={64}
        >
          <Text className="text-sm font-bold text-carbon-foreground">BIG</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonSize };
