import { Button, Tabs, Text } from '@skyroc/native-ui';
import type { TabItem } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 面板占位内容属性 */
interface PanelProps {
  /** 正文说明 */
  description: string;

  /** 面板标题 */
  title: string;
}

const Panel = (props: PanelProps) => {
  const { description, title } = props;

  return (
    <View className="flex-1 items-center justify-center gap-2 p-6">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-center text-sm text-muted-foreground">{description}</Text>
    </View>
  );
};

/** 懒加载面板属性 */
interface LazyPanelProps {
  /** 面板标题 */
  title: string;
}

/** 记录首次挂载时刻，用于验证「加载后常驻、切走不卸载」 */
const LazyPanel = (props: LazyPanelProps) => {
  const { title } = props;

  const mountedAtRef = useRef(new Date().toLocaleTimeString());

  return (
    <View className="flex-1 items-center justify-center gap-2 p-6">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-sm text-muted-foreground">挂载于 {mountedAtRef.current}</Text>
      <Text className="text-center text-xs text-muted-foreground">来回切换，时间不变说明面板没有被卸载重建</Text>
    </View>
  );
};

const BASIC_ITEMS: TabItem[] = [
  {
    children: (
      <Panel
        description="line 型指示器贴在 tabBar 底部，宽度跟随激活项"
        title="推荐"
      />
    ),
    key: 'recommend',
    title: '推荐'
  },
  {
    children: (
      <Panel
        description="左右滑动面板即可切换，指示器与滚动位置会跟着动"
        title="关注"
      />
    ),
    key: 'following',
    title: '关注'
  },
  {
    children: (
      <Panel
        description="点击 tab 与手势滑动共用同一份激活索引"
        title="热榜"
      />
    ),
    key: 'hot',
    title: '热榜'
  }
];

const PILL_ITEMS: TabItem[] = [
  {
    children: (
      <Panel
        description="pill 型指示器撑满 tab 高度，作为选中态背景"
        title="全部"
      />
    ),
    key: 'all',
    title: '全部'
  },
  {
    children: (
      <Panel
        description="tabBar 自身带底色与内边距，tab 等分宽度"
        title="进行中"
      />
    ),
    key: 'ongoing',
    title: '进行中'
  },
  {
    children: (
      <Panel
        description="指示器先于文字渲染，靠绘制顺序压在下层"
        title="已完成"
      />
    ),
    key: 'done',
    title: '已完成'
  }
];

const SCROLLABLE_ITEMS: TabItem[] = [
  '前端工程',
  '客户端',
  '人工智能',
  '后端开发',
  '数据分析',
  '音视频',
  '安全攻防',
  '产品设计'
].map(name => ({
  children: (
    <Panel
      description="tab 总宽超出容器时 tabBar 可横向滚动，激活项会自动居中"
      title={name}
    />
  ),
  key: name,
  title: name
}));

const DISABLED_ITEMS: TabItem[] = [
  {
    children: (
      <Panel
        description="从这里向右滑，会越过被禁用的「审核中」"
        title="草稿"
      />
    ),
    key: 'draft',
    title: '草稿'
  },
  {
    children: (
      <Panel
        description="不会被展示"
        title="审核中"
      />
    ),
    disabled: true,
    key: 'reviewing',
    title: '审核中'
  },
  {
    children: (
      <Panel
        description="滑动落到禁用页时，会沿滑动方向回弹到最近的可用页"
        title="已发布"
      />
    ),
    key: 'published',
    title: '已发布'
  },
  {
    children: (
      <Panel
        description="不会被展示"
        title="已下架"
      />
    ),
    disabled: true,
    key: 'archived',
    title: '已下架'
  }
];

const CONTROLLED_ITEMS: TabItem[] = ['第一步', '第二步', '第三步'].map((name, index) => ({
  children: (
    <Panel
      description={`当前是第 ${index + 1} 步，索引完全由外部 state 决定`}
      title={name}
    />
  ),
  key: name,
  title: name
}));

