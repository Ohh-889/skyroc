import type { DialogProps } from '@skyroc/native-ui';
import { Button, showDialog } from '@skyroc/native-ui';
import { View } from 'react-native';

const ALIGNMENTS: Array<NonNullable<DialogProps['messageAlign']>> = ['left', 'center', 'right'];

const DialogMessageAlign = () => {
  function handleOpen(messageAlign: NonNullable<DialogProps['messageAlign']>) {
    showDialog({
      message: `当前消息使用 ${messageAlign} 对齐。`,
      messageAlign,
      title: `${messageAlign} 对齐`
    });
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      {ALIGNMENTS.map(messageAlign => (
        <Button
          key={messageAlign}
          variant="tonal"
          onPress={() => handleOpen(messageAlign)}
        >
          {messageAlign}
        </Button>
      ))}
    </View>
  );
};

export { DialogMessageAlign };
