import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { PickerGroupBasic } from './PickerGroupBasic';
import { PickerGroupControlled } from './PickerGroupControlled';
import { PickerGroupDisplay } from './PickerGroupDisplay';
import { PickerGroupMixed } from './PickerGroupMixed';
import { PickerGroupPopup } from './PickerGroupPopup';
import { PickerGroupSingle } from './PickerGroupSingle';
import { PickerGroupStyles } from './PickerGroupStyles';

/**
 * PickerGroup 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/picker-group/PickerGroupMixed" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const PickerGroupDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="多个选择器共用工具栏；滚动、切 tab、取消和最终确认都有独立回调。"
        title="基础用法与事件"
      >
        <PickerGroupBasic />
      </Section>

      <Section
        description="activeTab 与 values 由外部 state 控制，按钮与 tab 点击会同步更新当前页。"
        title="受控模式（activeTab / values）"
      >
        <PickerGroupControlled />
      </Section>

      <Section
        description="分别切换 tab 栏、工具栏，并替换取消、下一步与确定按钮文案。"
        title="显示控制与文案（showTabBar / showToolbar）"
      >
        <PickerGroupDisplay />
      </Section>

      <Section
        description="滚动与切 tab 都是临时值；同时展示拖拽指示条、下拉关闭和 Sheet 样式覆盖。"
        title="弹层用法（show / values / Sheet 配置）"
      >
        <PickerGroupPopup />
      </Section>

      <Section
        description="每个 PickerGroupItem 可独立配置级联字段、触感、可见数量、行高与 Picker 插槽样式。"
        title="选择器配置（fieldNames / haptic / visibleCount）"
      >
        <PickerGroupMixed />
      </Section>

      <Section
        description="pickers 只有一项时 tab 栏自动隐藏，主按钮直接显示“确定”。"
        title="单个选择器"
      >
        <PickerGroupSingle />
      </Section>

      <Section
        description="className 覆盖根节点，classNames 分别覆盖工具栏、tab 和激活指示器。"
        title="样式覆盖（className / classNames）"
      >
        <PickerGroupStyles />
      </Section>
    </ScrollView>
  );
};

export { PickerGroupDemo };
