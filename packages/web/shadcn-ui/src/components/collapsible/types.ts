import type {
  CollapsibleContentProps as _CollapsibleContentProps,
  CollapsibleProps as _CollapsibleRootProps
} from '@radix-ui/react-collapsible';
import type { ClassValue, StyledComponentProps } from '../../types/shared';
import type { CollapsibleSlots } from './collapsible-variants';

/**
 * Props for the collapsible root component.
 * Provides state management and interaction handling for the collapsible element.
 */
export type CollapsibleRootProps = StyledComponentProps<Omit<_CollapsibleRootProps, 'content'>>;

/**
 * Props for the collapsible content component.
 * The expandable/collapsible content area that shows or hides based on state.
 */
export type CollapsibleContentProps = StyledComponentProps<_CollapsibleContentProps>;

/**
 * Class names for different slots in the collapsible component.
 * Allows customizing styles for specific parts of the collapsible.
 */
export type CollapsibleClassNames = Partial<Record<CollapsibleSlots, ClassValue>>;

/**
 * Props for the main Collapsible component.
 * Controls the visibility of content with animation support.
 *
 * @example
 * ```tsx
 * <Collapsible
 *   content={<div>Hidden content that toggles</div>}
 *   forceMountContent
 *   defaultOpen={true}
 * />
 * ```
 */
export interface CollapsibleProps extends CollapsibleRootProps {
  /**
   * Custom class names for different collapsible UI slots.
   * Allows styling the root and content areas independently.
   */
  classNames?: CollapsibleClassNames;

  /**
   * The content to display when the collapsible is expanded.
   * Can be text, HTML elements, or any React node.
   */
  content?: React.ReactNode;

  /**
   * Forces the content to always be mounted in the DOM.
   * Enables animation control and prevents layout shifts.
   */
  forceMountContent?: true;
}
