import type { ReactNode } from 'react';
import type { ClassValue, StyledComponentProps, ThemeSize } from '../../types/shared';
import type { PaginationShape, PaginationSlots, PaginationVariant } from './pagination-variants';

// ==================== Page Types ====================

/**
 * Represents an ellipsis item in pagination
 */
export interface PageEllipsis {
  type: 'ellipsis';
}

/**
 * Represents a page item in pagination
 */
export interface PageItem {
  type: 'page';
  value: number;
}

/**
 * Union type for pagination items (page numbers or ellipsis)
 */
export type PaginationPageItem = PageEllipsis | PageItem;

/**
 * Array of pagination items
 */
export type PaginationPages = PaginationPageItem[];

// ==================== Class Names ====================

/**
 * Class names for different slots in the pagination component
 */
export type PaginationClassNames = Partial<Record<PaginationSlots, ClassValue>>;

// ==================== Component Props ====================

/**
 * Props for the PaginationRoot component
 */
export interface PaginationRootProps extends StyledComponentProps<React.ComponentPropsWithRef<'nav'>> {

}

/**
 * Props for the PaginationContent component
 */
export interface PaginationContentProps extends StyledComponentProps<React.ComponentPropsWithRef<'div'>> {

}

/**
 * Props for the PaginationItem component (page number button)
 */
export interface PaginationItemProps extends StyledComponentProps<React.ComponentPropsWithRef<'button'>> {
  /**
   * Whether this item is the currently selected page
   */
  isActive?: boolean;
  /**
   * Button shape
   */
  shape?: PaginationShape;
  /**
   * Page number value
   */
  value: number;
  /**
   * Pagination variant style
   */
  variant?: PaginationVariant;
}

/**
 * Props for navigation buttons (Previous, Next, First, Last)
 */
export interface PaginationNavigationButtonProps extends StyledComponentProps<React.ComponentPropsWithRef<'button'>> {
  /**
   * Whether to apply selected state to navigation buttons
   */
  actionAsSelected?: boolean;
  /**
   * Custom icon to display
   */
  icon?: ReactNode;
  /**
   * Button shape
   */
  shape?: PaginationShape;
  /**
   * Pagination variant style (for actionAsSelected)
   */
  variant?: PaginationVariant;
}

/**
 * Props for the PaginationPrevious component
 */
export interface PaginationPreviousProps extends PaginationNavigationButtonProps {
  /**
   * Custom label text
   * @default 'Previous'
   */
  label?: ReactNode;
}

/**
 * Props for the PaginationNext component
 */
export interface PaginationNextProps extends PaginationNavigationButtonProps {
  /**
   * Custom label text
   * @default 'Next'
   */
  label?: ReactNode;
}

/**
 * Props for the PaginationFirst component
 */
export interface PaginationFirstProps extends PaginationNavigationButtonProps {
  /**
   * Custom label text
   * @default 'First'
   */
  label?: ReactNode;
}

/**
 * Props for the PaginationLast component
 */
export interface PaginationLastProps extends PaginationNavigationButtonProps {
  /**
   * Custom label text
   * @default 'Last'
   */
  label?: ReactNode;
}

/**
 * Props for the PaginationEllipsis component
 */
export interface PaginationEllipsisProps extends StyledComponentProps<React.ComponentPropsWithRef<'div'>> {
  /**
   * Custom icon to display
   */
  icon?: ReactNode;
}

/**
 * Props for the main Pagination component
 *
 * @example
 * ```tsx
 * <Pagination
 *   total={100}
 *   itemsPerPage={10}
 *   defaultPage={1}
 *   siblingCount={1}
 *   showEdges
 * />
 * ```
 */
export interface PaginationProps extends StyledComponentProps<Omit<React.ComponentPropsWithRef<'nav'>, 'onChange'>> {
  /**
   * Whether to apply the selected state to navigation buttons
   * @default false
   */
  actionAsSelected?: boolean;
  /**
   * Class names for customizing different parts of the pagination
   */
  classNames?: PaginationClassNames;
  /**
   * Props for the content container
   */
  contentProps?: Omit<PaginationContentProps, 'children'>;
  /**
   * The default page when uncontrolled
   * @default 1
   */
  defaultPage?: number;
  /**
   * When `true`, prevents the user from interacting with pagination
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom icon for the ellipsis
   */
  ellipsisIcon?: ReactNode;
  /**
   * Props for the ellipsis component
   */
  ellipsisProps?: Omit<PaginationEllipsisProps, 'children'>;
  /**
   * Custom icon for the first button
   */
  firstIcon?: ReactNode;
  /**
   * Custom label for the first button
   * @default 'First'
   */
  firstLabel?: ReactNode | true;
  /**
   * Props for the first button
   */
  firstProps?: Omit<PaginationFirstProps, 'children'>;
  /**
   * Props for page item buttons
   */
  itemProps?: Omit<PaginationItemProps, 'isActive' | 'value'>;
  /**
   * Number of items per page
   * @default 10
   */
  itemsPerPage?: number;
  /**
   * Custom icon for the last button
   */
  lastIcon?: ReactNode;
  /**
   * Custom label for the last button
   * @default 'Last'
   */
  lastLabel?: ReactNode | true;
  /**
   * Props for the last button
   */
  lastProps?: Omit<PaginationLastProps, 'children'>;
  /**
   * Custom icon for the next button
   */
  nextIcon?: ReactNode;
  /**
   * Custom label for the next button
   * @default 'Next'
   */
  nextLabel?: ReactNode | true;
  /**
   * Props for the next button
   */
  nextProps?: Omit<PaginationNextProps, 'children'>;
  /**
   * Callback when the page changes
   */
  onPageChange?: (page: number) => void;
  /**
   * The controlled value of the current page
   */
  page?: number;
  /**
   * Custom icon for the previous button
   */
  previousIcon?: ReactNode;
  /**
   * Custom label for the previous button
   * @default 'Previous'
   */
  previousLabel?: ReactNode | true;
  /**
   * Props for the previous button
   */
  previousProps?: Omit<PaginationPreviousProps, 'children'>;
  /**
   * Shape variant for pagination buttons
   * @default 'square'
   */
  shape?: PaginationShape;
  /**
   * Whether to always show first page, last page, and ellipsis
   * @default false
   */
  showEdges?: boolean;
  /**
   * Whether to show the first and last navigation buttons
   * @default true
   */
  showFirstLast?: boolean;
  /**
   * Number of siblings to show around the current page
   * @default 1
   */
  siblingCount?: number;
  /**
   * Size variant for the pagination component
   * @default 'md'
   */
  size?: ThemeSize;
  /**
   * Total number of items
   */
  total: number;
  /**
   * Style variant for the pagination
   * @default 'pure'
   */
  variant?: PaginationVariant;
}
