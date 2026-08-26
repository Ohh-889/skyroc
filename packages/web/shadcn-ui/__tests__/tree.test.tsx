import type { CSSProperties } from 'react';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Tree } from '../src/preset/tree';
import {
  TreeItem,
  TreeRoot,
  TreeVirtualizer,
  findParentPath,
  flattenChildren,
  flattenItems,
  recurseCheckChildren
} from '../src/components/tree';
import { useTreeRootContext } from '../src/components/tree/context';
import { useAutoAnimate } from '../src/components/tree/hooks';
import { findValuesBetween, getActiveElement, handleAndDispatchCustomEvent, isNullish } from '../src/components/tree/shared';
import type { TreeItemData, TreeVirtualizerRef } from '../src/components/tree';
import { render, screen, setupUser, within } from './helpers/render';

interface IconifyMockProps {
  /** CSS class passed through to the icon renderer. */
  className?: string;

  /** Icon name resolved by Iconify. */
  icon: string;

  /** Inline styles applied to the icon renderer. */
  style?: CSSProperties;
}

const autoAnimateMock = vi.hoisted(() => {
  const controller = {
    destroy: vi.fn(),
    disable: vi.fn(),
    enable: vi.fn()
  };

  return {
    autoAnimate: vi.fn(() => controller),
    controller
  };
});

const treeVirtualizerMock = vi.hoisted(() => {
  const scrollToIndex = vi.fn();
  const state: { scrollOffset?: number } = {
    scrollOffset: 18
  };

  return {
    state,
    scrollToIndex,
    useVirtualizer: vi.fn((options: { count: number; estimateSize: (index: number) => number; getScrollElement: () => HTMLDivElement | null; onChange?: (instance: { scrollOffset?: number }) => void }) => {
      options.getScrollElement();
      options.onChange?.({ scrollOffset: state.scrollOffset });

      return {
        getTotalSize: () => Array.from({ length: options.count }).reduce<number>((total, _, index) => total + options.estimateSize(index), 0),
        getVirtualItems: () => Array.from({ length: options.count }, (_, index) => ({
          index,
          key: index,
          size: options.estimateSize(index),
          start: index * options.estimateSize(index)
        })),
        scrollOffset: 18,
        scrollToIndex
      };
    })
  };
});

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
  autoAnimate: autoAnimateMock.autoAnimate
}));

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: treeVirtualizerMock.useVirtualizer
}));

const treeItems: TreeItemData[] = [
  {
    label: 'Documents',
    value: 'documents',
    children: [
      { label: 'Invoices', value: 'invoices' },
      { label: 'Reports', value: 'reports' }
    ]
  },
  { disabled: true, label: 'Archive', value: 'archive' }
];

interface AutoAnimateProbeProps {
  /** Whether to enable or disable the controller from test buttons. */
  enabled: boolean;
}

const AutoAnimateProbe = (props: AutoAnimateProbeProps) => {
  const { enabled } = props;
  const [element, setEnabled] = useAutoAnimate();

  return (
    <div>
      <div ref={node => element(node ?? undefined)}>Animated node</div>
      <button
        type="button"
        onClick={() => setEnabled(enabled)}
      >
        Toggle animation
      </button>
    </div>
  );
};

const TreeContextProbe = () => {
  useTreeRootContext('TreeContextProbe');

  return null;
};

function getTreeItemByValue(tree: HTMLElement, value: string) {
  return tree.querySelector(`[data-value="${value}"]`) as HTMLElement;
}

beforeEach(() => {
  autoAnimateMock.autoAnimate.mockClear();
  autoAnimateMock.controller.destroy.mockClear();
  autoAnimateMock.controller.disable.mockClear();
  autoAnimateMock.controller.enable.mockClear();
  treeVirtualizerMock.state.scrollOffset = 18;
  treeVirtualizerMock.scrollToIndex.mockClear();
  treeVirtualizerMock.useVirtualizer.mockClear();
});

