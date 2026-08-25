import { AppTree, ButtonIcon } from '@shell/ui/antd';
import { SvgIcon } from '@shell/ui/compose';
import { Alert, Button, Card, Empty, Flex, Input, Spin, Tag } from 'antd';
import type { TreeDataNode } from 'antd';
import { useMemo, useState } from 'react';
import type { Key } from 'react';

import type { DeptTreeNode, UserId } from '@/service/api/system-user';

interface UserDepartmentPanelProps {
  /** 部门树接口数据。 */
  departments: DeptTreeNode[];
  /** 部门树是否加载失败。 */
  error: boolean;
  /** 部门树是否正在刷新。 */
  fetching: boolean;
  /** 部门树是否首次加载。 */
  loading: boolean;
  /** 清除部门范围。 */
  onSelectAll: () => void;
  /** 选择一个精确部门。 */
  onSelectDepartment: (keys: Key[]) => void;
  /** 刷新部门树。 */
  refresh: () => Promise<unknown>;
  /** 当前选择的部门。 */
  selectedDeptId?: UserId;
}

const UserDepartmentPanel = (props: UserDepartmentPanelProps) => {
  const { departments, error, fetching, loading, onSelectAll, onSelectDepartment, refresh, selectedDeptId } = props;

  const [keyword, setKeyword] = useState('');
  const treeData = useMemo(() => createTreeData(departments, keyword), [departments, keyword]);

  function renderTree() {
    if (error) {
      return <Alert action={<Button onClick={refresh}>重试</Button>} showIcon title="部门树加载失败" type="error" />;
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
      extra={<ButtonIcon aria-label="刷新部门树" icon="ph:arrows-clockwise" loading={fetching} onClick={refresh} />}
      title="部门"
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
        type={selectedDeptId === undefined ? 'primary' : 'text'}
        onClick={onSelectAll}
      >
        全部用户
      </Button>
      <div className="min-h-0 flex-1 overflow-auto lt-xl:max-h-360px">
        <Spin spinning={loading}>{renderTree()}</Spin>
      </div>
      <div className="mt-12px border-t border-border-secondary pt-10px text-11px text-tertiary">当前接口支持部门模糊筛选</div>
    </Card>
  );
};

function createTreeData(nodes: DeptTreeNode[], keyword: string): TreeDataNode[] {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();
  return nodes.flatMap(node => {
    const children = createTreeData(node.children ?? [], keyword);
    const matches = !normalizedKeyword || node.label.toLocaleLowerCase().includes(normalizedKeyword);
    if (!matches && children.length === 0) return [];
    return [
      {
        children,
        key: String(node.id),
        title: (
          <Flex align="center" gap={6}>
            <span className="min-w-0 flex-1 truncate">{node.label}</span>
            {node.disabled ? (
              <Tag color="warning" variant="filled">
                停用
              </Tag>
            ) : null}
          </Flex>
        )
      }
    ];
  });
}

export default UserDepartmentPanel;
