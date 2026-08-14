import { Pressable, View } from 'react-native';
import { cn, isString } from '@skyroc/utils';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text } from '../text/Typography';
import { cellVariants } from './cell-variants';
import type { CellProps } from './types';

const Cell = (props: CellProps) => {
  const {
    arrow,
    arrowDirection = 'right',
    center,
    classNames,
    disabled = false,
    leading,
    showArrow,
    size = 'md',
    subtitle,
    title,
    trailing,
    ...rest
  } = props;

  const hasPress = Boolean(rest.onPress);
  const shouldShowArrow = showArrow ?? hasPress;

  const {
    content: contentCls,
    leading: leadingCls,
    root: rootCls,
    subtitle: subtitleCls,
    title: titleCls,
    trailing: trailingCls
  } = cellVariants({ center: center ?? Boolean(subtitle), disabled, size });

  function renderTrailing() {
    if (!trailing) return null;
    return (
      <View className={cn(trailingCls(), classNames?.trailing)}>
        {isString(trailing) ? <Text className="text-muted-foreground">{trailing}</Text> : trailing}
      </View>
    );
  }

  function renderArrow() {
    if (!shouldShowArrow) return null;
    if (arrow) {
      return <View className={classNames?.arrow}>{arrow}</View>;
    }
    return (
      <View className="ml-1 self-center">
        <AntDesign
          name={arrowDirection}
          size={12}
          color="#6b7280"
        />
      </View>
    );
  }

  const content = (
    <>
      {leading ? <View className={cn(leadingCls(), classNames?.leading)}>{leading}</View> : null}
      <View className={cn(contentCls(), classNames?.content)}>
        {isString(title) ? <Text className={cn(titleCls(), classNames?.title)}>{title}</Text> : title}
        {isString(subtitle) ? <Text className={cn(subtitleCls(), classNames?.subtitle)}>{subtitle}</Text> : subtitle}
      </View>
      {renderTrailing()}
      {renderArrow()}
    </>
  );

  if (hasPress) {
    return (
      <Pressable
        className={cn(rootCls(), classNames?.root)}
        disabled={disabled}
        {...rest}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={cn(rootCls(), classNames?.root)}>{content}</View>;
};

export { Cell };
