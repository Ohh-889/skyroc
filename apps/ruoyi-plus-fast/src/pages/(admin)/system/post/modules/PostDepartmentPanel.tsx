import { AppTree, ButtonIcon } from '@skyroc/web-ui-antd';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { Alert, Button, Card, Empty, Flex, Input, Spin, Tag } from 'antd';
import type { TreeDataNode } from 'antd';
import { useMemo, useState } from 'react';
import type { Key } from 'react';

import type { PostDeptTreeNode, PostId } from '@/service/api/system-post';

interface PostDepartmentPanelProps {
  /** 部门树接口返回的数据。 */
  departments: PostDeptTreeNode[];
  /** 部门树是否加载失败。 */
  error: boolean;
  /** 部门树是否正在刷新。 */
  fetching: boolean;
  /** 部门树是否首次加载。 */
  loading: boolean;
  /** 切换为全部部门范围。 */
  onSelectAll: () => void;
  /** 选择部门及其全部下级。 */
  onSelectDepartment: (keys: Key[]) => void;
  /** 重新加载部门树。 */
  refresh: () => Promise<unknown>;
  /** 左侧树当前选择的部门。 */
  selectedDeptId?: PostId;
}

const PostDepartmentPanel = (props: PostDepartmentPanelProps) => {
  const { departments, error, fetching, loading, onSelectAll, onSelectDepartment, refresh, selectedDeptId } = props;

  const [keyword, setKeyword] = useState('');
  const treeData = useMemo(() => createDepartmentTreeData(departments, keyword), [departments, keyword]);

  function renderDepartmentTree() {
    if (error) {
      return (
        <Alert
          action={
            <Button size="small" onClick={refresh}>
              重试
            </Button>
          }
          title="部门树加载失败"
          showIcon
          type="error"
        />
      );
    }
    if (treeData.length === 0) {
      return (
        <Empty description={keyword ? '没有找到符合条件的部门' : '暂无部门'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      );
    }

    return (
      <AppTree
        blockNode
        defaultExpandAll
        selectedKeys={selectedDeptId === undefined ? [] : [String(selectedDeptId)]}
        treeData={treeData}
        onSelect={onSelectDepartment}
      />
    );
  }

  return (
    <Card
      className="h-full min-h-0 flex flex-col overflow-hidden card-wrapper"
      classNames={{ body: 'min-h-0 flex flex-1 flex-col' }}
      extra={
        <ButtonIcon
          aria-label="刷新部门树"
          icon="ph:arrows-clockwise"
          loading={fetching}
          onClick={refresh}
        />
      }
      title={
        <Flex align="center" gap={8}>
          <SvgIcon icon="ph:buildings" />
          组织部门
        </Flex>
      }
      variant="borderless"
    >
      <Input
        allowClear
        className="mb-10px"
        placeholder="搜索部门"
        prefix={<SvgIcon className="text-tertiary" icon="ph:magnifying-glass" />}
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
      />
      <Button
        block
        className="mb-8px justify-start!"
        icon={<SvgIcon icon="ph:buildings" />}
        type={selectedDeptId === undefined ? 'primary' : 'text'}
        onClick={onSelectAll}
      >
        全部部门
      </Button>
      <div className="min-h-0 flex-1 overflow-auto lt-xl:max-h-360px">
        <Spin spinning={loading}>{renderDepartmentTree()}</Spin>
      </div>
      <div className="mt-12px border-t border-border-2 pt-10px text-11px text-tertiary">
        单击部门查看该部门及全部下级岗位
      </div>
    </Card>
  );
};

function createDepartmentTreeData(nodes: PostDeptTreeNode[], keyword: string): TreeDataNode[] {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();
  return nodes.flatMap(node => {
    const children = createDepartmentTreeData(node.children ?? [], keyword);
    const matches = !normalizedKeyword || node.label.toLocaleLowerCase().includes(normalizedKeyword);
    if (!matches && children.length === 0) return [];

    return [
      {
        children,
        key: String(node.id),
        title: (
          <Flex align="center" gap={6}>
            <SvgIcon className="shrink-0 text-tertiary" icon="ph:buildings" />
            <span className="min-w-0 flex-1 truncate">{node.label}</span>
            {node.disabled ? (
              <Tag variant="filled" className="m-0 text-11px" color="warning">
                停用
              </Tag>
            ) : null}
          </Flex>
        )
      }
    ];
  });
}

export default PostDepartmentPanel;