describe('Tree', () => {
  it('renders expanded items and emits selection and toggle events', async () => {
    const user = setupUser();
    const onExpandedChange = vi.fn();
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    const onValueChange = vi.fn();

    render(
      <Tree
        allowParentSelect
        className="custom-tree"
        classNames={{ item: 'custom-tree-item' }}
        defaultExpanded={['documents']}
        defaultValue="invoices"
        indentSize={20}
        items={treeItems}
        renderItem={(props) => {
          const { hasChildren, isSelected, item } = props;

          return (
            <span>
              {item.label}
              {' '}
              {isSelected ? 'selected' : 'idle'}
              {' '}
              {hasChildren ? 'branch' : 'leaf'}
            </span>
          );
        }}
        onExpandedChange={onExpandedChange}
        onSelect={onSelect}
        onToggle={onToggle}
        onValueChange={onValueChange}
      />
    );

    const root = screen.getByRole('tree');
    const documents = screen.getByRole('treeitem', { name: 'Documents idle branch' });
    const invoices = screen.getByRole('treeitem', { name: 'Invoices selected leaf' });
    const reports = screen.getByRole('treeitem', { name: 'Reports idle leaf' });
    const archive = screen.getByRole('treeitem', { name: 'Archive idle leaf' });

    expect(root).toHaveClass('custom-tree');
    expect(documents).toHaveAttribute('aria-expanded', 'true');
    expect(documents).toHaveClass('custom-tree-item');
    expect(documents).toHaveStyle({ paddingLeft: '0px' });
    expect(invoices).toHaveAttribute('aria-selected', 'true');
    expect(reports).toHaveStyle({ paddingLeft: '20px' });
    expect(archive).toHaveAttribute('aria-disabled', 'true');

    await user.click(reports);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].detail.value).toBe('reports');
    expect(onValueChange).toHaveBeenCalledWith('reports');

    await user.click(documents);

    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle.mock.calls[1][0].detail.value).toBe('documents');
    expect(onExpandedChange).toHaveBeenCalledWith([]);
  });

  it('uses ConfigProvider tree defaults and keeps component props in control', () => {
    render(
      <ConfigProvider
        tree={{
          className: 'configured-tree',
          classNames: { item: 'configured-tree-item' },
          multiple: true
        }}
      >
        <Tree
          defaultExpanded={['documents']}
          defaultValue={['invoices']}
          items={treeItems}
        />
        <Tree
          className="override-tree"
          items={treeItems}
          multiple={false}
        />
      </ConfigProvider>
    );

    const trees = screen.getAllByRole('tree');
    const configuredItems = screen.getAllByRole('treeitem', { name: /Documents|Invoices|Reports|Archive/ });

    expect(trees[0]).toHaveClass('configured-tree');
    expect(trees[0]).toHaveAttribute('aria-multiselectable', 'true');
    expect(configuredItems[0]).toHaveClass('configured-tree-item');
    expect(trees[1]).toHaveClass('override-tree');
    expect(trees[1]).not.toHaveClass('configured-tree');
    expect(trees[1]).not.toHaveAttribute('aria-multiselectable');
  });

  it('keeps tree data helpers stable for expanded and selected states', () => {
    const flattened = flattenItems(treeItems, ['documents']);

    expect(flattened.map(item => item.value)).toEqual(['documents', 'invoices', 'reports', 'archive']);
    expect(flattened[1]).toMatchObject({
      level: 2,
      parent: treeItems[0],
      value: 'invoices'
    });
    expect(flattenChildren(treeItems[0].children).map(item => item.value)).toEqual(['invoices', 'reports']);
    expect(findParentPath('reports', treeItems)).toEqual(['documents']);
    expect(recurseCheckChildren(['reports'], treeItems)).toBe(true);
    expect(recurseCheckChildren(['unknown'], treeItems)).toBe(false);
  });

  it('covers tree helper empty and event-dispatch branches', () => {
    const button = document.createElement('button');
    const handler = vi.fn((event: CustomEvent<{ value: string }>) => {
      expect(event.detail.value).toBe('documents');
    });
    const originalEvent = new MouseEvent('click');

    Object.defineProperty(originalEvent, 'target', {
      configurable: true,
      value: button
    });
    document.body.append(button);
    button.focus();

    expect(flattenItems()).toEqual([]);
    expect(flattenChildren()).toEqual([]);
    expect(recurseCheckChildren(['documents'])).toBe(false);
    expect(findParentPath('missing', treeItems)).toBeNull();
    expect(findParentPath('missing')).toBeNull();
    expect(findValuesBetween(['a', 'b', 'c'], 'a', 'c')).toEqual(['a', 'b', 'c']);
    expect(findValuesBetween(['a', 'b', 'c'], 'c', 'a')).toEqual(['a', 'b', 'c']);
    expect(findValuesBetween(['a', 'b', 'c'], 'a', 'missing')).toEqual([]);
    expect(getActiveElement()).toBe(button);
    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
    expect(isNullish('value')).toBe(false);

    handleAndDispatchCustomEvent('tree.helper-test', handler, {
      originalEvent,
      value: 'documents'
    });
    handleAndDispatchCustomEvent('tree.helper-test-without-handler', undefined, {
      originalEvent,
      value: 'documents'
    });

    expect(handler).toHaveBeenCalledOnce();

    button.remove();
  });

  it('prevents parent selection by default and ignores disabled tree interaction', async () => {
    const user = setupUser();
    const onDisabledExpandedChange = vi.fn();
    const onDisabledValueChange = vi.fn();
    const onParentValueChange = vi.fn();

    render(
      <>
        <Tree
          defaultExpanded={['documents']}
          items={treeItems}
          onValueChange={onParentValueChange}
        />
        <Tree
          disabled
          defaultExpanded={['documents']}
          items={treeItems}
          onExpandedChange={onDisabledExpandedChange}
          onValueChange={onDisabledValueChange}
        />
      </>
    );

    const [parentTree, disabledTree] = screen.getAllByRole('tree');
    const parentDocuments = getTreeItemByValue(parentTree, 'documents');
    const disabledReports = getTreeItemByValue(disabledTree, 'reports');

    await user.click(parentDocuments);
    await user.click(disabledReports);

    expect(onParentValueChange).not.toHaveBeenCalled();
    expect(disabledTree).toHaveAttribute('aria-disabled', 'true');
    expect(disabledReports).toHaveAttribute('aria-disabled', 'true');
    expect(onDisabledExpandedChange).not.toHaveBeenCalled();
    expect(onDisabledValueChange).not.toHaveBeenCalled();
  });

  it('covers direct tree item guards and root selection branches', async () => {
    const user = setupUser();
    const onBubbleValueChange = vi.fn();
    const onDisabledExpandedChange = vi.fn();
    const onDisabledValueChange = vi.fn();
    const onExpandedChange = vi.fn();
    const onPreventedExpandedChange = vi.fn();
    const onPreventedValueChange = vi.fn();
    const onReplaceSingleValueChange = vi.fn();
    const onValueChange = vi.fn();

    render(
      <>
        <TreeRoot
          defaultExpanded={['documents']}
          items={treeItems}
        >
          {({ flattenItems: flattenedTreeItems }) => flattenedTreeItems.map(item => (
            <TreeItem
              disabledSelect={item.value === 'reports'}
              disabledToggle={item.value === 'documents'}
              key={item._id}
              level={item.level}
              value={item.value}
            >
              Static
              {' '}
              {item.value}
            </TreeItem>
          ))}
        </TreeRoot>
        <TreeRoot
          defaultExpanded={['documents']}
          items={treeItems}
          onExpandedChange={onPreventedExpandedChange}
          onValueChange={onPreventedValueChange}
        >
          {({ flattenItems: flattenedTreeItems }) => flattenedTreeItems.map(item => (
            <TreeItem
              key={item._id}
              level={item.level}
              value={item.value}
              onSelect={event => event.preventDefault()}
              onToggle={event => event.preventDefault()}
            >
              Prevented
              {' '}
              {item.value}
            </TreeItem>
          ))}
        </TreeRoot>
        <Tree
          defaultExpanded={['documents']}
          defaultValue="reports"
          items={treeItems}
          onValueChange={onValueChange}
        />
        <Tree
          items={treeItems}
          onExpandedChange={onExpandedChange}
        />
        <Tree
          defaultExpanded={['documents']}
          items={treeItems}
          selectionBehavior="replace"
          onValueChange={onReplaceSingleValueChange}
        />
        <Tree
          bubbleSelect
          defaultExpanded={['documents']}
          defaultValue={['documents', 'invoices']}
          items={treeItems}
          multiple
          onValueChange={onBubbleValueChange}
        />
        <Tree
          disabled
          defaultExpanded={['documents']}
          items={treeItems}
          renderItem={(props) => {
            const { select, toggle } = props;

            return (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  select('reports');
                  toggle('documents');
                }}
              >
                disabled action
              </button>
            );
          }}
          onExpandedChange={onDisabledExpandedChange}
          onValueChange={onDisabledValueChange}
        />
      </>
    );

    const [directTree, preventedTree, selectedTree, collapsedTree, replaceSingleTree, bubbleTree] = screen.getAllByRole('tree');

    await user.click(within(directTree).getByRole('treeitem', { name: 'Static reports' }));
    await user.click(within(directTree).getByRole('treeitem', { name: 'Static documents' }));
    await user.click(within(preventedTree).getByRole('treeitem', { name: 'Prevented documents' }));
    await user.click(getTreeItemByValue(selectedTree, 'reports'));
    await user.click(getTreeItemByValue(collapsedTree, 'documents'));
    await user.click(getTreeItemByValue(replaceSingleTree, 'reports'));
    await user.click(getTreeItemByValue(bubbleTree, 'invoices'));
    await user.click(screen.getAllByRole('button', { name: 'disabled action' })[0]);

    expect(onValueChange).toHaveBeenCalledWith('');
    expect(onExpandedChange).toHaveBeenCalledWith(['documents']);
    expect(onReplaceSingleValueChange).toHaveBeenCalledWith('reports');
    expect(onBubbleValueChange).toHaveBeenCalledWith([]);
    expect(onPreventedExpandedChange).not.toHaveBeenCalled();
    expect(onPreventedValueChange).not.toHaveBeenCalled();
    expect(onDisabledExpandedChange).not.toHaveBeenCalled();
    expect(onDisabledValueChange).not.toHaveBeenCalled();
  });

  it('supports multiple selection, bubble selection and propagated child selection', async () => {
    const user = setupUser();
    const onMultiValueChange = vi.fn();
    const onBubbleValueChange = vi.fn();
    const onPropagateValueChange = vi.fn();
    const onPropagateRemoveValueChange = vi.fn();

    render(
      <>
        <Tree
          defaultExpanded={['documents']}
          defaultValue={['invoices']}
          items={treeItems}
          multiple
          onValueChange={onMultiValueChange}
        />
        <Tree
          bubbleSelect
          defaultExpanded={['documents']}
          defaultValue={['invoices']}
          items={treeItems}
          multiple
          onValueChange={onBubbleValueChange}
        />
        <Tree
          allowParentSelect
          defaultExpanded={['documents']}
          items={treeItems}
          multiple
          propagateSelect
          onValueChange={onPropagateValueChange}
        />
        <Tree
          allowParentSelect
          defaultExpanded={['documents']}
          defaultValue={['documents']}
          items={treeItems}
          multiple
          propagateSelect
          onValueChange={onPropagateRemoveValueChange}
        />
      </>
    );

    const [multiTree, bubbleTree, propagateTree, propagateRemoveTree] = screen.getAllByRole('tree');

    await user.click(within(multiTree).getByRole('treeitem', { name: 'Reports' }));
    await user.click(within(multiTree).getByRole('treeitem', { name: 'Invoices' }));
    await user.click(within(bubbleTree).getByRole('treeitem', { name: 'Reports' }));
    await user.click(getTreeItemByValue(propagateTree, 'documents'));
    await user.click(getTreeItemByValue(propagateRemoveTree, 'documents'));

    expect(onMultiValueChange).toHaveBeenNthCalledWith(1, ['invoices', 'reports']);
    expect(onMultiValueChange).toHaveBeenNthCalledWith(2, ['reports']);
    expect(onBubbleValueChange).toHaveBeenLastCalledWith(['invoices', 'reports', 'documents']);
    expect(onPropagateValueChange).toHaveBeenLastCalledWith(['documents']);
    expect(onPropagateRemoveValueChange).toHaveBeenLastCalledWith(['invoices', 'reports']);
  });

  it('supports replace selection and single-branch expansion', async () => {
    const user = setupUser();
    const onExpandedChange = vi.fn();
    const onValueChange = vi.fn();
    const nestedItems: TreeItemData[] = [
      {
        label: 'Documents',
        value: 'documents',
        children: [
          {
            label: 'Reports',
            value: 'reports',
            children: [
              { label: 'Annual', value: 'annual' }
            ]
          }
        ]
      },
      {
        label: 'Media',
        value: 'media',
        children: [
          { label: 'Images', value: 'images' }
        ]
      }
    ];

    render(
      <Tree
        allowParentSelect
        defaultExpanded={['documents']}
        defaultValue={['annual']}
        items={nestedItems}
        multiple
        selectionBehavior="replace"
        toggleBehavior="single"
        onExpandedChange={onExpandedChange}
        onValueChange={onValueChange}
      />
    );

    const tree = screen.getByRole('tree');

    await user.click(getTreeItemByValue(tree, 'reports'));
    await user.click(getTreeItemByValue(tree, 'media'));

    expect(onValueChange).toHaveBeenCalledWith(['reports']);
    expect(onExpandedChange).toHaveBeenLastCalledWith(['media']);
  });

  it('marks partially selected propagated branches as indeterminate', () => {
    render(
      <Tree
        allowParentSelect
        defaultExpanded={['documents']}
        defaultValue={['documents', 'invoices']}
        items={treeItems}
        multiple
        propagateSelect
        renderItem={(props) => {
          const { isIndeterminate, item } = props;

          return (
            <span>
              {item.label}
              {' '}
              {isIndeterminate ? 'partial' : 'complete'}
            </span>
          );
        }}
      />
    );

    expect(screen.getByRole('treeitem', { name: 'Documents partial' })).toHaveAttribute('aria-selected', 'true');
  });

  it('uses item values when tree data has no label', () => {
    render(
      <Tree
        items={[{ value: 'unlabeled-node' }] as unknown as TreeItemData[]}
      />
    );

    expect(screen.getByRole('treeitem', { name: 'unlabeled-node' })).toBeInTheDocument();
  });

  it('throws a clear error when tree item context is missing', () => {
    expect(() => render(<TreeContextProbe />)).toThrow('`TreeContextProbe` must be used within a `TreeRoot` component.');
    expect(() => render(<TreeItem level={1} value="orphan">Orphan</TreeItem>)).toThrow('`TreeItem` must be used within a `TreeRoot` component.');
  });

  it('controls the auto-animate controller lifecycle', async () => {
    const user = setupUser();
    const { rerender, unmount } = render(<AutoAnimateProbe enabled />);

    expect(autoAnimateMock.autoAnimate).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Toggle animation' }));

    expect(autoAnimateMock.controller.enable).toHaveBeenCalledOnce();

    rerender(<AutoAnimateProbe enabled={false} />);
    await user.click(screen.getByRole('button', { name: 'Toggle animation' }));

    expect(autoAnimateMock.controller.disable).toHaveBeenCalledOnce();

    unmount();

    expect(autoAnimateMock.controller.destroy).toHaveBeenCalled();
  });

  it('ignores auto-animate toggles before an element is registered', async () => {
    const UnboundAutoAnimateProbe = () => {
      const [, setEnabled] = useAutoAnimate();

      return (
        <button
          type="button"
          onClick={() => setEnabled(true)}
        >
          Toggle before bind
        </button>
      );
    };
    const user = setupUser();

    render(<UnboundAutoAnimateProbe />);

    await user.click(screen.getByRole('button', { name: 'Toggle before bind' }));

    expect(autoAnimateMock.controller.enable).not.toHaveBeenCalled();
    expect(autoAnimateMock.controller.disable).not.toHaveBeenCalled();
  });

  it('renders virtual tree items and exposes scrolling helpers', async () => {
    const user = setupUser();
    const virtualizerRef = createRef<TreeVirtualizerRef | null>();
    const onScroll = vi.fn();
    const onValueChange = vi.fn();

    render(
      <TreeVirtualizer
        className="custom-virtual-tree"
        classNames={{
          item: 'custom-virtual-tree-item',
          virtualContainer: 'custom-virtual-tree-container',
          virtualContent: 'custom-virtual-tree-content'
        }}
        defaultExpanded={['documents']}
        defaultValue="invoices"
        height={120}
        itemSize={index => 30 + index}
        items={treeItems}
        virtualizerRef={virtualizerRef}
        width={240}
        onScroll={onScroll}
        onValueChange={onValueChange}
      />
    );

    const virtualTree = screen.getByRole('tree');
    const reports = screen.getByRole('treeitem', { name: 'Reports' });

    expect(virtualTree).toHaveClass('custom-virtual-tree', 'custom-virtual-tree-container');
    expect(virtualTree).toHaveStyle({ height: '120px', width: '240px' });
    expect(virtualTree.querySelector('.custom-virtual-tree-content')).toBeInTheDocument();
    expect(reports).toHaveClass('custom-virtual-tree-item');
    expect(onScroll).toHaveBeenCalledWith(18);

    await user.click(reports);

    expect(onValueChange).toHaveBeenCalledWith('reports');

    virtualizerRef.current?.scrollToIndex(1, { align: 'center' });
    virtualizerRef.current?.scrollToValue('reports', { align: 'end' });
    virtualizerRef.current?.scrollToValue('missing');

    expect(treeVirtualizerMock.scrollToIndex).toHaveBeenNthCalledWith(1, 1, { align: 'center' });
    expect(treeVirtualizerMock.scrollToIndex).toHaveBeenNthCalledWith(2, 2, { align: 'end' });
    expect(treeVirtualizerMock.scrollToIndex).toHaveBeenCalledTimes(2);
    expect(virtualizerRef.current?.flattenItems.map(item => item.value)).toEqual(['documents', 'invoices', 'reports', 'archive']);
  });

  it('covers virtual tree selection, toggle and disabled callback branches', async () => {
    const user = setupUser();
    const onBubbleAddValueChange = vi.fn();
    const onBubbleRemoveValueChange = vi.fn();
    const onDisabledExpandedChange = vi.fn();
    const onDisabledValueChange = vi.fn();
    const onExpandedChange = vi.fn();
    const onPropagateAddValueChange = vi.fn();
    const onPropagateRemoveValueChange = vi.fn();
    const onReplaceValueChange = vi.fn();
    const onValueChange = vi.fn();

    render(
      <>
        <TreeVirtualizer
          defaultExpanded={['documents']}
          defaultValue="reports"
          height={120}
          items={treeItems}
          onValueChange={onValueChange}
        />
        <TreeVirtualizer
          height={120}
          items={treeItems}
          onExpandedChange={onExpandedChange}
        />
        <TreeVirtualizer
          defaultExpanded={['documents']}
          defaultValue={['invoices']}
          height={120}
          items={treeItems}
          multiple
          selectionBehavior="replace"
          onValueChange={onReplaceValueChange}
        />
        <TreeVirtualizer
          bubbleSelect
          defaultExpanded={['documents']}
          defaultValue={['invoices']}
          height={120}
          items={treeItems}
          multiple
          onValueChange={onBubbleAddValueChange}
        />
        <TreeVirtualizer
          bubbleSelect
          defaultExpanded={['documents']}
          defaultValue={['documents', 'invoices']}
          height={120}
          items={treeItems}
          multiple
          onValueChange={onBubbleRemoveValueChange}
        />
        <TreeVirtualizer
          allowParentSelect
          defaultExpanded={['documents']}
          height={120}
          items={treeItems}
          multiple
          propagateSelect
          onValueChange={onPropagateAddValueChange}
        />
        <TreeVirtualizer
          allowParentSelect
          defaultExpanded={['documents']}
          defaultValue={['documents']}
          height={120}
          items={treeItems}
          multiple
          propagateSelect
          onValueChange={onPropagateRemoveValueChange}
        />
        <TreeVirtualizer
          disabled
          defaultExpanded={['documents']}
          height={120}
          items={treeItems}
          renderItem={(props) => {
            const { select, toggle } = props;

            return (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  select('reports');
                  toggle('documents');
                }}
              >
                disabled virtual action
              </button>
            );
          }}
          onExpandedChange={onDisabledExpandedChange}
          onValueChange={onDisabledValueChange}
        />
      </>
    );

    const [selectedTree, collapsedTree, replaceTree, bubbleAddTree, bubbleRemoveTree, propagateAddTree, propagateRemoveTree] = screen.getAllByRole('tree');

    await user.click(getTreeItemByValue(selectedTree, 'reports'));
    await user.click(getTreeItemByValue(collapsedTree, 'documents'));
    await user.click(getTreeItemByValue(replaceTree, 'reports'));
    await user.click(getTreeItemByValue(bubbleAddTree, 'reports'));
    await user.click(getTreeItemByValue(bubbleRemoveTree, 'invoices'));
    await user.click(getTreeItemByValue(propagateAddTree, 'documents'));
    await user.click(getTreeItemByValue(propagateRemoveTree, 'documents'));
    await user.click(screen.getAllByRole('button', { name: 'disabled virtual action' })[0]);

    expect(onValueChange).toHaveBeenCalledWith('');
    expect(onExpandedChange).toHaveBeenCalledWith(['documents']);
    expect(onReplaceValueChange).toHaveBeenCalledWith(['reports']);
    expect(onBubbleAddValueChange).toHaveBeenCalledWith(['invoices', 'reports', 'documents']);
    expect(onBubbleRemoveValueChange).toHaveBeenCalledWith([]);
    expect(onPropagateAddValueChange).toHaveBeenCalledWith(['documents']);
    expect(onPropagateRemoveValueChange).toHaveBeenCalledWith(['invoices', 'reports']);
    expect(onDisabledExpandedChange).not.toHaveBeenCalled();
    expect(onDisabledValueChange).not.toHaveBeenCalled();
  });

  it('covers virtual tree single replacement, single toggle and empty dynamic paths', async () => {
    const user = setupUser();
    const onEmptyScroll = vi.fn();
    const onExpandedChange = vi.fn();
    const onReplaceSingleValueChange = vi.fn();
    const nestedItems: TreeItemData[] = [
      {
        label: 'Documents',
        value: 'documents',
        children: [
          {
            label: 'Reports',
            value: 'reports',
            children: [
              { label: 'Annual', value: 'annual' }
            ]
          }
        ]
      }
    ];

    treeVirtualizerMock.state.scrollOffset = undefined;

    const { container } = render(
      <>
        <TreeVirtualizer
          dynamic
          height={120}
          items={[]}
          onScroll={onEmptyScroll}
        />
        <TreeVirtualizer
          dynamic
          defaultExpanded={['documents']}
          height={120}
          items={[{ children: [{ value: 'virtual-child' }], value: 'virtual-parent' }] as unknown as TreeItemData[]}
        />
        <TreeVirtualizer
          defaultExpanded={['documents']}
          height={120}
          items={treeItems}
          selectionBehavior="replace"
          onValueChange={onReplaceSingleValueChange}
        />
        <TreeVirtualizer
          defaultExpanded={['documents']}
          height={120}
          items={nestedItems}
          toggleBehavior="single"
          onExpandedChange={onExpandedChange}
        />
      </>
    );

    const [, dynamicDefaultTree, replaceTree, singleToggleTree] = screen.getAllByRole('tree');

    await user.click(getTreeItemByValue(replaceTree, 'reports'));
    await user.click(getTreeItemByValue(singleToggleTree, 'reports'));

    expect(container.querySelector('ul > div')).toHaveStyle({ transform: 'translateY(0px)' });
    expect(getTreeItemByValue(dynamicDefaultTree, 'virtual-parent')).toHaveTextContent('virtual-parent');
    expect(onEmptyScroll).toHaveBeenCalledWith(0);
    expect(onReplaceSingleValueChange).toHaveBeenCalledWith('reports');
    expect(onExpandedChange).toHaveBeenCalledWith(['documents', 'reports']);
  });

  it('renders dynamic virtual tree items with custom content', () => {
    render(
      <TreeVirtualizer
        dynamic
        defaultExpanded={['documents']}
        height={120}
        items={treeItems}
        renderItem={(props) => {
          const { isSelected, item } = props;

          return (
            <span>
              {item.label}
              {' '}
              {isSelected ? 'selected' : 'idle'}
            </span>
          );
        }}
      />
    );

    expect(screen.getByRole('treeitem', { name: 'Documents idle' })).toHaveAttribute('data-index', '0');
    expect(screen.getByRole('treeitem', { name: 'Invoices idle' })).toHaveAttribute('data-index', '1');
  });
});
