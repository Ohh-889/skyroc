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
    ref,
    right,
    rightDisabled = false,
    rightText,
    safeAreaTop = true,
    title
  } = props;

  const variantSlots = navBarVariants({ border, leftDisabled, rightDisabled, safeAreaTop });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      container: cn(variantSlots.container(), classNames?.container),
      left: cn(variantSlots.left(), classNames?.left),
      leftText: 'text-sm',
      right: cn(variantSlots.right(), classNames?.right),
      rightText: 'text-sm text-primary',
      root: cn(variantSlots.root(), className),
      title: cn(variantSlots.title(), classNames?.title),
      titleText: 'font-semibold'
    };
  }

  const slotClassNames = resolveSlotClassNames();

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
        {leftText ? <Text className={slotClassNames.leftText}>{leftText}</Text> : null}
      </>
    );
  }

  function renderRight() {
    if (right) return right;

    if (!rightText) return null;

    return <Text className={slotClassNames.rightText}>{rightText}</Text>;
  }

  function renderTitle() {
    if (!title) return null;

    const content = isString(title) ? (
      <Text
        className={slotClassNames.titleText}
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
          className={slotClassNames.title}
          pointerEvents="none"
        >
          {content}
        </View>
      );
    }

    return (
      <Pressable
        className={slotClassNames.title}
        onPress={onTitlePress}
      >
        {content}
      </Pressable>
    );
  }

  const leftContent = renderLeft();
  const rightContent = renderRight();

  return (
    <View
      ref={ref}
      className={slotClassNames.container}
    >
      <View className={slotClassNames.root}>
        {renderTitle()}

        {/* 左右两侧即使无内容也保留占位，维持 justify-between 的两端对齐 */}
        {leftContent ? (
          <Pressable
            className={slotClassNames.left}
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
            className={slotClassNames.right}
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