const LAZY_ITEMS: TabItem[] = ['日报', '周报', '月报', '年报'].map(name => ({
  children: <LazyPanel title={name} />,
  key: name,
  title: name
}));

const STATIC_ITEMS: TabItem[] = ['概览', '明细'].map(name => ({
  children: (
    <Panel
      description="关闭 swipeable 后只能点击切换，面板改用 display 切换"
      title={name}
    />
  ),
  key: name,
  title: name
}));

const CUSTOM_ITEMS: TabItem[] = ['设计', '研发', '测试'].map(name => ({
  children: (
    <Panel
      description="通过 classNames 覆写 tabBar / tab / tabText / indicator 各插槽"
      title={name}
    />
  ),
  key: name,
  title: name
}));

const TabsDemo = () => {
  const [step, setStep] = useState(0);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8 h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs items={BASIC_ITEMS} />
      </View>

      {/* Pill */}
      <Text className="mb-4 text-lg font-semibold">Pill</Text>
      <View className="mb-8 h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          items={PILL_ITEMS}
          type="pill"
        />
      </View>

      {/* Scrollable */}
      <Text className="mb-4 text-lg font-semibold">Scrollable</Text>
      <Text className="mb-3 text-sm text-muted-foreground">tab 数量超出一屏，tabBar 横向滚动并自动居中激活项</Text>
      <View className="mb-8 h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          defaultActiveIndex={4}
          items={SCROLLABLE_ITEMS}
        />
      </View>

      {/* Disabled */}
      <Text className="mb-4 text-lg font-semibold">Disabled</Text>
      <Text className="mb-3 text-sm text-muted-foreground">禁用项既不可点击，手势滑过时也会自动回弹</Text>
      <View className="mb-8 h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs items={DISABLED_ITEMS} />
      </View>

      {/* Controlled */}
      <Text className="mb-4 text-lg font-semibold">Controlled</Text>
      <View className="mb-4 h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          activeIndex={step}
          items={CONTROLLED_ITEMS}
          type="pill"
          onIndexChange={setStep}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          color="secondary"
          variant="outline"
          onPress={() => setStep(value => Math.max(0, value - 1))}
        >
          上一步
        </Button>
        <Button
          color="primary"
          variant="tonal"
          onPress={() => setStep(value => Math.min(CONTROLLED_ITEMS.length - 1, value + 1))}
        >
          下一步
        </Button>
        <Text className="text-sm text-muted-foreground">activeIndex：{step}</Text>
      </View>

      {/* Lazy */}
      <Text className="mb-4 text-lg font-semibold">Lazy</Text>
      <Text className="mb-3 text-sm text-muted-foreground">
        只渲染当前及相邻各 1 个面板；已加载的面板常驻，切回来挂载时间不变
      </Text>
      <View className="mb-8 h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          lazy
          items={LAZY_ITEMS}
          lazyPreloadDistance={1}
          renderLazyPlaceholder={() => (
            <View className="flex-1 items-center justify-center">
              <Text className="text-sm text-muted-foreground">尚未加载</Text>
            </View>
          )}
        />
      </View>

      {/* Swipe disabled */}
      <Text className="mb-4 text-lg font-semibold">Swipe Disabled</Text>
      <View className="mb-8 h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          items={STATIC_ITEMS}
          swipeable={false}
          type="pill"
        />
      </View>

      {/* Custom slots */}
      <Text className="mb-4 text-lg font-semibold">Custom Slots</Text>
      <View className="mb-8 h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          classNames={{
            indicator: 'h-1 bg-destructive',
            tab: 'px-8 py-4',
            tabBar: 'bg-muted/40',
            tabText: 'text-base'
          }}
          items={CUSTOM_ITEMS}
        />
      </View>
    </ScrollView>
  );
};

export { TabsDemo };
