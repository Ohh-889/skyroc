import type { ReactNode } from 'react';
import type {
  ToggleGroupItemProps as _ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps
} from '@radix-ui/react-toggle-group';
import type { ClassValue, StyledComponentProps } from '../../types/shared';
import type { ToggleProps } from '../toggle';
import type { ToggleSlots } from '../toggle/toggle-variants';

/**
 * Props for the toggle group root component.
 * Can be either single or multiple selection mode.
 * Single mode allows only one toggle to be active at a time.
 * Multiple mode allows multiple toggles to be active simultaneously.
 */
export type ToggleGroupRootProps = StyledComponentProps<ToggleGroupMultipleProps> | StyledComponentProps<ToggleGroupSingleProps>;

/**
 * Props for individual toggle items within the group.
 * Extends the base Radix UI toggle group item with style customization.
 *
 * @example
 * ```tsx
 * const itemProps: ToggleGroupItemProps = {
 *   value: 'bold',
 *   variant: 'outline',
 *   children: 'Bold'
 * }
 * ```
 */
export type ToggleGroupItemProps = StyledComponentProps<_ToggleGroupItemProps> & {
  /**
   * Visual variant style for the toggle item (e.g., outline, solid, ghost).
   */
  variant?: ToggleProps['variant'];
};

/**
 * Class names for different slots in the toggle group component.
 * Allows customizing styles for specific parts of the toggle group (items, etc.).
 *
 * @example
 * ```tsx
 * const classNames: ToggleGroupClassNames = {
 *   root: 'custom-group',
 *   item: 'custom-toggle-item'
 * }
 * ```
 */
export type ToggleGroupClassNames = Partial<Record<ToggleSlots, ClassValue>>;

/**
 * Data structure for a single toggle group item when using the data-driven approach.
 * Use this type to define items passed to the `items` prop of the ToggleGroup component.
 *
 * @example
 * ```tsx
 * const items: ToggleGroupItemData[] = [
 *   { value: 'bold', label: 'Bold', disabled: false },
 *   { value: 'italic', label: 'Italic', disabled: false }
 * ]
 * ```
 */
export type ToggleGroupItemData = Omit<ToggleGroupItemProps, 'children'> & {
  /**
   * The display label/text shown in the toggle item button.
   */
  label: ReactNode;
};

/**
 * Props for the main ToggleGroup component.
 * Supports data-driven rendering via the `items` prop.
 *
 * @template T - Type of toggle group item data, defaults to ToggleGroupItemData
 *
 * @example
 * ```tsx
 * const items = [
 *   { value: 'bold', label: 'Bold' },
 *   { value: 'italic', label: 'Italic' },
 *   { value: 'underline', label: 'Underline' }
 * ]
 *
 * <ToggleGroup
 *   items={items}
 *   type="single"
 *   defaultValue="bold"
 *   variant="outline"
 *   classNames={{ item: 'custom-toggle' }}
 * />
 * ```
 */
export type ToggleGroupProps<T extends ToggleGroupItemData = ToggleGroupItemData> = ToggleGroupRootProps & {
  /**
   * Class names for customizing different slots of the toggle group component.
   */
  classNames?: ToggleGroupClassNames;
  /**
   * Custom render function for toggle items.
   * Receives the item data and returns the rendered content.
   * If not provided, the `label` property is used as default content.
   */
  itemRender?: (item: T) => ReactNode;
  /**
   * Array of toggle items to render.
   * Each item should have a unique `value` property.
   */
  items: T[];
  /**
   * Visual variant style for all toggle items in the group (e.g., outline, solid, ghost).
   * Can be overridden per item if specified in item props.
   */
  variant?: ToggleProps['variant'];
};
