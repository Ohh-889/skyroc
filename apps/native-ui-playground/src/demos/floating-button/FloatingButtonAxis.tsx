import { FloatingButton, Portal, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const FloatingButtonAxis = () => {
  return (
    <View className="bg-background px-4">
      <Text className="mb-6 text-sm text-muted-foreground">
        绿色按钮 axis=&quot;xy&quot;，可以拖到任意位置，但始终被 gap（默认 24）挡在屏幕边缘之内。
      </Text>

      {/* 边界按窗口尺寸算，渲染却是相对父容器的 absolute：套一层铺满屏幕的 PortalHost，位置才对得上 */}
      <Portal>
        <FloatingButton
          axis="xy"
          className="bg-success"
          offset={{ x: 24, y: 260 }}
        >
          <Text className="text-xs font-bold text-success-foreground">XY</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonAxis };
