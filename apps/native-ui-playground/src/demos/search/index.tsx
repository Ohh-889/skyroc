import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { SearchBasic } from './SearchBasic';
import { SearchClearable } from './SearchClearable';
import { SearchControlled } from './SearchControlled';
import { SearchCustom } from './SearchCustom';
import { SearchDisabled } from './SearchDisabled';
import { SearchLabelAction } from './SearchLabelAction';
import { SearchShape } from './SearchShape';
import { SearchSize } from './SearchSize';
import { SearchStyles } from './SearchStyles';
import { SearchUncontrolled } from './SearchUncontrolled';

/** Search 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/search/SearchShape" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const SearchDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="只给 placeholder 即可得到一个完整搜索框。"
        title="基础用法"
      >
        <SearchBasic />
      </Section>

      <Section
        description="square 的圆角跟随 size，round 恒为胶囊。"
        title="形状（shape）"
      >
        <SearchShape />
      </Section>

      <Section
        description="外层留白与图标尺寸一起跟随 size。"
        title="尺寸（size）"
      >
        <SearchSize />
      </Section>

      <Section
        description="label 放在输入框左侧；showAction 打开右侧操作区，action 可传文本也可传节点。"
        title="标签与操作（label / showAction / action）"
      >
        <SearchLabelAction />
      </Section>

      <Section
        description="默认有值时显示清除按钮；clearable=false 可关闭，onClear 用于监听清空动作。"
        title="清除按钮（clearable / onClear）"
      >
        <SearchClearable />
      </Section>

      <Section
        description="value 与 onChangeText 组成受控用法，onSearch 在键盘搜索键触发。"
        title="受控（value / onChangeText）"
      >
        <SearchControlled />
      </Section>

      <Section
        description="不传 value 时输入值由内部 Input 托管，onSearch 仍能拿到提交文本。"
        title="非受控（defaultValue）"
      >
        <SearchUncontrolled />
      </Section>

      <Section
        description="leading 传入节点后会完全替换默认放大镜。"
        title="自定义前置内容（leading）"
      >
        <SearchCustom />
      </Section>

      <Section
        description="className / classNames 控制搜索栏布局，inputClassNames 下钻到内部 Input 的 control 与 action。"
        title="样式覆盖（className / classNames / inputClassNames）"
      >
        <SearchStyles />
      </Section>

      <Section
        description="disabled 让输入框不可编辑。"
        title="禁用状态（disabled）"
      >
        <SearchDisabled />
      </Section>
    </ScrollView>
  );
};

export { SearchDemo };
