import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { SpaceAlign } from './SpaceAlign';
import { SpaceCustomSize } from './SpaceCustomSize';
import { SpaceFill } from './SpaceFill';
import { SpaceHorizontal } from './SpaceHorizontal';
import { SpaceSize } from './SpaceSize';
import { SpaceSplit } from './SpaceSplit';
import { SpaceVertical } from './SpaceVertical';
import { SpaceWrap } from './SpaceWrap';

/** Space 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/space/SpaceSize" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const SpaceDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="默认水平排列，子元素之间插入统一间距。"
        title="水平方向"
      >
        <SpaceHorizontal />
      </Section>

      <Section
        description='direction="vertical" 让子元素纵向排列。'
        title="垂直方向（direction）"
      >
        <SpaceVertical />
      </Section>

      <Section
        description="支持 xs、sm、md、lg、xl 和 2xl 六档间距。"
        title="预设间距（size）"
      >
        <SpaceSize />
      </Section>

      <Section
        description="数值单位为 dp，下面使用 size=20。"
        title="自定义间距（size）"
      >
        <SpaceCustomSize />
      </Section>

      <Section
        description="align 控制交叉轴对齐，支持 start、center、end 和 baseline。"
        title="对齐方式（align）"
      >
        <SpaceAlign />
      </Section>

      <Section
        description="wrap 仅在水平方向生效。"
        title="自动换行（wrap）"
      >
        <SpaceWrap />
      </Section>

      <Section
        description="split 在相邻子元素之间插入分隔节点。"
        title="分隔符（split）"
      >
        <SpaceSplit />
      </Section>

      <Section
        description="fill 让 Space 占满父元素宽度。"
        title="撑满容器（fill）"
      >
        <SpaceFill />
      </Section>
    </ScrollView>
  );
};

export { SpaceDemo };
