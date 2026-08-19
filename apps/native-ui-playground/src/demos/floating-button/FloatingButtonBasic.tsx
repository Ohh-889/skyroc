import { FloatingButton, Portal, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const FloatingButtonBasic = () => {
  return (
    <View className="bg-background px-4">
      <Text className="mb-6 text-sm text-muted-foreground">
        默认 axis=&quot;y&quot;，蓝色按钮只能上下拖，点击有反馈。
      </Text>

      {/* 边界按窗口尺寸算，渲染却是相对父容器的 absolute：套一层铺满屏幕的 PortalHost，位置才对得上 */}
      <Portal>
        <FloatingButton offset={{ x: 24, y: 180 }}>
          <Text className="text-xs font-bold text-primary-foreground">Y</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonBasic };
