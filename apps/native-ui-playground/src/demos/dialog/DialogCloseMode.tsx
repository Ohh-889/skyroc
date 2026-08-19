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
    <View className="gap-3 bg-background p-4">
      <View className="flex-row flex-wrap items-center gap-3">
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
        <Button
          variant="tonal"
          onPress={() =>
            showDialog({
              closeOnBackdropPress: false,
              closeOnBackPress: false,
              message: '遮罩点击和 Android 返回键都不会关闭，只能点击确认按钮。',
              title: '禁止外部关闭'
            })
          }
        >
          禁止外部关闭
        </Button>
      </View>
      <Text color="muted">最近一次操作：{lastAction}</Text>
    </View>
  );
};

export { DialogCloseMode };
