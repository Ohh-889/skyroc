import type { ReactNode } from 'react';
import type {
  RadioGroupIndicatorProps as _RadioGroupIndicatorProps,
  RadioGroupItemProps as _RadioGroupItemProps,
  RadioGroupProps as _RadioGroupProps
} from '@radix-ui/react-radio-group';
import type { ClassValue, HTMLComponentProps, StyledComponentProps, ThemeColor, ThemeSize } from '../../types/shared';
import type { RadioSlots, radioVariants } from './radio-variants';

type RadioVariant = NonNullable<Parameters<typeof radioVariants>[0]>['variant'];
type RadioOrientation = NonNullable<Parameters<typeof radioVariants>[0]>['orientation'];

/**
 * Position of the radio control relative to the content.
 */
export type RadioPosition = 'left' | 'right';

/**
 * Class names for different slots in the radio component.
 * Allows customizing styles for specific parts of the radio button and group.
 */
export type RadioClassNames = Partial<Record<RadioSlots, ClassValue>>;

/**
 * Props for the individual radio button component.
 * Extends the base radio group item with additional styling and label support.
 *
 * @example
 * ```tsx
 * <Radio value="option1" label="Option 1" />
 * ```
 */
export interface RadioProps extends RadioGroupItemProps {
  /**
   * Class names for customizing specific parts of the radio button
   * (control, indicator, label, and root container).
   */
  classNames?: Pick<RadioClassNames, 'control' | 'indicator' | 'label' | 'root'>;
  /**
   * Props for the radio indicator component.
   */
  indicatorProps?: RadioIndicatorProps;
  /**
   * Props for the radio group item component.
   */
  itemProps?: RadioGroupItemProps;
  /**
   * Label text or element displayed next to the radio button.
   */
  label?: ReactNode;
  /**
   * Props for the radio root component.
   */
  rootProps?: RadioRootProps;
  /**
   * Variant style for the radio.
   * @default 'dot'
   */
  variant?: RadioVariant;
}

/**
 * Props for the radio group component containing multiple radio options.
 * Manages the group selection state and renders multiple radio items.
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   items={[
 *     { value: "option1", label: "Option 1" },
 *     { value: "option2", label: "Option 2" }
 *   ]}
 *   defaultValue="option1"
 * />
 * ```
 */
export interface RadioGroupProps extends StyledComponentProps<_RadioGroupProps> {
  /**
   * Class names for customizing different parts of the radio group and its items.
   */
  classNames?: RadioClassNames;
  /**
   * Theme color applied to all radio buttons in the group.
   * Affects the radio control and indicator colors.
   */
  color?: ThemeColor;
  /**
   * Array of radio items to render in the group.
   * Each item configuration is passed to individual Radio components.
   */
  items: Omit<RadioProps, 'classNames' | 'color' | 'size' | 'variant'>[];
  /**
   * Variant style for the radio.
   * @default 'dot'
   */
  variant?: RadioVariant;
}

/**
 * Props for the radio group item component.
 * Represents a single selectable radio button within a group.
 */
export interface RadioGroupItemProps extends StyledComponentProps<_RadioGroupItemProps> {
  /**
   * Theme color for this specific radio item.
   * Overrides the group-level color if specified.
   */
  color?: ThemeColor;
  /**
   * Variant style for the radio.
   * @default 'dot'
   */
  variant?: RadioVariant;
}

/**
 * Props for the radio indicator component.
 * The visual indicator element shown inside the radio control when selected.
 */
export interface RadioIndicatorProps extends StyledComponentProps<_RadioGroupIndicatorProps> {
  /**
   * Theme color for the radio indicator element.
   * Determines the fill color of the indicator dot.
   */
  color?: ThemeColor;
  /**
   * Variant style for the radio.
   * @default 'dot'
   */
  variant?: RadioVariant;
}

/**
 * Props for the radio root container component.
 * Provides a styled div wrapper for radio buttons with custom HTML attributes.
 */
export interface RadioRootProps extends HTMLComponentProps<'div'> {}

/**
 * Item configuration for RadioCardGroup.
 * Extends RadioProps with icon and description for card display.
 */
export interface RadioCardGroupItem extends Omit<RadioProps, 'classNames' | 'color' | 'size' | 'variant'> {
  /**
   * Description text displayed below the label.
   */
  description?: ReactNode;
  /**
   * Icon to display on the card.
   */
  icon?: ReactNode;
}

/**
 * Props for the RadioCard component.
 * A card-styled radio button with icon, label and description support.
 *
 * @example
 * ```tsx
 * <RadioCard
 *   icon={<AppleIcon />}
 *   label="Apple"
 *   description="This is an apple"
 *   value="apple"
 *   radioPosition="right"
 * />
 * ```
 */
export interface RadioCardProps extends RadioGroupItemProps {
  /**
   * Whether the radio is checked (controlled).
   */
  checked?: boolean;
  /**
   * Custom class names for different radio card UI slots.
   */
  classNames?: RadioClassNames;
  /**
   * Description text displayed below the label.
   */
  description?: ReactNode;
  /**
   * Icon name or ReactNode to display on the card.
   */
  icon?: ReactNode;
  /**
   * Label text or element displayed on the card.
   */
  label?: ReactNode;
  /**
   * Position of the radio relative to the content.
   * @default 'right'
   */
  radioPosition?: RadioPosition;
}

/**
 * Props for the RadioCardGroup component.
 * A card-styled variant of RadioGroup with richer content display.
 *
 * @example
 * ```tsx
 * <RadioCardGroup
 *   items={[
 *     { value: "apple", label: "Apple", icon: <AppleIcon />, description: "This is an apple" },
 *     { value: "orange", label: "Orange", icon: <OrangeIcon />, description: "This is an orange" }
 *   ]}
 *   radioPosition="right"
 * />
 * ```
 */
export interface RadioCardGroupProps extends Omit<StyledComponentProps<_RadioGroupProps>, 'children'> {
  /**
   * Class names for customizing different parts of the radio card group.
   */
  classNames?: RadioClassNames;
  /**
   * Theme color applied to all radio cards in the group.
   */
  color?: ThemeColor;
  /**
   * Array of card items to render, with icon and description support.
   */
  items: RadioCardGroupItem[];
  /**
   * Layout orientation of the radio card group.
   * @default 'horizontal'
   */
  orientation?: RadioOrientation;
  /**
   * Position of the radio relative to the content.
   * @default 'right'
   */
  radioPosition?: RadioPosition;
  /**
   * Component size variant.
   */
  size?: ThemeSize;
  /**
   * Variant style for the radio.
   * @default 'dot'
   */
  variant?: RadioVariant;
}
