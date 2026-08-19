import { Button, FloatingButton, Portal, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FloatingButtonDisabled = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <View className="bg-background px-4">
      <View className="mb-6 gap-3">
        <Text className="text-sm text-muted-foreground">紫色按钮禁用后不响应点击与拖拽，并整体降低不透明度。</Text>
        <Button
          color="primary"
          variant="outline"
          onPress={() => setDisabled(prev => !prev)}
        >
          {disabled ? '解除禁用' : '禁用紫色按钮'}
        </Button>
      </View>

      {/* 边界按窗口尺寸算，渲染却是相对父容器的 absolute：套一层铺满屏幕的 PortalHost，位置才对得上 */}
      <Portal>
        <FloatingButton
          axis="xy"
          className="bg-info"
          disabled={disabled}
          offset={{ x: 96, y: 260 }}
        >
          <Text className="text-xs font-bold text-info-foreground">EN</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonDisabled };
