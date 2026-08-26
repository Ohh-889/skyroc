import type {
  AlertDialogContentProps as _AlertDialogContentProps,
  AlertDialogDescriptionProps as _AlertDialogDescriptionProps,
  AlertDialogOverlayProps as _AlertDialogOverlayProps,
  AlertDialogPortalProps as _AlertDialogPortalProps,
  AlertDialogProps as _AlertDialogProps,
  AlertDialogTitleProps as _AlertDialogTitleProps
} from '@radix-ui/react-alert-dialog';
import type { ClassValue, HTMLComponentProps, StyledComponentProps, ThemeColor } from '../../types/shared';
import type { ButtonProps } from '../button';
import type { DialogSlots } from './alert-dialog-variants';

/**
 * Class names for different slots in the alert dialog component.
 * Allows customizing styles for specific parts of the alert dialog, including the icon slot.
 */
export type AlertDialogClassNames = Partial<Record<DialogSlots, ClassValue>> & {
  /**
   * Class names for the icon element within the alert dialog.
   */
  icon?: string;
};

/**
 * Alert type enumeration that restricts theme colors to alert-specific types.
 * Supports destructive, info, success, and warning alert types.
 */
export type AlertType = Extract<ThemeColor, 'destructive' | 'info' | 'success' | 'warning'>;

/**
 * Props for the alert dialog content component.
 * Contains the main content area of the alert dialog.
 */
export interface AlertDialogContentProps extends StyledComponentProps<_AlertDialogContentProps> {}

/**
 * Props for the alert dialog description component.
 * Provides descriptive text or additional information in the alert dialog.
 */
export interface AlertDialogDescriptionProps extends StyledComponentProps<_AlertDialogDescriptionProps> {}

/**
 * Props for the alert dialog footer component.
 * Container for action buttons or additional footer content.
 */
export type AlertDialogFooterProps = HTMLComponentProps<'div'>;

/**
 * Props for the alert dialog header component.
 * Container for title, icon, and other header content.
 */
export type AlertDialogHeaderProps = HTMLComponentProps<'div'>;

/**
 * Props for the alert dialog overlay component.
 * Semi-transparent backdrop that appears behind the alert dialog.
 */
export interface AlertDialogOverlayProps extends StyledComponentProps<_AlertDialogOverlayProps> {}

/**
 * Props for the alert dialog title component.
 * Displays the primary heading text of the alert dialog.
 */
export interface AlertDialogTitleProps extends StyledComponentProps<_AlertDialogTitleProps> {}

/**
 * Props for the main AlertDialog component.
 * Combines base Radix UI alert dialog props with custom styling and content options.
 *
 * @example
 * ```jsx
 * <AlertDialog
 *   type="destructive"
 *   title="Confirm Deletion"
 *   description="This action cannot be undone."
 *   icon={<TrashIcon />}
 * >
 *   <Button>Delete</Button>
 * </AlertDialog>
 * ```
 */
export type AlertDialogProps = StyledComponentProps<_AlertDialogProps>
  & AlertDialogContentProps
  & _AlertDialogPortalProps & {
    /**
     * Props for the cancel button.
     */
    cancelButtonProps?: ButtonProps;
    /**
     * Text of the cancel button. Default is "Cancel".
     */
    cancelText?: React.ReactNode;
    /**
     * Class names for customizing different parts of the alert dialog.
     */
    classNames?: AlertDialogClassNames;
    /**
     * Props for the alert dialog content component.
     */
    contentProps?: AlertDialogContentProps;
    /**
     * Description text displayed in the alert dialog.
     */
    description: string;
    /**
     * Props for the alert dialog description component.
     */
    descriptionProps?: AlertDialogDescriptionProps;
    /**
     * Whether to disable portal rendering for the alert dialog.
     */
    disabledPortal?: boolean;
    /**
     * Content to display in the footer section (typically action buttons).
     * Set to `null` to hide the default footer buttons.
     * Set to a React node to render custom footer content.
     */
    footer?: React.ReactNode | null | false;
    /**
     * Props for the alert dialog footer component.
     */
    footerProps?: AlertDialogFooterProps;
    /**
     * Force mount the overlay element even when not visible.
     */
    forceMountOverlay?: true;
    /**
     * Force mount the portal element for the alert dialog.
     */
    forceMountPortal?: true;
    /**
     * Props for the alert dialog header component.
     */
    headerProps?: AlertDialogHeaderProps;
    /**
     * Icon or visual element displayed at the top of the alert dialog.
     */
    icon?: React.ReactNode;
    /**
     * Props for the OK button.
     */
    okButtonProps?: ButtonProps;
    /**
     * Text of the OK button. Default is "OK".
     */
    okText?: React.ReactNode;
    /**
     * Callback when cancel button is clicked.
     */
    onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /**
     * Callback when OK button is clicked.
     */
    onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /**
     * Props for the alert dialog overlay component.
     */
    overlayProps?: AlertDialogOverlayProps;
    /**
     * Whether to show the cancel button. Default is true.
     */
    showCancel?: boolean;
    /**
     * Title or heading text displayed at the top of the alert dialog.
     */
    title?: React.ReactNode;
    /**
     * Props for the alert dialog title component.
     */
    titleProps?: AlertDialogTitleProps;
    /**
     * Element that triggers the alert dialog to open when clicked.
     */
    trigger?: React.ReactNode;
    /**
     * The alert type which determines styling (destructive, info, success, or warning).
     */
    type?: AlertType;
  };
