import type { ClassValue, SlotProps, StyledComponentProps, ThemeColor } from '../../types/shared';
import type { AlertSlots, AlertVariant } from './alert-variants';

/**
 * Props for the alert description component.
 * Displays supplementary text or details below the alert title.
 */
export type AlertDescriptionProps = StyledComponentProps<React.ComponentProps<'div'>>;

/**
 * Props for the alert root/wrapper component.
 * Serves as the main container for the alert with color and variant styling.
 */
export interface AlertRootProps extends StyledComponentProps<React.ComponentProps<'div'>> {
  /**
   * The color theme of the alert (e.g., primary, secondary, destructive, etc.).
   */
  color?: ThemeColor;
  /**
   * The visual variant style of the alert (e.g., solid, outline, subtle).
   */
  variant?: AlertVariant;
}

/**
 * Props for the alert title component.
 * Displays the main heading or primary message of the alert.
 */
export type AlertTitleProps = StyledComponentProps<React.ComponentProps<'div'>>;

/**
 * Props for the alert wrapper component.
 * Contains the overall alert element structure.
 */
export type AlertWrapperProps = StyledComponentProps<React.ComponentProps<'div'>>;

/**
 * Props for the alert icon component.
 * Displays an icon or visual indicator for the alert type.
 */
export type AlertIconProps = StyledComponentProps<React.ComponentProps<'div'>> & {
  /**
   * The color theme of the icon (can differ from the alert color).
   */
  color?: ThemeColor;
};

/**
 * Props for the alert close button component.
 * Renders a button to dismiss or close the alert.
 */
export type AlertCloseProps = StyledComponentProps<React.ComponentProps<'button'>>;

/**
 * Class names for different slots in the alert component.
 * Allows customizing styles for specific parts of the alert.
 */
export type AlertClassNames = Partial<Record<AlertSlots, ClassValue>>;

/**
 * Props for the main Alert component.
 * Combines root styling props with optional icon, title, and description content.
 *
 * @example
 * ```jsx
 * <Alert
 *   color="info"
 *   variant="solid"
 *   icon={<InfoIcon />}
 *   title="Information"
 *   description="This is an informational alert message."
 * />
 * ```
 */
export interface AlertProps extends Omit<AlertRootProps, 'title'>, SlotProps {
  /**
   * Class names for customizing different parts of the alert.
   */
  classNames?: AlertClassNames;
  /**
   * Description text displayed below the title.
   */
  description?: React.ReactNode;
  /**
   * Props for the alert description component.
   */
  descriptionProps?: AlertDescriptionProps;
  /**
   * Icon or visual element displayed at the start of the alert.
   */
  icon?: React.ReactNode;
  /**
   * Title or heading text displayed in the alert.
   */
  title?: React.ReactNode;
  /**
   * Props for the alert title component.
   */
  titleProps?: AlertTitleProps;
  /**
   * Props for the alert wrapper component.
   */
  wrapperProps?: AlertWrapperProps;
}

export type { AlertVariant };
