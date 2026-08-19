import { AnchorNav, Button, Divider, Text } from '@skyroc/native-ui';
import type { AnchorNavChild, AnchorNavRef, AnchorNavSection, AnchorNavSidebarContext } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

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

const LIBRARY_DATA: AnchorNavSection[] = [
  {
    badge: 6,
    children: [
      { key: 'button', text: 'Button 按钮' },
      { key: 'text', text: 'Text 文字' },
      { key: 'avatar', text: 'Avatar 头像' },
      { key: 'badge', text: 'Badge 徽标' }
    ],
    key: 'basic',
    title: '基础组件'
  },
  {
    children: [
      { key: 'input', text: 'Input 输入框' },
      { key: 'field', text: 'Field 字段' },
      { key: 'checkbox', text: 'Checkbox 复选框' },
      { key: 'radio', text: 'Radio 单选框' }
    ],
    dot: true,
    key: 'form',
    title: '表单输入'
  },
  {
    children: [
      { key: 'toast', text: 'Toast 轻提示' },
      { key: 'notify', text: 'Notify 通知' },
      { key: 'dialog', text: 'Dialog 对话框' },
      { key: 'action-sheet', text: 'ActionSheet 操作面板' }
    ],
    key: 'feedback',
    title: '反馈展示'
  },
  {
    children: [
      { key: 'tabs', text: 'Tabs 标签页' },
      { key: 'sidebar', text: 'Sidebar 侧边导航' },
      { key: 'anchor-nav', text: 'AnchorNav 锚点导航' },
      { key: 'pagination', text: 'Pagination 分页' }
    ],
    key: 'navigation',
    title: '导航布局'
  },
  {
    children: [
      { key: 'cell', text: 'Cell 单元格' },
      { key: 'collapse', text: 'Collapse 折叠面板' },
      { key: 'grid', text: 'Grid 宫格' },
      { key: 'tree-select', text: 'TreeSelect 分类选择' }
    ],
    key: 'display',
    title: '数据展示'
  },
  {
    children: [
      { key: 'popup', text: 'Popup 弹出层' },
      { key: 'sheet', text: 'Sheet 底部面板' },
      { key: 'picker', text: 'Picker 选择器' },
      { key: 'calendar', text: 'Calendar 日历' }
    ],
    key: 'overlay',
    title: '弹层选择'
  },
  {
    children: [
      { key: 'signature', text: 'Signature 签名' },
      { key: 'rolling-text', text: 'RollingText 滚动文字' },
      { key: 'back-top', text: 'BackTop 返回顶部' }
    ],
    disabled: true,
    key: 'experimental',
    title: '实验组件'
  },
  {
    children: [
      { key: 'divider', text: 'Divider 分隔线' },
      { key: 'space', text: 'Space 间距' },
      { key: 'image', text: 'Image 图片' },
      { key: 'tag', text: 'Tag 标签' }
    ],
    key: 'utility',
    title: '通用工具'
  }
];

const CUSTOM_ITEM_HEIGHT = 72;

function getExampleCount(key: string) {
  const seed = [...key].reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return 2 + (seed % 7);
}

