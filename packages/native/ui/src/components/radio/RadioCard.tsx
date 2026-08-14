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

  const {
    card: cardCls,
    cardContent: cardContentCls,
    cardDescription: cardDescriptionCls,
    cardLabel: cardLabelCls
  } = radioCardVariants({ disabled: item.disabled });

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
        color={item.color}
        shape={item.shape}
        sizes={item.sizes}
      />
    );
  }

  return (
    <Pressable
      className={cn(cardCls(), className)}
      disabled={item.disabled}
      onPress={item.select}
    >
      {radioPosition === 'left' && renderIndicator()}

      <View className={cardContentCls()}>
        {icon ? <View className="shrink-0">{icon}</View> : null}

        <View className="flex-1 gap-0.5">
          {renderText(label, cardLabelCls())}
          {renderText(description, cardDescriptionCls())}
        </View>
      </View>

      {radioPosition === 'right' && renderIndicator()}
    </Pressable>
  );
};

export { RadioCard };
