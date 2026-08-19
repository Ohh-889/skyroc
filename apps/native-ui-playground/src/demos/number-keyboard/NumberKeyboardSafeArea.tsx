import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NumberKeyboardSafeArea = () => {
  const [visible, setVisible] = useState(false);
  const [safeAreaInsetBottom, setSafeAreaInsetBottom] = useState(true);

  function openKeyboard(withSafeArea: boolean) {
    setSafeAreaInsetBottom(withSafeArea);
    setVisible(true);
  }

  function closeKeyboard() {
    setVisible(false);
  }

  return (
    <View className="gap-3 bg-background p-4">
      <Text color="muted">当前：safeAreaInsetBottom={String(safeAreaInsetBottom)}</Text>
      <View className="flex-row flex-wrap gap-2">
        <Button
          variant="outline"
          onPress={() => openKeyboard(true)}
        >
          适配底部安全区
        </Button>
        <Button
          variant="outline"
          onPress={() => openKeyboard(false)}
        >
          关闭安全区适配
        </Button>
      </View>

      <NumberKeyboard
        closeButtonText="完成"
        safeAreaInsetBottom={safeAreaInsetBottom}
        title="底部安全区"
        visible={visible}
        onBlur={closeKeyboard}
        onClose={closeKeyboard}
      />
    </View>
  );
};

export { NumberKeyboardSafeArea };
