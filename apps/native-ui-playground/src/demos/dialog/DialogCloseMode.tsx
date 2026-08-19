import { Button, Text, closeDialog, showDialog } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DialogCloseMode = () => {
  const [lastAction, setLastAction] = useState<string>('—');

  async function handleBackdrop() {
    const action = await showDialog({
      closeOnBackdropPress: true,
      message: '点击遮罩关闭，同样按取消结算',
      title: '遮罩关闭'
    });

    setLastAction(action);
  }

  async function handleProgrammaticClose() {
    const pending = showDialog({ message: '2 秒后由代码关闭', title: '命令式关闭' });

    setTimeout(closeDialog, 2000);

    setLastAction(await pending);
  }

  return (
    <View className="bg-background px-6">
      <View className="mb-2 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={handleBackdrop}
        >
          点遮罩关闭
        </Button>
        <Button
          variant="tonal"
          onPress={handleProgrammaticClose}
        >
          代码关闭
        </Button>
      </View>
      <Text
        className="mb-8"
        color="muted"
      >
        最近一次操作：{lastAction}
      </Text>
    </View>
  );
};

export { DialogCloseMode };
