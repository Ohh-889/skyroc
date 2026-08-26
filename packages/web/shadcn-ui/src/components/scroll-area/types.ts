import type {
  ScrollAreaProps as _ScrollAreaProps,
  ScrollAreaScrollbarProps as _ScrollAreaScrollbarProps,
  ScrollAreaThumbProps as _ScrollAreaThumbProps,
  ScrollAreaViewportProps as _ScrollAreaViewportProps
} from '@radix-ui/react-scroll-area';

import type { ClassValue, StyledComponentProps } from '../../types/shared';

import type { ScrollAreaSlots } from './scroll-area-variants';

/**
 * Class names for different slots in the scroll area component. Allows customizing styles for the root, scrollbar,
 * thumb, and viewport elements.
 */
export type ScrollAreaUi = Partial<Record<ScrollAreaSlots, ClassValue>>;

/**
 * Props for the scroll area root component. Provides the container for scrollable content with custom scrollbar
 * styling.
 */
export interface ScrollAreaRootProps extends StyledComponentProps<_ScrollAreaProps> {}

/**
 * Props for the scroll area scrollbar component. Represents the track element that contains the thumb for vertical or
 * horizontal scrolling.
 */
export interface ScrollAreaScrollbarProps extends StyledComponentProps<_ScrollAreaScrollbarProps> {}

/**
 * Props for the scroll area thumb component. The draggable indicator that shows the scroll position and can be dragged
 * to scroll.
 */
export interface ScrollAreaThumbProps extends StyledComponentProps<_ScrollAreaThumbProps> {}

/** Props for the scroll area viewport component. The container that holds the actual scrollable content. */
export interface ScrollAreaViewportProps extends StyledComponentProps<_ScrollAreaViewportProps> {}

/**
 * Props for the main ScrollArea component. Combines root, scrollbar, and viewport configurations for a complete
 * scrollable region.
 *
 * @example
 *   ```tsx
 *   <ScrollArea classNames={{ viewport: 'max-h-96' }}>
 *     <div>Scrollable content here</div>
 *   </ScrollArea>;
 *   ```
 */
export interface ScrollAreaProps
  extends ScrollAreaRootProps, Omit<ScrollAreaScrollbarProps, 'dir'>, Omit<ScrollAreaViewportProps, 'dir'> {
  /** Class names for customizing different parts of the scroll area component. */
  classNames?: ScrollAreaUi;
  /** Props for the scroll area scrollbar component. */
  scrollbarProps?: ScrollAreaScrollbarProps;
  /** Props for the scroll area thumb component. */
  thumbProps?: ScrollAreaThumbProps;
  /** Props for the scroll area viewport component. */
  viewportProps?: ScrollAreaViewportProps;
}
