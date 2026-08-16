import { cn, isNumber, isString } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../text/Typography';
import { radioCardVariants } from './radio-variants';
import { RadioIndicator } from './RadioIndicator';
import type { RadioCardProps } from './types';
import { useRadioItem } from './useRadioItem';

const RadioCard = (props: RadioCardProps) => {
  const {
    checked,
    checkedIcon,
    className,
    classNames,
    color,
    defaultChecked,
    description,
    disabled,
    icon,
    iconSize,
    label,
    name,
    onCheckedChange,
    radioPosition = 'left',
    shape,
    size
  } = props;

  const item = useRadioItem({
    caller: 'RadioCard',
    checked,
    checkedIcon,
    color,
    defaultChecked,
    disabled,
    iconSize,
    name,
    onCheckedChange,
    shape,
    size
  });

  const variantSlots = radioCardVariants({ disabled: item.disabled });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.cardContent(), classNames?.content),
      description: cn(variantSlots.cardDescription(), classNames?.description),
      icon: cn('shrink-0', classNames?.icon),
      label: cn(variantSlots.cardLabel(), classNames?.label),
      root: cn(variantSlots.card(), classNames?.root, className),
      texts: cn('flex-1 gap-0.5', classNames?.texts)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function renderText(content: ReactNode, textCls: string) {
    if (content === null || content === undefined) return null;

    if (isString(content) || isNumber(content)) return <Text className={textCls}>{content}</Text>;

    return content;
  }

  function renderIndicator() {
    return (
      <RadioIndicator
        checked={item.checked}
        checkedIcon={item.checkedIcon}
        classNames={classNames}
        color={item.color}
        shape={item.shape}
        sizes={item.sizes}
      />
    );
  }

  return (
    <Pressable
      className={slotClassNames.root}
      disabled={item.disabled}
      onPress={item.select}
    >
      {radioPosition === 'left' && renderIndicator()}

      <View className={slotClassNames.content}>
        {icon ? <View className={slotClassNames.icon}>{icon}</View> : null}

        <View className={slotClassNames.texts}>
          {renderText(label, slotClassNames.label)}
          {renderText(description, slotClassNames.description)}
        </View>
      </View>

      {radioPosition === 'right' && renderIndicator()}
    </Pressable>
  );
};

export { RadioCard };
