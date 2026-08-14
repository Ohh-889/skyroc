import Octicons from '@expo/vector-icons/Octicons';
import { cn, isString } from '@skyroc/utils';
import { Pressable, View } from 'react-native';
import { Text } from '../text/Typography';
import { navBarVariants } from './navbar-variants';
import type { NavBarProps } from './types';

/**
 * 导航栏组件。
 *
 * 刻意不依赖任何路由方案：返回行为由使用方通过 onLeftPress 注入，组件只负责布局与样式。
 */
const NavBar = (props: NavBarProps) => {
  const {
    backColor,
    border = true,
    className,
    classNames,
    left,
    leftArrow = false,
    leftDisabled = false,
    leftText,
    onLeftPress,
    onRightPress,
    onTitlePress,
    right,
    rightDisabled = false,
    rightText,
    safeAreaTop = true,
    title
  } = props;

  const slots = navBarVariants({ border, leftDisabled, rightDisabled, safeAreaTop });

  function renderLeft() {
    if (left) return left;

    if (!leftArrow && !leftText) return null;

    return (
      <>
        {/* 包一层 Text 让图标在未显式指定 backColor 时继承主题前景色 */}
        {leftArrow ? (
          <Text>
            <Octicons
              color={backColor}
              name="chevron-left"
              size={24}
            />
          </Text>
        ) : null}
        {leftText ? <Text className="text-sm">{leftText}</Text> : null}
      </>
    );
  }

  function renderRight() {
    if (right) return right;

    if (!rightText) return null;

    return <Text className="text-sm text-primary">{rightText}</Text>;
  }

  function renderTitle() {
    if (!title) return null;

    const titleClass = cn(slots.title(), classNames?.title);

    const content = isString(title) ? (
      <Text
        className="font-semibold"
        numberOfLines={1}
      >
        {title}
      </Text>
    ) : (
      title
    );

    // 标题铺满整行，不可点时必须让出触摸，否则会盖掉两侧按钮
    if (!onTitlePress) {
      return (
        <View
          className={titleClass}
          pointerEvents="none"
        >
          {content}
        </View>
      );
    }

    return (
      <Pressable
        className={titleClass}
        onPress={onTitlePress}
      >
        {content}
      </Pressable>
    );
  }

  const leftContent = renderLeft();
  const rightContent = renderRight();

  return (
    <View className={cn(slots.container(), classNames?.container)}>
      <View className={cn(slots.root(), className)}>
        {renderTitle()}

        {/* 左右两侧即使无内容也保留占位，维持 justify-between 的两端对齐 */}
        {leftContent ? (
          <Pressable
            className={cn(slots.left(), classNames?.left)}
            disabled={leftDisabled || !onLeftPress}
            hitSlop={5}
            onPress={onLeftPress}
          >
            {leftContent}
          </Pressable>
        ) : (
          <View />
        )}

        {rightContent ? (
          <Pressable
            className={cn(slots.right(), classNames?.right)}
            disabled={rightDisabled || !onRightPress}
            hitSlop={5}
            onPress={onRightPress}
          >
            {rightContent}
          </Pressable>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

export { NavBar };
