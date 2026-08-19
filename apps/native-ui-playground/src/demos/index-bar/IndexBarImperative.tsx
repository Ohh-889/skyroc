import { Button, Divider, IndexBar, Text } from '@skyroc/native-ui';
import type { IndexBarChild, IndexBarRef } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { CITY_ITEMS } from './shared';

/** 命令式定位的几个落点，取首、中、尾 */
const QUICK_INDEXES = ['A', 'M', 'Z'];

const IndexBarImperative = () => {
  const [activeIndex, setActiveIndex] = useState(CITY_ITEMS[0].title);
  const [pressedItem, setPressedItem] = useState<IndexBarChild | null>(null);

  const indexBarRef = useRef<IndexBarRef>(null);

  return (
    <View className="flex-1 bg-background">
      {/* 对外的定位入口是字母而不是下标 */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        {QUICK_INDEXES.map(index => (
          <Button
            key={index}
            color="primary"
            size="sm"
            variant="outline"
            onPress={() => indexBarRef.current?.scrollToIndex(index)}
          >
            {`跳到 ${index}`}
          </Button>
        ))}
      </View>

      <View className="flex-row items-center gap-2 px-4 pb-3">
        <Text className="text-xs text-muted-foreground">当前索引：{activeIndex}</Text>
        <Text className="flex-1 text-right text-xs text-muted-foreground">
          {pressedItem ? `点击了 ${pressedItem.text}` : '试着滚动列表看高亮联动'}
        </Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">
        <IndexBar
          ref={indexBarRef}
          items={CITY_ITEMS}
          onIndexChange={setActiveIndex}
          onPressItem={setPressedItem}
        />
      </View>
    </View>
  );
};

export { IndexBarImperative };
