import type { ActionSheetAction } from '@skyroc/native-ui';
import { ActionSheet, Button } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const BASIC_ACTIONS: ActionSheetAction[] = [
  { name: '选项一', value: 'one' },
  { name: '选项二', value: 'two' },
  { name: '选项三', value: 'three' }
];

const ActionSheetStyles = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="bg-background">
      <View className="p-4">
        <Button
          variant="tonal"
          onPress={() => setShow(true)}
        >
          打开自定义面板
        </Button>
      </View>

      <ActionSheet
        closeOnClickAction
        actions={BASIC_ACTIONS}
        cancelText="再想想"
        classNames={{
          actionName: 'font-medium',
          cancelName: 'text-primary',
          root: 'bg-primary/5'
        }}
        sheetClassNames={{ title: 'text-primary' }}
        show={show}
        title="自定义样式"
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ActionSheetStyles };
