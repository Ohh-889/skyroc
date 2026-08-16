import { Button, Divider, IndexBar, Text } from '@skyroc/native-ui';
import type { IndexBarChild, IndexBarRef, IndexBarSection } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

/** 演示变体 */
type DemoVariant = 'basic' | 'custom' | 'imperative' | 'slots';

const VARIANTS: { label: string; value: DemoVariant }[] = [
  { label: '基础', value: 'basic' },
  { label: '命令式定位', value: 'imperative' },
  { label: '自定义子项', value: 'custom' },
  { label: '插槽定制', value: 'slots' }
];

/** 城市按拼音首字母分组，字母即分组身份 */
const CITY_DATA: Record<string, string[]> = {
  A: ['安庆', '安阳', '鞍山', '安康'],
  B: ['北京', '保定', '包头', '蚌埠', '宝鸡'],
  C: ['成都', '重庆', '长沙', '长春', '常州'],
  D: ['大连', '东莞', '大庆', '德阳'],
  E: ['鄂州', '恩施', '鄂尔多斯'],
  F: ['福州', '佛山', '阜阳', '抚州'],
  G: ['广州', '贵阳', '桂林', '赣州'],
  H: ['杭州', '合肥', '哈尔滨', '海口', '惠州'],
  J: ['济南', '嘉兴', '金华', '荆州', '九江'],
  K: ['昆明', '开封', '克拉玛依'],
  L: ['兰州', '拉萨', '洛阳', '柳州', '临沂'],
  M: ['绵阳', '牡丹江', '马鞍山', '梅州'],
  N: ['南京', '南昌', '南宁', '宁波', '南通'],
  P: ['攀枝花', '莆田', '平顶山', '濮阳'],
  Q: ['青岛', '泉州', '秦皇岛', '衢州'],
  S: ['上海', '深圳', '苏州', '沈阳', '绍兴'],
  T: ['天津', '太原', '唐山', '台州'],
  W: ['武汉', '无锡', '温州', '潍坊', '威海'],
  X: ['西安', '厦门', '徐州', '襄阳', '咸阳'],
  Y: ['烟台', '扬州', '宜昌', '银川', '岳阳'],
  Z: ['郑州', '珠海', '中山', '湛江', '镇江']
};

const CITY_ITEMS: IndexBarSection[] = Object.entries(CITY_DATA).map(([letter, cities]) => ({
  children: cities.map(city => ({ key: city, text: city })),
  title: letter
}));

/** 命令式定位的几个落点，取首、中、尾 */
const QUICK_INDEXES = ['A', 'M', 'Z'];

/** 自定义子项的高度，同时是 IndexBar 的滚动定位度量，所以只在这里写一次 */
const CUSTOM_ITEM_HEIGHT = 64;

/** Demo 占位区号：按城市名稳定散列，免得为几十座城市维护一张表 */
function toAreaCode(key: string) {
  const seed = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return `0${(seed % 800) + 100}`;
}

const IndexBarDemo = () => {
  const [variant, setVariant] = useState<DemoVariant>('basic');
  const [activeIndex, setActiveIndex] = useState(CITY_ITEMS[0].title);
  const [pressedItem, setPressedItem] = useState<IndexBarChild | null>(null);

  const indexBarRef = useRef<IndexBarRef>(null);

  function handlePressItem(item: IndexBarChild) {
    setPressedItem(item);
  }

  /** 切换变体会换掉一棵子树，高亮从头开始，外部镜像的状态也要跟着归零 */
  function handleSelectVariant(value: DemoVariant) {
    setVariant(value);
    setActiveIndex(CITY_ITEMS[0].title);
    setPressedItem(null);
  }

  /** 自定义子项：外层已经被钉在 CUSTOM_ITEM_HEIGHT 上，这里只负责把内容撑满并垂直居中 */
  function renderCityItem(item: IndexBarChild, section: IndexBarSection) {
    return (
      <Pressable
        className="h-full flex-row items-center gap-3 px-3 active:opacity-80"
        onPress={() => handlePressItem(item)}
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Text className="text-sm font-semibold text-primary">{section.title}</Text>
        </View>

        <View className="flex-1 gap-1">
          <Text className="text-sm font-medium text-foreground">{item.text}</Text>
          <Text className="text-xs text-muted-foreground">区号 {toAreaCode(item.key)}</Text>
        </View>
      </Pressable>
    );
  }

  function renderIndexBar() {
    if (variant === 'imperative') {
      return (
        <IndexBar
          ref={indexBarRef}
          items={CITY_ITEMS}
          onIndexChange={setActiveIndex}
          onPressItem={handlePressItem}
        />
      );
    }

    if (variant === 'custom') {
      return (
        <IndexBar
          itemHeight={CUSTOM_ITEM_HEIGHT}
          items={CITY_ITEMS}
          renderItem={renderCityItem}
          sectionHeaderHeight={28}
          onIndexChange={setActiveIndex}
        />
      );
    }

    if (variant === 'slots') {
      return (
        <IndexBar
          haptic={false}
          itemHeight={52}
          items={CITY_ITEMS}
          sectionHeaderHeight={40}
          sticky={false}
          classNames={{
            // 索引条加宽了，列表的右内边距要跟着加宽，否则文字会钻到字母底下
            content: 'bg-secondary pr-10',
            item: 'mx-2 rounded-xl bg-background px-4',
            itemText: 'text-sm font-medium text-primary',
            sectionHeader: 'bg-primary/10 px-4',
            sectionHeaderText: 'text-sm font-semibold text-primary',
            // 只把线藏起来，不动高度：分隔线的占位是滚动定位的度量之一
            separator: 'mx-0 my-0 opacity-0',
            sidebar: 'w-10',
            sidebarItem: 'h-6 w-6',
            // 只放大字号，颜色留给 active 变体去决定，覆盖了就分不出激活态了
            sidebarItemText: 'text-sm'
          }}
          onIndexChange={setActiveIndex}
        />
      );
    }

    return (
      <IndexBar
        items={CITY_ITEMS}
        onIndexChange={setActiveIndex}
        onPressItem={handlePressItem}
      />
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* 变体切换：IndexBar 自己要占满剩余高度并独占纵向滚动，所以不套在竖向 ScrollView 里逐段罗列 */}
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

      {/* 命令式示例：对外的定位入口是字母而不是下标 */}
      {variant === 'imperative' ? (
        <View className="flex-row items-center gap-3 px-4 pb-3">
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
      ) : null}

      <View className="flex-row items-center gap-2 px-4 pb-3">
        <Text className="text-xs text-muted-foreground">当前索引：{activeIndex}</Text>
        <Text className="flex-1 text-right text-xs text-muted-foreground">
          {pressedItem ? `点击了 ${pressedItem.text}` : '试着滚动列表看高亮联动'}
        </Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">{renderIndexBar()}</View>
    </View>
  );
};

export { IndexBarDemo };
