import type { ActionSheetAction } from '@skyroc/native-ui';
import { ActionSheet, Cell } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const BASIC_ACTIONS: ActionSheetAction[] = [
  { name: '选项一', value: 'one' },
  { name: '选项二', value: 'two' },
  { name: '选项三', value: 'three' }
];

const ActionSheetControlled = () => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <View className="bg-background p-4">
      <ActionSheet
        closeOnClickAction
        actions={BASIC_ACTIONS}
        cancelText="取消"
        title="选择城市"
        value={selectedValue}
        onChange={setSelectedValue}
      >
        {args => (
          <Cell
            showArrow
            classNames={{ root: 'rounded-xl border border-border' }}
            title="当前选项"
            trailing={args.action?.name ?? '请选择'}
            onPress={args.toggle}
          />
        )}
      </ActionSheet>
    </View>
  );
};

export { ActionSheetControlled };
