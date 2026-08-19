import { Button, resetNotifyDefaultOptions, setNotifyDefaultOptions, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const NotifyDefaults = () => {
  function handleShowWithDefaults() {
    setNotifyDefaultOptions({ duration: 5000, position: 'bottom', type: 'primary' });
    showNotify('使用全局默认配置');
  }

  function handleResetDefaults() {
    resetNotifyDefaultOptions();
    showNotify('已恢复默认配置');
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={handleShowWithDefaults}
      >
        设置并使用默认配置
      </Button>
      <Button
        variant="outline"
        onPress={handleResetDefaults}
      >
        重置默认配置
      </Button>
    </View>
  );
};

export { NotifyDefaults };
