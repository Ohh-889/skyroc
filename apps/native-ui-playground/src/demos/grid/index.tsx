import { Text } from '@skyroc/native-ui';
import { ScrollView } from 'react-native';
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

/** Grid 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/grid/GridGutter" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const GridDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="pt-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 px-6 text-lg font-semibold">基础用法</Text>
      <GridBasic />

      {/* 列数 */}
      <Text className="mb-4 px-6 text-lg font-semibold">列数</Text>
      <Text className="mb-3 px-6 text-sm text-muted-foreground">通过 columnNum 调整每行显示的宫格数量</Text>
      <GridColumnNum />

      {/* 分隔线 */}
      <Text className="mb-4 px-6 text-lg font-semibold">分隔线</Text>
      <Text className="mb-3 px-6 text-sm text-muted-foreground">末行不满时不会留下悬空的竖线</Text>
      <GridBorder />

      {/* 间距 */}
      <Text className="mb-4 px-6 text-lg font-semibold">间距</Text>
      <GridGutter />

      {/* 间距与分隔线 */}
      <Text className="mb-4 px-6 text-lg font-semibold">间距与分隔线</Text>
      <Text className="mb-3 px-6 text-sm text-muted-foreground">分隔线位于相邻宫格间距的中线</Text>
      <GridGutterBorder />

      {/* 正方形 */}
      <Text className="mb-4 px-6 text-lg font-semibold">正方形</Text>
      <GridSquare />

      {/* 横向排列 */}
      <Text className="mb-4 px-6 text-lg font-semibold">横向排列</Text>
      <GridHorizontal />

      {/* 反向排列 */}
      <Text className="mb-4 px-6 text-lg font-semibold">反向排列</Text>
      <GridReverse />

      {/* 左对齐 */}
      <Text className="mb-4 px-6 text-lg font-semibold">左对齐</Text>
      <GridAlign />

      {/* 点击与禁用 */}
      <Text className="mb-4 px-6 text-lg font-semibold">点击与禁用</Text>
      <GridPress />

      {/* 自定义内容 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义内容</Text>
      <Text className="mb-3 px-6 text-sm text-muted-foreground">children 会优先于 icon 和 text 渲染</Text>
      <GridCustomContent />
    </ScrollView>
  );
};

export { GridDemo };
