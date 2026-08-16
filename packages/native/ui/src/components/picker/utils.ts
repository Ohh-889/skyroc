import type { PickerColumnType, PickerFieldNames, PickerOption } from './types';

/** Merge user-provided field names with defaults */
function assignDefaultFieldNames(fieldNames?: PickerFieldNames): Required<PickerFieldNames> {
  return {
    children: fieldNames?.children ?? 'children',
    label: fieldNames?.label ?? 'label',
    value: fieldNames?.value ?? 'value'
  };
}

/** Detect column data type from the provided columns */
function getColumnsType(
  columns: PickerOption[] | PickerOption[][],
  fieldNames: Required<PickerFieldNames>
): PickerColumnType {
  if (Array.isArray(columns[0])) {
    return 'multiple';
  }

  // Flat array — check if any option has children → cascade
  const flatColumns = columns as PickerOption[];
  const hasChildren = flatColumns.some(option => {
    const children = option[fieldNames.children];
    return Array.isArray(children) && children.length > 0;
  });

  return hasChildren ? 'cascade' : 'single';
}

/** Expand cascade tree into a 2D column array based on current selected values */
function formatCascadeColumns(
  columns: PickerOption[],
  fieldNames: Required<PickerFieldNames>,
  selectedValues: string[]
): PickerOption[][] {
  const result: PickerOption[][] = [columns];

  let currentOptions = columns;

  for (let i = 0; i < selectedValues.length; i += 1) {
    const selectedValue = selectedValues[i];
    const selectedOption = findOptionByValue(currentOptions, selectedValue, fieldNames);

    if (!selectedOption) break;

    const children = selectedOption[fieldNames.children] as PickerOption[] | undefined;

    if (!Array.isArray(children) || children.length === 0) break;

    result.push(children);
    currentOptions = children;
  }

  return result;
}

/** Normalize any column format into a uniform 2D array */
function normalizeColumns(
  columns: PickerOption[] | PickerOption[][],
  fieldNames: Required<PickerFieldNames>,
  selectedValues: string[]
): PickerOption[][] {
  const type = getColumnsType(columns, fieldNames);

  switch (type) {
    case 'multiple': {
      return columns as PickerOption[][];
    }
    case 'cascade': {
      return formatCascadeColumns(columns as PickerOption[], fieldNames, selectedValues);
    }
    case 'single':
    default: {
      return [columns as PickerOption[]];
    }
  }
}

/** Find an option by its value in a flat option array */
function findOptionByValue(
  options: PickerOption[],
  value: string,
  fieldNames: Required<PickerFieldNames>
): PickerOption | undefined {
  return options.find(option => option[fieldNames.value] === value);
}

/** Get the first non-disabled option from a list */
function getFirstEnabledOption(options: PickerOption[]): PickerOption | undefined {
  return options.find(option => !option.disabled) ?? options[0];
}

/** Ensure selected values are valid; fall back to first enabled option when invalid */
function ensureSelectedValues(
  normalizedColumns: PickerOption[][],
  values: string[],
  fieldNames: Required<PickerFieldNames>
): string[] {
  return normalizedColumns.map((columnOptions, index) => {
    const currentValue = values[index];

    if (currentValue !== undefined) {
      const found = findOptionByValue(columnOptions, currentValue, fieldNames);

      if (found && !found.disabled) {
        return currentValue;
      }
    }

    // Fall back to first enabled option
    const fallback = getFirstEnabledOption(columnOptions);
    return fallback ? (fallback[fieldNames.value] as string) : '';
  });
}

export {
  assignDefaultFieldNames,
  ensureSelectedValues,
  findOptionByValue,
  formatCascadeColumns,
  getColumnsType,
  getFirstEnabledOption,
  normalizeColumns
};
