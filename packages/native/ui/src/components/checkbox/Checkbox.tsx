import { cn, isNumber, isString } from '@skyroc/utils';
import { Pressable, View } from 'react-native';
import { Text } from '../text/Typography';
import { isEmptyContent } from './checkbox-content';
import { checkboxVariants } from './checkbox-variants';
import { CheckboxIndicator } from './CheckboxIndicator';
import type { CheckboxProps } from './types';
import { useCheckboxItem } from './useCheckboxItem';

const Checkbox = (props: CheckboxProps) => {
  const {
    checked,
    checkedIcon,
    children,
    className,
    color,
    defaultChecked,
    disabled,
    iconSize,
    indeterminateIcon,
    labelDisabled = false,
    labelPosition,
    name,
    onCheckedChange,
    shape,
    size,
    testID
  } = props;

  const item = useCheckboxItem({
    caller: 'Checkbox',
    checked,
    checkedIcon,
    color,
    defaultChecked,
    disabled,
    iconSize,
    indeterminateIcon,
    labelPosition,
    name,
    onCheckedChange,
    shape,
    size
  });

  const { label: labelCls, root: rootCls } = checkboxVariants({
    disabled: item.disabled,
    labelPosition: item.labelPosition,
    size: item.size
  });

  function renderLabel() {
    if (isEmptyContent(children)) return null;

    const isTextChild = isString(children) || isNumber(children);

    return (
      <Pressable
        className="shrink active:opacity-70"
        disabled={item.disabled || labelDisabled}
        onPress={item.toggle}
      >
        {isTextChild ? <Text className={labelCls()}>{children}</Text> : children}
      </Pressable>
    );
  }

  return (
    <View
      className={cn(rootCls(), className)}
      testID={testID}
    >
      {/* 控件按 controlRow 撑高，多行 label 下指示器才会贴着首行而不是整块垂直居中 */}
      <Pressable
        className="items-center justify-center active:opacity-70"
        disabled={item.disabled}
        hitSlop={4}
        onPress={item.toggle}
        style={{ height: item.sizes.controlRow, width: item.sizes.control }}
      >
        <CheckboxIndicator
          checked={item.checked}
          checkedIcon={item.checkedIcon}
          color={item.color}
          indeterminate={item.indeterminate}
          indeterminateIcon={item.indeterminateIcon}
          shape={item.shape}
          sizes={item.sizes}
        />
      </Pressable>

      {renderLabel()}
    </View>
  );
};

export { Checkbox };
