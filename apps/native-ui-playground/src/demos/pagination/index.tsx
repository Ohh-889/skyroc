import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { PaginationBasic } from './PaginationBasic';
import { PaginationControlled } from './PaginationControlled';
import { PaginationDisabled } from './PaginationDisabled';
import { PaginationEdges } from './PaginationEdges';
import { PaginationNav } from './PaginationNav';
import { PaginationSiblingCount } from './PaginationSiblingCount';
import { PaginationSimple } from './PaginationSimple';
import { PaginationStyles } from './PaginationStyles';
import { PaginationTotalChange } from './PaginationTotalChange';
import { PaginationWithList } from './PaginationWithList';

/**
 * Pagination 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/pagination/PaginationBasic" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const PaginationDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="总页数由 totalItems / itemsPerPage 推出，默认显示当前页左右各 1 个兄弟页码。"
        title="基础用法（totalItems / itemsPerPage）"
      >
        <PaginationBasic />
      </Section>

      <Section
        description="只保留「当前页/总页数」，适合空间紧张的场景。"
        title="简单模式（mode=simple）"
      >
        <PaginationSimple />
      </Section>

      <Section
        description="始终显示首末页，中间用省略号折叠；折叠不足 2 页时不画省略号。"
        title="固定首尾页（showEdges）"
      >
        <PaginationEdges />
      </Section>

      <Section
        description="控制当前页左右各显示几个页码，0 表示只显示当前页。"
        title="兄弟页码数量（siblingCount）"
      >
        <PaginationSiblingCount />
      </Section>

      <Section
        description="prev / next 接受任意节点，传字符串会自动包裹 Text。"
        title="自定义上下页（prev / next）"
      >
        <PaginationNav />
      </Section>

      <Section
        description="disabled 后所有页码与上下页按钮都不响应点击。"
        title="禁用（disabled）"
      >
        <PaginationDisabled />
      </Section>

      <Section
        description="page + onPageChange 由外部持有页码；父级不更新 page 时组件也不会自己走。"
        title="受控（page / onPageChange）"
      >
        <PaginationControlled />
      </Section>

      <Section
        description="总数变小、当前页越界时，组件只把显示值夹回合法区间，不会擅自回写外部状态。"
        title="数据量变化（totalItems）"
      >
        <PaginationTotalChange />
      </Section>

      <Section
        description="每页 5 条共 23 条，末页不足一页也照常显示。"
        title="配合列表"
      >
        <PaginationWithList />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 细粒度覆盖各 slot。"
        title="自定义样式（className / classNames）"
      >
        <PaginationStyles />
      </Section>
    </ScrollView>
  );
};

export { PaginationDemo };
