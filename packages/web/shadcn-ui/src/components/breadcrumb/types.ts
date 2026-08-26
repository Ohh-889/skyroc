import type { ClassValue, HTMLComponentProps, SlotProps } from '../../types/shared';
import type { DropdownMenuProps } from '../dropdown-menu';
import type { BreadcrumbSlots } from './breadcrumb-variants';

/**
 * Props for the breadcrumb ellipsis component.
 * Displays a visual indicator (usually "...") when breadcrumb items are hidden.
 */
export type BreadcrumbEllipsisProps = HTMLComponentProps<'span'>;

/**
 * Props for the breadcrumb item component.
 * Represents a single breadcrumb navigation item.
 */
export type BreadcrumbItemProps = HTMLComponentProps<'li'>;

/**
 * Props for the breadcrumb link component.
 * A clickable link in the breadcrumb trail.
 */
export type BreadcrumbLinkProps = HTMLComponentProps<'a'> & {
  /**
   * Whether to render as a child component using Radix UI's asChild pattern.
   */
  asChild?: boolean;
};

/**
 * Props for the breadcrumb list component.
 * Container for all breadcrumb items.
 */
export type BreadcrumbListProps = HTMLComponentProps<'ol'>;

/**
 * Props for the breadcrumb page component.
 * Displays the current/active page in the breadcrumb trail.
 */
export type BreadcrumbPageProps = HTMLComponentProps<'span'>;

/**
 * Props for the breadcrumb root component.
 * Main navigation element for breadcrumb navigation.
 */
export type BreadcrumbRootProps = HTMLComponentProps<'nav'>;

/**
 * Props for the breadcrumb separator component.
 * Displays a visual divider between breadcrumb items (e.g., "/", ">").
 */
export type BreadcrumbSeparatorProps = HTMLComponentProps<'li'>;

/**
 * Data structure for a single breadcrumb item.
 * Use this type to define items passed to the Breadcrumb component.
 */
export interface BreadcrumbItem extends BreadcrumbLinkProps, SlotProps {
  /**
   * Custom class names for styling this specific breadcrumb item.
   */
  className?: ClassValue;
  /**
   * Display text or content for the breadcrumb item.
   */
  label: React.ReactNode;
  /**
   * Unique identifier for the breadcrumb item.
   */
  value: string;
}

/**
 * Class names for different slots in the breadcrumb component.
 * Allows customizing styles for specific parts of the breadcrumb.
 */
export type BreadcrumbUi = Partial<Record<BreadcrumbSlots, ClassValue>>;

/**
 * Props for the main Breadcrumb component.
 * Manages rendering and navigation of breadcrumb items with optional ellipsis support.
 *
 * @template T - Type of breadcrumb item data, extends BreadcrumbItem
 *
 * @example
 * ```jsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', value: 'home' },
 *     { label: 'Products', value: 'products' },
 *     { label: 'Electronics', value: 'electronics' }
 *   ]}
 *   ellipsis={[1, 2]}
 *   separator="/"
 *   handleItemClick={(item) => navigate(item.value)}
 * />
 * ```
 */
export type BreadcrumbProps<T extends BreadcrumbItem> = BreadcrumbRootProps & {
  /**
   * Class names for customizing breadcrumb slots (excluding link and page slots).
   */
  classNames?: Omit<BreadcrumbUi, 'link' | 'page'>;
  /**
   * Configuration for displaying ellipsis when items are hidden.
   * Can be true to auto-show ellipsis when items exceed 4, [start, end] for specific range, or null to disable.
   * When true, ellipsis appears when the item count is greater than 4.
   * [start, end] specifies the range indices where ellipsis should be displayed.
   */
  ellipsis?: true | [number, number] | null;
  /**
   * Props for the dropdown menu that wraps the ellipsis.
   * Use this to customize the dropdown menu behavior and appearance.
   */
  ellipsisDropdownProps?: Omit<DropdownMenuProps, 'children' | 'items'>;
  /**
   * Custom icon or element to display for the ellipsis.
   */
  ellipsisIcon?: React.ReactNode;
  /**
   * Props for the breadcrumb ellipsis component.
   */
  ellipsisProps?: BreadcrumbEllipsisProps;
  /**
   * Callback function invoked when a breadcrumb item is clicked.
   */
  handleItemClick?: (item: T) => void;
  /**
   * Props for the breadcrumb item component.
   */
  itemProps?: BreadcrumbItemProps;
  /**
   * Array of breadcrumb items to render.
   */
  items: T[];
  /**
   * Props for the breadcrumb link component.
   */
  linkProps?: BreadcrumbLinkProps;
  /**
   * Props for the breadcrumb list component.
   */
  listProps?: BreadcrumbListProps;
  /**
   * Props for the breadcrumb page component.
   */
  pageProps?: BreadcrumbPageProps;
  /**
   * Custom render function for displaying the ellipsis element.
   */
  renderEllipsis?: (items: T[]) => React.ReactNode;
  /**
   * Custom render function for displaying individual breadcrumb items.
   */
  renderItem?: (item: T) => React.ReactNode;
  /**
   * Visual separator displayed between breadcrumb items (e.g., "/", ">", "|").
   */
  separator?: React.ReactNode;
  /**
   * Props for the breadcrumb separator component.
   */
  separatorProps?: BreadcrumbSeparatorProps;
};
