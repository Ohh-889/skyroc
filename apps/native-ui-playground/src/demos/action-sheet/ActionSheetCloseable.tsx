import type { ActionSheetAction } from '@skyroc/native-ui';
import { ActionSheet, Button } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const BASIC_ACTIONS: ActionSheetAction[] = [
  { name: '选项一', value: 'one' },
  { name: '选项二', value: 'two' },
  { name: '选项三', value: 'three' }
];

const ActionSheetCloseable = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="bg-background">
      <View className="p-4">
        <Button
          variant="tonal"
          onPress={() => setShow(true)}
        >
          打开受限面板
        </Button>
      </View>

      <ActionSheet
        closeOnClickAction
        actions={BASIC_ACTIONS}
        cancelText="关闭面板"
        closeOnBackdropPress={false}
        closeable={false}
        enablePanDownToClose={false}
        show={show}
        showHandle={false}
        title="受限关闭"
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ActionSheetCloseable };
