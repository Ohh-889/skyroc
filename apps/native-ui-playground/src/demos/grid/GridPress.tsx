import { Grid, Text } from '@skyroc/native-ui';
import type { GridItemData } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { BASIC_ITEMS } from './shared';

const GridPress = () => {
  const [message, setMessage] = useState('尚未触发');

  function handlePress() {
    setMessage('触发 onPress');
  }

  function handleLongPress() {
    setMessage('触发 onLongPress');
  }

  function handleDisabledPress() {
    setMessage('禁用项不应触发');
  }

  function getItems(): GridItemData[] {
    return [
      { ...BASIC_ITEMS[0], onPress: handlePress },
      { ...BASIC_ITEMS[1], onLongPress: handleLongPress },
      BASIC_ITEMS[2],
      { ...BASIC_ITEMS[3], disabled: true, onPress: handleDisabledPress }
    ];
  }

  return (
    <View className="bg-background p-4">
      <Text className="mb-3 text-sm text-muted-foreground">最近交互：{message}</Text>
      <View className="overflow-hidden rounded-xl border border-border">
        <Grid
          border
          clickable
          items={getItems()}
        />
      </View>
    </View>
  );
};

export { GridPress };
