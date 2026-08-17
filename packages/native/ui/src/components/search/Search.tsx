import type { NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';
import { Pressable, View } from 'react-native';
import { cn } from '@skyroc/utils';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Input } from '../input';
import { Text } from '../text/Typography';
import { searchVariants } from './search-variants';
import type { SearchProps } from './types';

const Search = (props: SearchProps) => {
  const {
    actionText = '取消',
    background,
    className,
    classNames,
    clearable = true,
    disabled,
    label,
    leftIcon,
    onCancel,
    onSearch,
    onSubmitEditing,
    shape = 'square',
    showAction = false,
    size = 'md',
    value,
    ...rest
  } = props;

  const slots = searchVariants({ shape });

  function handleSubmitEditing(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
    onSearch?.(value ?? '');
    onSubmitEditing?.(e);
  }

  function handleCancel() {
    onCancel?.();
  }

  function renderSearchIcon() {
    if (leftIcon) return leftIcon;

    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

    return (
      <AntDesign
        color="#9ca3af"
        name="search"
        size={iconSize}
      />
    );
  }

  return (
    <View
      className={cn(slots.root(), className)}
      style={background ? { backgroundColor: background } : undefined}
    >
      {label ? <Text className={slots.label()}>{label}</Text> : null}
      <Input
        classNames={{ ...classNames, root: cn(slots.input(), classNames?.root) }}
        clearable={clearable}
        disabled={disabled}
        leading={renderSearchIcon()}
        returnKeyType="search"
        size={size}
        value={value}
        variant="filled"
        onSubmitEditing={handleSubmitEditing}
        {...rest}
      />
      {showAction ? (
        <Pressable
          className={slots.action()}
          onPress={handleCancel}
        >
          <Text className={slots.actionText()}>{actionText}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export { Search };
