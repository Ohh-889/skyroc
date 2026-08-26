import type { FlattenedItem, TreeItemData } from './types';

export const TREE_SELECT = 'tree.select';
export const TREE_TOGGLE = 'tree.toggle';

// eslint-disable-next-line max-params
export function flattenItems<T extends TreeItemData>(
  items?: T[],
  expandedValues?: string[],
  level: number = 1,
  parent?: T
): FlattenedItem<T>[] {
  if (!items) {
    return [];
  }

  return items.reduce((acc: FlattenedItem<T>[], item: T, index: number) => {
    const children = item.children as T[];
    const isExpanded = expandedValues?.includes(item.value);

    const flattenedItem: FlattenedItem<T> = {
      _id: item.value,
      value: item.value,
      data: item,
      index,
      level,
      parent,
      label: item.label,
      hasChildren: Boolean(children && children.length > 0),
      bind: {
        'data': item,
        level,
        'aria-setsize': items.length,
        'aria-posinset': index + 1
      }
    };
    acc.push(flattenedItem);

    if (children && isExpanded) {
      acc.push(...flattenItems(children, expandedValues, level + 1, item));
    }

    return acc;
  }, []);
}

export function recurseCheckChildren(selected: string[], items?: TreeItemData[]): boolean {
  if (!items) {
    return false;
  }

  return items.some((item) => {
    if (selected.includes(item.value)) {
      return true;
    }

    return recurseCheckChildren(selected, item.children);
  });
}

export function findParentPath<T extends TreeItemData>(
  targetValue: string,
  items?: T[],
  parentPath: string[] = []
): string[] | null {
  if (!items) {
    return null;
  }

  for (const item of items) {
    if (item.value === targetValue) {
      return parentPath;
    }

    if (item.children) {
      const found = findParentPath(targetValue, item.children as T[], [...parentPath, item.value]);
      if (found !== null) {
        return found;
      }
    }
  }

  return null;
}

export function flattenChildren<T extends { children?: any[] }>(items?: T[]) {
  if (!items) {
    return [];
  }

  return items.reduce(
    (acc, item) => {
      acc.push(item);

      if (item.children) {
        acc.push(...flattenChildren(item.children));
      }
      return acc;
    },
    [] as Omit<T, 'children'>[]
  );
}

export function findValuesBetween(values: string[], start: string, end: string): string[] {
  const startIndex = values.indexOf(start);
  const endIndex = values.indexOf(end);

  if (startIndex === -1 || endIndex === -1) {
    return [];
  }

  const [min, max] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
  return values.slice(min, max + 1);
}

export function getActiveElement(): Element | null {
  return document.activeElement;
}

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function handleAndDispatchCustomEvent<E extends CustomEvent, OriginalEvent extends Event>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: { originalEvent: OriginalEvent } & (E extends CustomEvent<infer D> ? D : never)
) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, {
    bubbles: false,
    cancelable: true,
    detail
  });
  if (handler) {
    target.addEventListener(name, handler, { once: true });
  }

  target.dispatchEvent(event);
}
