import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { VirtualGrid, VirtualList } from '../src/components/virtualizer';
import * as virtualizerOrigin from '../src/components/virtualizer/origin';
import type { VirtualizerGrid, VirtualizerList } from '../src/components/virtualizer';
import { render, screen, waitFor } from './helpers/render';

interface RowItem {
  /** Stable identifier used by virtualizer keys. */
  id: string;

  /** Visible row label rendered by tests. */
  label: string;
}

const rows: RowItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `row-${index}`,
  label: `Row ${index}`
}));

describe('Virtualizer', () => {
  it('renders virtual list items with custom slots and exposes the virtualizer ref', async () => {
    const listRef = createRef<VirtualizerList<HTMLDivElement, HTMLDivElement>>();

    const { container } = render(
      <VirtualList
        className="custom-list"
        classNames={{ inner: 'custom-list-inner' }}
        data={rows}
        height={120}
        initialRect={{ height: 120, width: 240 }}
        itemSize={30}
        keyExtractor="id"
        observeElementOffset={(_instance, callback) => {
          callback(0, false);

          return () => undefined;
        }}
        observeElementRect={(_instance, callback) => {
          callback({ height: 120, width: 240 });

          return () => undefined;
        }}
        ref={listRef}
        width={240}
        renderItem={(props) => {
          const { index, item } = props;

          return (
            <div data-testid={`row-${index}`}>
              {item.label}
            </div>
          );
        }}
      />
    );

    const root = container.firstElementChild as HTMLElement;
    const inner = root.firstElementChild as HTMLElement;

    expect(root).toHaveClass('custom-list');
    expect(root).toHaveStyle({ height: '120px', width: '240px' });
    expect(inner).toHaveClass('custom-list-inner');

    await waitFor(() => {
      expect(screen.getByTestId('row-0')).toHaveTextContent('Row 0');
    });

    expect(screen.getByTestId('row-0')).toHaveStyle({
      height: '30px',
      position: 'absolute',
      transform: 'translateY(0px)'
    });
    expect(listRef.current?.containerRef).toBe(root);
    expect(listRef.current?.getTotalSize()).toBe(600);
  });

  it('renders dynamic horizontal lists without wrapping items in absolute rows', async () => {
    const { container } = render(
      <VirtualList
        data={rows.slice(0, 5)}
        dynamic
        height={80}
        horizontal
        initialRect={{ height: 80, width: 200 }}
        itemSize={50}
        measureElement={() => 50}
        observeElementOffset={(_instance, callback) => {
          callback(0, false);

          return () => undefined;
        }}
        observeElementRect={(_instance, callback) => {
          callback({ height: 80, width: 200 });

          return () => undefined;
        }}
        width={200}
        renderItem={(props) => {
          const { index, item } = props;

          return (
            <div>
              {index}
              {' - '}
              {item.label}
            </div>
          );
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('0 - Row 0')).toBeInTheDocument();
    });

    expect(container.querySelector('[data-index="0"]')).toHaveStyle({
      height: '100%',
      position: 'absolute',
      transform: 'translateX(0px)'
    });
  });

  it('renders dynamic vertical lists with functional sizing and change callbacks', async () => {
    const onChange = vi.fn();
    const onScroll = vi.fn();

    const { container } = render(
      <VirtualList
        data={rows.slice(0, 5)}
        dynamic
        height={100}
        initialRect={{ height: 100, width: 180 }}
        itemSize={index => 24 + index}
        keyExtractor={item => item.id}
        measureElement={() => 24}
        observeElementOffset={(_instance, callback) => {
          queueMicrotask(() => {
            callback(12, true);
          });

          return () => undefined;
        }}
        observeElementRect={(_instance, callback) => {
          callback({ height: 100, width: 180 });

          return () => undefined;
        }}
        width={180}
        onChange={onChange}
        onScroll={onScroll}
        renderItem={(props) => {
          const { index, item } = props;

          return (
            <div>
              {item.id}
              {' / '}
              {index}
            </div>
          );
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('row-0 / 0')).toBeInTheDocument();
    });

    expect(container.querySelector('[data-index="0"]')?.parentElement).toHaveStyle({
      position: 'absolute',
      transform: 'translateY(0px)'
    });
    expect(onChange).toHaveBeenCalled();
    expect(onScroll).toHaveBeenCalled();
  });

  it('renders horizontal fixed lists and empty dynamic lists with default keys', async () => {
    const { container } = render(
      <>
        <VirtualList
          data={rows.slice(0, 3)}
          height={80}
          horizontal
          initialRect={{ height: 80, width: 180 }}
          itemSize={60}
          observeElementOffset={(_instance, callback) => {
            callback(0, false);

            return () => undefined;
          }}
          observeElementRect={(_instance, callback) => {
            callback({ height: 80, width: 180 });

            return () => undefined;
          }}
          width={180}
          renderItem={(props) => {
            const { index, item } = props;

            return (
              <div data-testid={`horizontal-row-${index}`}>
                {item.label}
              </div>
            );
          }}
        />
        <VirtualList<RowItem>
          data={[]}
          dynamic
          height={100}
          initialRect={{ height: 100, width: 160 }}
          itemSize={24}
          observeElementOffset={(_instance, callback) => {
            callback(0, false);

            return () => undefined;
          }}
          observeElementRect={(_instance, callback) => {
            callback({ height: 100, width: 160 });

            return () => undefined;
          }}
          renderItem={(props) => {
            const { item } = props;

            return <div>{item.label}</div>;
          }}
        />
      </>
    );

    await waitFor(() => {
      expect(screen.getByTestId('horizontal-row-0')).toHaveTextContent('Row 0');
    });

    expect(screen.getByTestId('horizontal-row-0')).toHaveStyle({
      position: 'absolute',
      transform: 'translateX(0px)',
      width: '60px'
    });
    const emptyListRoot = container.children[1] as HTMLElement;
    const emptyListInner = emptyListRoot.firstElementChild as HTMLElement;

    expect(emptyListInner.firstElementChild).toHaveStyle({
      transform: 'translateY(0px)'
    });
    expect(virtualizerOrigin.useVirtualizer).toBeTypeOf('function');
  });

  it('renders virtual grid cells and exposes row and column virtualizers', async () => {
    const gridRef = createRef<VirtualizerGrid<HTMLDivElement, HTMLDivElement>>();

    const { container } = render(
      <VirtualGrid
        className="custom-grid"
        classNames={{ inner: 'custom-grid-inner' }}
        columnProps={{
          initialRect: { height: 120, width: 200 },
          observeElementOffset: (_instance, callback) => {
            callback(0, false);

            return () => undefined;
          },
          observeElementRect: (_instance, callback) => {
            callback({ height: 120, width: 200 });

            return () => undefined;
          },
          scrollToFn: () => undefined
        }}
        columnWidth={100}
        columns={2}
        data={rows.slice(0, 6)}
        height={120}
        initialRect={{ height: 120, width: 200 }}
        keyExtractor="id"
        observeElementOffset={(_instance, callback) => {
          callback(0, false);

          return () => undefined;
        }}
        observeElementRect={(_instance, callback) => {
          callback({ height: 120, width: 200 });

          return () => undefined;
        }}
        ref={gridRef}
        rowHeight={40}
        width={200}
        renderCell={(item, rowIndex, colIndex) => (
          <div data-testid={`cell-${rowIndex}-${colIndex}`}>
            {item.label}
          </div>
        )}
      />
    );

    const root = container.firstElementChild as HTMLElement;
    const inner = root.firstElementChild as HTMLElement;

    expect(root).toHaveClass('custom-grid');
    expect(root).toHaveStyle({ height: '120px', width: '200px' });
    expect(inner).toHaveClass('custom-grid-inner');

    await waitFor(() => {
      expect(screen.getByTestId('cell-0-0')).toHaveTextContent('Row 0');
      expect(screen.getByTestId('cell-0-1')).toHaveTextContent('Row 1');
    });

    expect(screen.getByTestId('cell-1-0')).toHaveTextContent('Row 2');
    expect(gridRef.current?.containerRef).toBe(root);
    expect(gridRef.current?.rowVirtualizer.getTotalSize()).toBe(120);
    expect(gridRef.current?.columnVirtualizer.getTotalSize()).toBe(200);
  });

  it('renders function-sized virtual grid cells and skips trailing empty cells', async () => {
    const onChange = vi.fn();
    const onScroll = vi.fn();

    render(
      <VirtualGrid
        columnProps={{
          initialRect: { height: 120, width: 200 },
          observeElementOffset: (_instance, callback) => {
            callback(0, false);

            return () => undefined;
          },
          observeElementRect: (_instance, callback) => {
            callback({ height: 120, width: 200 });

            return () => undefined;
          },
          scrollToFn: () => undefined
        }}
        columnWidth={index => 80 + index * 10}
        columns={2}
        data={rows.slice(0, 5)}
        height={120}
        initialRect={{ height: 120, width: 200 }}
        keyExtractor={item => item.id}
        observeElementOffset={(_instance, callback) => {
          queueMicrotask(() => {
            callback(8, true);
          });

          return () => undefined;
        }}
        observeElementRect={(_instance, callback) => {
          callback({ height: 120, width: 200 });

          return () => undefined;
        }}
        rowHeight={index => 32 + index * 4}
        width={200}
        onChange={onChange}
        onScroll={onScroll}
        renderCell={(item, rowIndex, colIndex) => (
          <div data-testid={`function-cell-${rowIndex}-${colIndex}`}>
            {item.label}
          </div>
        )}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('function-cell-0-0')).toHaveTextContent('Row 0');
      expect(screen.getByTestId('function-cell-2-0')).toHaveTextContent('Row 4');
    });

    expect(screen.queryByTestId('function-cell-2-1')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalled();
    expect(onScroll).toHaveBeenCalled();
  });

  it('renders virtual grid cells with default fallback keys', async () => {
    render(
      <VirtualGrid
        columnProps={{
          initialRect: { height: 80, width: 160 },
          observeElementOffset: (_instance, callback) => {
            callback(0, false);

            return () => undefined;
          },
          observeElementRect: (_instance, callback) => {
            callback({ height: 80, width: 160 });

            return () => undefined;
          },
          scrollToFn: () => undefined
        }}
        columnWidth={80}
        columns={2}
        data={rows.slice(0, 3)}
        height={80}
        initialRect={{ height: 80, width: 160 }}
        observeElementOffset={(_instance, callback) => {
          callback(0, false);

          return () => undefined;
        }}
        observeElementRect={(_instance, callback) => {
          callback({ height: 80, width: 160 });

          return () => undefined;
        }}
        rowHeight={40}
        width={160}
        renderCell={(item, rowIndex, colIndex) => (
          <div data-testid={`default-key-cell-${rowIndex}-${colIndex}`}>
            {item.label}
          </div>
        )}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('default-key-cell-0-0')).toHaveTextContent('Row 0');
      expect(screen.getByTestId('default-key-cell-1-0')).toHaveTextContent('Row 2');
    });

    expect(screen.queryByTestId('default-key-cell-1-1')).not.toBeInTheDocument();
  });
});
