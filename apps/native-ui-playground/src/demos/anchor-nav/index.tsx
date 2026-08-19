import { Button, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AnchorNavBasic } from './AnchorNavBasic';
import { AnchorNavControlled } from './AnchorNavControlled';
import { AnchorNavCustomItem } from './AnchorNavCustomItem';
import { AnchorNavCustomSidebar } from './AnchorNavCustomSidebar';
import { AnchorNavSlots } from './AnchorNavSlots';

type DemoVariant = 'basic' | 'controlled' | 'custom-item' | 'custom-sidebar' | 'slots';

interface DemoVariantOption {
  /** 当前模式重点展示的公开能力 */
  description: string;

  /** 模式切换按钮文字 */
  label: string;

  /** 模式标识 */
  value: DemoVariant;
}

const VARIANTS: DemoVariantOption[] = [
  { description: '点击侧栏定位分组，滚动内容同步高亮。', label: '基础联动', value: 'basic' },
  {
    description: 'activeIndex 受控，高亮跳转通过 ref.scrollToSection 完成。',
    label: '受控 / 命令式',
    value: 'controlled'
  },
  {
    description: 'renderItem 自定义子项，itemHeight 同时作为滚动度量。',
    label: '自定义子项',
    value: 'custom-item'
  },
  {
    description: 'renderSidebar 完全替换默认 Sidebar，并复用统一的定位逻辑。',
    label: '自定义侧栏',
    value: 'custom-sidebar'
  },
  {
    description: '调整高度、吸顶、触感及内容区和默认侧栏的样式槽。',
    label: '插槽定制',
    value: 'slots'
  }
];

/**
 * AnchorNav 的总览页，按模式切换同目录下的单点 demo。
 *
 * AnchorNav 需要占满剩余高度才能滚动，所以这里不像别的组件那样用 Section 逐节铺开，而是保留原来的模式切换器。
 */
const AnchorNavDemo = () => {
  const [variant, setVariant] = useState<DemoVariant>('basic');

  const currentVariant = VARIANTS.find(item => item.value === variant) ?? VARIANTS[0];

  function renderVariant() {
    if (variant === 'controlled') {
      return <AnchorNavControlled />;
    }

    if (variant === 'custom-item') {
      return <AnchorNavCustomItem />;
    }

    if (variant === 'custom-sidebar') {
      return <AnchorNavCustomSidebar />;
    }

    if (variant === 'slots') {
      return <AnchorNavSlots />;
    }

    return <AnchorNavBasic />;
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

      {renderVariant()}
    </View>
  );
};

export { AnchorNavDemo };
