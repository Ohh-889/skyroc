import { Button, FloatingButton, Portal, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FloatingButtonDisabled = () => {
  const [disabled, setDisabled] = useState(false);
  const [pressCount, setPressCount] = useState(0);

  function handlePress() {
    setPressCount(current => current + 1);
  }

  return (
    <View className="bg-background p-4">
      <View className="gap-3">
        <Text className="text-sm text-muted-foreground">已点击 {pressCount} 次；禁用后计数和位置都不会变化。</Text>
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
          onPress={handlePress}
        >
          <Text className="text-xs font-bold text-info-foreground">{disabled ? 'OFF' : 'ON'}</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonDisabled };
