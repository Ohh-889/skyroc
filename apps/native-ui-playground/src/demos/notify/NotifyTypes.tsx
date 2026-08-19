import type { NotifyType } from '@skyroc/native-ui';
import { Button, closeNotify, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const TYPES: NotifyType[] = ['primary', 'success', 'warning', 'danger'];

const NotifyTypes = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background px-6 py-4">
      {TYPES.map(type => (
        <Button
          key={type}
          variant="tonal"
          onPress={() => showNotify({ message: `${type} 通知`, type })}
        >
          {type}
        </Button>
      ))}
      <Button
        variant="outline"
        onPress={closeNotify}
      >
        关闭
      </Button>
    </View>
  );
};

export { NotifyTypes };
