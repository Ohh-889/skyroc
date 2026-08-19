import { Button, showConfirmDialog, showDialog } from '@skyroc/native-ui';
import { View } from 'react-native';

const DialogBasic = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => showDialog({ message: '这是一段需要用户知晓的提示信息。', title: '提示' })}
      >
        提示弹窗
      </Button>
      <Button
        variant="tonal"
        onPress={() => showConfirmDialog({ message: '是否确认继续当前操作？', title: '请确认' })}
      >
        确认弹窗
      </Button>
      <Button
        variant="tonal"
        onPress={() => showDialog('只传一段文案')}
      >
        纯文案
      </Button>
    </View>
  );
};

export { DialogBasic };
