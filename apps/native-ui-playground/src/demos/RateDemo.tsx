import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Rate, Text } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

const COLORS: ThemeColor[] = ['warning', 'primary', 'destructive', 'success', 'info', 'accent', 'carbon', 'secondary'];

const READONLY_SCORES = [3.7, 4.2, 2.5];

/** 与库内一致的取色方式：`accent-*` 工具类映射到矢量图标的 color 上 */
const HeartIcon = withUniwind(Ionicons);

const RateDemo = () => {
  const [basic, setBasic] = useState(3);
  const [half, setHalf] = useState(2.5);
  const [clearable, setClearable] = useState(3);
  const [controlled, setControlled] = useState(4);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8 gap-2">
        <Rate
          value={basic}
          onChange={setBasic}
        />
        <Text color="muted">当前分值：{basic}</Text>
      </View>

      {/* 半星 */}
      <Text className="mb-4 text-lg font-semibold">半星</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        点星星左半区得 .5 分，右半区得整分
      </Text>
      <View className="mb-8 gap-2">
        <Rate
          allowHalf
          value={half}
          onChange={setHalf}
        />
        <Text color="muted">当前分值：{half}</Text>
      </View>

      {/* 可清除 */}
      <Text className="mb-4 text-lg font-semibold">可清除</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        再次点中当前分值即归零
      </Text>
      <View className="mb-8 gap-2">
        <Rate
          clearable
          value={clearable}
          onChange={setClearable}
        />
        <Text color="muted">当前分值：{clearable}</Text>
      </View>

      {/* 数量与尺寸 */}
      <Text className="mb-4 text-lg font-semibold">数量与尺寸</Text>
      <View className="mb-8 gap-3">
        <Rate
          count={3}
          defaultValue={2}
          size={20}
        />
        <Rate defaultValue={3} />
        <Rate
          count={7}
          defaultValue={5}
          gutter={8}
          size={32}
        />
      </View>

      {/* 主题色 */}
      <Text className="mb-4 text-lg font-semibold">主题色</Text>
      <View className="mb-8 gap-3">
        {COLORS.map(color => (
          <View
            key={color}
            className="flex-row items-center gap-3"
          >
            <Rate
              color={color}
              defaultValue={4}
              size={20}
            />
            <Text color="muted">{color}</Text>
          </View>
        ))}
      </View>

      {/* 只读小数 */}
      <Text className="mb-4 text-lg font-semibold">只读小数</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        readonly 配合 allowHalf 可展示任意小数，用于统计分
      </Text>
      <View className="mb-8 gap-3">
        {READONLY_SCORES.map(score => (
          <View
            key={score}
            className="flex-row items-center gap-3"
          >
            <Rate
              allowHalf
              readonly
              value={score}
            />
            <Text color="muted">{score} 分</Text>
          </View>
        ))}
      </View>

      {/* 禁用 */}
      <Text className="mb-4 text-lg font-semibold">禁用</Text>
      <View className="mb-8 gap-3">
        <Rate
          disabled
          defaultValue={3}
        />
        <Rate
          allowHalf
          disabled
          defaultValue={2.5}
        />
      </View>

      {/* 自定义图标 */}
      <Text className="mb-4 text-lg font-semibold">自定义图标</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        icon / voidIcon 支持节点或 (index, active) =&gt; 节点，宽度需与 size 一致
      </Text>
      <View className="mb-8 gap-3">
        <Rate
          allowHalf
          color="destructive"
          defaultValue={3.5}
          icon={(_index, active) => (
            <HeartIcon
              colorClassName="accent-destructive"
              name={active ? 'heart' : 'heart-outline'}
              size={24}
            />
          )}
          voidIcon={
            <HeartIcon
              colorClassName="accent-muted-foreground"
              name="heart-outline"
              size={24}
            />
          }
        />
      </View>

      {/* 自定义样式 */}
      <Text className="mb-4 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        className 覆盖根容器，classNames 细粒度覆盖各 slot
      </Text>
      <View className="mb-8 gap-3">
        <Rate
          className="self-start rounded-lg bg-secondary px-3 py-2"
          defaultValue={4}
        />
        <Rate
          classNames={{
            icon: 'accent-info',
            item: 'rounded-full bg-muted p-1'
          }}
          defaultValue={3}
        />
      </View>

      {/* 受控 */}
      <Text className="mb-4 text-lg font-semibold">受控</Text>
      <View className="mb-8 gap-3">
        <Rate
          allowHalf
          value={controlled}
          onChange={setControlled}
        />
        <View className="flex-row gap-2">
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(Math.max(0, controlled - 0.5))}
          >
            -0.5
          </Button>
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(Math.min(5, controlled + 0.5))}
          >
            +0.5
          </Button>
          <Button
            color="primary"
            variant="ghost"
            onPress={() => setControlled(0)}
          >
            重置
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export { RateDemo };
