import AntDesign from '@expo/vector-icons/AntDesign';
import { cn, isString } from '@skyroc/utils';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { Text, TextClassContext } from '../text/Typography';
import { CLOSE_HIT_SLOP_MAP, CLOSE_ICON_SIZE_MAP, DEFAULT_TAG_SIZE, tagVariants } from './tag-variants';
import type { TagProps } from './types';

/** AntDesign 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让关闭图标色跟随主题 token */
const CloseIcon = withUniwind(AntDesign);

const Tag = (props: TagProps) => {
  const {
    children,
    className,
    classNames,
    closeable = false,
    closeAccessibilityLabel = '关闭',
    color,
    leading,
    onClose,
    shape,
    size,
    variant,
    ...rest
  } = props;

  const {
    close: closeCls,
    closeIcon: closeIconCls,
    root: rootCls,
    text: textCls
  } = tagVariants({ color, shape, size, variant });

  const sizeKey = size ?? DEFAULT_TAG_SIZE;

  const isTextChild = isString(children) || typeof children === 'number';

  return (
    // 文字色通过 Context 下发，非 string children（图标 + 自定义 Text 等）同样能继承标签的前景色
    <TextClassContext.Provider value={cn(textCls(), classNames?.text)}>
      <View
        className={cn(rootCls(), classNames?.root, className)}
        {...rest}
      >
        {leading}
        {isTextChild ? <Text>{children}</Text> : children}
        {closeable ? (
          <Pressable
            accessibilityLabel={closeAccessibilityLabel}
            className={cn(closeCls(), classNames?.close)}
            hitSlop={CLOSE_HIT_SLOP_MAP[sizeKey]}
            onPress={onClose}
            role="button"
          >
            <CloseIcon
              colorClassName={cn(closeIconCls(), classNames?.closeIcon)}
              name="close"
              size={CLOSE_ICON_SIZE_MAP[sizeKey]}
            />
          </Pressable>
        ) : null}
      </View>
    </TextClassContext.Provider>
  );
};

export { Tag };
