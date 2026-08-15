import { cn, isNumber, isString } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../text/Typography';
import { isEmptyContent } from './checkbox-content';
import { checkboxCardVariants } from './checkbox-variants';
import { CheckboxIndicator } from './CheckboxIndicator';
import type { CheckboxCardProps } from './types';
import { useCheckboxItem } from './useCheckboxItem';

const CheckboxCard = (props: CheckboxCardProps) => {
  const {
    checkboxPosition = 'left',
    checked,
    checkedIcon,
    className,
    color,
    defaultChecked,
    description,
    disabled,
    icon,
    iconSize,
    indeterminateIcon,
    label,
    name,
    onCheckedChange,
    shape,
    size,
    testID
  } = props;

  const item = useCheckboxItem({
    caller: 'CheckboxCard',
    checked,
    checkedIcon,
    color,
    defaultChecked,
    disabled,
    iconSize,
    indeterminateIcon,
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
  } = checkboxCardVariants({ disabled: item.disabled });

  function renderText(content: ReactNode, textCls: string) {
    if (isEmptyContent(content)) return null;

    if (isString(content) || isNumber(content)) return <Text className={textCls}>{content}</Text>;

    return content;
  }

  function renderIndicator() {
    return (
      <CheckboxIndicator
        checked={item.checked}
        checkedIcon={item.checkedIcon}
        color={item.color}
        indeterminate={item.indeterminate}
        indeterminateIcon={item.indeterminateIcon}
        shape={item.shape}
        sizes={item.sizes}
      />
    );
  }

  return (
    <Pressable
      className={cn(cardCls(), className)}
      disabled={item.disabled}
      testID={testID}
      onPress={item.toggle}
    >
      {checkboxPosition === 'left' && renderIndicator()}

      <View className={cardContentCls()}>
        {icon ? <View className="shrink-0">{icon}</View> : null}

        <View className="flex-1 gap-0.5">
          {renderText(label, cardLabelCls())}
          {renderText(description, cardDescriptionCls())}
        </View>
      </View>

      {checkboxPosition === 'right' && renderIndicator()}
    </Pressable>
  );
};

export { CheckboxCard };
