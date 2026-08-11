import { SvgIcon } from '@skyroc/web-ui-compose';
import { Flex, Tag, Typography } from 'antd';
import type { TreeDataNode } from 'antd';
import type { Key, ReactNode } from 'react';

import type { TenantPackageMenuTreeNode, TenantPackageMenuType } from '@/service/api/system-tenant-package';

export interface PackageMenuTreeDataNode extends TreeDataNode {
  children?: PackageMenuTreeDataNode[];
  menuType: TenantPackageMenuType;
  rawLabel: string;
}

function resolveTreeIcon(menuType: TenantPackageMenuType) {
  if (menuType === 'F') return 'ph:cursor-click';
  if (menuType === 'M') return 'ph:folder';

  return 'ph:browser';
}

function resolveTreeTypeLabel(menuType: TenantPackageMenuType) {
  if (menuType === 'F') return '按钮';
  if (menuType === 'M') return '目录';

  return '菜单';
}

/** 命中的片段标出来，光靠展开定位不到具体是哪一行。 */
function renderLabel(label: string, keyword: string): ReactNode {
  const normalized = keyword.trim().toLocaleLowerCase();

  if (!normalized) return label;

  const index = label.toLocaleLowerCase().indexOf(normalized);

  if (index < 0) return label;

  return (
    <>
      {label.slice(0, index)}
      <mark className="bg-transparent text-primary font-700">{label.slice(index, index + normalized.length)}</mark>
      {label.slice(index + normalized.length)}
    </>
  );
}

/**
 * 后端的树节点转成 antd 的树数据。
 *
 * 搜索只做高亮，不裁剪树：裁掉之后 antd 的受控 checkedKeys 会丢掉不在可见树里的那些勾选， 用户搜一次再清空搜索，之前勾的就没了。
 */
export function buildPackageMenuTreeData(nodes: TenantPackageMenuTreeNode[], keyword = ''): PackageMenuTreeDataNode[] {
  return nodes.map(node => ({
    children: node.children?.length ? buildPackageMenuTreeData(node.children, keyword) : undefined,
    // 停用的菜单不给勾：授权了也进不去，勾上只会让套餐看起来比实际能用的多
    disabled: node.status === '1',
    key: String(node.id),
    menuType: node.menuType,
    rawLabel: node.label,
    title: (
      <Flex
        align="center"
        className="min-w-0"
        gap={7}
      >
        <SvgIcon
          className={node.menuType === 'F' ? 'text-warning' : 'text-primary'}
          icon={resolveTreeIcon(node.menuType)}
        />
        <Typography.Text className="min-w-0 flex-1 truncate">{renderLabel(node.label, keyword)}</Typography.Text>
        <Tag
          className="m-0 text-10px"
          color={node.menuType === 'F' ? 'orange' : undefined}
          variant="filled"
        >
          {resolveTreeTypeLabel(node.menuType)}
        </Tag>
      </Flex>
    )
  }));
}

export function collectPackageMenuTreeKeys(nodes: PackageMenuTreeDataNode[]): Key[] {
  return nodes.flatMap(node => [node.key, ...collectPackageMenuTreeKeys(node.children ?? [])]);
}

/** 可以勾的那些。停用菜单被 disabled 掉了，全选时不能算进去，否则和树的显示对不上。 */
export function collectSelectablePackageMenuKeys(nodes: PackageMenuTreeDataNode[]): Key[] {
  return nodes.flatMap(node => [
    ...(node.disabled ? [] : [node.key]),
    ...collectSelectablePackageMenuKeys(node.children ?? [])
  ]);
}

/** 命中节点的所有祖先，用来把树展开到命中的位置。 */
export function collectMatchedExpandKeys(nodes: PackageMenuTreeDataNode[], keyword: string): Key[] {
  const normalized = keyword.trim().toLocaleLowerCase();

  if (!normalized) return [];

  const expanded: Key[] = [];

  function visit(items: PackageMenuTreeDataNode[]): boolean {
    let matchedInside = false;

    items.forEach(item => {
      const childMatched = visit(item.children ?? []);
      const selfMatched = item.rawLabel.toLocaleLowerCase().includes(normalized);

      if (childMatched) expanded.push(item.key);
      if (childMatched || selfMatched) matchedInside = true;
    });

    return matchedInside;
  }

  visit(nodes);

  return expanded;
}

export function countPackageMenuMatches(nodes: PackageMenuTreeDataNode[], keyword: string): number {
  const normalized = keyword.trim().toLocaleLowerCase();

  if (!normalized) return 0;

  return nodes.reduce(
    (count, node) =>
      count +
      (node.rawLabel.toLocaleLowerCase().includes(normalized) ? 1 : 0) +
      countPackageMenuMatches(node.children ?? [], keyword),
    0
  );
}

/** 提交的是数字数组，不是数据库里那种逗号串。 */
export function toPackageMenuIds(keys: readonly Key[]): number[] {
  const ids = keys.map(key => Number(key)).filter(id => Number.isInteger(id) && id > 0);

  return [...new Set(ids)];
}

export function countPackageMenuSelection(nodes: PackageMenuTreeDataNode[], checkedKeys: readonly Key[]) {
  const selected = new Set(checkedKeys.map(String));
  let buttons = 0;
  let menus = 0;

  function visit(items: PackageMenuTreeDataNode[]) {
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
