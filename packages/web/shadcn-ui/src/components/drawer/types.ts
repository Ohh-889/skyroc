import type { DialogContentProps } from '@radix-ui/react-dialog';
import type { ClassValue, StyledComponentProps } from '../../types/shared';
import type { DialogSlots as DrawerSlots } from '../dialog/dialog-variants';
import type { DialogProps } from '../dialog/types';
import type { DrawerSide } from './drawer-variants';

/**
 * Props for the drawer content component.
 * The main container that slides in from a specified side of the screen.
 *
 * @example
 * ```tsx
 * <DrawerContent side="right">
 *   <DrawerHeader>
 *     <DrawerTitle>Drawer Title</DrawerTitle>
 *   </DrawerHeader>
 *   <div>Drawer content goes here</div>
 * </DrawerContent>
 * ```
 */
export interface DrawerContentProps extends StyledComponentProps<DialogContentProps> {
  /**
   * The side of the screen from which the drawer slides in.
   * Can be "top", "right", "bottom", or "left".
   */
  side?: DrawerSide;
}

/**
 * Class names for different slots in the drawer component.
 * Allows customizing styles for the overlay, content, and other parts.
 */
export type DrawerClassNames = Partial<Record<DrawerSlots, ClassValue>>;

/**
 * Props for the main Drawer component.
 * A side panel modal that slides in from the edge of the screen.
 *
 * @example
 * ```tsx
 * <Drawer scrollable>
 *   <DrawerTrigger>Open Drawer</DrawerTrigger>
 *   <DrawerContent side="left">
 *     <DrawerHeader>
 *       <DrawerTitle>Navigation</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerBody>
 *       <nav>Navigation items here</nav>
 *     </DrawerBody>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export interface DrawerProps extends Omit<DialogProps<DrawerContentProps>, 'contentComponent'> {
  /**
   * Whether the drawer content should be scrollable.
   * When true, adds overflow-auto to the content wrapper.
   * @default true
   */
  scrollable?: boolean;
}

export type { DrawerSide };
