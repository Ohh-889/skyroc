import type { PickerColumnType, PickerFieldNames, PickerOption } from './types';

/**
 * 级联展开的最大轮数。
 *
 * 每轮至少多展开一列，正常数据下轮数等于树的深度；这个上限只是防止 children 自引用时死循环。
 */
const MAX_CASCADE_DEPTH = 20;

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

/** Find an option by its value in a flat option array */
function findOptionByValue(
  options: PickerOption[],
  value: string,
  fieldNames: Required<PickerFieldNames>
): PickerOption | undefined {
  return options.find(option => option[fieldNames.value] === value);
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
    return (fallback?.[fieldNames.value] as string | undefined) ?? '';
  });
}

/**
 * 归一化列数据并同时修正选中值。
 *
 * 级联模式下这两件事互相依赖：列展开到第几级取决于选中值，而选中值合不合法又取决于列。 单向算一遍会在初始 value 为空时只展开出第一列（三级联动首屏只显示一列，滚一下才冒出第二列），
 * 所以这里迭代到不动点——每轮拿上一轮补齐的值重新展开，直到列数不再增长。
 *
 * 单列 / 多列模式下 normalizeColumns 与选中值无关，第一轮就会收敛，不会有额外开销。
 */
function resolveColumns(
  columns: PickerOption[] | PickerOption[][],
  fieldNames: Required<PickerFieldNames>,
  values: string[]
): { columns: PickerOption[][]; values: string[] } {
  let resolvedColumns = normalizeColumns(columns, fieldNames, values);
  let resolvedValues = ensureSelectedValues(resolvedColumns, values, fieldNames);

  for (let depth = 0; depth < MAX_CASCADE_DEPTH; depth += 1) {
    const nextColumns = normalizeColumns(columns, fieldNames, resolvedValues);

    if (nextColumns.length === resolvedColumns.length) break;

    resolvedColumns = nextColumns;
    resolvedValues = ensureSelectedValues(nextColumns, resolvedValues, fieldNames);
  }

  return { columns: resolvedColumns, values: resolvedValues };
}

export {
  assignDefaultFieldNames,
  ensureSelectedValues,
  findOptionByValue,
  formatCascadeColumns,
  getColumnsType,
  getFirstEnabledOption,
  normalizeColumns,
  resolveColumns
};
