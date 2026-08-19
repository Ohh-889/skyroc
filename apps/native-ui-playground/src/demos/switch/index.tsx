import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { SwitchAsync } from './SwitchAsync';
import { SwitchBasic } from './SwitchBasic';
import { SwitchColor } from './SwitchColor';
import { SwitchControlled } from './SwitchControlled';
import { SwitchDisabled } from './SwitchDisabled';
import { SwitchLoading } from './SwitchLoading';
import { SwitchSize } from './SwitchSize';
import { SwitchStyles } from './SwitchStyles';
import { SwitchThumb } from './SwitchThumb';
import { SwitchUncontrolled } from './SwitchUncontrolled';

/** Switch 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const SwitchDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="checked 与 onCheckedChange 组成最常用的受控开关。"
        title="基础用法（checked / onCheckedChange）"
      >
        <SwitchBasic />
      </Section>

      <Section
        description="只传 defaultChecked 时，选中状态由组件内部维护。"
        title="非受控（defaultChecked）"
      >
        <SwitchUncontrolled />
      </Section>

      <Section
        description="size 提供 xs、sm、md、lg、xl、2xl 六档轨道与滑块尺寸。"
        title="尺寸（size）"
      >
        <SwitchSize />
      </Section>

      <Section
        description="color 设置开启状态的语义色。"
        title="语义颜色（color）"
      >
        <SwitchColor />
      </Section>

      <Section
        description="disabled 阻止切换并降低整体透明度，关闭与开启状态均适用。"
        title="禁用状态（disabled）"
      >
        <SwitchDisabled />
      </Section>

      <Section
        description="loading 显示随滑块尺寸缩放的指示器，并在加载期间阻止点击。"
        title="加载状态（loading）"
      >
        <SwitchLoading />
      </Section>

      <Section
        description="受控状态配合 loading，可在异步操作成功后再更新 checked。"
        title="异步切换（checked / loading）"
      >
        <SwitchAsync />
      </Section>

      <Section
        description="children 支持文字或自定义节点，并渲染在滑块内部；loading 时由指示器替代。"
        title="自定义滑块内容（children）"
      >
        <SwitchThumb />
      </Section>

      <Section
        description="className 覆盖轨道容器，classNames 可覆盖选中色层、滑块和 indicator 的 accent 颜色。"
        title="样式覆盖（className / classNames）"
      >
        <SwitchStyles />
      </Section>

      <Section
        description="外部按钮与 Switch 共享 checked，展示受控状态可从组件外更新。"
        title="外部控制（checked）"
      >
        <SwitchControlled />
      </Section>
    </ScrollView>
  );
};

export { SwitchDemo };
