import { Button, Text, showToast } from '@skyroc/native-ui';
import { View } from 'react-native';

const ToastCustom = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background px-6 py-4">
      <Button
        variant="tonal"
        onPress={() =>
          showToast({
            icon: <Text className="text-3xl">🎉</Text>,
            message: '自定义图标'
          })
        }
      >
        Emoji 图标
      </Button>
      <Button
        variant="tonal"
        onPress={() =>
          showToast({
            className: 'rounded-none bg-primary',
            classNames: { message: 'text-base text-primary-foreground' },
            message: 'className 覆盖'
          })
        }
      >
        className 覆盖
      </Button>
    </View>
  );
};

export { ToastCustom };
