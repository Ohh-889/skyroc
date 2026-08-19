import { Button, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonSlot = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Button leading={<Text>↓</Text>}>下载文件</Button>

      <Button
        variant="outline"
        trailing={<Text>→</Text>}
      >
        下一步
      </Button>

      {/* leading / trailing 同时存在，文字被夹在中间 */}
      <Button
        variant="tonal"
        leading={<Text>♡</Text>}
        trailing={<Text>→</Text>}
      >
        收藏并继续
      </Button>
    </View>
  );
};

export { ButtonSlot };
