import { AppTree, ButtonIcon } from '@shell/ui/antd';
import { SvgIcon } from '@shell/ui/compose';
import { Alert, Button, Card, Empty, Flex, Input, Spin, Tag } from 'antd';
import type { TreeDataNode } from 'antd';
import { useState } from 'react';
import type { Key, MouseEvent } from 'react';

import type { MenuId, MenuItem } from '@/service/api/system-menu';

import { buildMenuForest, filterMenuForest, getMenuTypeIcon, isSameMenuId } from './menu-utils';
import type { MenuHierarchyNode } from './menu-utils';

interface MenuTreeTitleProps {
  /** 当前节点是否允许新增子菜单。 */
  allowAddChild: boolean;
  /** 当前树节点对应的菜单资源。 */
  menu: MenuItem;
  /** 新增子菜单操作。 */
  onAddChild: (menu: MenuItem) => void;
  /** 当前节点是否处于选中状态。 */
  selected: boolean;
}

interface MenuTreePanelProps {
  /** 菜单列表加载是否失败。 */
  error: boolean;
  /** 当前受控展开节点。 */
  expandedKeys: Key[];
  /** 菜单列表是否正在加载。 */
  loading: boolean;
  /** 后端返回的完整平铺菜单列表。 */
  menus: MenuItem[];
  /** 新增当前目录子菜单操作。 */
  onAddChild: (menu: MenuItem) => void;
  /** 新增根菜单操作。 */
  onAddRoot: () => void;
  /** 删除当前节点操作。 */
  onDelete: () => void;
  /** 受控树展开状态变化。 */
  onExpand: (keys: Key[]) => void;
  /** 刷新菜单列表。 */
  onRefresh: () => void;
  /** 重新加载失败数据。 */
  onRetry: () => void;
  /** 选择菜单节点。 */
  onSelect: (menuId: MenuId) => void;
  /** 当前选中的菜单 ID。 */
  selectedMenuId?: MenuId;
}

const MenuTreeTitle = (props: MenuTreeTitleProps) => {
  const { allowAddChild, menu, onAddChild, selected } = props;

  function handleAddChild(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    onAddChild(menu);
  }

  return (
    <Flex align="center" className="group min-w-0" gap={7}>
      <SvgIcon className={selected ? 'text-primary' : 'text-tertiary'} icon={getMenuTypeIcon(menu.menuType)} />
      <span className="min-w-0 flex-1 truncate">{menu.menuName}</span>
      <Tag variant="filled" className="m-0 text-10px text-tertiary">
        {menu.menuType === 'M' ? '目录' : '菜单'}
      </Tag>
      {allowAddChild ? (
        <ButtonIcon
          aria-label={`在${menu.menuName}下新增菜单`}
          className={
            selected
              ? 'h-26px w-26px text-14px opacity-100'
              : 'h-26px w-26px text-14px opacity-0 group-hover:opacity-100'
          }
          icon="ph:plus"
          tooltipContent={`在${menu.menuName}下新增`}
          onClick={handleAddChild}
        />
      ) : null}
    </Flex>
  );
};

const MenuTreePanel = (props: MenuTreePanelProps) => {
  const {
    error,
    expandedKeys,
    loading,
    menus,
    onAddChild,
    onAddRoot,
    onDelete,
    onExpand,
    onRefresh,
    onRetry,
    onSelect,
    selectedMenuId
  } = props;

  const [keyword, setKeyword] = useState('');
  const routeForest = buildMenuForest(menus);
  const filteredForest = filterMenuForest(routeForest, keyword);
  const treeData = createTreeData(filteredForest);

  function createTreeData(nodes: MenuHierarchyNode[]): TreeDataNode[] {
    return nodes.map(node => ({
      children: createTreeData(node.children),
      key: String(node.menu.menuId),
      title: (
        <MenuTreeTitle
          allowAddChild={node.menu.menuType === 'M'}
          menu={node.menu}
          selected={Boolean(selectedMenuId) && isSameMenuId(node.menu.menuId, selectedMenuId as MenuId)}
          onAddChild={onAddChild}
        />
      )
    }));
  }

  function handleSelect(keys: Key[]) {
    const selectedKey = keys[0];
    if (selectedKey) onSelect(String(selectedKey));
  }

  function renderTreeContent() {
    if (error) {
      return (
        <Alert
          action={
            <Button size="small" type="primary" onClick={onRetry}>
              重试
            </Button>
          }
          title="菜单列表加载失败，请确认当前账号具有菜单管理权限"
          showIcon
          type="error"
        />
      );
    }

    if (!loading && treeData.length === 0) {
      return <Empty description={keyword ? '未找到匹配菜单' : '暂无菜单资源'} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <AppTree
        blockNode
        expandedKeys={keyword ? collectTreeKeys(treeData) : expandedKeys}
        selectedKeys={selectedMenuId ? [String(selectedMenuId)] : []}
        treeData={treeData}
        onExpand={onExpand}
        onSelect={handleSelect}
      />
    );
  }

  return (
    <Card
      className="card-wrapper h-full overflow-hidden"
      extra={
        <Flex gap={2}>
          <ButtonIcon
            aria-label="新增根菜单"
            className="h-28px w-28px text-15px"
            icon="ph:plus"
            tooltipContent="新增根菜单"
            onClick={onAddRoot}
          />
          <ButtonIcon
            aria-label="删除当前菜单"
            className="h-28px w-28px text-15px text-error"
            disabled={!selectedMenuId}
            icon="ph:trash"
            tooltipContent="删除当前菜单"
            onClick={onDelete}
          />
          <ButtonIcon
            aria-label="刷新菜单树"
            className="h-28px w-28px text-15px"
            hoverAnimation="rotate"
            icon="ph:arrows-clockwise"
            loading={loading}
            tooltipContent="刷新菜单树"
            onClick={onRefresh}
          />
        </Flex>
      }
      title={
        <div>
          <div>菜单列表</div>
          <div className="mt-2px text-11px text-tertiary font-normal">目录与页面路由</div>
        </div>
      }
      variant="borderless"
    >
      <Input
        allowClear
        className="mb-8px"
        placeholder="搜索菜单名称或路由"
        prefix={<SvgIcon className="text-tertiary" icon="ph:magnifying-glass" />}
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
      />
      <div className="mb-8px text-11px text-tertiary">选择菜单后查看详情和按钮权限</div>
      <Spin spinning={loading}>
        <div className="max-h-[calc(100vh-260px)] min-h-360px overflow-y-auto pr-2px">{renderTreeContent()}</div>
      </Spin>
    </Card>
  );
};

function collectTreeKeys(nodes: TreeDataNode[]) {
  const keys: Key[] = [];
  for (const node of nodes) {
    keys.push(node.key);
    if (node.children) keys.push(...collectTreeKeys(node.children));
  }
  return keys;
}

export default MenuTreePanel;
