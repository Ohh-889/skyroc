import type { CommandGroupOptionProps, CommandOptionData, CommandSeparatorOptionProps } from './types';

export function isGroup(opt: CommandOptionData): opt is CommandGroupOptionProps {
  return opt.type === 'group' || 'children' in opt;
}
export function isSeparator(opt: CommandOptionData): opt is CommandSeparatorOptionProps {
  return opt.type === 'separator';
}
