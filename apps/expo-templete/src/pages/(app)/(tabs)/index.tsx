import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Badge, Button, Cell, CellGroup, Grid, Text } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { withUniwind } from 'uniwind';

import type { HomeNotice, HomeStat, HomeStatKey, HomeTodo, HomeTodoLevel } from '@/feature/demo';
import { useHomeSummaryQuery, useUnreadCountQuery } from '@/feature/demo';

const Icon = withUniwind(MaterialCommunityIcons);

/** ScrollViewMarker 是原生视图，不吃 className，只能给 style */
const FILL = { flex: 1 } as const;

/** 金刚区的一个入口 */
interface QuickEntry {
  /** 图标取色，只接受 `accent-*` 工具类 */
  accent: string;

  href: Href;

  icon: keyof typeof MaterialCommunityIcons.glyphMap;

  label: string;

  /** 图标底色类名 */
  tint: string;
}

/**
 * 金刚区。
 *
 * 它是**常用入口的快捷方式**，不是目录——全量能力清单在「发现」tab，所以最后一格留给「全部」。 业务项目照着改的时候，这里放的应该是用户每天点的那几个，不要一路加到二十格。
 */
const QUICK_ENTRIES: QuickEntry[] = [
  {
    accent: 'accent-primary',
    href: '/demo/orders',
    icon: 'receipt-text-outline',
    label: '我的订单',
    tint: 'bg-primary/10'
  },
  {
    accent: 'accent-info',
    href: '/demo/contacts',
    icon: 'account-search-outline',
    label: '通讯录',
    tint: 'bg-info/10'
  },
  {
    accent: 'accent-warning',
    href: '/demo/activity',
    icon: 'timeline-text-outline',
    label: '操作日志',
    tint: 'bg-warning/10'
  },
  {
    accent: 'accent-success',
    href: '/demo/map',
    icon: 'map-marker-radius-outline',
    label: '地图导航',
    tint: 'bg-success/10'
  },
  {
    accent: 'accent-info',
    href: '/demo/bluetooth',
    icon: 'bluetooth',
    label: '蓝牙',
    tint: 'bg-info/10'
  },
  {
    accent: 'accent-success',
    href: '/demo/wechat',
    icon: 'wechat',
    label: '微信能力',
    tint: 'bg-success/10'
  },
  {
    accent: 'accent-destructive',
    href: '/demo/live-activity',
    icon: 'cellphone-dock',
    label: '灵动岛',
    tint: 'bg-destructive/10'
  },
  {
    accent: 'accent-muted-foreground',
    href: '/explore',
    icon: 'dots-horizontal',
    label: '全部',
    tint: 'bg-muted'
  }
];

/** 统计项的图标。配色不用查表——整张卡是 bg-primary，里面一律 primary-foreground */
const STAT_ICONS: Record<HomeStatKey, keyof typeof MaterialCommunityIcons.glyphMap> = {
  done: 'check-circle-outline',
  pending: 'clock-outline',
  running: 'progress-clock'
};

/** 待办紧急程度的圆点配色与文案 */
const TODO_LEVEL_META: Record<HomeTodoLevel, { dot: string; label: string }> = {
  high: { dot: 'bg-destructive', label: '紧急' },
  low: { dot: 'bg-muted-foreground', label: '不急' },
  normal: { dot: 'bg-warning', label: '普通' }
};

/** 首屏骨架：块的位置和真实内容对齐，数据回来时不会整页跳动 */
const HomeSkeleton = () => (
  <View className="gap-4 px-4">
    <View className="h-28 rounded-3xl bg-muted" />

    <View className="h-44 rounded-2xl bg-muted" />

    <View className="h-20 rounded-2xl bg-muted" />

    <View className="h-40 rounded-2xl bg-muted" />
  </View>
);

/** 首屏失败态。整屏只有一个请求，所以失败就是整屏失败，给一个够大的重试按钮 */
const HomeError = ({ onRetry }: { onRetry: () => void }) => (
  <View className="items-center gap-3 px-4 py-16">
    <Icon
      colorClassName="accent-muted-foreground"
      name="cloud-off-outline"
      size={40}
    />

    <Text
      color="muted"
      size="sm"
    >
      没能拉到首页数据
    </Text>

    <Button
      size="sm"
      variant="tonal"
      onPress={onRetry}
    >
      重试
    </Button>
  </View>
);

/** 统计卡：整张卡吃品牌色，三个数字等分，中间用半透明前景色分隔 */
const HomeStatsCard = ({ stats }: { stats: HomeStat[] }) => (
  <View className="mx-4 flex-row rounded-3xl bg-primary px-2 py-4">
    {stats.map((stat, index) => (
      <View
        key={stat.key}
        className={`flex-1 items-center gap-1 ${index > 0 ? 'border-l border-primary-foreground/20' : ''}`}
      >
        <Icon
          colorClassName="accent-primary-foreground"
          name={STAT_ICONS[stat.key]}
          size={18}
        />

        <Text
          className="text-2xl leading-none text-primary-foreground"
          weight="bold"
        >
          {stat.value}
        </Text>

        <Text
          className="text-xs text-primary-foreground/80"
          size="xs"
        >
          {stat.label}
        </Text>
      </View>
    ))}
  </View>
);

