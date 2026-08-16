import { Grid, Text } from '@skyroc/native-ui';
import type { GridItemData } from '@skyroc/native-ui';
import { Alert, ScrollView, View } from 'react-native';

/** 图标占位，用色块代替真实图标，避免 demo 依赖图标库 */
const DemoIcon = (props: { label: string }) => {
  const { label } = props;

  return (
    <View className="size-8 items-center justify-center rounded-lg bg-primary">
      <Text className="text-sm text-primary-foreground">{label}</Text>
    </View>
  );
};

const BASE_ITEMS: GridItemData[] = [
  { icon: <DemoIcon label="A" />, key: 'a', text: '文字' },
  { icon: <DemoIcon label="B" />, key: 'b', text: '文字' },
  { icon: <DemoIcon label="C" />, key: 'c', text: '文字' },
  { icon: <DemoIcon label="D" />, key: 'd', text: '文字' }
];

const EIGHT_ITEMS: GridItemData[] = Array.from({ length: 8 }, (_, index) => ({
  icon: <DemoIcon label={String(index + 1)} />,
  key: `item-${index}`,
  text: `选项 ${index + 1}`
}));

/** 末行不满，用来验证悬空竖线已经被裁掉 */
const SEVEN_ITEMS = EIGHT_ITEMS.slice(0, 7);

const GridDemo = () => {
  function handlePress(key: string) {
    Alert.alert('Grid Pressed', key);
  }

  const clickableItems: GridItemData[] = EIGHT_ITEMS.slice(0, 4).map(item => ({
    ...item,
    onPress: () => handlePress(item.key)
  }));

  return (
    <ScrollView className="flex-1 bg-muted p-6">
      {/* Basic */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8 bg-background">
        <Grid items={BASE_ITEMS} />
      </View>

      {/* Column Num */}
      <Text className="mb-4 text-lg font-semibold">Column Num</Text>
      <View className="mb-8 bg-background">
        <Grid
          columnNum={3}
          items={EIGHT_ITEMS}
        />
      </View>

      {/* Border */}
      <Text className="mb-4 text-lg font-semibold">Border</Text>
      <View className="mb-8 bg-background">
        <Grid
          border
          items={SEVEN_ITEMS}
        />
      </View>

      {/* Gutter */}
      <Text className="mb-4 text-lg font-semibold">Gutter</Text>
      <View className="mb-8">
        <Grid
          gutter={12}
          items={EIGHT_ITEMS}
          classNames={{ item: 'rounded-xl bg-background' }}
        />
      </View>

      {/* Gutter + Border */}
      <Text className="mb-4 text-lg font-semibold">Gutter + Border</Text>
      <View className="mb-8 bg-background">
        <Grid
          border
          gutter={16}
          items={EIGHT_ITEMS}
        />
      </View>

      {/* Square */}
      <Text className="mb-4 text-lg font-semibold">Square</Text>
      <View className="mb-8 bg-background">
        <Grid
          border
          square
          items={BASE_ITEMS}
        />
      </View>

      {/* Horizontal */}
      <Text className="mb-4 text-lg font-semibold">Horizontal</Text>
      <View className="mb-8 bg-background">
        <Grid
          border
          columnNum={2}
          direction="horizontal"
          items={BASE_ITEMS}
        />
      </View>

      {/* Reverse */}
      <Text className="mb-4 text-lg font-semibold">Reverse</Text>
      <View className="mb-8 bg-background">
        <Grid
          reverse
          items={BASE_ITEMS}
        />
      </View>

      {/* Align Start */}
      <Text className="mb-4 text-lg font-semibold">Align Start</Text>
      <View className="mb-8 bg-background">
        <Grid
          border
          center={false}
          items={BASE_ITEMS}
        />
      </View>

      {/* Clickable + Disabled */}
      <Text className="mb-4 text-lg font-semibold">Clickable + Disabled</Text>
      <View className="mb-8 bg-background">
        <Grid
          border
          items={[...clickableItems, { ...EIGHT_ITEMS[4], disabled: true, onPress: () => handlePress('disabled') }]}
        />
      </View>

      {/* Custom Children */}
      <Text className="mb-4 text-lg font-semibold">Custom Children</Text>
      <View className="mb-8 bg-background">
        <Grid
          columnNum={2}
          items={[
            {
              children: (
                <View className="w-full rounded-lg bg-primary/10 p-3">
                  <Text className="text-sm font-semibold text-primary">自定义内容</Text>
                  <Text className="mt-1 text-xs text-muted-foreground">children 优先于 icon / text</Text>
                </View>
              ),
              key: 'custom'
            },
            { icon: <DemoIcon label="0" />, key: 'zero', text: 0 }
          ]}
        />
      </View>
    </ScrollView>
  );
};

export { GridDemo };