function renderCustomSidebar(context: AnchorNavSidebarContext) {
  const { activeIndex, items, onPressIndex } = context;

  return (
    <ScrollView
      className="w-20 shrink-0 grow-0 bg-muted/50"
      contentContainerClassName="gap-1 py-2"
      showsVerticalScrollIndicator={false}
    >
      {items.map((item, index) => (
        <Pressable
          accessibilityRole="button"
          className={
            activeIndex === index
              ? 'mx-2 min-h-12 justify-center rounded-xl bg-primary/10 px-2'
              : 'mx-2 min-h-12 justify-center rounded-xl px-2'
          }
          disabled={item.disabled}
          key={item.key ?? index}
          onPress={() => onPressIndex(index)}
        >
          <Text
            className={
              activeIndex === index
                ? 'text-center text-xs font-semibold text-primary'
                : 'text-center text-xs text-muted-foreground'
            }
          >
            {item.title}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const AnchorNavDemo = () => {
  const [variant, setVariant] = useState<DemoVariant>('basic');
  const [activeIndex, setActiveIndex] = useState(0);
  const [pressedItem, setPressedItem] = useState<AnchorNavChild | null>(null);

  const anchorRef = useRef<AnchorNavRef>(null);

  const currentVariant = VARIANTS.find(item => item.value === variant) ?? VARIANTS[0];
  const isFirstSection = activeIndex === 0;
  const isLastSection = activeIndex === LIBRARY_DATA.length - 1;

  function handlePressItem(item: AnchorNavChild) {
    setPressedItem(item);
  }

  function handleSelectVariant(value: DemoVariant) {
    setVariant(value);
    setActiveIndex(0);
    setPressedItem(null);
  }

  function renderLibraryItem(item: AnchorNavChild, section: AnchorNavSection) {
    return (
      <Pressable
        accessibilityRole="button"
        className="h-full flex-row items-center gap-3 px-3 active:opacity-80"
        onPress={() => handlePressItem(item)}
      >
        <View className="size-10 items-center justify-center rounded-xl bg-primary/10">
          <Text className="text-sm font-semibold text-primary">{section.title.slice(0, 1)}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-sm font-medium text-foreground">{item.text}</Text>
          <Text className="text-xs text-muted-foreground">
            {section.title} · {getExampleCount(item.key)} 个示例
          </Text>
        </View>
        <Text className="text-xs font-medium text-primary">查看</Text>
      </Pressable>
    );
  }

  function renderAnchorNav() {
    if (variant === 'controlled') {
      return (
        <AnchorNav
          ref={anchorRef}
          activeIndex={activeIndex}
          items={LIBRARY_DATA}
          key={variant}
          onIndexChange={setActiveIndex}
          onPressItem={handlePressItem}
        />
      );
    }

    if (variant === 'custom-item') {
      return (
        <AnchorNav
          itemHeight={CUSTOM_ITEM_HEIGHT}
          items={LIBRARY_DATA}
          key={variant}
          renderItem={renderLibraryItem}
          sectionHeaderHeight={28}
          onIndexChange={setActiveIndex}
        />
      );
    }

    if (variant === 'custom-sidebar') {
      return (
        <AnchorNav
          items={LIBRARY_DATA}
          key={variant}
          renderSidebar={renderCustomSidebar}
          onIndexChange={setActiveIndex}
          onPressItem={handlePressItem}
        />
      );
    }

    if (variant === 'slots') {
      return (
        <AnchorNav
          haptic={false}
          itemHeight={52}
          items={LIBRARY_DATA}
          key={variant}
          sectionHeaderHeight={40}
          sticky={false}
          classNames={{
            content: 'bg-secondary',
            item: 'mx-2 rounded-xl bg-background px-4',
            itemText: 'text-sm font-medium text-primary',
            sectionHeader: 'bg-primary/10 px-4',
            sectionHeaderText: 'text-sm font-semibold text-primary',
            separator: 'mx-0 my-0 opacity-0',
            sidebar: 'w-24 bg-primary/5'
          }}
          sidebarClassNames={{
            indicator: 'h-8 w-1 rounded-sm bg-destructive',
            itemText: 'text-xs'
          }}
          onIndexChange={setActiveIndex}
        />
      );
    }

    return (
      <AnchorNav
        items={LIBRARY_DATA}
        key={variant}
        onIndexChange={setActiveIndex}
        onPressItem={handlePressItem}
      />
    );
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
              onPress={() => handleSelectVariant(item.value)}
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

      {variant === 'controlled' ? (
        <View className="flex-row items-center gap-3 px-4 pb-3">
          <Button
            disabled={isFirstSection}
            size="sm"
            variant="outline"
            onPress={() => anchorRef.current?.scrollToSection(activeIndex - 1)}
          >
            上一组
          </Button>
          <Button
            disabled={isLastSection}
            size="sm"
            variant="tonal"
            onPress={() => anchorRef.current?.scrollToSection(activeIndex + 1)}
          >
            下一组
          </Button>
        </View>
      ) : null}

      <View className="flex-row items-center gap-2 px-4 pb-3">
        <Text className="text-xs text-muted-foreground">
          当前分组：{activeIndex} · {LIBRARY_DATA[activeIndex].title}
        </Text>
        <Text className="flex-1 text-right text-xs text-muted-foreground">
          {pressedItem ? `点击了 ${pressedItem.text}` : '滚动列表可观察高亮联动'}
        </Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">{renderAnchorNav()}</View>
    </View>
  );
};

export { AnchorNavDemo };
