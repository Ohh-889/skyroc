import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { CellArrow } from './CellArrow';
import { CellBasic } from './CellBasic';
import { CellDisabled } from './CellDisabled';
import { CellGroupBasic } from './CellGroupBasic';
import { CellGroupInset } from './CellGroupInset';
import { CellLeading } from './CellLeading';
import { CellPress } from './CellPress';
import { CellSize } from './CellSize';

/**
 * Cell 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/cell/CellBasic" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const CellDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="title、subtitle 与 trailing 可以任意组合。"
        title="基础用法"
      >
        <CellBasic />
      </Section>

      <Section
        description="传入点击事件后默认显示右箭头，也可以通过 showArrow 显式控制。"
        title="点击与箭头（onPress / showArrow）"
      >
        <CellPress />
      </Section>

      <Section
        description="leading 可以承载图标、头像等前置内容。"
        title="左侧内容（leading）"
      >
        <CellLeading />
      </Section>

      <Section
        description="arrowDirection 控制箭头朝向，可与 trailing 同时使用。"
        title="右侧内容与箭头方向（trailing / arrowDirection）"
      >
        <CellArrow />
      </Section>

      <Section
        description="CellGroup 把多个列表项收成一组，并提供分组标题。"
        title="分组（CellGroup）"
      >
        <CellGroupBasic />
      </Section>

      <Section
        description="inset 会为分组内容增加左右留白。"
        title="内嵌分组（inset）"
      >
        <CellGroupInset />
      </Section>

      <Section
        description="size 提供 sm、md、lg 三档行高。"
        title="尺寸（size）"
      >
        <CellSize />
      </Section>

      <Section
        description="disabled 后不会触发点击事件。"
        title="禁用（disabled）"
      >
        <CellDisabled />
      </Section>
    </ScrollView>
  );
};

export { CellDemo };
