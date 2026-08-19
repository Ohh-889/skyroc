import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { GridAlign } from './GridAlign';
import { GridBasic } from './GridBasic';
import { GridBorder } from './GridBorder';
import { GridColumnNum } from './GridColumnNum';
import { GridCustomContent } from './GridCustomContent';
import { GridGutter } from './GridGutter';
import { GridGutterBorder } from './GridGutterBorder';
import { GridHorizontal } from './GridHorizontal';
import { GridPress } from './GridPress';
import { GridReverse } from './GridReverse';
import { GridSquare } from './GridSquare';
import { GridStyles } from './GridStyles';

/** Grid 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/grid/GridGutter" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const GridDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="items 提供图标与文字，默认每行四列并居中纵向排列。"
        title="基础用法（items）"
      >
        <GridBasic />
      </Section>

      <Section
        description="columnNum 设置每行列数，下面使用三列布局。"
        title="列数（columnNum）"
      >
        <GridColumnNum />
      </Section>

      <Section
        description="border 添加格间分隔线；末行不满时不会留下悬空竖线。"
        title="分隔线（border）"
      >
        <GridBorder />
      </Section>

      <Section
        description="gutter 以 dp 为单位设置格间距离，并抵消容器最外圈空白。"
        title="间距（gutter）"
      >
        <GridGutter />
      </Section>

      <Section
        description="border 与 gutter 可同时使用，分隔线位于相邻宫格间距的中线。"
        title="间距与分隔线（gutter / border）"
      >
        <GridGutterBorder />
      </Section>

      <Section
        description="square 让每个格子的内容区保持正方形，不把 gutter 计算在内。"
        title="正方形（square）"
      >
        <GridSquare />
      </Section>

      <Section
        description="direction=horizontal 让图标与文字沿水平方向排列。"
        title="排列方向（direction）"
      >
        <GridHorizontal />
      </Section>

      <Section
        description="reverse 翻转图标与文字顺序，并同步调整二者间距。"
        title="反向排列（reverse）"
      >
        <GridReverse />
      </Section>

      <Section
        description="center=false 让格子内容从起始位置对齐。"
        title="内容对齐（center）"
      >
        <GridAlign />
      </Section>

      <Section
        description="clickable 让所有格子具有按压反馈；单项支持点击、长按与 disabled。"
        title="交互与禁用（clickable / disabled）"
      >
        <GridPress />
      </Section>

      <Section
        description="children 优先于 icon 和 text；数字 0 会自动使用 Text 渲染。"
        title="自定义内容（children）"
      >
        <GridCustomContent />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 与 item.classNames 分别覆盖全局和单项槽位。"
        title="样式覆盖（className / classNames）"
      >
        <GridStyles />
      </Section>
    </ScrollView>
  );
};

export { GridDemo };
