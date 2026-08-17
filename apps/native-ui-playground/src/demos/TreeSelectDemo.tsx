import { Button, Text, TreeSelect } from '@skyroc/native-ui';
import type { TreeSelectActiveId, TreeSelectItem } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 把选中值渲染成一行文本，单选多选共用 */
function formatActiveId(activeId: TreeSelectActiveId) {
  if (Array.isArray(activeId)) return activeId.join('、') || '无';

  return activeId === null ? '无' : String(activeId);
}

/** 把「分组名 + 子项名」的简写转成 items，子项 id 用「组序号-项序号」保证全局唯一 */
function toItems(groups: [string, string[]][]): TreeSelectItem[] {
  return groups.map(([text, children], groupIndex) => ({
    children: children.map((childText, childIndex) => ({
      id: `${groupIndex}-${childIndex}`,
      text: childText
    })),
    id: text,
    text
  }));
}

const CITY_ITEMS = toItems([
  ['浙江', ['杭州', '宁波', '温州', '嘉兴', '湖州']],
  ['江苏', ['南京', '苏州', '无锡', '常州']],
  ['福建', ['福州', '厦门', '泉州']]
]);

const TAG_ITEMS = toItems([
  ['口味', ['麻辣', '清淡', '酸甜', '咸鲜']],
  ['菜系', ['川菜', '粤菜', '徽菜']],
  ['忌口', ['不吃香菜', '不吃葱', '不吃辣']]
]);

const BADGE_ITEMS: TreeSelectItem[] = [
  { children: [{ id: 'all-1', text: '全部订单' }], id: 'all', text: '全部' },
  { badge: 3, children: [{ id: 'pay-1', text: '待付款订单' }], id: 'pay', text: '待付款' },
  { children: [{ id: 'ship-1', text: '待收货订单' }], dot: true, id: 'ship', text: '待收货' },
  { badge: 128, children: [{ id: 'refund-1', text: '退款订单' }], id: 'refund', text: '退款' }
];

const DISABLED_ITEMS: TreeSelectItem[] = [
  {
    children: [
      { id: 'draft-1', text: '草稿一' },
      { disabled: true, id: 'draft-2', text: '草稿二（禁用）' },
      { id: 'draft-3', text: '草稿三' }
    ],
    id: 'draft',
    text: '草稿'
  },
  { children: [{ id: 'review-1', text: '审核中的内容' }], disabled: true, id: 'review', text: '审核中' },
  { children: [{ id: 'published-1', text: '已发布的内容' }], id: 'published', text: '已发布' }
];

const CUSTOM_ITEMS = toItems([
  ['设计', []],
  ['研发', []],
  ['测试', []]
]);

/** 分组会被裁短，用来验证 items 变短后激活索引自动收敛，不会留下空白右栏 */
const SHRINK_ITEMS = toItems([
  ['第一组', ['A1', 'A2']],
  ['第二组', ['B1', 'B2']],
  ['第三组', ['C1', 'C2']],
  ['第四组', ['D1', 'D2']]
]);

const MAX_COUNT = 3;

