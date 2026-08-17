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
    classNames,
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
    ref,
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

  const variantSlots = checkboxCardVariants({ disabled: item.disabled });

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
    if (isEmptyContent(content)) return null;

    if (isString(content) || isNumber(content)) return <Text className={textCls}>{content}</Text>;

    return content;
  }

  function renderIndicator() {
    return (
      <CheckboxIndicator
        checked={item.checked}
        checkedIcon={item.checkedIcon}
        classNames={classNames}
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
      ref={ref}
      className={slotClassNames.root}
      disabled={item.disabled}
      testID={testID}
      onPress={item.toggle}
    >
      {checkboxPosition === 'left' && renderIndicator()}

      <View className={slotClassNames.content}>
        {icon ? <View className={slotClassNames.icon}>{icon}</View> : null}

        <View className={slotClassNames.texts}>
          {renderText(label, slotClassNames.label)}
          {renderText(description, slotClassNames.description)}
        </View>
      </View>

      {checkboxPosition === 'right' && renderIndicator()}
    </Pressable>
  );
};

export { CheckboxCard };
