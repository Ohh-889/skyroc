import { Button, showConfirmDialog } from '@skyroc/native-ui';
import { View } from 'react-native';

const DialogTheme = () => {
  function handleRound(themeDirection: 'horizontal' | 'vertical') {
    showConfirmDialog({
      message: `round-button 主题 · ${themeDirection}`,
      theme: 'round-button',
      themeDirection,
      title: '圆角按钮'
    });
  }

  return (
    <View className="mb-8 flex-row flex-wrap items-center gap-3 bg-background px-6">
      <Button
        variant="tonal"
        onPress={() => handleRound('vertical')}
      >
        圆角竖排
      </Button>
      <Button
        variant="tonal"
        onPress={() => handleRound('horizontal')}
      >
        圆角横排
      </Button>
    </View>
  );
};

export { DialogTheme };
