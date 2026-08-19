import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { PickerBasic } from './PickerBasic';
import { PickerCascade } from './PickerCascade';
import { PickerControlled } from './PickerControlled';
import { PickerDisabled } from './PickerDisabled';
import { PickerFieldNames } from './PickerFieldNames';
import { PickerLoading } from './PickerLoading';
import { PickerMultiColumn } from './PickerMultiColumn';
import { PickerPopup } from './PickerPopup';
import { PickerStyles } from './PickerStyles';
import { PickerToolbar } from './PickerToolbar';
import { PickerTrigger } from './PickerTrigger';
import { PickerWheel } from './PickerWheel';

/** Picker 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/picker/PickerCascade" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const PickerDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="columns 传入一维数组时显示单列滚轮，defaultValue 设置初始选中值。"
        title="基础用法（columns / defaultValue）"
      >
        <PickerBasic />
      </Section>

      <Section
        description="value 与 onChange 组成受控模式，外部修改会同步滚轮位置。"
        title="受控模式（value / onChange）"
      >
        <PickerControlled />
      </Section>

      <Section
        description="columns 传入二维数组时各列相互独立。"
        title="多列选择"
      >
        <PickerMultiColumn />
      </Section>

      <Section
        description="选项带 children 时按当前选中值级联展开；不传初值也会自动补齐各级。"
        title="级联选择（children）"
      >
        <PickerCascade />
      </Section>

      <Section
        description="fieldNames 把自定义数据中的 id、name 和 sub 映射为值、文字和子选项。"
        title="自定义字段（fieldNames）"
      >
        <PickerFieldNames />
      </Section>

      <Section
        description="disabled 选项不可选，滚轮停下时会吸附到最近的可用项。"
        title="禁用选项（disabled）"
      >
        <PickerDisabled />
      </Section>

      <Section
        description="itemHeight 与 visibleCount 控制滚轮密度，haptic 开启逐格触感。"
        title="滚轮尺寸与反馈（itemHeight / visibleCount / haptic）"
      >
        <PickerWheel />
      </Section>

      <Section
        description="loading 在滚轮区域显示加载遮罩，工具栏仍保持可见。"
        title="加载状态（loading）"
      >
        <PickerLoading />
      </Section>

      <Section
        description="title、cancelText 与 confirmText 定制工具栏；onCancel / onConfirm 返回当前选中值。"
        title="工具栏与回调"
      >
        <PickerToolbar />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 可分别定制公开 slot。"
        title="样式覆盖（className / classNames）"
      >
        <PickerStyles />
      </Section>

      <Section
        description="弹层中的滚动值只在确定后提交；showHandle 与 enablePanDownToClose 开启下拉关闭，sheetClassNames 定制面板。"
        title="弹层提交与关闭（Picker）"
      >
        <PickerPopup />
      </Section>

      <Section
        description="children 渲染函数提供 open 与已确认 value；ref 透传底层 BottomSheetModal 实例。"
        title="自定义触发元素与 ref"
      >
        <PickerTrigger />
      </Section>
    </ScrollView>
  );
};

export { PickerDemo };
