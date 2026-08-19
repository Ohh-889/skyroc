import { DropdownMenu, Text } from '@skyroc/native-ui';
import type { DropdownMenuItem, DropdownMenuOption } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const STATUS_ITEM: DropdownMenuItem = {
  key: 'status',
  options: [
    { text: '全部状态', value: 'all' },
    { text: '进行中', value: 'active' },
    { text: '已完成', value: 'done' }
  ],
  title: '保持展开'
};

const DropdownMenuSelectBehavior = () => {
  const [selectedText, setSelectedText] = useState('尚未选择');

  function handleSelect(_itemIndex: number, option: DropdownMenuOption) {
    setSelectedText(option.text);
  }

  return (
    <View className="bg-background pb-4">
      <Text className="mb-3 px-4 text-sm text-muted-foreground">最近选择：{selectedText}</Text>
      <DropdownMenu
        closeOnSelect={false}
        items={[STATUS_ITEM]}
        onSelect={handleSelect}
      />
    </View>
  );
};

export { DropdownMenuSelectBehavior };
