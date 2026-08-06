import type { Key } from 'react';

import type { DeptId, DeptItem } from '@/service/api/system-dept';

export interface DeptSelectNode {
  children?: DeptSelectNode[];
  disabled?: boolean;
  key: string;
  title: string;
  value: DeptId;
}

export function buildDeptTree<T extends DeptItem>(departments: T[]): T[] {
  const nodes = new Map<string, T>();
  const roots: T[] = [];

  for (const department of departments) {
    nodes.set(String(department.deptId), { ...department, children: [] } as T);
  }

  for (const department of departments) {
    const node = nodes.get(String(department.deptId));
    if (node) {
      const parent = nodes.get(String(department.parentId));
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
  }

  return roots;
}

export function collectExpandableDeptKeys(tree: DeptItem[]): Key[] {
  return tree.flatMap(department => [
    ...(department.children.length > 0 ? [String(department.deptId)] : []),
    ...collectExpandableDeptKeys(department.children)
  ]);
}

export function buildDeptSelectTree(departments: DeptItem[]): DeptSelectNode[] {
  return buildDeptTree(departments).map(toDeptSelectNode);
}

export function hasDirectChildren(departments: DeptItem[], deptId: DeptId) {
  return departments.some(department => String(department.parentId) === String(deptId));
}

export function maskDeptPhone(phone: null | string) {
  if (!phone) return '—';
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

function toDeptSelectNode(department: DeptItem): DeptSelectNode {
  return {
    children: department.children.map(toDeptSelectNode),
    disabled: department.status === '1',
    key: String(department.deptId),
    title: department.deptName,
    value: department.deptId
  };
}
