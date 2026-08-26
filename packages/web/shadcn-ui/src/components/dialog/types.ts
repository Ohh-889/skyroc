import type { ComponentPropsWithoutRef, ComponentType } from 'react';
import type {
  DialogCloseProps as _DialogCloseProps,
  DialogContentProps as _DialogContentProps,
  DialogDescriptionProps as _DialogDescriptionProps,
  DialogOverlayProps as _DialogOverlayProps,
  DialogPortalProps,
  DialogProps as _DialogProps,
  DialogTitleProps as _DialogTitleProps
} from '@radix-ui/react-dialog';
import type { ClassValue, StyledComponentProps } from '../../types/shared';
import type { ButtonProps } from '../button';
import type { DialogSlots } from './dialog-variants';

/**
 * Class names for different slots in the dialog component.
 * Allows customizing styles for specific parts of the dialog.
 */
export type DialogClassNames = Partial<Record<DialogSlots, ClassValue>>;

/**
 * Props for the dialog close button component.
 * Allows customizing the close button appearance and behavior.
 *
 * @example
 * ```tsx
 * <DialogClose className="absolute top-4 right-4">X</DialogClose>
 * ```
 */
export interface DialogCloseProps extends StyledComponentProps<_DialogCloseProps> {
  /**
   * Custom component to use instead of the default close button.
   * Useful for using a custom icon or button component.
   */
  component?: ComponentType<_DialogCloseProps>;
}

/**
 * Props for the dialog content component.
 * The main container that holds the dialog's content.
 */
export interface DialogContentProps extends StyledComponentProps<_DialogContentProps> {
  /**
   * Custom component to use instead of the default content wrapper.
   * Allows complete customization of the content container.
   */
  component?: ComponentType<_DialogContentProps>;
}

/**
 * Props for the dialog description component.
 * Accessible description text for screen readers.
 */
export interface DialogDescriptionProps extends StyledComponentProps<_DialogDescriptionProps> {
  /**
   * Custom component to use instead of the default description element.
   * Useful for rendering description with custom styling or structure.
   */
  component?: ComponentType<_DialogDescriptionProps>;
}

/**
 * Props for the dialog footer component.
 * Container for action buttons (OK, Cancel, etc).
 *
 * @example
 * ```tsx
 * <DialogFooter>
 *   <Button onClick={onCancel}>Cancel</Button>
 *   <Button onClick={onConfirm}>Confirm</Button>
 * </DialogFooter>
 * ```
 */
export interface DialogFooterProps extends StyledComponentProps<ComponentPropsWithoutRef<'footer'>> {}

/**
 * Props for the dialog header component.
 * Container for the dialog title and optional close button.
 *
 * @example
 * ```tsx
 * <DialogHeader>
 *   <DialogTitle>Delete Item</DialogTitle>
 *   <DialogClose />
 * </DialogHeader>
 * ```
 */
export interface DialogHeaderProps extends StyledComponentProps<ComponentPropsWithoutRef<'header'>> {}

/**
 * Props for the dialog overlay component.
 * The background overlay that appears behind the dialog.
 */
export interface DialogOverlayProps extends StyledComponentProps<_DialogOverlayProps> {
  /**
   * Custom component to use instead of the default overlay element.
   * Allows complete customization of the overlay appearance.
   */
  component?: ComponentType<_DialogOverlayProps>;
}

/**
 * Props for the dialog title component.
 * The heading text displayed at the top of the dialog.
 */
export interface DialogTitleProps extends StyledComponentProps<_DialogTitleProps> {
  /**
   * Custom component to use instead of the default title element.
   * Useful for using custom heading levels or styled components.
   */
  component?: ComponentType<_DialogTitleProps>;
}

/**
 * Props for the main Dialog component.
 * A modal dialog with header, content, and footer sections.
 *
 * @template T - Type of content props, defaults to DialogContentProps
 *
 * @example
 * ```tsx
 * <Dialog
 *   trigger={<Button>Open Dialog</Button>}
 *   title="Confirm Action"
 *   description="Are you sure you want to delete?"
 *   okText="Confirm"
 *   onOk={() => console.log('confirmed')}
 * >
 *   <p>This action cannot be undone.</p>
 * </Dialog>
 * ```
 */
export interface DialogProps<T extends DialogContentProps = DialogContentProps> extends StyledComponentProps<_DialogProps> {
  /**
   * Custom class names for different dialog UI slots.
   */
  classNames?: DialogClassNames;

  /**
   * Props for the dialog close button component.
   */
  closeProps?: DialogCloseProps;

  /**
   * Custom component to render the dialog content.
   * Allows replacing the default content wrapper with a custom implementation.
   */
  contentComponent?: ComponentType<T>;

  /**
   * Props to pass to the content component.
   */
  contentProps?: T;

  /**
   * Description text displayed in the dialog.
   * Provides context or additional information about the dialog action.
   */
  description?: React.ReactNode;

  /**
   * Props for the dialog description component.
   */
  descriptionProps?: DialogDescriptionProps;

  /**
   * Footer content, typically containing action buttons.
   * Appears at the bottom of the dialog.
   * Set to `null` to hide the default footer.
   */
  footer?: React.ReactNode | null | false;

  /**
   * Props for the dialog footer component.
   */
  footerProps?: DialogFooterProps;

  /**
   * Props for the dialog header component.
   */
  headerProps?: DialogHeaderProps;

  /**
   * Props for the OK button.
   */
  okButtonProps?: ButtonProps;

  /**
   * Text of the OK button. Default is "OK".
   */
  okText?: React.ReactNode;
  /**
   * Callback when OK button is clicked.
   */
  onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Props for the dialog overlay component.
   */
  overlayProps?: DialogOverlayProps;
  /**
   * Title text displayed at the top of the dialog.
   * Should clearly indicate the purpose of the dialog.
   */
  title?: React.ReactNode;
  /**
   * Props for the dialog title component.
   */
  titleProps?: DialogTitleProps;
  /**
   * Element that triggers the dialog to open.
   * Typically a button, but can be any interactive element.
   */
  trigger?: React.ReactNode;
}

export type { DialogPortalProps };
