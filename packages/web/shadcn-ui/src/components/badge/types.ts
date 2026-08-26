import type { ClassValue, HTMLComponentProps, ThemeColor, ThemeSize } from '../../types/shared';
import type { BadgePosition, BadgeSlots } from './badge-variants';

/**
 * Props for the badge root container component.
 * Serves as the main wrapper for the badge element.
 */
export type BadgeRootProps = HTMLComponentProps<'div'>;

/**
 * Props for the badge content component.
 * Controls the styling and appearance of the badge's displayed content.
 */
export interface BadgeContentProps extends HTMLComponentProps<'span'> {
  /**
   * Theme color for the badge.
   * Determines the visual styling and background color.
   */
  color?: ThemeColor;

  /**
   * Position where the badge is placed.
   * Affects the badge's layout and positioning within its container.
   */
  position?: BadgePosition;

  /**
   * Size variant for the badge.
   * Controls the overall dimensions and padding.
   */
  size?: ThemeSize;
}

/**
 * Class names for different slots in the badge component.
 * Allows customizing styles for specific parts of the badge.
 */
export type BadgeUi = Partial<Record<BadgeSlots, ClassValue>>;

/**
 * Props for the main Badge component.
 * Combines root and content properties with visibility control.
 *
 * @example
 * ```tsx
 * <Badge
 *   color="blue"
 *   size="md"
 *   position="left"
 *   content="Label"
 *   open={true}
 * />
 * ```
 */
export interface BadgeProps
  extends Omit<BadgeRootProps, 'color' | 'content'>,
  Pick<BadgeContentProps, 'color' | 'position' | 'size'> {
  /**
   * Custom class names for different badge UI slots.
   * Allows fine-grained styling of badge components.
   */
  classNames?: BadgeUi;

  /**
   * The content to display inside the badge.
   * Can be text, icons, or any React node.
   */
  content?: React.ReactNode;

  /**
   * Controls the visibility/open state of the badge.
   * When true, the badge is displayed; when false, it may be hidden or collapsed.
   */
  open?: boolean;
}

export type { BadgePosition };
