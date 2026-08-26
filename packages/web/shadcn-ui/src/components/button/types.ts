import type { ComponentProps } from 'react';
import type { PrimitiveProps, StyledComponentProps, ThemeColor, ThemeOrientation } from '../../types/shared';
import type { IconProps } from '../icon';
import type { ButtonShadow, ButtonShape, ButtonVariant } from './button-variants';

/**
 * Props for the Button component.
 * A versatile button element with support for variants, colors, loading states, and icons.
 *
 * @example
 * ```jsx
 * <Button
 *   variant="solid"
 *   color="primary"
 *   shape="rounded"
 *   leading={<PlusIcon />}
 *   trailing={<ChevronIcon />}
 *   loading={isLoading}
 * >
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps extends PrimitiveProps, StyledComponentProps<ComponentProps<'button'>> {
  /**
   * The color theme of the button (e.g., primary, secondary, destructive, success).
   */
  color?: ThemeColor;
  /**
   * If true, the button width will be constrained to fit its content.
   */
  fitContent?: boolean;
  /**
   * Content or icon displayed at the start of the button (before text).
   */
  leading?: React.ReactNode;
  /**
   * If true, displays a loading indicator and disables the button.
   */
  loading?: boolean;
  /**
   * Shadow variant for the button (e.g., none, sm, md, lg).
   */
  shadow?: ButtonShadow;
  /**
   * The shape variant of the button (e.g., square, rounded, pill).
   */
  shape?: ButtonShape;
  /**
   * Content or icon displayed at the end of the button (after text).
   */
  trailing?: React.ReactNode;
  /**
   * The visual style variant of the button (e.g., solid, outline, ghost).
   */
  variant?: ButtonVariant;
}

/**
 * Props for the ButtonGroup component.
 * Container for grouping multiple buttons together with consistent spacing.
 *
 * @example
 * ```jsx
 * <ButtonGroup orientation="horizontal">
 *   <Button>Previous</Button>
 *   <Button>Next</Button>
 * </ButtonGroup>
 * ```
 */
export interface ButtonGroupProps extends StyledComponentProps<React.HTMLAttributes<HTMLDivElement>> {
  /**
   * Direction of button group layout (horizontal or vertical).
   */
  orientation?: ThemeOrientation;
}

/**
 * Props for the ButtonIcon component.
 * A specialized button variant that displays primarily an icon with optional leading/trailing content.
 * Extends ButtonProps with icon-specific configuration.
 *
 * @example
 * ```jsx
 * <ButtonIcon
 *   icon="bell"
 *   iconProps={{ size: 'lg' }}
 *   variant="ghost"
 * />
 * ```
 */
export interface ButtonIconProps extends ButtonProps {
  /**
   * Icon identifier or icon element to display in the button.
   */
  icon?: IconProps['icon'];
  /**
   * Additional props to pass to the Icon component.
   */
  iconProps?: Omit<IconProps, 'icon'>;
}

export type { ButtonShadow, ButtonShape, ButtonVariant };