const TreeSelectDemo = () => {
  const [city, setCity] = useState<TreeSelectActiveId>('0-0');
  const [tags, setTags] = useState<TreeSelectActiveId>(['0-0', '1-1']);
  const [navIndex, setNavIndex] = useState(0);
  const [controlledId, setControlledId] = useState<TreeSelectActiveId>('1-0');
  const [controlledNav, setControlledNav] = useState(1);
  const [groupCount, setGroupCount] = useState(SHRINK_ITEMS.length);

  const shrinkItems = SHRINK_ITEMS.slice(0, groupCount);
  const selectedTagCount = Array.isArray(tags) ? tags.length : 0;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <Text className="mb-3 text-sm text-muted-foreground">左侧切换分组，右侧单选，选中项打勾并高亮</Text>
      <View className="mb-2 overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          activeId={city}
          items={CITY_ITEMS}
          onActiveIdChange={setCity}
        />
      </View>
      <Text className="mb-8 text-sm text-muted-foreground">当前选中：{formatActiveId(city)}</Text>

      {/* Multiple */}
      <Text className="mb-4 text-lg font-semibold">Multiple</Text>
      <Text className="mb-3 text-sm text-muted-foreground">
        multiple 开启多选，max={String(MAX_COUNT)} 后再点未选中项不会有任何反应，已选中项仍可取消
      </Text>
      <View className="mb-2 overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          multiple
          activeId={tags}
          items={TAG_ITEMS}
          max={MAX_COUNT}
          onActiveIdChange={setTags}
        />
      </View>
      <Text className="mb-8 text-sm text-muted-foreground">
        已选 {selectedTagCount} / {MAX_COUNT}：{formatActiveId(tags)}
      </Text>

      {/* Badge */}
      <Text className="mb-4 text-lg font-semibold">Badge</Text>
      <Text className="mb-3 text-sm text-muted-foreground">分组支持 badge 与 dot，透传给左侧导航</Text>
      <View className="mb-8 overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          defaultActiveId="pay-1"
          defaultMainActiveIndex={1}
          items={BADGE_ITEMS}
          height={220}
        />
      </View>

      {/* Disabled */}
      <Text className="mb-4 text-lg font-semibold">Disabled</Text>
      <Text className="mb-3 text-sm text-muted-foreground">分组与子项都能单独禁用，禁用项降透明度且不响应点击</Text>
      <View className="mb-8 overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          height={220}
          items={DISABLED_ITEMS}
        />
      </View>

      {/* Controlled */}
      <Text className="mb-4 text-lg font-semibold">Controlled</Text>
      <Text className="mb-3 text-sm text-muted-foreground">分组索引与选中值都由外部 state 决定</Text>
      <View className="mb-4 overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          activeId={controlledId}
          items={CITY_ITEMS}
          mainActiveIndex={controlledNav}
          onActiveIdChange={setControlledId}
          onMainActiveIndexChange={setControlledNav}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          color="secondary"
          variant="outline"
          onPress={() => setControlledNav(value => Math.max(0, value - 1))}
        >
          上一组
        </Button>
        <Button
          color="primary"
          variant="tonal"
          onPress={() => setControlledNav(value => Math.min(CITY_ITEMS.length - 1, value + 1))}
        >
          下一组
        </Button>
        <Button
          color="secondary"
          variant="ghost"
          onPress={() => setControlledId(null)}
        >
          清空选中
        </Button>
      </View>
      <Text className="mb-8 text-sm text-muted-foreground">
        分组：{CITY_ITEMS[controlledNav].text} / 选中：{formatActiveId(controlledId)}
      </Text>

      {/* Custom content */}
      <Text className="mb-4 text-lg font-semibold">Custom Content</Text>
      <Text className="mb-3 text-sm text-muted-foreground">renderContent 接收当前分组与下标，右侧内容完全自定义</Text>
      <View className="mb-8 overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          height={220}
          items={CUSTOM_ITEMS}
          renderContent={(item, index) => (
            <View className="flex-1 items-center justify-center gap-2 p-4">
              <Text className="text-base font-semibold">{item.text}</Text>
              <Text className="text-center text-sm text-muted-foreground">第 {index + 1} 个分组的自定义内容</Text>
            </View>
          )}
          onClickNav={setNavIndex}
        />
      </View>
      <Text className="mb-8 text-sm text-muted-foreground">最近点击的分组下标：{navIndex}</Text>

      {/* Dynamic items */}
      <Text className="mb-4 text-lg font-semibold">Dynamic Items</Text>
      <Text className="mb-3 text-sm text-muted-foreground">
        先选中靠后的分组再删掉它，激活索引会收敛到最后一组，而不是留下空白右栏
      </Text>
      <View className="mb-4 overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          height={200}
          items={shrinkItems}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          color="secondary"
          variant="outline"
          onPress={() => setGroupCount(count => Math.max(1, count - 1))}
        >
          删掉最后一组
        </Button>
        <Button
          color="primary"
          variant="tonal"
          onPress={() => setGroupCount(count => Math.min(SHRINK_ITEMS.length, count + 1))}
        >
          加回一组
        </Button>
        <Text className="text-sm text-muted-foreground">当前 {groupCount} 组</Text>
      </View>

      {/* Custom slots */}
      <Text className="mb-4 text-lg font-semibold">Custom Slots</Text>
      <Text className="mb-3 text-sm text-muted-foreground">
        classNames 覆写自身各插槽，左侧导航内部的插槽走 sidebarClassNames
      </Text>
      <View className="mb-8 overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          classNames={{
            content: 'bg-primary-50',
            contentItem: 'px-5 py-4',
            selectedIcon: 'accent-success',
            sidebar: 'w-28 self-stretch bg-primary-100'
          }}
          defaultActiveId="0-1"
          height={220}
          items={CITY_ITEMS}
          sidebarClassNames={{ indicator: 'h-6 bg-success' }}
        />
      </View>
    </ScrollView>
  );
};

export { TreeSelectDemo };
