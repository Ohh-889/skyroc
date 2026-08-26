import type {
  HoverCardArrowProps as _HoverCardArrowProps,
  HoverCardContentProps as _HoverCardContentProps,
  HoverCardProps as _HoverCardProps
} from '@radix-ui/react-hover-card';
import type { ClassValue, StyledComponentProps } from '../../types/shared';
import type { HoverCardSlots } from './hover-card-variants';

/**
 * Class names for different slots in the hover card component.
 * Allows customizing styles for specific parts of the hover card.
 */
export type HoverCardClassNames = Partial<Record<HoverCardSlots, ClassValue>>;

/**
 * Props for the main Hover Card component.
 * A floating card that appears when hovering over a trigger element.
 *
 * @example
 * ```tsx
 * <HoverCard
 *   trigger={<span>Hover me</span>}
 *   showArrow
 *   contentProps={{ side: 'right' }}
 * >
 *   <p>This content appears on hover</p>
 * </HoverCard>
 * ```
 */
export type HoverCardProps = StyledComponentProps<_HoverCardProps> & {
  /**
   * Props to customize the arrow indicator of the hover card.
   * Only applied when showArrow is true.
   */
  arrowProps?: HoverCardArrowProps;
  /**
   * Class names for customizing different parts of the hover card component.
   */
  classNames?: HoverCardClassNames;
  /**
   * Props to customize the content container of the hover card.
   * Includes positioning, delay, and other content behaviors.
   */
  contentProps?: Omit<HoverCardContentProps, 'children' | 'className'>;
  /**
   * Whether to display the arrow indicator pointing to the trigger element.
   * Defaults to false.
   */
  showArrow?: boolean;
  /**
   * Element that triggers the hover card to appear.
   * Can be any React element or component.
   */
  trigger?: React.ReactNode;
};

/**
 * Props for the hover card arrow component.
 * The small arrow/pointer that visually connects the trigger to the card.
 */
export type HoverCardArrowProps = StyledComponentProps<_HoverCardArrowProps>;

/**
 * Props for the hover card content component.
 * Container for the content displayed in the floating hover card.
 */
export type HoverCardContentProps = StyledComponentProps<_HoverCardContentProps>;
