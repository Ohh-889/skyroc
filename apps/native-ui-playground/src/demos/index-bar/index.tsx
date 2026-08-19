import { Button } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { IndexBarBasic } from './IndexBarBasic';
import { IndexBarCustomItem } from './IndexBarCustomItem';
import { IndexBarImperative } from './IndexBarImperative';
import { IndexBarSlots } from './IndexBarSlots';

/** 演示变体 */
type DemoVariant = 'basic' | 'custom' | 'imperative' | 'slots';

const VARIANTS: { label: string; value: DemoVariant }[] = [
  { label: '基础', value: 'basic' },
  { label: '命令式定位', value: 'imperative' },
  { label: '自定义子项', value: 'custom' },
  { label: '插槽定制', value: 'slots' }
];

/**
 * IndexBar 的总览页，逐个复用同目录下的单点 demo。
 *
 * 这里用横向切换器而不是 Section 竖排：IndexBar 要占满剩余高度并独占纵向滚动， 套进竖向 ScrollView 里逐段罗列会让它的滚动定位失效。
 */
const IndexBarDemo = () => {
  const [variant, setVariant] = useState<DemoVariant>('basic');

  function renderIndexBar() {
    if (variant === 'imperative') return <IndexBarImperative />;
    if (variant === 'custom') return <IndexBarCustomItem />;
    if (variant === 'slots') return <IndexBarSlots />;

    return <IndexBarBasic />;
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        horizontal
        className="grow-0"
        contentContainerClassName="gap-2 px-4 py-3"
        showsHorizontalScrollIndicator={false}
      >
        {VARIANTS.map(item => (
          <Button
            key={item.value}
            color="primary"
            shape="pill"
            size="sm"
            variant={variant === item.value ? 'solid' : 'outline'}
            onPress={() => setVariant(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </ScrollView>

      {/* 切换变体会换掉一棵子树，各 demo 自己持有高亮状态，天然从头开始 */}
      <View className="flex-1">{renderIndexBar()}</View>
    </View>
  );
};

export { IndexBarDemo };
