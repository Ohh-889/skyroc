import { describe, expect, it, vi } from 'vitest';
import { VirtualGrid, VirtualList } from '../src/components/virtualizer';
import { render, screen } from './helpers/render';

interface RowItem {
  /** Stable identifier used by virtualizer keys. */
  id: string;

  /** Visible row label rendered by tests. */
  label: string;
}

interface VirtualizerMockOptions {
  /** Number of virtual items requested by the component. */
  count: number;

  /** Estimated size resolver passed to the virtualizer. */
  estimateSize: (index: number) => number;

  /** Callback for resolving the scroll element. */
  getScrollElement: () => unknown;

  /** Whether the virtualizer is rendering on the horizontal axis. */
  horizontal?: boolean;

  /** Change callback registered by the component. */
  onChange?: (instance: { scrollOffset?: number }, sync: boolean) => void;
}

const virtualizerMock = vi.hoisted(() => {
  const measureElement = vi.fn();

  return {
    measureElement,
    useVirtualizer: vi.fn((options: VirtualizerMockOptions) => {
      options.getScrollElement();
      options.onChange?.({}, false);

      return {
        getTotalSize: () => options.count * options.estimateSize(0),
        getVirtualItems: () => Array.from({ length: options.count }, (_, index) => ({
          index,
          key: index,
          size: options.estimateSize(index),
          start: index * options.estimateSize(index)
        })),
        measureElement,
        scrollOffset: undefined
      };
    })
  };
});

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: virtualizerMock.useVirtualizer
}));

const rows: RowItem[] = [
  { id: 'row-a', label: 'Row A' },
  { id: 'row-b', label: 'Row B' }
];

describe('Virtualizer branch coverage', () => {
  it('covers fallback scroll offsets, dimensions and key extraction branches', () => {
    const onGridScroll = vi.fn();
    const onListScroll = vi.fn();

    render(
      <>
        <VirtualList
          data={rows.slice(0, 1)}
          itemSize={24}
          onScroll={onListScroll}
          renderItem={(props) => {
            const { item } = props;

            return <div data-testid="default-height-row">{item.label}</div>;
          }}
        />
        <VirtualList
          data={rows.slice(0, 1)}
          horizontal
          itemSize={32}
          keyExtractor={item => item.id}
          renderItem={(props) => {
            const { item } = props;

            return <div data-testid="horizontal-function-key-row">{item.label}</div>;
          }}
        />
        <VirtualList
          data={rows.slice(0, 1)}
          dynamic
          itemSize={28}
          keyExtractor="id"
          renderItem={(props) => {
            const { item } = props;

            return <div data-testid="dynamic-string-key-row">{item.label}</div>;
          }}
        />
        <VirtualGrid
          columnWidth={64}
          columns={1}
          data={rows.slice(0, 1)}
          height={80}
          rowHeight={40}
          width={120}
          onScroll={onGridScroll}
          renderCell={(item, rowIndex, colIndex) => (
            <div data-testid={`mock-grid-cell-${rowIndex}-${colIndex}`}>
              {item.label}
            </div>
          )}
        />
      </>
    );

    expect(screen.getByTestId('default-height-row')).toHaveTextContent('Row A');
    expect(screen.getByTestId('horizontal-function-key-row')).toHaveStyle({
      transform: 'translateX(0px)',
      width: '32px'
    });
    expect(screen.getByTestId('dynamic-string-key-row')).toHaveTextContent('Row A');
    expect(screen.getByTestId('mock-grid-cell-0-0')).toHaveTextContent('Row A');
    expect(onListScroll).toHaveBeenCalledWith(0);
    expect(onGridScroll).toHaveBeenCalledWith(0);
  });
});
