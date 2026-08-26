import type { ContentProps, DialogProps } from 'vaul';
import type { ClassValue, HTMLComponentProps, StyledComponentProps, ThemeSize } from '../../types/shared';
import type {
  DialogCloseProps,
  DialogDescriptionProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogTitleProps
} from '../dialog';
import type { DialogSlots } from '../dialog/dialog-variants';
import type { BottomSheetSlots } from './bottom-sheet-variants';

/**
 * Class names for different slots in the bottom-sheet component.
 * Allows customizing styles for bottom-sheet-specific and dialog-shared parts.
 */
export type BottomSheetClassNames = Partial<Record<BottomSheetSlots | DialogSlots, ClassValue>>;

/**
 * Props for the bottom-sheet content component.
 * Wraps the main content area of the bottom-sheet with styling and slot customization.
 *
 * @example
 * ```tsx
 * <BottomSheet.Content
 *   contentProps={{
 *     classNames: {
 *       content: 'custom-content-class',
 *       knob: 'custom-knob-class'
 *     }
 *   }}
 * >
 *   Content here
 * </BottomSheet.Content>
 * ```
 */
export type BottomSheetContentProps = StyledComponentProps<ContentProps> & {
  /**
   * Class names for customizing specific parts of the bottom-sheet content area.
   * Includes content, contentBody, knob, and overlay styling slots.
   */
  classNames?: Pick<BottomSheetClassNames, 'content' | 'contentBody' | 'knob' | 'overlay'>;
};

/**
 * Props for the bottom-sheet content body component.
 * Standard div element props for the inner content wrapper.
 */
export type BottomSheetContentBodyProps = HTMLComponentProps<'div'>;

/**
 * Props for the bottom-sheet footer component.
 * Standard div element props for the footer section of the bottom-sheet.
 */
export type BottomSheetFooterProps = HTMLComponentProps<'div'>;

/**
 * Props for the bottom-sheet knob component.
 * The draggable indicator typically shown at the top of mobile bottom-sheet implementations.
 */
export type BottomSheetKnobProps = HTMLComponentProps<'div'>;

/**
 * Props for the bottom-sheet overlay component.
 * The backdrop that appears behind the bottom-sheet when it's open.
 */
export type BottomSheetOverlayProps = Omit<DialogOverlayProps, 'component'>;

/**
 * Props for the bottom-sheet header component.
 * Container for the bottom-sheet's header content, typically including title and close button.
 */
export type BottomSheetHeaderProps = DialogHeaderProps;

/**
 * Props for the bottom-sheet description component.
 * Accessible description text for the bottom-sheet content.
 */
export type BottomSheetDescriptionProps = Omit<DialogDescriptionProps, 'component'>;

/**
 * Props for the bottom-sheet title component.
 * The main heading/title displayed in the bottom-sheet header.
 */
export type BottomSheetTitleProps = Omit<DialogTitleProps, 'component'>;

/**
 * Props for the bottom-sheet close button component.
 * Button trigger to dismiss and close the bottom-sheet.
 */
export type BottomSheetCloseProps = Omit<DialogCloseProps, 'component'>;

/**
 * Props for the main BottomSheet component.
 * A slide-out panel component with header, content, footer, and overlay.
 *
 * @example
 * ```tsx
 * <BottomSheet
 *   trigger={<button>Open BottomSheet</button>}
 *   title="Settings"
 *   description="Manage your preferences"
 *   footer={<button>Save</button>}
 *   showClose
 * >
 *   BottomSheet content goes here
 * </BottomSheet>
 * ```
 */
export type BottomSheetProps = DialogProps & {
  /**
   * Class names for customizing different parts of the bottom-sheet component.
   */
  classNames?: BottomSheetClassNames;
  /**
   * Props for the bottom-sheet close button component.
   */
  closeProps?: BottomSheetCloseProps;
  /**
   * Props to customize the content area of the bottom-sheet.
   */
  contentProps?: BottomSheetContentProps;
  /**
   * Accessible description text for the bottom-sheet.
   * Useful for screen readers and accessibility.
   */
  description?: React.ReactNode;
  /**
   * Props for the bottom-sheet description component.
   */
  descriptionProps?: BottomSheetDescriptionProps;
  /**
   * Content to display in the bottom-sheet footer section.
   * Typically used for action buttons like Save/Cancel.
   */
  footer?: React.ReactNode;
  /**
   * Props for the bottom-sheet footer component.
   */
  footerProps?: BottomSheetFooterProps;
  /**
   * Props for the bottom-sheet header component.
   */
  headerProps?: BottomSheetHeaderProps;
  /**
   * Whether to show the close button in the bottom-sheet header.
   * Defaults to false.
   */
  showClose?: boolean;
  /**
   * Size variant for the bottom-sheet (sm, md, lg, etc).
   * Controls the width/dimensions of the bottom-sheet panel.
   */
  size?: ThemeSize;
  /**
   * Title text displayed in the bottom-sheet header.
   */
  title?: React.ReactNode;
  /**
   * Props for the bottom-sheet title component.
   */
  titleProps?: BottomSheetTitleProps;
  /**
   * Element that triggers the opening of the bottom-sheet.
   * Usually a button or interactive element.
   */
  trigger?: React.ReactNode;
};
