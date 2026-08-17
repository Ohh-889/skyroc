import { cn, isNil } from '@skyroc/utils';
import { Children, isValidElement } from 'react';
import { View } from 'react-native';
import { Avatar } from './Avatar';
import { avatarGroupVariants } from './avatar-variants';
import { AvatarGroupContext } from './AvatarGroupContext';
import type { AvatarGroupContextValue, AvatarGroupProps } from './types';

/**
 * 头像组：把若干 Avatar 横向叠压排列，超出 max 的部分折叠成一个 +N。
 *
 * 尺寸与分隔描边走 Context 下发（同 Button 用 TextClassContext 给子 Text 传样式的套路），子 Avatar 无需感知自己在组里； 叠压的负 margin 依赖索引，Context
 * 表达不了，所以逐项包一层 View 承担。
 */
const AvatarGroup = (props: AvatarGroupProps) => {
  const { children, className, classNames, max, overflowProps, size, total } = props;

  const variantSlots = avatarGroupVariants({ size });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      item: cn(variantSlots.item(), classNames?.item),
      ring: cn(variantSlots.ring(), classNames?.ring),
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 摊平成数组：既要按索引决定首项是否跳过负 margin，也要拿总数算 +N */
  const items = Children.toArray(children);

  const visibleCount = isNil(max) || max <= 0 ? items.length : Math.min(max, items.length);

  /** Total 让调用方能只渲染前几个头像却声明真实总人数，未传时退回实际子项数 */
  const overflowCount = (total ?? items.length) - visibleCount;

  const contextValue: AvatarGroupContextValue = { ringClassName: slotClassNames.ring, size };

  return (
    <AvatarGroupContext value={contextValue}>
      <View className={slotClassNames.root}>
        {items.slice(0, visibleCount).map((item, index) => (
          <View
            // 首项不叠压，否则整组会整体左移半个头像
            className={index === 0 ? undefined : slotClassNames.item}
            key={isValidElement(item) ? item.key : index}
          >
            {item}
          </View>
        ))}

        {overflowCount > 0 && (
          <View className={slotClassNames.item}>
            <Avatar
              fallback={`+${overflowCount}`}
              {...overflowProps}
            />
          </View>
        )}
      </View>
    </AvatarGroupContext>
  );
};

export { AvatarGroup };
