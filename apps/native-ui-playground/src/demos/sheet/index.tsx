import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { SheetBasic } from './SheetBasic';
import { SheetCloseBehavior } from './SheetCloseBehavior';
import { SheetDynamicHeight } from './SheetDynamicHeight';
import { SheetHeader } from './SheetHeader';
import { SheetList } from './SheetList';
import { SheetSnapPoints } from './SheetSnapPoints';

/** Sheet 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/sheet/SheetSnapPoints" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const SheetDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="不传 snapPoints 时走动态尺寸，面板高度由内容自己撑开"
        title="基础用法"
      >
        <SheetBasic />
      </Section>

      <Section
        description="标题栏走 handleComponent，是固定不滚的顶部区，closeable 默认开启"
        title="标题与描述"
      >
        <SheetHeader />
      </Section>

      <Section
        description="传了 snapPoints 高度就固定下来，可以在几档之间拖动"
        title="吸附高度"
      >
        <SheetSnapPoints />
      </Section>

      <Section
        description="长列表用 BottomSheetFlatList 直接当内容，底部留白写进 contentContainerStyle 才会跟着滚"
        title="列表内容"
      >
        <SheetList />
      </Section>

      <Section
        description="关掉点遮罩和下拉之后，只剩右上角的关闭按钮这一条出口"
        title="关闭行为"
      >
        <SheetCloseBehavior />
      </Section>

      <Section
        description="不传 snapPoints 也能滚：列表自己上报内容高度，长到屏幕上限后就在内部滚动"
        title="动态尺寸 + 滚动"
      >
        <SheetDynamicHeight />
      </Section>
    </ScrollView>
  );
};

export { SheetDemo };
