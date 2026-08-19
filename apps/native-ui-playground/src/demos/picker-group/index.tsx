import { Text } from '@skyroc/native-ui';
import { ScrollView } from 'react-native';
import { PickerGroupBasic } from './PickerGroupBasic';
import { PickerGroupMixed } from './PickerGroupMixed';
import { PickerGroupPopup } from './PickerGroupPopup';
import { PickerGroupSingle } from './PickerGroupSingle';

/**
 * PickerGroup 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/picker-group/PickerGroupMixed" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const PickerGroupDemo = () => {
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
        多个选择器共用一套工具栏；不在最后一个 tab 时主按钮是「下一步」，走到最后才变成「确定」
      </Text>
      <PickerGroupBasic />

      {/* 弹层用法 */}
      <Text className="mb-2 px-6 text-lg font-semibold">弹层用法</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        滚动与切 tab 都是临时的，点「确定」才写回 values；再次打开会重置回已确认值并回到第一个 tab
      </Text>
      <PickerGroupPopup />

      {/* 混合形态与自定义触发元素 */}
      <Text className="mb-2 px-6 text-lg font-semibold">混合形态与触发元素</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        每个 tab 的列形态互不相干，这里第一个是级联、第二个是多列；children 传函数就能自己画触发元素
      </Text>
      <PickerGroupMixed />

      {/* 单个选择器 */}
      <Text className="mb-2 px-6 text-lg font-semibold">单个选择器</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        pickers 只有一项时 tab 栏自动隐藏，主按钮直接是「确定」
      </Text>
      <PickerGroupSingle />
    </ScrollView>
  );
};

export { PickerGroupDemo };
