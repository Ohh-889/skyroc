import { describe, expect, it, vi } from 'vitest';
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious
} from '../src/components/pagination';
import { getPageCount, getRange, transform } from '../src/components/pagination/shared';
import { Pagination } from '../src/preset/pagination';
import { render, screen, setupUser } from './helpers/render';

describe('pagination shared helpers', () => {
  it('calculates page count with a minimum of one page', () => {
    expect(getPageCount(0, 10)).toBe(1);
    expect(getPageCount(45, 10)).toBe(5);
    expect(getPageCount(45, 0)).toBe(45);
  });

  it('builds compact ranges without edge pages', () => {
    expect(getRange(1, 2, 2, false)).toEqual([1, 2]);
    expect(getRange(1, 10, 1, false)).toEqual([1, 2, 3]);
    expect(getRange(5, 10, 1, false)).toEqual([4, 5, 6]);
    expect(getRange(10, 10, 1, false)).toEqual([8, 9, 10]);
  });

  it('builds edge-aware ranges with ellipsis markers', () => {
    expect(getRange(3, 5, 1, true)).toEqual([1, 2, 3, 4, 5]);
    expect(getRange(1, 10, 1, true)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
    expect(getRange(5, 10, 1, true)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
    expect(getRange(10, 10, 1, true)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10]);
  });

  it('transforms raw ranges into renderable page items', () => {
    expect(transform([1, 'ellipsis', 4])).toEqual([
      { type: 'page', value: 1 },
      { type: 'ellipsis' },
      { type: 'page', value: 4 }
    ]);
  });
});

describe('Pagination', () => {
  it('updates the selected page through page and navigation buttons', async () => {
    const user = setupUser();
    const onPageChange = vi.fn();

    render(
      <Pagination
        defaultPage={2}
        itemsPerPage={10}
        total={50}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { current: 'page', name: 'Page 2' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Page 3' }));

    expect(onPageChange).toHaveBeenLastCalledWith(3);
    expect(screen.getByRole('button', { current: 'page', name: 'Page 3' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to previous page' }));

    expect(onPageChange).toHaveBeenLastCalledWith(2);
    expect(screen.getByRole('button', { current: 'page', name: 'Page 2' })).toBeInTheDocument();
  });

  it('updates the selected page through first, next and last buttons', async () => {
    const user = setupUser();
    const onPageChange = vi.fn();

    render(
      <Pagination
        defaultPage={2}
        itemsPerPage={10}
        total={50}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(onPageChange).toHaveBeenLastCalledWith(3);
    expect(screen.getByRole('button', { current: 'page', name: 'Page 3' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to last page' }));

    expect(onPageChange).toHaveBeenLastCalledWith(5);
    expect(screen.getByRole('button', { current: 'page', name: 'Page 5' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to first page' }));

    expect(onPageChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('button', { current: 'page', name: 'Page 1' })).toBeInTheDocument();
  });

  it('prevents page changes while disabled', async () => {
    const user = setupUser();
    const onPageChange = vi.fn();

    render(
      <Pagination
        disabled
        defaultPage={1}
        itemsPerPage={10}
        total={30}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    await user.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { current: 'page', name: 'Page 1' })).toBeInTheDocument();
  });

  it('renders ellipsis markers when edge pages are enabled', () => {
    const { container } = render(
      <Pagination
        classNames={{
          ellipsis: 'configured-pagination-ellipsis'
        }}
        defaultPage={5}
        ellipsisIcon={<span>Gap</span>}
        itemsPerPage={10}
        showEdges
        total={100}
      />
    );

    const ellipsisItems = container.querySelectorAll('[data-slot="pagination-ellipsis"]');

    expect(ellipsisItems).toHaveLength(2);
    expect(ellipsisItems[0]).toHaveClass('configured-pagination-ellipsis');
    expect(screen.getAllByText('Gap')).toHaveLength(2);
  });

  it('can hide the first and last navigation buttons', () => {
    render(
      <Pagination
        defaultPage={2}
        itemsPerPage={10}
        showFirstLast={false}
        total={30}
      />
    );

    expect(screen.queryByRole('button', { name: 'Go to first page' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to last page' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument();
  });

  it('keeps out-of-range navigation from changing the page', async () => {
    const user = setupUser();
    const onPageChange = vi.fn();

    render(
      <Pagination
        defaultPage={1}
        itemsPerPage={10}
        previousProps={{ disabled: false }}
        total={20}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Go to previous page' }));

    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { current: 'page', name: 'Page 1' })).toBeInTheDocument();
  });

  it('runs the disabled guard even when item props override the button disabled state', async () => {
    const user = setupUser();
    const onPageChange = vi.fn();

    render(
      <Pagination
        disabled
        defaultPage={1}
        itemProps={{ disabled: false }}
        itemsPerPage={10}
        total={30}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Page 2' }));

    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { current: 'page', name: 'Page 1' })).toBeInTheDocument();
  });
});

describe('pagination primitive branches', () => {
  it('renders ellipsis children, custom icons and fallback icons', () => {
    const { container } = render(
      <div>
        <PaginationEllipsis
          data-testid="ellipsis-icon"
          icon={<span>Custom gap icon</span>}
        />

        <PaginationEllipsis data-testid="ellipsis-children">
          Custom gap children
        </PaginationEllipsis>

        <PaginationEllipsis data-testid="ellipsis-fallback" />
      </div>
    );

    expect(screen.getByText('Custom gap icon')).toBeInTheDocument();
    expect(screen.getByText('Custom gap children')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="ellipsis-fallback"] svg')).toBeInTheDocument();
  });

  it('renders selected navigation buttons with custom labels and icons', () => {
    render(
      <div>
        <PaginationFirst
          actionAsSelected
          icon={<span>First icon</span>}
          label={<span>First label</span>}
        />

        <PaginationPrevious
          actionAsSelected
          icon={<span>Previous icon</span>}
          label="Previous label"
        />

        <PaginationNext
          actionAsSelected
          icon={<span>Next icon</span>}
          label={<span>Next label</span>}
        />

        <PaginationLast
          actionAsSelected
          icon={<span>Last icon</span>}
          label="Last label"
        />
      </div>
    );

    expect(screen.getByRole('button', { name: 'Go to first page' })).toHaveAttribute('data-selected', '');
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toHaveAttribute('data-selected', '');
    expect(screen.getByRole('button', { name: 'Go to next page' })).toHaveAttribute('data-selected', '');
    expect(screen.getByRole('button', { name: 'Go to last page' })).toHaveAttribute('data-selected', '');
    expect(screen.getByText('First icon')).toBeInTheDocument();
    expect(screen.getByText('First label')).toBeInTheDocument();
    expect(screen.getByText('Previous icon')).toBeInTheDocument();
    expect(screen.getByText('Previous label')).toBeInTheDocument();
    expect(screen.getByText('Next icon')).toBeInTheDocument();
    expect(screen.getByText('Next label')).toBeInTheDocument();
    expect(screen.getByText('Last icon')).toBeInTheDocument();
    expect(screen.getByText('Last label')).toBeInTheDocument();
  });

  it('renders alternate navigation label and fallback icon branches', () => {
    const { container } = render(
      <div>
        <PaginationFirst label="First text label" />
        <PaginationPrevious label={<span>Previous element label</span>} />
        <PaginationNext label="Next text label" />
        <PaginationLast label={<span>Last element label</span>} />
      </div>
    );

    expect(screen.getByText('First text label')).toBeInTheDocument();
    expect(screen.getByText('Previous element label')).toBeInTheDocument();
    expect(screen.getByText('Next text label')).toBeInTheDocument();
    expect(screen.getByText('Last element label')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="pagination-previous"] svg')).toBeInTheDocument();
  });
});
