import { Badge, Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';

const COLORS = ['destructive', 'primary', 'secondary', 'success', 'warning', 'info'] as const;

const SIZES = ['sm', 'md', 'lg'] as const;

const POSITIONS = ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const;

/** 占位方块，模拟头像 / 图标等被角标标记的内容 */
const Block = () => <View className="h-12 w-12 rounded-lg bg-muted" />;

const BadgeDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        <Badge content={5}>
          <Block />
        </Badge>
        <Badge content={200}>
          <Block />
        </Badge>
        <Badge content="new">
          <Block />
        </Badge>
        <Badge dot>
          <Block />
        </Badge>
      </View>

      {/* 数字封顶 */}
      <Text className="mb-4 text-lg font-semibold">Max</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        <Badge content={99}>
          <Block />
        </Badge>
        <Badge content={100}>
          <Block />
        </Badge>
        <Badge
          content={100}
          max={9}
        >
          <Block />
        </Badge>
      </View>

      {/* 零值 */}
      <Text className="mb-4 text-lg font-semibold">Show Zero</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        <Badge content={0}>
          <Block />
        </Badge>
        <Badge
          showZero
          content={0}
        >
          <Block />
        </Badge>
      </View>

      {/* 颜色 */}
      <Text className="mb-4 text-lg font-semibold">Colors</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        {COLORS.map(color => (
          <Badge
            color={color}
            content={6}
            key={color}
          >
            <Block />
          </Badge>
        ))}
      </View>

      {/* 颜色（圆点） */}
      <Text className="mb-4 text-lg font-semibold">Colors (Dot)</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        {COLORS.map(color => (
          <Badge
            dot
            color={color}
            key={color}
          >
            <Block />
          </Badge>
        ))}
      </View>

      {/* 尺寸 */}
      <Text className="mb-4 text-lg font-semibold">Sizes</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        {SIZES.map(size => (
          <Badge
            content={8}
            key={size}
            size={size}
          >
            <Block />
          </Badge>
        ))}
        {SIZES.map(size => (
          <Badge
            dot
            key={`dot-${size}`}
            size={size}
          >
            <Block />
          </Badge>
        ))}
      </View>

      {/* 位置 */}
      <Text className="mb-4 text-lg font-semibold">Positions</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        {POSITIONS.map(position => (
          <Badge
            content={3}
            key={position}
            position={position}
          >
            <Block />
          </Badge>
        ))}
      </View>

      {/* 偏移：在默认角落位置上做像素微调 */}
      <Text className="mb-4 text-lg font-semibold">Offset</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        <Badge content={3}>
          <Block />
        </Badge>
        <Badge
          content={3}
          offset={[-6, 6]}
        >
          <Block />
        </Badge>
        <Badge
          content={3}
          offset={[6, -6]}
        >
          <Block />
        </Badge>
      </View>

      {/* 独立使用：className / style 直接作用于角标本身 */}
      <Text className="mb-4 text-lg font-semibold">Standalone</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Badge content={12} />
        <Badge
          color="success"
          content="OK"
        />
        <Badge
          dot
          color="warning"
        />
        <Badge
          className="border-0"
          color="info"
          content={666}
        />
      </View>

      {/* 自定义内容与 slot 覆盖 */}
      <Text className="mb-4 text-lg font-semibold">Custom</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        <Badge content={<Text className="px-1 text-2xs font-bold text-white">HOT</Text>}>
          <Block />
        </Badge>
        <Badge
          classNames={{ badge: 'bg-carbon-900', content: 'text-white' }}
          content={9}
        >
          <Block />
        </Badge>
      </View>

      {/* 包裹文字：Badge 不干预 children 的文字色 */}
      <Text className="mb-4 text-lg font-semibold">Text Child</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-6">
        <Badge content={1}>消息</Badge>
        <Badge dot>动态</Badge>
      </View>
    </ScrollView>
  );
};

export { BadgeDemo };
