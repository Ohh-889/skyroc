import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Slider, Text } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

const COLORS: ThemeColor[] = ['primary', 'success', 'warning', 'destructive', 'info', 'accent', 'carbon', 'secondary'];

const ThumbIcon = withUniwind(Ionicons);

const SliderDemo = () => {
  const [basic, setBasic] = useState(30);
  const [stepped, setStepped] = useState(60);
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 70]);
  const [settled, setSettled] = useState(30);
  const [controlled, setControlled] = useState(50);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8 gap-2">
        <Slider
          value={basic}
          onChange={setBasic}
        />
        <Text color="muted">当前值：{basic}</Text>
      </View>

      {/* 步长与取值范围 */}
      <Text className="mb-4 text-lg font-semibold">步长与取值范围</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        取值对齐到 min + n * step，点击轨道同样按 step 吸附
      </Text>
      <View className="mb-8 gap-2">
        <Slider
          max={200}
          min={20}
          step={20}
          value={stepped}
          onChange={setStepped}
        />
        <Text color="muted">当前值：{stepped}（20 ~ 200，步长 20）</Text>
      </View>

      {/* 区间选择 */}
      <Text className="mb-4 text-lg font-semibold">区间选择</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        两端互为边界，拖到相遇即停，不会互相穿越
      </Text>
      <View className="mb-8 gap-2">
        <Slider
          range
          value={rangeValue}
          onChange={setRangeValue}
        />
        <Text color="muted">
          当前区间：{rangeValue[0]} ~ {rangeValue[1]}
        </Text>
      </View>

      {/* 拖拽结束回调 */}
      <Text className="mb-4 text-lg font-semibold">拖拽结束回调</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        onChange 拖拽中实时触发，onChangeAfterDrag 只在值稳定后触发一次，适合拿来发请求
      </Text>
      <View className="mb-8 gap-2">
        <Slider
          defaultValue={30}
          onChangeAfterDrag={setSettled}
        />
        <Text color="muted">松手后的值：{settled}</Text>
      </View>

      {/* 主题色 */}
      <Text className="mb-4 text-lg font-semibold">主题色</Text>
      <View className="mb-8 gap-4">
        {COLORS.map(color => (
          <View
            key={color}
            className="flex-row items-center gap-4"
          >
            <View className="flex-1">
              <Slider
                color={color}
                defaultValue={60}
              />
            </View>
            <Text
              className="w-20"
              color="muted"
            >
              {color}
            </Text>
          </View>
        ))}
      </View>

      {/* 尺寸 */}
      <Text className="mb-4 text-lg font-semibold">尺寸</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        barSize 控制轨道粗细，thumbSize 控制圆钮直径；命中区始终不小于 44pt
      </Text>
      <View className="mb-8 gap-4">
        <Slider
          barSize={2}
          defaultValue={40}
          thumbSize={16}
        />
        <Slider
          barSize={6}
          defaultValue={40}
          thumbSize={24}
        />
        <Slider
          barSize={12}
          defaultValue={40}
          thumbSize={32}
        />
      </View>

      {/* 垂直方向 */}
      <Text className="mb-4 text-lg font-semibold">垂直方向</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        vertical 模式下父级必须有确定高度
      </Text>
      <View className="mb-8 h-56 flex-row gap-8">
        <Slider
          vertical
          defaultValue={40}
        />
        <Slider
          range
          vertical
          color="success"
          defaultValue={[20, 80]}
        />
        <Slider
          vertical
          barSize={8}
          color="warning"
          defaultValue={65}
          thumbSize={28}
        />
      </View>

      {/* 自定义滑块 */}
      <Text className="mb-4 text-lg font-semibold">自定义滑块</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        单值模式用 thumb，区间模式用 startThumb / endThumb，内容需自行控制在 thumbSize 内
      </Text>
      <View className="mb-8 gap-6">
        <Slider
          defaultValue={50}
          thumbSize={28}
          thumb={
            <View className="size-7 items-center justify-center rounded-full bg-primary shadow-sm">
              <ThumbIcon
                colorClassName="accent-primary-foreground"
                name="reorder-two"
                size={16}
              />
            </View>
          }
        />
        <Slider
          range
          color="destructive"
          defaultValue={[30, 70]}
          thumbSize={20}
          endThumb={<View className="size-5 rounded-sm bg-destructive shadow-sm" />}
          startThumb={<View className="size-5 rounded-sm bg-destructive shadow-sm" />}
        />
      </View>

      {/* 禁用与只读 */}
      <Text className="mb-4 text-lg font-semibold">禁用与只读</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        disabled 整体置灰且不响应手势，readonly 只是不响应手势
      </Text>
      <View className="mb-8 gap-4">
        <Slider
          disabled
          defaultValue={40}
        />
        <Slider
          readonly
          defaultValue={40}
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
      <View className="mb-8 gap-4">
        <Slider
          className="rounded-xl bg-secondary px-4"
          defaultValue={45}
        />
        <Slider
          classNames={{
            activeBar: 'bg-info',
            thumbInner: 'border-info bg-info/10',
            track: 'bg-info/20'
          }}
          defaultValue={60}
        />
      </View>

      {/* 受控 */}
      <Text className="mb-4 text-lg font-semibold">受控</Text>
      <View className="mb-8 gap-3">
        <Slider
          step={5}
          value={controlled}
          onChange={setControlled}
        />
        <Text color="muted">当前值：{controlled}</Text>
        <View className="flex-row gap-2">
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(Math.max(0, controlled - 5))}
          >
            -5
          </Button>
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(Math.min(100, controlled + 5))}
          >
            +5
          </Button>
          <Button
            color="primary"
            variant="ghost"
            onPress={() => setControlled(50)}
          >
            重置
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export { SliderDemo };
