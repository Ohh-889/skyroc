import { cn, isNil, isNumber, isString } from '@skyroc/utils';
import { isValidElement } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { Text } from '../text/Typography';
import { badgeVariants } from './badge-variants';
import type { BadgePosition, BadgeProps } from './types';

/** ViewStyle.transform 的数组形态，排除 web 端的字符串写法，便于拼接 */
type BadgeTransform = Exclude<NonNullable<ViewStyle['transform']>, string>;

/** Android 的 includeFontPadding 会在字形上下补空白，把角标文字顶偏，这里关掉交给 leading + flex 居中（iOS 忽略该属性） */
const contentTextStyle: TextStyle = { includeFontPadding: false };

/** 四角锚点，把角标定位到 children 对应的角落 */
const anchorStyles: Record<BadgePosition, ViewStyle> = {
  'top-right': { position: 'absolute', right: 0, top: 0 },
  'top-left': { left: 0, position: 'absolute', top: 0 },
  'bottom-right': { bottom: 0, position: 'absolute', right: 0 },
  'bottom-left': { bottom: 0, left: 0, position: 'absolute' }
};

/** 各角落的基准位移，按角标自身尺寸的 50% 外推，让角标骑在边角上 */
const anchorTranslates: Record<BadgePosition, [`${number}%`, `${number}%`]> = {
  'top-right': ['50%', '-50%'],
  'top-left': ['-50%', '-50%'],
  'bottom-right': ['50%', '50%'],
  'bottom-left': ['-50%', '50%']
};

const Badge = (props: BadgeProps) => {
  const {
    children,
    className,
    classNames,
    color,
    content,
    dot = false,
    max = 99,
    offset,
    position = 'top-right',
    showZero = false,
    size,
    ...rest
  } = props;

  const variantSlots = badgeVariants({ color, size });

  /** 无 children 时角标独立成块，此处不再有外层容器，View props 直接落到角标自身 */
  const isStandalone = isNil(children);

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    // 独立模式下角标就是根节点，由它承接调用方的 className
    const ownClassName = isStandalone ? className : undefined;

    return {
      badge: cn(variantSlots.badge(), classNames?.badge, ownClassName),
      content: cn(variantSlots.content(), classNames?.content),
      dot: cn(variantSlots.dot(), classNames?.dot, ownClassName),
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function resolveVisible() {
    if (dot) return true;
    if (isNil(content) || content === '') return false;
    if (content === 0) return showZero;
    return true;
  }

  const visible = resolveVisible();

  function getDisplayContent() {
    if (isNumber(content) && content > max) {
      return `${max}+`;
    }
    return content;
  }

  function getPositionStyle(): ViewStyle | undefined {
    if (isStandalone) return undefined;

    const [translateX, translateY] = anchorTranslates[position];

    // offset 只是在默认角落位置上叠加的像素微调，不替换 50% 外推
    const transform: BadgeTransform = offset
      ? [{ translateX }, { translateY }, { translateX: offset[0] }, { translateY: offset[1] }]
      : [{ translateX }, { translateY }];

    return { ...anchorStyles[position], transform };
  }

  function renderBadgeContent() {
    const displayContent = getDisplayContent();

    if (isValidElement(displayContent)) {
      return displayContent;
    }

    return (
      <Text
        className={slotClassNames.content}
        numberOfLines={1}
        style={contentTextStyle}
      >
        {displayContent}
      </Text>
    );
  }

  function renderBadge() {
    if (!visible) return null;

    // 独立模式下角标就是根节点，承接其余 View props
    const ownProps = isStandalone ? rest : {};

    if (dot) {
      return (
        <View
          className={slotClassNames.dot}
          style={getPositionStyle()}
          {...ownProps}
        />
      );
    }

    return (
      <View
        className={slotClassNames.badge}
        style={getPositionStyle()}
        {...ownProps}
      >
        {renderBadgeContent()}
      </View>
    );
  }

  if (isStandalone) {
    return renderBadge();
  }

  return (
    <View
      className={slotClassNames.root}
      {...rest}
    >
      {isString(children) || isNumber(children) ? <Text>{children}</Text> : children}
      {renderBadge()}
    </View>
  );
};

export { Badge };
