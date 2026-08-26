import type {
  TooltipArrowProps as _TooltipArrowProps,
  TooltipContentProps as _TooltipContentProps,
  TooltipProps as _TooltipProps
} from '@radix-ui/react-tooltip';

import type { ClassValue, StyledComponentProps, ThemeAlign, ThemeSide } from '../../types/shared';

import type { TooltipSlots } from './tooltip-variants';

/**
 * Class names for different slots in the tooltip component. Allows customizing styles for specific parts (content,
 * arrow, etc.).
 *
 * @example
 *   ```tsx
 *   const classNames: TooltipClassNames = {
 *     content: 'custom-tooltip-content',
 *     arrow: 'custom-arrow'
 *   };
 *   ```
 */
export type TooltipClassNames = Partial<Record<TooltipSlots, ClassValue>>;

/** Props for the tooltip content element. The container element that displays the tooltip message. */
export interface TooltipContentProps extends StyledComponentProps<_TooltipContentProps> {}

/** Props for the tooltip arrow element. The small triangular pointer that points to the trigger element. */
export interface TooltipArrowProps extends StyledComponentProps<_TooltipArrowProps> {}

/**
 * Props for the Tooltip component. Provides contextual information when users hover over or focus on an element. Wraps
 * the trigger element and displays a floating tooltip message.
 *
 * @example
 *   ```tsx
 *   <Tooltip content="Save your work" side="top" showArrow={true} classNames={{ content: 'dark-tooltip' }}>
 *     <button>Save</button>
 *   </Tooltip>;
 *   ```
 */
export interface TooltipProps extends StyledComponentProps<_TooltipProps> {
  /** Props for the tooltip arrow component. */
  arrowProps?: TooltipArrowProps;
  /** Class names for customizing different slots of the tooltip component. */
  classNames?: TooltipClassNames;
  /** The content to display inside the tooltip. Can be text, JSX elements, or any React node. */
  content: React.ReactNode;
  /**
   * Additional props to pass to the tooltip content element. Useful for customizing positioning, delays, and other
   * behavior. Note: `children` and `className` are not allowed as they are managed by the component.
   */
  contentProps?: Omit<TooltipContentProps, 'children' | 'className'>;
  /**
   * Whether to display an arrow pointing to the trigger element. When true, a small triangular pointer is shown at the
   * edge of the tooltip. Defaults to false.
   */
  showArrow?: boolean;
}

/**
 * The side of the trigger element where the tooltip should appear. Controls the preferred placement direction for the
 * tooltip.
 *
 * Possible values include: 'top', 'right', 'bottom', 'left'
 */
export type TooltipSide = ThemeSide;

/**
 * The alignment of the tooltip relative to the trigger element. Controls how the tooltip is aligned when placed on a
 * side.
 *
 * Possible values include: 'start', 'center', 'end'
 */
export type TooltipAlign = ThemeAlign;
