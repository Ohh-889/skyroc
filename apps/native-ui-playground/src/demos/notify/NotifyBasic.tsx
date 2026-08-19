import { Button, closeNotify, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const NotifyBasic = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => showNotify('这是一条基础通知')}
      >
        字符串简写
      </Button>
      <Button
        variant="tonal"
        onPress={() => showNotify({ message: '使用 options 传入通知内容' })}
      >
        options 调用
      </Button>
      <Button
        variant="outline"
        onPress={closeNotify}
      >
        关闭当前通知
      </Button>
    </View>
  );
};

export { NotifyBasic };
