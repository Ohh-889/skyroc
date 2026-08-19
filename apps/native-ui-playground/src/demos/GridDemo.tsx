import { Grid, Text } from '@skyroc/native-ui';
import type { GridItemData } from '@skyroc/native-ui';
import { Alert, ScrollView, View } from 'react-native';

interface DemoIconProps {
  /** 图标中展示的简短标识 */
  label: string;
  /** 用于区分不同入口的语义色 */
  tone: 'info' | 'primary' | 'success' | 'warning';
}

const DemoIcon = (props: DemoIconProps) => {
  const { label, tone } = props;

  if (tone === 'success') {
    return (
      <View className="size-10 items-center justify-center rounded-2xl bg-success/10">
        <Text className="text-sm font-semibold text-success">{label}</Text>
      </View>
    );
  }
  if (tone === 'info') {
    return (
      <View className="size-10 items-center justify-center rounded-2xl bg-info/10">
        <Text className="text-sm font-semibold text-info">{label}</Text>
      </View>
    );
  }
  if (tone === 'warning') {
    return (
      <View className="size-10 items-center justify-center rounded-2xl bg-warning/10">
        <Text className="text-sm font-semibold text-warning">{label}</Text>
      </View>
    );
  }

  return (
    <View className="size-10 items-center justify-center rounded-2xl bg-primary/10">
      <Text className="text-sm font-semibold text-primary">{label}</Text>
    </View>
  );
};

const GRID_ITEMS: GridItemData[] = [
  {
    icon: (
      <DemoIcon
        label="扫"
        tone="primary"
      />
    ),
    key: 'scan',
    text: '扫一扫'
  },
  {
    icon: (
      <DemoIcon
        label="付"
        tone="success"
      />
    ),
    key: 'payment',
    text: '付款码'
  },
  {
    icon: (
      <DemoIcon
        label="转"
        tone="info"
      />
    ),
    key: 'transfer',
    text: '转账'
  },
  {
    icon: (
      <DemoIcon
        label="票"
        tone="warning"
      />
    ),
    key: 'invoice',
    text: '发票'
  },
  {
    icon: (
      <DemoIcon
        label="程"
        tone="info"
      />
    ),
    key: 'schedule',
    text: '日程'
  },
  {
    icon: (
      <DemoIcon
        label="旅"
        tone="warning"
      />
    ),
    key: 'travel',
    text: '差旅'
  },
  {
    icon: (
      <DemoIcon
        label="讯"
        tone="success"
      />
    ),
    key: 'contacts',
    text: '通讯录'
  },
  {
    icon: (
      <DemoIcon
        label="全"
        tone="primary"
      />
    ),
    key: 'all',
    text: '全部'
  }
];

const BASIC_ITEMS = GRID_ITEMS.slice(0, 4);

/** 末行不满，用来验证悬空竖线已经被裁掉 */
const SEVEN_ITEMS = GRID_ITEMS.slice(0, 7);

function handlePress(label: string) {
  Alert.alert(label, '宫格项已点击');
}

const GridDemo = () => {
  const clickableItems: GridItemData[] = BASIC_ITEMS.map(item => ({
    ...item,
    onPress: () => handlePress(String(item.text))
  }));

  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid items={BASIC_ITEMS} />
      </View>

      {/* 列数 */}
      <Text className="mb-4 text-lg font-semibold">列数</Text>
      <Text className="mb-3 text-sm text-muted-foreground">通过 columnNum 调整每行显示的宫格数量</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          columnNum={3}
          items={GRID_ITEMS}
        />
      </View>

      {/* 分隔线 */}
      <Text className="mb-4 text-lg font-semibold">分隔线</Text>
      <Text className="mb-3 text-sm text-muted-foreground">末行不满时不会留下悬空的竖线</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          border
          items={SEVEN_ITEMS}
        />
      </View>

      {/* 间距 */}
      <Text className="mb-4 text-lg font-semibold">间距</Text>
      <View className="mb-8">
        <Grid
          gutter={12}
          items={GRID_ITEMS}
          classNames={{ content: 'rounded-2xl border border-border/70 bg-background' }}
        />
      </View>

      {/* 间距与分隔线 */}
      <Text className="mb-4 text-lg font-semibold">间距与分隔线</Text>
      <Text className="mb-3 text-sm text-muted-foreground">分隔线位于相邻宫格间距的中线</Text>
      <View className="mb-8 rounded-2xl bg-background p-2">
        <Grid
          border
          gutter={16}
          items={GRID_ITEMS}
        />
      </View>

      {/* 正方形 */}
      <Text className="mb-4 text-lg font-semibold">正方形</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          border
          square
          items={BASIC_ITEMS}
        />
      </View>

      {/* 横向排列 */}
      <Text className="mb-4 text-lg font-semibold">横向排列</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          border
          columnNum={2}
          direction="horizontal"
          items={BASIC_ITEMS}
        />
      </View>

      {/* 反向排列 */}
      <Text className="mb-4 text-lg font-semibold">反向排列</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          reverse
          items={BASIC_ITEMS}
        />
      </View>

      {/* 左对齐 */}
      <Text className="mb-4 text-lg font-semibold">左对齐</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          border
          center={false}
          items={BASIC_ITEMS}
        />
      </View>

      {/* 点击与禁用 */}
      <Text className="mb-4 text-lg font-semibold">点击与禁用</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          border
          items={[
            ...clickableItems,
            {
              ...GRID_ITEMS[4],
              disabled: true,
              onPress: () => handlePress('日程')
            }
          ]}
        />
      </View>

      {/* 自定义内容 */}
      <Text className="mb-4 text-lg font-semibold">自定义内容</Text>
      <Text className="mb-3 text-sm text-muted-foreground">children 会优先于 icon 和 text 渲染</Text>
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          columnNum={2}
          items={[
            {
              children: (
                <View className="w-full rounded-xl bg-primary/10 p-3">
                  <Text className="text-sm font-semibold text-primary">自定义内容</Text>
                  <Text className="mt-1 text-xs text-muted-foreground">可承载任意 ReactNode</Text>
                </View>
              ),
              key: 'custom'
            },
            {
              icon: (
                <DemoIcon
                  label="0"
                  tone="success"
                />
              ),
              key: 'zero',
              text: 0
            }
          ]}
        />
      </View>
    </ScrollView>
  );
};

export { GridDemo };
