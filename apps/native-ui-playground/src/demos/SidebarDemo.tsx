import { Button, Sidebar, Text } from '@skyroc/native-ui';
import type { SidebarItem } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 右侧内容区属性 */
interface PanelProps {
  /** 正文说明 */
  description: string;

  /** 面板标题 */
  title: string;
}

const Panel = (props: PanelProps) => {
  const { description, title } = props;

  return (
    <View className="flex-1 items-center justify-center gap-2 p-4">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-center text-sm text-muted-foreground">{description}</Text>
    </View>
  );
};

/** 把一组标题转成最简单的 items */
function toItems(titles: string[]): SidebarItem[] {
  return titles.map(title => ({ key: title, title }));
}

const BASIC_ITEMS = toItems(['推荐', '手机数码', '家用电器', '男装', '女装', '生鲜']);

/** 项高故意不一致：多行标题、单行标题混排，用来验证指示器逐项测量而不是按首项高度推算 */
const UNEVEN_ITEMS = toItems(['热销', '家庭清洁 / 纸品', '个护', '医药健康与营养品', '母婴']);

const BADGE_ITEMS: SidebarItem[] = [
  { key: 'all', title: '全部' },
  { badge: 3, key: 'pending', title: '待付款' },
  { key: 'shipping', title: '待收货' },
  { dot: true, key: 'review', title: '待评价' },
  { badge: 128, key: 'refund', title: '退款' }
];

const DISABLED_ITEMS: SidebarItem[] = [
  { key: 'draft', title: '草稿' },
  { disabled: true, key: 'reviewing', title: '审核中' },
  { key: 'published', title: '已发布' },
  { disabled: true, key: 'archived', title: '已下架' }
];

const CONTROLLED_ITEMS = toItems(['基本信息', '收货地址', '支付方式', '发票信息']);

const SCROLL_ITEMS = toItems(Array.from({ length: 20 }, (_, index) => `分类 ${String(index + 1).padStart(2, '0')}`));

const STATIC_ITEMS = toItems(['概览', '明细', '设置']);

const CUSTOM_ITEMS = toItems(['设计', '研发', '测试']);

const SidebarDemo = () => {
  const [basicIndex, setBasicIndex] = useState(0);
  const [unevenIndex, setUnevenIndex] = useState(3);
  const [badgeIndex, setBadgeIndex] = useState(1);
  const [disabledIndex, setDisabledIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [stepKey, setStepKey] = useState(CONTROLLED_ITEMS[0].key);
  const [scrollIndex, setScrollIndex] = useState(11);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8 h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch"
          items={BASIC_ITEMS}
          onIndexChange={setBasicIndex}
        />
        <Panel
          description="指示器落在激活项的垂直中心，切换时做位移动画"
          title={BASIC_ITEMS[basicIndex].title as string}
        />
      </View>

      {/* Uneven items */}
      <Text className="mb-4 text-lg font-semibold">Uneven Items</Text>
      <Text className="mb-3 text-sm text-muted-foreground">
        标题换行导致各项高度不一，指示器仍然逐项对齐——每项自己上报布局，不按首项高度推算
      </Text>
      <View className="mb-8 h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="w-24 self-stretch"
          defaultActiveIndex={3}
          items={UNEVEN_ITEMS}
          onIndexChange={setUnevenIndex}
        />
        <Panel
          description="试着点最后一项再点第二项，指示器不会越对越偏"
          title={UNEVEN_ITEMS[unevenIndex].title as string}
        />
      </View>

      {/* Badge */}
      <Text className="mb-4 text-lg font-semibold">Badge</Text>
      <View className="mb-8 h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch"
          defaultActiveIndex={1}
          items={BADGE_ITEMS}
          onIndexChange={setBadgeIndex}
        />
        <Panel
          description="badge 传数字、dot 传小红点，角标贴着标题而不是飞到整项右边缘"
          title={BADGE_ITEMS[badgeIndex].title as string}
        />
      </View>

      {/* Disabled */}
      <Text className="mb-4 text-lg font-semibold">Disabled</Text>
      <View className="mb-8 h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch"
          items={DISABLED_ITEMS}
          onIndexChange={setDisabledIndex}
        />
        <Panel
          description="禁用项整体降透明度且不响应点击"
          title={DISABLED_ITEMS[disabledIndex].title as string}
        />
      </View>

      {/* Controlled */}
      <Text className="mb-4 text-lg font-semibold">Controlled</Text>
      <Text className="mb-3 text-sm text-muted-foreground">
        onIndexChange 第二个参数直接给出该项配置，可以按 key 持久化选中态而不是存下标
      </Text>
      <View className="mb-4 h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          activeIndex={step}
          className="self-stretch"
          items={CONTROLLED_ITEMS}
          onIndexChange={(index, item) => {
            setStep(index);
            setStepKey(item.key);
          }}
        />
        <Panel
          description="激活索引完全由外部 state 决定"
          title={CONTROLLED_ITEMS[step].title as string}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          color="secondary"
          variant="outline"
          onPress={() => setStep(value => Math.max(0, value - 1))}
        >
          上一项
        </Button>
        <Button
          color="primary"
          variant="tonal"
          onPress={() => setStep(value => Math.min(CONTROLLED_ITEMS.length - 1, value + 1))}
        >
          下一项
        </Button>
        <Text className="text-sm text-muted-foreground">
          index：{step} / key：{stepKey}
        </Text>
      </View>

      {/* Scrollable */}
      <Text className="mb-4 text-lg font-semibold">Scrollable</Text>
      <Text className="mb-3 text-sm text-muted-foreground">项数超出容器高度时侧边栏自身可纵向滚动，指示器跟着内容一起滚</Text>
      <View className="mb-8 h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch"
          defaultActiveIndex={11}
          items={SCROLL_ITEMS}
          onIndexChange={setScrollIndex}
        />
        <Panel
          description="默认激活第 12 项，向下滚动即可看到指示器"
          title={SCROLL_ITEMS[scrollIndex].title as string}
        />
      </View>

      {/* Not scrollable */}
      <Text className="mb-4 text-lg font-semibold">Not Scrollable</Text>
      <Text className="mb-3 text-sm text-muted-foreground">
        scrollable={'{false}'} 时根节点退化成普通 View，交给外层容器滚动，避免嵌套滚动
      </Text>
      <View className="mb-8 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          items={STATIC_ITEMS}
          scrollable={false}
        />
        <Panel
          description="这一块没有固定高度，由侧边栏自身内容撑开"
          title="随内容撑开"
        />
      </View>

      {/* Custom slots */}
      <Text className="mb-4 text-lg font-semibold">Custom Slots</Text>
      <Text className="mb-3 text-sm text-muted-foreground">改指示器高度不会让它错位——居中偏移取自实测高度，不是写死的常量</Text>
      <View className="mb-8 h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch bg-muted/40"
          classNames={{
            indicator: 'h-10 w-1.5 rounded-sm bg-destructive',
            item: 'px-6 py-6',
            itemText: 'text-base'
          }}
          items={CUSTOM_ITEMS}
        />
        <Panel
          description="indicator / item / itemText 各插槽都可以覆写"
          title="自定义插槽"
        />
      </View>
    </ScrollView>
  );
};

export { SidebarDemo };
