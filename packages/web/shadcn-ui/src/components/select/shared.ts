import type { SelectGroupOptionData, SelectOptionItemData, SelectSeparatorOptionData } from './types';

export function isGroup(
  opt: SelectOptionItemData | SelectSeparatorOptionData | SelectGroupOptionData
): opt is SelectGroupOptionData {
  return opt.type === 'group' || 'children' in opt;
}
export function isSeparator(
  opt: SelectOptionItemData | SelectSeparatorOptionData | SelectGroupOptionData
): opt is SelectSeparatorOptionData {
  return opt.type === 'separator';
}
