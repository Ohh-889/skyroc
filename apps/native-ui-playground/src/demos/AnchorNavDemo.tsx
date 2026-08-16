import { AnchorNav, Button, Divider, Text } from '@skyroc/native-ui';
import type { AnchorNavChild, AnchorNavRef, AnchorNavSection } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

/** 演示变体 */
type DemoVariant = 'basic' | 'controlled' | 'custom' | 'slots';

const VARIANTS: { label: string; value: DemoVariant }[] = [
  { label: '基础', value: 'basic' },
  { label: '受控 / 命令式', value: 'controlled' },
  { label: '自定义子项', value: 'custom' },
  { label: '插槽定制', value: 'slots' }
];

const MENU_DATA: AnchorNavSection[] = [
  {
    children: [
      { key: 'h1', text: '招牌烤鱼' },
      { key: 'h2', text: '麻辣小龙虾' },
      { key: 'h3', text: '酸菜鱼' },
      { key: 'h4', text: '水煮牛肉' },
      { key: 'h5', text: '剁椒鱼头' }
    ],
    key: 'hot',
    title: '热销推荐'
  },
  {
    children: [
      { key: 'l1', text: '口水鸡' },
      { key: 'l2', text: '凉拌黄瓜' },
      { key: 'l3', text: '皮蛋豆腐' },
      { key: 'l4', text: '拍黄瓜' },
      { key: 'l5', text: '凉拌木耳' },
      { key: 'l6', text: '夫妻肺片' }
    ],
    key: 'cold',
    title: '凉菜小吃'
  },
  {
    children: [
      { key: 'c1', text: '麻婆豆腐' },
      { key: 'c2', text: '回锅肉' },
      { key: 'c3', text: '宫保鸡丁' },
      { key: 'c4', text: '辣子鸡' },
      { key: 'c5', text: '鱼香肉丝' },
      { key: 'c6', text: '毛血旺' },
      { key: 'c7', text: '水煮鱼片' }
    ],
    key: 'sichuan',
    title: '川湘菜系'
  },
  {
    children: [
      { key: 'y1', text: '虾饺皇' },
      { key: 'y2', text: '烧麦' },
      { key: 'y3', text: '叉烧包' },
      { key: 'y4', text: '肠粉' },
      { key: 'y5', text: '凤爪' }
    ],
    key: 'dimsum',
    title: '粤式点心'
  },
  {
    children: [
      { key: 'z1', text: '扬州炒饭' },
      { key: 'z2', text: '担担面' },
      { key: 'z3', text: '重庆小面' },
      { key: 'z4', text: '葱油拌面' },
      { key: 'z5', text: '炸酱面' },
      { key: 'z6', text: '酸辣粉' }
    ],
    key: 'staple',
    title: '主食面点'
  },
  {
    children: [
      { key: 't1', text: '番茄蛋汤' },
      { key: 't2', text: '紫菜蛋花汤' },
      { key: 't3', text: '酸辣汤' },
      { key: 't4', text: '老火靓汤' },
      { key: 't5', text: '冬瓜排骨汤' }
    ],
    key: 'soup',
    title: '汤品煲仔'
  },
  {
    children: [
      { key: 'd1', text: '酸梅汤' },
      { key: 'd2', text: '冰粉' },
      { key: 'd3', text: '椰汁西米露' },
      { key: 'd4', text: '杨枝甘露' },
      { key: 'd5', text: '芒果布丁' }
    ],
    key: 'dessert',
    title: '饮品甜品'
  },
  {
    badge: '新',
    children: [
      { key: 'j1', text: '青岛啤酒' },
      { key: 'j2', text: '百威啤酒' },
      { key: 'j3', text: '可乐' },
      { key: 'j4', text: '雪碧' },
      { key: 'j5', text: '矿泉水' },
      { key: 'j6', text: '王老吉' }
    ],
    dot: true,
    key: 'drink',
    title: '酒水'
  }
];

/** 自定义子项的高度，同时是 AnchorNav 的滚动定位度量，所以只在这里写一次 */
const CUSTOM_ITEM_HEIGHT = 76;

