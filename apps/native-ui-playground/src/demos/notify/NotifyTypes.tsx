import type { NotifyType } from '@skyroc/native-ui';
import { Button, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const TYPES: NotifyType[] = ['primary', 'success', 'warning', 'danger'];

const NotifyTypes = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      {TYPES.map(type => (
        <Button
          key={type}
          variant="tonal"
          onPress={() => showNotify({ message: `${type} 通知`, type })}
        >
          {type}
        </Button>
      ))}
    </View>
  );
};

export { NotifyTypes };
