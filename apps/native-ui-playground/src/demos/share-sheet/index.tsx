import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { ShareSheetBasic } from './ShareSheetBasic';
import { ShareSheetDescription } from './ShareSheetDescription';
import { ShareSheetImperative } from './ShareSheetImperative';
import { ShareSheetMultiRow } from './ShareSheetMultiRow';
import { ShareSheetStyles } from './ShareSheetStyles';

/**
 * ShareSheet 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/share-sheet/ShareSheetMultiRow"
 * />），所以这里只负责串场，不要把示例代码写回本文件。
 */
const ShareSheetDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="一维数组即单行，选项超出宽度可以横向滚动"
        title="基础用法"
      >
        <ShareSheetBasic />
      </Section>

      <Section
        description="二维数组按行渲染，onSelect 会带上行下标"
        title="多行展示"
      >
        <ShareSheetMultiRow />
      </Section>

      <Section
        description="选项名称下方可以再挂一行说明"
        title="描述信息"
      >
        <ShareSheetDescription />
      </Section>

      <Section
        description="classNames 覆盖各 slot，sheetClassNames 覆盖内部 Sheet"
        title="自定义样式"
      >
        <ShareSheetStyles />
      </Section>

      <Section
        description="showShareSheet 返回 Promise，选中与取消都会结算；closeShareSheet 可从外部关闭"
        title="命令式调用"
      >
        <ShareSheetImperative />
      </Section>
    </ScrollView>
  );
};

export { ShareSheetDemo };