/** Demo 占位价格：按 key 稳定散列，免得为几十道菜维护一张价格表 */
function toPrice(key: string) {
  const seed = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return 18 + (seed % 12) * 5;
}

const AnchorNavDemo = () => {
  const [variant, setVariant] = useState<DemoVariant>('basic');
  const [activeIndex, setActiveIndex] = useState(0);
  const [pressedItem, setPressedItem] = useState<AnchorNavChild | null>(null);

  const anchorRef = useRef<AnchorNavRef>(null);

  const isFirstSection = activeIndex === 0;
  const isLastSection = activeIndex === MENU_DATA.length - 1;

  function handlePressItem(item: AnchorNavChild) {
    setPressedItem(item);
  }

  /** 切换变体会换掉一棵子树，高亮从头开始，外部镜像的状态也要跟着归零 */
  function handleSelectVariant(value: DemoVariant) {
    setVariant(value);
    setActiveIndex(0);
    setPressedItem(null);
  }

  /** 自定义子项：外层已经被钉在 CUSTOM_ITEM_HEIGHT 上，这里只负责把内容撑满并垂直居中 */
  function renderMenuItem(item: AnchorNavChild, section: AnchorNavSection) {
    return (
      <Pressable
        className="h-full flex-row items-center gap-3 px-3 active:opacity-80"
        onPress={() => handlePressItem(item)}
      >
        <View className="h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <Text className="text-base text-muted-foreground">{section.title.slice(0, 1)}</Text>
        </View>

        <View className="flex-1 gap-1">
          <Text className="text-sm font-medium text-foreground">{item.text}</Text>
          <Text className="text-xs text-muted-foreground">
            {section.title} · 月售 {toPrice(item.key) * 3} 份
          </Text>
        </View>

        <Text className="text-sm font-semibold text-destructive">¥{toPrice(item.key)}</Text>
      </Pressable>
    );
  }

  function renderAnchorNav() {
    if (variant === 'controlled') {
      return (
        <AnchorNav
          ref={anchorRef}
          activeIndex={activeIndex}
          items={MENU_DATA}
          onIndexChange={setActiveIndex}
          onPressItem={handlePressItem}
        />
      );
    }

    if (variant === 'custom') {
      return (
        <AnchorNav
          itemHeight={CUSTOM_ITEM_HEIGHT}
          items={MENU_DATA}
          renderItem={renderMenuItem}
          sectionHeaderHeight={28}
          onIndexChange={setActiveIndex}
        />
      );
    }

    if (variant === 'slots') {
      return (
        <AnchorNav
          haptic={false}
          itemHeight={52}
          items={MENU_DATA}
          sectionHeaderHeight={40}
          sticky={false}
          classNames={{
            content: 'bg-secondary',
            item: 'mx-2 rounded-xl bg-background px-4',
            itemText: 'text-sm font-medium text-primary',
            sectionHeader: 'bg-primary/10 px-4',
            sectionHeaderText: 'text-sm font-semibold text-primary',
            // 只把线藏起来，不动高度：分隔线的占位是滚动定位的度量之一
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
        items={MENU_DATA}
        onIndexChange={setActiveIndex}
        onPressItem={handlePressItem}
      />
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* 变体切换：AnchorNav 自己要占满剩余高度并独占纵向滚动，所以不套在竖向 ScrollView 里逐段罗列 */}
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
            onPress={() => handleSelectVariant(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </ScrollView>

      {/* 受控示例的跳转按钮：activeIndex 只是高亮镜像，跳转必须走命令式方法 */}
      {variant === 'controlled' ? (
        <View className="flex-row items-center gap-3 px-4 pb-3">
          <Button
            color="secondary"
            disabled={isFirstSection}
            size="sm"
            variant="outline"
            onPress={() => anchorRef.current?.scrollToSection(activeIndex - 1)}
          >
            上一组
          </Button>
          <Button
            color="primary"
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
          当前分组：{activeIndex} · {MENU_DATA[activeIndex].title}
        </Text>
        <Text className="flex-1 text-right text-xs text-muted-foreground">
          {pressedItem ? `点击了 ${pressedItem.text}` : '试着滚动列表看高亮联动'}
        </Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">{renderAnchorNav()}</View>
    </View>
  );
};

export { AnchorNavDemo };
