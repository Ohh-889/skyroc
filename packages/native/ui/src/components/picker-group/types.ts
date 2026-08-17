import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';
import type { PickerFieldNames, PickerOption } from '../picker/types';

/** Configuration for a single picker within the group */
export interface PickerGroupItem {
  /** Column data: single (PickerOption[]), multiple (PickerOption[][]), or cascade (PickerOption[] with children) */
  columns: PickerOption[] | PickerOption[][];

  /** Default selected values for this picker */
  defaultValue?: string[];

  /** Custom field name mapping */
  fieldNames?: PickerFieldNames;

  /** Whether to trigger haptic feedback when scrolling */
  haptic?: boolean;

  /** Height of each item in pixels */
  itemHeight?: number;

  /** Unique key for this picker tab */
  key?: string;

  /** Whether to show a loading overlay */
  loading?: boolean;

  /** Tab label text */
  title: string;

  /** Number of visible items */
  visibleCount?: number;
}

/** Style slot names for PickerGroup */
export type PickerGroupSlots =
  | 'activeIndicator'
  | 'root'
  | 'tab'
  | 'tabBar'
  | 'tabText'
  | 'toolbar';

/** Props for the inline PickerGroupView component */
export interface PickerGroupViewProps {
  /** Currently active tab index (controlled) */
  activeTab?: number;

  /** Cancel button text */
  cancelText?: string;

  /** Class name for the root element */
  className?: string;

  /** Slot class name overrides */
  classNames?: SlotClassNames<PickerGroupSlots>;

  /** Confirm button text */
  confirmText?: string;

  /** Default active tab index (uncontrolled) */
  defaultActiveTab?: number;

  /** Default selected values for all pickers */
  defaultValues?: string[][];

  /** Button text for non-final tabs */
  nextStepText?: string;

  /** Called when any picker value changes */
  onChange?: (values: string[][], pickerIndex: number) => void;

  /** Called when cancel is pressed */
  onCancel?: (values: string[][]) => void;

  /** Called when confirm is pressed on the last tab */
  onConfirm?: (values: string[][]) => void;

  /** Called when the active tab changes */
  onTabChange?: (index: number) => void;

  /** Picker configurations */
  pickers: PickerGroupItem[];

  /** Whether to show the tab bar */
  showTabBar?: boolean;

  /** Whether to show the toolbar */
  showToolbar?: boolean;

  /** Selected values for all pickers (controlled) */
  values?: string[][];
}

/** Props for the popup PickerGroup component */
export interface PickerGroupProps extends PickerGroupViewProps {
  /** Trigger element: ReactNode or render function */
  children?: ReactNode | ((params: { open: () => void; values: string[][] }) => ReactNode);

  /** Called when the sheet visibility changes */
  onUpdateShow?: (show: boolean) => void;

  /** Whether the sheet is visible */
  show: boolean;
}
