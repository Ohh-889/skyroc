import { SvgIcon } from '@shell/ui/compose';
import { Flex, Tag, Typography } from 'antd';
import type { TreeDataNode } from 'antd';
import type { Key } from 'react';

import type { RoleTreeKey, RoleTreeNode } from '@/service/api/system-role';

export interface RoleTreeDataNode extends TreeDataNode {
  children?: RoleTreeDataNode[];
  menuType?: RoleTreeNode['menuType'];
  rawLabel: string;
}

function resolveTreeIcon(menuType: RoleTreeNode['menuType']) {
  if (menuType === 'F') return 'ph:cursor-click';
  if (menuType === 'M') return 'ph:folder';
  return 'ph:browser';
}

function resolveTreeTypeLabel(menuType: RoleTreeNode['menuType']) {
  if (menuType === 'F') return '按钮';
  if (menuType === 'M') return '目录';
  return '菜单';
}

export function buildRoleTreeData(nodes: RoleTreeNode[]): RoleTreeDataNode[] {
  return nodes.map(node => ({
    children: node.children?.length ? buildRoleTreeData(node.children) : undefined,
    disabled: node.disabled || node.status === '1',
    key: String(node.id),
    menuType: node.menuType,
    rawLabel: node.label,
    title: (
      <Flex align="center" className="min-w-0" gap={7}>
        <SvgIcon
          className={node.menuType === 'F' ? 'text-warning' : 'text-primary'}
          icon={resolveTreeIcon(node.menuType)}
        />
        <Typography.Text className="min-w-0 flex-1 truncate">{node.label}</Typography.Text>
        {node.menuType ? (
          <Tag className="m-0 text-10px" color={node.menuType === 'F' ? 'orange' : undefined} variant="filled">
            {resolveTreeTypeLabel(node.menuType)}
          </Tag>
        ) : null}
      </Flex>
    )
  }));
}

export function filterRoleTreeData(nodes: RoleTreeDataNode[], keyword: string): RoleTreeDataNode[] {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();
  if (!normalizedKeyword) return nodes;

  return nodes.flatMap(node => {
    const children = filterRoleTreeData(node.children ?? [], normalizedKeyword);
    if (!node.rawLabel.toLocaleLowerCase().includes(normalizedKeyword) && children.length === 0) return [];
    return [{ ...node, children }];
  });
}

export function collectRoleTreeKeys(nodes: RoleTreeDataNode[]): Key[] {
  return nodes.flatMap(node => [node.key, ...collectRoleTreeKeys(node.children ?? [])]);
}

export function normalizeRoleTreeKeys(keys: readonly Key[]): RoleTreeKey[] {
  return keys.map(String);
}

export function countRoleTreeSelection(nodes: RoleTreeDataNode[], checkedKeys: readonly Key[]) {
  const selected = new Set(checkedKeys.map(String));
  let buttons = 0;
  let menus = 0;

  function visit(items: RoleTreeDataNode[]) {
    items.forEach(item => {
      if (selected.has(String(item.key))) {
        if (item.menuType === 'F') buttons += 1;
        else menus += 1;
      }
      visit(item.children ?? []);
    });
  }

  visit(nodes);
  return { buttons, menus };
}
