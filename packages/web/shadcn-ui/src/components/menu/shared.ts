import type {
  MenuLabelOption,
  MenuOptionData,
  MenuRadioItemOptionProps,
  MenuSeparatorOption,
  MenuSubOption
} from './types';

export function isLabel(opt: MenuOptionData | MenuRadioItemOptionProps): opt is MenuLabelOption {
  return opt.type === 'label';
}
export function isSeparator(opt: MenuOptionData | MenuRadioItemOptionProps): opt is MenuSeparatorOption {
  return opt.type === 'separator';
}

export function isSub(opt: MenuOptionData | MenuRadioItemOptionProps): opt is MenuSubOption {
  return opt.type === 'sub' || 'children' in opt;
}
