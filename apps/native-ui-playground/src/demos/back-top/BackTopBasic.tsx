import { BackTop, Cell, Portal, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

/** 用来把页面撑到能滚动的假数据 */
const ROWS = Array.from({ length: 40 }, (_, index) => index + 1);

const BackTopBasic = () => {
  const [pressCount, setPressCount] = useState(0);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  function handlePress() {
    setPressCount(prev => prev + 1);
  }

  return (
    <View className="flex-1 bg-muted">
      <Animated.ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-2 mt-4 px-4 text-lg font-semibold">基础用法</Text>
        <Text className="mb-4 px-4 text-sm text-muted-foreground">
          往下滚超过 200px，右下角出现按钮；点一下回到顶部。显隐判断全程在 UI 线程，滚动时不会触发重渲染。
        </Text>
        <Text className="mb-4 px-4 text-sm text-muted-foreground">已点击 {pressCount} 次</Text>

        {ROWS.map(row => (
          <Cell
            key={row}
            title={`第 ${row} 行`}
            trailing={String(row)}
          />
        ))}
      </Animated.ScrollView>

      {/* 套 Portal 是因为 bottom / right 是相对屏幕边缘算的，而本页顶部还有一个 NavBar */}
      <Portal>
        <BackTop
          target={scrollRef}
          onPress={handlePress}
        />
      </Portal>
    </View>
  );
};

export { BackTopBasic };
