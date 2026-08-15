import { cn, isNil, isNumber, isString } from '@skyroc/utils';
import { isValidElement } from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';
import { Text } from '../text/Typography';
import { badgeVariants } from './badge-variants';
import type { BadgePosition, BadgeProps } from './types';

/** ViewStyle.transform 的数组形态，排除 web 端的字符串写法，便于拼接 */
type BadgeTransform = Exclude<NonNullable<ViewStyle['transform']>, string>;

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

  const { badge: badgeCls, content: contentCls, dot: dotCls, root: rootCls } = badgeVariants({ color, size });

  /** 无 children 时角标独立成块，此处不再有外层容器，View props 直接落到角标自身 */
  const isStandalone = isNil(children);

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

    return <Text className={cn(contentCls(), classNames?.content)}>{displayContent}</Text>;
  }

  function renderBadge() {
    if (!visible) return null;

    // 独立模式下角标就是根节点，承接 className 与其余 View props
    const ownProps = isStandalone ? rest : {};
    const ownClassName = isStandalone ? className : undefined;

    if (dot) {
      return (
        <View
          className={cn(dotCls(), classNames?.dot, ownClassName)}
          style={getPositionStyle()}
          {...ownProps}
        />
      );
    }

    return (
      <View
        className={cn(badgeCls(), classNames?.badge, ownClassName)}
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
      className={cn(rootCls(), classNames?.root, className)}
      {...rest}
    >
      {isString(children) || isNumber(children) ? <Text>{children}</Text> : children}
      {renderBadge()}
    </View>
  );
};

export { Badge };
