import type { ReactNode } from 'react';
import type {
  SelectContentProps as _SelectContentProps,
  SelectItemProps as _SelectItemProps,
  SelectLabelProps as _SelectLabelProps,
  SelectProps as _SelectProps,
  SelectSeparatorProps as _SelectSeparatorProps,
  SelectTriggerProps as _SelectTriggerProps,
  SelectValueProps as _SelectValueProps
} from '@radix-ui/react-select';
import type { ClassValue, SlotProps, StyledComponentProps, ThemeSize } from '../../types/shared';
import type { SelectSlots } from './select-variants';

/**
 * Class names for different slots in the select component.
 * Allows customizing styles for content, items, scrolling buttons, and other parts.
 */
export type SelectClassNames = Partial<Record<SelectSlots, ClassValue>>;

/**
 * Props for the select content component.
 * The dropdown panel that displays the selectable options.
 */
export interface SelectContentProps extends StyledComponentProps<_SelectContentProps> {
  /**
   * Class names for customizing the content container and scroll buttons.
   */
  classNames?: Pick<SelectClassNames, 'content' | 'scrollDownButton' | 'scrollUpButton' | 'viewport'>;
  /**
   * Custom element to display as the scroll down button in the dropdown.
   * Shown when the content is scrollable downward.
   */
  scrollDownButton?: React.ReactNode;
  /**
   * Custom element to display as the scroll up button in the dropdown.
   * Shown when the content is scrollable upward.
   */
  scrollUpButton?: React.ReactNode;
}

/**
 * Props for the select option item component.
 * Represents a single selectable option in the dropdown menu.
 *
 * @example
 * ```tsx
 * <SelectItem value="option1" indicatorIcon={<CheckIcon />}>
 *   Option 1
 * </SelectItem>
 * ```
 */
export interface SelectItemProps extends StyledComponentProps<_SelectItemProps>, SlotProps {
  /**
   * Class names for customizing the item and its indicator.
   */
  classNames?: Pick<SelectClassNames, 'item' | 'itemIndicator' | 'itemText'>;
  /**
   * Custom icon to display when the item is selected.
   * Typically a checkmark or similar indicator.
   */
  indicatorIcon?: React.ReactNode;
}

/**
 * Props for the select label/group header component.
 * Used to group and label sets of related options.
 */
export interface SelectLabelProps extends StyledComponentProps<_SelectLabelProps> {}

/**
 * Props for the select separator component.
 * A visual divider between groups of options.
 */
export interface SelectSeparatorProps extends StyledComponentProps<_SelectSeparatorProps> {}

/**
 * Props for the select trigger component.
 * The button that opens the dropdown when clicked.
 *
 * @example
 * ```tsx
 * <SelectTrigger placeholder="Select an option" triggerIcon={<ChevronDownIcon />} />
 * ```
 */
export interface SelectTriggerProps
  extends StyledComponentProps<_SelectTriggerProps>,
  Pick<_SelectValueProps, 'placeholder'>,
  SlotProps {
  /**
   * Class names for customizing the trigger button, selected value display, and trigger icon.
   */
  classNames?: Pick<SelectClassNames, 'selectedValue' | 'trigger' | 'triggerIcon'>;
  /**
   * Custom icon to display in the trigger button, typically a chevron or dropdown arrow.
   */
  triggerIcon?: React.ReactNode;
}

/**
 * Data structure for a single select option item.
 * Represents an individual selectable choice in the dropdown.
 *
 * @example
 * ```tsx
 * {
 *   value: "apple",
 *   label: "Apple",
 *   disabled: false
 * }
 * ```
 */
export type SelectOptionItemData = Omit<SelectItemProps, 'children'> & {
  /**
   * Display label for the option.
   */
  label?: ReactNode;
  /**
   * Type identifier for this option data structure.
   */
  type?: 'item';
};

/**
 * Data structure for a separator option in the select dropdown.
 * Used to visually separate groups of options.
 */
export type SelectSeparatorOptionData = SelectSeparatorProps & {
  /**
   * Type identifier indicating this is a separator element.
   */
  type: 'separator';
};

/**
 * Data structure for a group of related select options.
 * Allows organizing options under a common label.
 *
 * @example
 * ```tsx
 * {
 *   label: "Fruits",
 *   type: "group",
 *   children: [
 *     { value: "apple", label: "Apple" },
 *     { value: "orange", label: "Orange" }
 *   ]
 * }
 * ```
 */
export type SelectGroupOptionData = Omit<SelectLabelProps, 'children'> & {
  /**
   * Array of option items contained in this group.
   */
  children: SelectOptionItemData[];
  /**
   * Display label for the group header.
   */
  label?: ReactNode;
  /**
   * Type identifier indicating this is a group element.
   */
  type?: 'group';
};

/**
 * Union type representing any type of select option data.
 * Can be an individual item, a group of items, or a separator.
 */
export type SelectOptionData = SelectOptionItemData | SelectGroupOptionData | SelectSeparatorOptionData;

/**
 * Props for rendering a single select option.
 * Used internally to render option items and groups.
 */
export interface SelectOptionProps extends Pick<SelectItemProps, 'indicatorIcon'> {
  /**
   * Class names for customizing option rendering.
   */
  classNames?: SelectClassNames;
  /**
   * The option data to render.
   */
  item: SelectOptionData;
  /**
   * Size variant for the option item.
   */
  size?: ThemeSize;
}

/**
 * Props for the main Select component.
 * A searchable dropdown for selecting one or multiple values from a list.
 *
 * @example
 * ```tsx
 * <Select
 *   items={[
 *     { value: "apple", label: "Apple" },
 *     { value: "orange", label: "Orange" },
 *     { type: "separator" },
 *     {
 *       label: "Vegetables",
 *       type: "group",
 *       children: [
 *         { value: "carrot", label: "Carrot" }
 *       ]
 *     }
 *   ]}
 *   triggerProps={{ placeholder: "Select a fruit..." }}
 * />
 * ```
 */
export interface SelectProps
  extends StyledComponentProps<Omit<_SelectProps, 'children'>>,
  Pick<SelectItemProps, 'indicatorIcon'> {
  /**
   * Class names for customizing different parts of the select component.
   */
  classNames?: SelectClassNames;
  /**
   * Props for customizing the content/dropdown panel.
   */
  contentProps?: Omit<SelectContentProps, 'children'>;
  /**
   * Array of options to display in the dropdown.
   * Can include individual items, groups, and separators.
   */
  items: SelectOptionData[];
  /**
   * Size variant for the select component (affects spacing and typography).
   */
  size?: ThemeSize;
  /**
   * Props for customizing the trigger button.
   */
  triggerProps?: SelectTriggerProps;
}
