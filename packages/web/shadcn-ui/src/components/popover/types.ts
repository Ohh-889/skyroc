import type {
  PopoverAnchorProps as _PopoverAnchorProps,
  PopoverArrowProps as _PopoverArrowProps,
  PopoverContentProps as _PopoverContentProps,
  PopoverPortalProps,
  PopoverProps as _PopoverProps
} from '@radix-ui/react-popover';
import type { ClassValue, StyledComponentProps } from '../../types/shared';
import type { PopoverSlots } from './popover-varianst';

/**
 * Class names for different slots in the popover component.
 * Allows customizing styles for specific parts of the popover.
 */
export type PopoverClassNames = Partial<Record<PopoverSlots, ClassValue>>;

/**
 * Props for the PopoverArrow component.
 * Renders a decorative arrow pointing to the popover trigger.
 *
 * @example
 * <PopoverArrow />
 */
export type PopoverArrowProps = StyledComponentProps<_PopoverArrowProps>;

/**
 * Props for the PopoverContent component.
 * Container for the popover body content.
 *
 * @example
 * <PopoverContent>
 *   <p>Popover content goes here</p>
 * </PopoverContent>
 */
export type PopoverContentProps = StyledComponentProps<_PopoverContentProps>;

/**
 * Props for the main Popover component.
 * A component that displays content in a floating panel relative to a trigger element.
 * Combines trigger and content functionality with optional arrow and close button.
 *
 * @example
 * // Basic popover
 * <Popover trigger={<button>Click me</button>} showArrow>
 *   <p>This is the popover content</p>
 * </Popover>
 *
 * @example
 * // Popover with close button
 * <Popover
 *   trigger={<button>Options</button>}
 *   closeIcon={<XIcon />}
 *   side="bottom"
 *   sideOffset={10}
 * >
 *   <div className="p-4">Settings</div>
 * </Popover>
 *
 * @example
 * // Customized arrow size
 * <Popover
 *   trigger={<button>Help</button>}
 *   showArrow
 *   arrowWidth={20}
 *   arrowHeight={10}
 * >
 *   <p>Help content</p>
 * </Popover>
 */
export type PopoverProps = _PopoverProps
  & Pick<PopoverPortalProps, 'container' | 'forceMount'>
  & Omit<PopoverContentProps, 'forceMount'> & {
    /** Props for the popover anchor component */
    anchorProps?: PopoverAnchorProps;
    /** Height of the arrow element in pixels */
    arrowHeight?: number;
    /** Props for the popover arrow component */
    arrowProps?: PopoverArrowProps;
    /** Width of the arrow element in pixels */
    arrowWidth?: number;
    /** Class names for customizing different parts of the popover */
    classNames?: PopoverClassNames;
    /** Icon or element to display as the close button */
    closeIcon?: React.ReactNode;
    /** Props for the popover content component */
    contentProps?: PopoverContentProps;
    /** Whether to disable the portal container */
    disabledPortal?: boolean;
    /** Force mount the popover portal */
    forceMountPortal?: true;
    /** Whether to display an arrow pointing to the trigger */
    showArrow?: boolean;
    /** Content to display in the popover trigger button */
    trigger?: React.ReactNode;
  };

/**
 * Props for the PopoverAnchor component.
 * An alternative trigger element that anchors the popover without opening it.
 * Useful when you want the popover to appear relative to a specific element.
 *
 * @example
 * <Popover>
 *   <PopoverAnchor asChild>
 *     <div ref={anchorRef} />
 *   </PopoverAnchor>
 *   <PopoverContent>Content</PopoverContent>
 * </Popover>
 */
export type PopoverAnchorProps = StyledComponentProps<_PopoverAnchorProps>;
