import CommandGroup from './CommandGroup';
import CommandItem from './CommandItem';
import CommandSeparator from './CommandSeparator';
import { isGroup, isSeparator } from './shared';
import type { CommandOptionProps } from './types';

const CommandOption = (props: CommandOptionProps) => {
  const { classNames, item, size } = props;

  if (isGroup(item)) {
    const { children, label, ...rest2 } = item;
    return (
      <CommandGroup classNames={classNames} heading={label} size={size} {...rest2}>
        {children.map((child, index) => (
          <CommandOption classNames={classNames} item={child} key={String(index)} size={size} />
        ))}
      </CommandGroup>
    );
  }

  if (isSeparator(item)) {
    return <CommandSeparator className={classNames?.separator} size={size} {...item} />;
  }

  return (
    <CommandItem className={classNames?.item} size={size} {...item}>
      {item.label}
    </CommandItem>
  );
};

export default CommandOption;