/** 公告条 */
const HomeNoticeCard = ({ notice }: { notice: HomeNotice }) => (
  <View className="mx-4 flex-row gap-3 rounded-2xl bg-warning/10 p-3">
    <View className="size-8 items-center justify-center rounded-full bg-warning/20">
      <Icon
        colorClassName="accent-warning"
        name="bullhorn-outline"
        size={16}
      />
    </View>

    <View className="flex-1 gap-1">
      <View className="flex-row items-center gap-2">
        <Text
          className="flex-1"
          numberOfLines={1}
          size="sm"
          weight="semibold"
        >
          {notice.title}
        </Text>

        <Text
          color="muted"
          size="2xs"
        >
          {notice.publishedAt}
        </Text>
      </View>

      <Text
        color="muted"
        numberOfLines={2}
        size="xs"
      >
        {notice.content}
      </Text>
    </View>
  </View>
);

/** 待办列表 */
const HomeTodoGroup = ({ todos }: { todos: HomeTodo[] }) => (
  <CellGroup
    inset
    border
    title="我的待办"
  >
    {todos.map(todo => {
      const meta = TODO_LEVEL_META[todo.level];

      return (
        <Cell
          center={false}
          key={todo.id}
          showArrow
          title={todo.title}
          leading={<View className={`mt-1.5 size-2 rounded-full ${meta.dot}`} />}
          subtitle={
            <Text
              color="muted"
              size="xs"
            >
              {meta.label} · {todo.owner} · {todo.deadline}
            </Text>
          }
        />
      );
    })}
  </CellGroup>
);

/**
 * 首页。
 *
 * 这一页要立起来的是 tab 根页面的排版骨架：页面自己拼头部并吃掉状态栏安全区、**一个**顶层 ScrollView（自动内容内边距只认它，见 `(tabs)/_layout`）、下拉刷新、以及首屏三态（骨架 / 失败 / 内容）。
 *
 * 首屏只打一个 `useHomeSummaryQuery`：拆成四五个接口的话，页面上要处理的 loading × error 组合 会以乘法增长，弱网下还会出现半屏空着的中间态。真正独立的东西（未读数）才单开一个 query。
 */
const HomeScreen = () => {
  const router = useRouter();

  const { data, isError, isPending, isRefetching, refetch } = useHomeSummaryQuery();

  const { data: unreadCount = 0 } = useUnreadCountQuery();

  const pendingCount = data?.stats.find(stat => stat.key === 'pending')?.value ?? 0;

  function renderBody() {
    if (isPending) return <HomeSkeleton />;

    if (isError || !data) return <HomeError onRetry={refetch} />;

    return (
      <View className="gap-4">
        <HomeStatsCard stats={data.stats} />

        <View className="mx-4 rounded-2xl bg-card py-1">
          <Grid
            columnNum={4}
            classNames={{ content: 'px-1 py-3', text: 'text-xs text-muted-foreground' }}
            items={QUICK_ENTRIES.map(entry => ({
              key: entry.label,
              // 用 navigate 而不是 push：最后一格「全部」的目标是另一个 tab，push 会把它当新页面
              // 压到当前栈上，tab bar 的选中态就和内容对不上了
              onPress: () => router.navigate(entry.href),
              text: entry.label,
              icon: (
                <View className={`size-11 items-center justify-center rounded-2xl ${entry.tint}`}>
                  <Icon
                    colorClassName={entry.accent}
                    name={entry.icon}
                    size={22}
                  />
                </View>
              )
            }))}
          />
        </View>

        <HomeNoticeCard notice={data.notice} />

        <HomeTodoGroup todos={data.todos} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* 头部固定在滚动区之外：跟着滚的话，下拉刷新的转圈会从标题底下钻出来 */}
      <View className="flex-row items-center justify-between gap-3 px-4 pb-4 pt-safe-offset-2">
        <View className="flex-1 gap-0.5">
          <Text
            size="2xl"
            weight="bold"
          >
            你好{data ? `，${data.userName}` : ''}
          </Text>

          <Text
            color="muted"
            size="sm"
          >
            {isPending ? '正在拉取今天的安排' : `今天还有 ${pendingCount} 件事待处理`}
          </Text>
        </View>

        <Badge
          max={99}
          content={unreadCount}
        >
          <Pressable
            accessibilityLabel="消息"
            accessibilityRole="button"
            className="size-10 items-center justify-center rounded-full bg-muted active:opacity-70"
            onPress={() => router.navigate('/messages')}
          >
            <Icon
              colorClassName="accent-foreground"
              name="bell-outline"
              size={20}
            />
          </Pressable>
        </Badge>
      </View>

      <ScrollViewMarker style={FILL}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-6"
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
            />
          }
        >
          {renderBody()}
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
};

export default HomeScreen;
