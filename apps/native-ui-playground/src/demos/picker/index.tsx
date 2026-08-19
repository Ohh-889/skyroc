import { Text } from '@skyroc/native-ui';
import { ScrollView } from 'react-native';
import { PickerBasic } from './PickerBasic';
import { PickerCascade } from './PickerCascade';
import { PickerDisabled } from './PickerDisabled';
import { PickerFieldNames } from './PickerFieldNames';
import { PickerLoading } from './PickerLoading';
import { PickerMultiColumn } from './PickerMultiColumn';
import { PickerPopup } from './PickerPopup';
import { PickerTrigger } from './PickerTrigger';

/** Picker 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/picker/PickerCascade" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const PickerDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pt-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-2 px-6 text-lg font-semibold">基础用法</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        单列内联选择器，haptic 打开后每滚过一格会有一次轻触反馈
      </Text>
      <PickerBasic />

      {/* 多列 */}
      <Text className="mb-2 px-6 text-lg font-semibold">多列</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        columns 传二维数组时各列相互独立，改一列不影响其它列
      </Text>
      <PickerMultiColumn />

      {/* 级联 */}
      <Text className="mb-2 px-6 text-lg font-semibold">级联</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        选项带 children 即为级联；这里刻意不传 defaultValue，三列应当在首屏就全部展开
      </Text>
      <PickerCascade />

      {/* 自定义字段名 */}
      <Text className="mb-2 px-6 text-lg font-semibold">自定义字段名</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        数据用的是 id / name / sub，靠 fieldNames 映射，显示文字与选中值都要跟着走
      </Text>
      <PickerFieldNames />

      {/* 禁用项 */}
      <Text className="mb-2 px-6 text-lg font-semibold">禁用项</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        停在禁用项上会自动吸附到最近的可选项，连着几个禁用也能跨过去
      </Text>
      <PickerDisabled />

      {/* 加载中 */}
      <Text className="mb-2 px-6 text-lg font-semibold">加载中</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        loading 只盖住滚轮区域，工具栏仍然可点
      </Text>
      <PickerLoading />

      {/* 弹层用法 */}
      <Text className="mb-2 px-6 text-lg font-semibold">弹层用法</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        滚动过程中的值是临时的，点「确定」才会写回 value，点「取消」直接丢弃
      </Text>
      <PickerPopup />

      {/* 触发元素与 ref */}
      <Text className="mb-2 px-6 text-lg font-semibold">触发元素与 ref</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        children 传函数就能自己画触发元素；ref 拿到的是底层 BottomSheetModal，show 表达不了的命令式操作走它
      </Text>
      <PickerTrigger />
    </ScrollView>
  );
};

export { PickerDemo };
