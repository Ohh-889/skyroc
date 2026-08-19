import type { PickerGroupItem, PickerOption } from '@skyroc/native-ui';
import { Button, PickerGroupView, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const OPTIONS: PickerOption[] = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' }
];

const DISPLAY_PICKERS: PickerGroupItem[] = [
  { columns: OPTIONS, key: 'first', title: '第一步' },
  { columns: OPTIONS, key: 'second', title: '第二步' }
];

type DisplayMode = 'all' | 'no-tab-bar' | 'no-toolbar';

const PickerGroupDisplay = () => {
  const [mode, setMode] = useState<DisplayMode>('all');

  const showTabBar = mode !== 'no-tab-bar';
  const showToolbar = mode !== 'no-toolbar';

  return (
    <View className="gap-3 bg-background px-4 pb-4">
      <View className="flex-row flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onPress={() => setMode('all')}
        >
          全部显示
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={() => setMode('no-tab-bar')}
        >
          隐藏 tab 栏
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={() => setMode('no-toolbar')}
        >
          隐藏工具栏
        </Button>
      </View>
      <Text color="muted">当前模式：{mode}</Text>
      <PickerGroupView
        cancelText="返回"
        confirmText="提交"
        nextStepText="继续"
        pickers={DISPLAY_PICKERS}
        showTabBar={showTabBar}
        showToolbar={showToolbar}
      />
    </View>
  );
};

export { PickerGroupDisplay };
