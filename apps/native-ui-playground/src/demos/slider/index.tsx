import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';
import { SliderBasic } from './SliderBasic';
import { SliderChangeAfterDrag } from './SliderChangeAfterDrag';
import { SliderColor } from './SliderColor';
import { SliderControlled } from './SliderControlled';
import { SliderCustomThumb } from './SliderCustomThumb';
import { SliderDisabled } from './SliderDisabled';
import { SliderRange } from './SliderRange';
import { SliderSize } from './SliderSize';
import { SliderStep } from './SliderStep';
import { SliderStyles } from './SliderStyles';
import { SliderVertical } from './SliderVertical';

/** Slider 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const SliderDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="py-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 px-6 text-lg font-semibold">基础用法</Text>
      <View className="mb-4">
        <SliderBasic />
      </View>

      {/* 步长与取值范围 */}
      <Text className="mb-4 px-6 text-lg font-semibold">步长与取值范围</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        取值对齐到 min + n * step，点击轨道同样按 step 吸附
      </Text>
      <View className="mb-4">
        <SliderStep />
      </View>

      {/* 区间选择 */}
      <Text className="mb-4 px-6 text-lg font-semibold">区间选择</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        两端互为边界，拖到相遇即停，不会互相穿越
      </Text>
      <View className="mb-4">
        <SliderRange />
      </View>

      {/* 拖拽结束回调 */}
      <Text className="mb-4 px-6 text-lg font-semibold">拖拽结束回调</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        onChange 拖拽中实时触发，onChangeAfterDrag 只在值稳定后触发一次，适合拿来发请求
      </Text>
      <View className="mb-4">
        <SliderChangeAfterDrag />
      </View>

      {/* 主题色 */}
      <Text className="mb-4 px-6 text-lg font-semibold">主题色</Text>
      <View className="mb-4">
        <SliderColor />
      </View>

      {/* 尺寸 */}
      <Text className="mb-4 px-6 text-lg font-semibold">尺寸</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        barSize 控制轨道粗细，thumbSize 控制圆钮直径；命中区始终不小于 44pt
      </Text>
      <View className="mb-4">
        <SliderSize />
      </View>

      {/* 垂直方向 */}
      <Text className="mb-4 px-6 text-lg font-semibold">垂直方向</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        vertical 模式下父级必须有确定高度
      </Text>
      <View className="mb-4">
        <SliderVertical />
      </View>

      {/* 自定义滑块 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义滑块</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        单值模式用 thumb，区间模式用 startThumb / endThumb，内容需自行控制在 thumbSize 内
      </Text>
      <View className="mb-4">
        <SliderCustomThumb />
      </View>

      {/* 禁用与只读 */}
      <Text className="mb-4 px-6 text-lg font-semibold">禁用与只读</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        disabled 整体置灰且不响应手势，readonly 只是不响应手势
      </Text>
      <View className="mb-4">
        <SliderDisabled />
      </View>

      {/* 自定义样式 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        className 覆盖根容器，classNames 细粒度覆盖各 slot
      </Text>
      <View className="mb-4">
        <SliderStyles />
      </View>

      {/* 受控 */}
      <Text className="mb-4 px-6 text-lg font-semibold">受控</Text>
      <View className="mb-4">
        <SliderControlled />
      </View>
    </ScrollView>
  );
};

export { SliderDemo };
