import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';

/** Single picker option */
export interface PickerOption {
  /** Allow dynamic field name access via fieldNames mapping */
  [key: string]: unknown;

  /** Child options for cascade mode */
  children?: PickerOption[];

  /** Whether this option is disabled */
  disabled?: boolean;

  /** Display text */
  label: string;

  /** Option value identifier */
  value: string;
}

/** Custom field name mapping for option objects */
export interface PickerFieldNames {
  /** Key for child options, defaults to 'children' */
  children?: string;

  /** Key for display text, defaults to 'label' */
  label?: string;

  /** Key for value identifier, defaults to 'value' */
  value?: string;
}

/** Column data type indicator */
export type PickerColumnType = 'cascade' | 'multiple' | 'single';

/** Internal props for PickerColumn (not exported from package) */
export interface PickerColumnProps {
  /** Column index in the picker */
  columnIndex: number;

  /** Field name mapping */
  fieldNames: Required<PickerFieldNames>;

  /** Height of each item in pixels */
  itemHeight: number;

  /** Whether to trigger haptic feedback when scrolling between items */
  haptic?: boolean;

  /** Called when the selected value changes */
  onChange: (value: string, columnIndex: number) => void;

  /** Options for this column */
  options: PickerOption[];

  /** Currently selected value */
  value: string;

  /** Number of visible items */
  visibleCount: number;
}

/** Internal props for PickerToolbar (not exported from package) */
export interface PickerToolbarProps {
  /** Cancel button text */
  cancelText: string;

  /** Slot class name overrides */
  classNames?: SlotClassNames<PickerSlots>;

  /** Confirm button text */
  confirmText: string;

  /** Called when cancel is pressed */
  onCancel: () => void;

  /** Called when confirm is pressed */
  onConfirm: () => void;

  /** Toolbar title */
  title?: string;
}

export type PickerSlots =
  | 'cancel'
  | 'cancelText'
  | 'column'
  | 'columns'
  | 'confirm'
  | 'confirmText'
  | 'item'
  | 'itemText'
  | 'loading'
  | 'root'
  | 'selectedIndicator'
  | 'title'
  | 'toolbar';

/** Props for the inline PickerView component */
export interface PickerViewProps {
  /** Cancel button text */
  cancelText?: string;

  /** Class name for the root element */
  className?: string;

  /** Slot class name overrides */
  classNames?: SlotClassNames<PickerSlots>;

  /** Column data: single (PickerOption[]), multiple (PickerOption[][]), or cascade (PickerOption[] with children) */
  columns: PickerOption[] | PickerOption[][];

  /** Confirm button text */
  confirmText?: string;

  /** Default selected values (uncontrolled mode) */
  defaultValue?: string[];

  /** Custom field name mapping */
  fieldNames?: PickerFieldNames;

  /** Height of each item in pixels */
  itemHeight?: number;

  /** Whether to show a loading overlay */
  loading?: boolean;

  /** Whether to trigger haptic feedback when scrolling between items */
  haptic?: boolean;

  /** Called when any column value changes */
  onChange?: (values: string[]) => void;

  /** Called when cancel button is pressed */
  onCancel?: (values: string[]) => void;

  /** Called when confirm button is pressed */
  onConfirm?: (values: string[]) => void;

  /** Whether to show the toolbar */
  showToolbar?: boolean;

  /** Toolbar title */
  title?: string;

  /** Selected values (controlled mode) */
  value?: string[];

  /** Number of visible items in each column */
  visibleCount?: number;
}

/** Props for the popup Picker component */
export interface PickerProps extends PickerViewProps {
  /** Trigger element: ReactNode or render function */
  children?: ReactNode | ((params: { open: () => void; value: string[] }) => ReactNode);

  /** Whether tapping the backdrop closes the sheet, defaults to true */
  closeOnBackdropPress?: boolean;

  /** Whether swiping down closes the sheet, defaults to true */
  enablePanDownToClose?: boolean;

  /** Called when the sheet visibility changes */
  onUpdateShow?: (show: boolean) => void;

  /** Whether the sheet is visible */
  show: boolean;
}
