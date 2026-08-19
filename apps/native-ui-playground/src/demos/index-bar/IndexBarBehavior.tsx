import { Button, Divider, IndexBar, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { CITY_ITEMS } from './shared';

const IndexBarBehavior = () => {
  const [activeIndex, setActiveIndex] = useState(CITY_ITEMS[0].title);
  const [sticky, setSticky] = useState(true);
  const [haptic, setHaptic] = useState(true);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row flex-wrap gap-2 px-4 py-3">
        <Button
          size="sm"
          variant={sticky ? 'solid' : 'outline'}
          onPress={() => setSticky(current => !current)}
        >
          {sticky ? '吸顶已开启' : '吸顶已关闭'}
        </Button>
        <Button
          size="sm"
          variant={haptic ? 'solid' : 'outline'}
          onPress={() => setHaptic(current => !current)}
        >
          {haptic ? '触感已开启' : '触感已关闭'}
        </Button>
      </View>

      <View className="flex-row items-center gap-2 px-4 pb-3">
        <Text className="text-xs text-muted-foreground">当前索引：{activeIndex}</Text>
        <Text className="flex-1 text-right text-xs text-muted-foreground">haptic 仅在原生端触发</Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">
        <IndexBar
          haptic={haptic}
          items={CITY_ITEMS}
          sticky={sticky}
          onIndexChange={setActiveIndex}
        />
      </View>
    </View>
  );
};

export { IndexBarBehavior };
