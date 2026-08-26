import type { CSSProperties } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TreeItem, TreeRoot, TreeVirtualizer } from '../src/components/tree';
import type { FlattenedItem, TreeItemData } from '../src/components/tree';
import { render, screen, setupUser } from './helpers/render';

interface IconifyMockProps {
  /** CSS class passed through to the icon renderer. */
  className?: string;

  /** Icon name resolved by Iconify. */
  icon: string;

  /** Inline styles applied to the icon renderer. */
  style?: CSSProperties;
}

interface VirtualizerMockOptions {
  /** Number of virtual items requested by the component. */
  count: number;

  /** Estimated size resolver passed to the virtualizer. */
  estimateSize: (index: number) => number;

  /** Callback for resolving the scroll element. */
  getScrollElement: () => unknown;

  /** Change callback registered by the component. */
  onChange?: (instance: { scrollOffset?: number }) => void;
}

const treeSharedMock = vi.hoisted(() => ({
  orphanBranchItem: {
    _id: 'orphan-branch',
    bind: {
      'aria-posinset': 2,
      'aria-setsize': 2,
      'data': {
        children: [{ label: 'Orphan Leaf', value: 'orphan-leaf' }],
        label: 'Orphan Branch',
        value: 'orphan-branch'
      },
      level: 1
    },
    data: {
      children: [{ label: 'Orphan Leaf', value: 'orphan-leaf' }],
      label: 'Orphan Branch',
      value: 'orphan-branch'
    },
    hasChildren: true,
    index: 1,
    label: 'Orphan Branch',
    level: 1,
    parent: undefined,
    value: 'orphan-branch'
  } as FlattenedItem<TreeItemData>,
  orphanFlattenedItem: {
    _id: 'orphan-child',
    bind: {
      'aria-posinset': 1,
      'aria-setsize': 1,
      'data': { label: 'Orphan Child', value: 'orphan-child' },
      level: 1
    },
    data: { label: 'Orphan Child', value: 'orphan-child' },
    hasChildren: false,
    index: 0,
    label: 'Orphan Child',
    level: 1,
    parent: { label: 'Missing Parent', value: 'missing-parent' },
    value: 'orphan-child'
  } as FlattenedItem<TreeItemData>
}));

vi.mock('@iconify/react', () => ({
  Icon: (props: IconifyMockProps) => {
    const { className, icon, style } = props;

    return (
      <span
        aria-label={icon}
        className={className}
        data-testid="iconify-icon"
        style={style}
      />
    );
  }
}));

vi.mock('@formkit/auto-animate', () => ({
  autoAnimate: () => ({
    destroy: vi.fn(),
    disable: vi.fn(),
    enable: vi.fn()
  })
}));

vi.mock('../src/components/tree/shared', () => ({
  findParentPath: () => null,
  flattenChildren: () => [],
  flattenItems: () => [treeSharedMock.orphanFlattenedItem, treeSharedMock.orphanBranchItem],
  handleAndDispatchCustomEvent: (
    name: string,
    handler: ((event: CustomEvent) => void) | undefined,
    detail: { originalEvent: Event }
  ) => {
    handler?.(new CustomEvent(name, { cancelable: true, detail }));
  },
  recurseCheckChildren: () => false
}));

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn((options: VirtualizerMockOptions) => {
    options.getScrollElement();
    options.onChange?.({ scrollOffset: 0 });

    return {
      getTotalSize: () => options.count * options.estimateSize(0),
      getVirtualItems: () => Array.from({ length: options.count }, (_, index) => ({
        index,
        key: index,
        size: options.estimateSize(index),
        start: index * options.estimateSize(index)
      })),
      scrollToIndex: vi.fn()
    };
  })
}));

describe('Tree defensive branches', () => {
  it('keeps bubble selection stable when a flattened parent is missing', async () => {
    const user = setupUser();
    const onRootExpandedChange = vi.fn();
    const onRootValueChange = vi.fn();
    const onVirtualExpandedChange = vi.fn();
    const onVirtualValueChange = vi.fn();

    render(
      <>
        <TreeRoot
          bubbleSelect
          items={[]}
          multiple
          toggleBehavior="single"
          onExpandedChange={onRootExpandedChange}
          onValueChange={onRootValueChange}
        >
          {({ flattenItems }) => flattenItems.map(item => (
            <TreeItem
              key={item._id}
              level={item.level}
              value={item.value}
            >
              {item.value === 'orphan-child' ? 'Root orphan child' : 'Root orphan branch'}
            </TreeItem>
          ))}
        </TreeRoot>
        <TreeVirtualizer
          bubbleSelect
          height={80}
          items={[]}
          multiple
          renderItem={({ item }) => item.value === 'orphan-child' ? 'Virtual orphan child' : 'Virtual orphan branch'}
          toggleBehavior="single"
          onExpandedChange={onVirtualExpandedChange}
          onValueChange={onVirtualValueChange}
        />
      </>
    );

    await user.click(screen.getByRole('treeitem', { name: 'Root orphan child' }));
    await user.click(screen.getByRole('treeitem', { name: 'Virtual orphan child' }));
    await user.click(screen.getByRole('treeitem', { name: 'Root orphan branch' }));
    await user.click(screen.getByRole('treeitem', { name: 'Virtual orphan branch' }));

    expect(onRootValueChange).toHaveBeenCalledWith(['orphan-child']);
    expect(onVirtualValueChange).toHaveBeenCalledWith(['orphan-child']);
    expect(onRootExpandedChange).toHaveBeenCalledWith(['orphan-branch']);
    expect(onVirtualExpandedChange).toHaveBeenCalledWith(['orphan-branch']);
  });
});
