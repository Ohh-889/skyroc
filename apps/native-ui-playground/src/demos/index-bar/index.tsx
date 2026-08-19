import { Button, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { IndexBarBasic } from './IndexBarBasic';
import { IndexBarBehavior } from './IndexBarBehavior';
import { IndexBarCustomItem } from './IndexBarCustomItem';
import { IndexBarImperative } from './IndexBarImperative';
import { IndexBarMetrics } from './IndexBarMetrics';
import { IndexBarSlots } from './IndexBarSlots';

/** 演示变体 */
type DemoVariant = 'basic' | 'behavior' | 'custom' | 'imperative' | 'metrics' | 'slots';

interface DemoVariantOption {
  /** 当前模式重点展示的公开能力 */
  description: string;
  /** 模式切换按钮文字 */
  label: string;
  /** 模式标识 */
  value: DemoVariant;
}

const VARIANTS: DemoVariantOption[] = [
  {
    description: 'items 渲染分组列表；点击侧栏或滚动内容都会通过 onIndexChange 同步当前索引。',
    label: '基础联动',
    value: 'basic'
  },
  {
    description: 'ref.scrollToIndex(index) 按字母定位；不存在的索引会被静默忽略。',
    label: '命令式定位',
    value: 'imperative'
  },
  {
    description: 'itemHeight 与 sectionHeaderHeight 同时控制视觉高度和滚动定位度量。',
    label: '高度度量',
    value: 'metrics'
  },
  {
    description: 'sticky 控制分组标题吸顶；haptic 控制点击侧栏时的原生轻触反馈。',
    label: '滚动行为',
    value: 'behavior'
  },
  {
    description: 'renderItem 接管子项内容和点击；外层仍由 itemHeight 约束。',
    label: '自定义子项',
    value: 'custom'
  },
  {
    description: 'className 设置根容器；classNames 分别覆盖列表、分组头、子项、分隔线和右侧索引栏。',
    label: '插槽样式',
    value: 'slots'
  }
];

/**
 * IndexBar 的总览页，逐个复用同目录下的单点 demo。
 *
 * 这里用横向切换器而不是 Section 竖排：IndexBar 要占满剩余高度并独占纵向滚动， 套进竖向 ScrollView 里逐段罗列会让它的滚动定位失效。
 */
const IndexBarDemo = () => {
  const [variant, setVariant] = useState<DemoVariant>('basic');

  const currentVariant = VARIANTS.find(item => item.value === variant) ?? VARIANTS[0];

  function renderIndexBar() {
    if (variant === 'imperative') {
      return <IndexBarImperative />;
    }

    if (variant === 'metrics') {
      return <IndexBarMetrics />;
    }

    if (variant === 'behavior') {
      return <IndexBarBehavior />;
    }

    if (variant === 'custom') {
      return <IndexBarCustomItem />;
    }

    if (variant === 'slots') {
      return <IndexBarSlots />;
    }

    return <IndexBarBasic />;
  }

  return (
    <View className="flex-1 bg-background">
      <View className="h-14 shrink-0">
        <ScrollView
          horizontal
          className="flex-1"
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
      </View>

      <View className="gap-1 px-4 pb-3">
        <Text className="text-sm font-medium text-foreground">{currentVariant.label}</Text>
        <Text className="text-xs leading-5 text-muted-foreground">{currentVariant.description}</Text>
      </View>

      {/* 切换变体会换掉一棵子树，各 demo 自己持有高亮状态，天然从头开始 */}
      {renderIndexBar()}
    </View>
  );
};

export { IndexBarDemo };
