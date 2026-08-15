import { cn, isNil, isNumber, isString } from '@skyroc/utils';
import { useContext } from 'react';
import { Image } from '../image/Image';
import { Text } from '../text/Typography';
import { avatarVariants } from './avatar-variants';
import { AvatarGroupContext } from './AvatarGroupContext';
import type { AvatarProps } from './types';

/**
 * Avatar 直接渲染成一个圆形 Image，不再自建加载/失败状态。
 *
 * Image 已经把「空 src 与加载失败等价」「src 变化时重置状态」收敛在内部，Avatar 若再维护一份 error state， 两份状态不会同步：换头像 URL 后旧的失败态清不掉，且失败瞬间会先闪一帧 Image
 * 自带的破损图标。 这里只负责把 fallback 塞进 Image 的 errorSlot，状态归 Image 独有。
 */
const Avatar = (props: AvatarProps) => {
  const { alt, className, classNames, fallback, imageProps, size, src } = props;

  /** 独立使用时为 undefined；在 AvatarGroup 里则拿到组内统一的尺寸与叠压描边 */
  const group = useContext(AvatarGroupContext);

  const variantSlots = avatarVariants({ size: size ?? group?.size });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      // fallback 的底色与居中来自 Image 的 error slot，这里只承接调用方覆盖（如字母头像换成 bg-primary）
      fallback: classNames?.fallback,
      fallbackText: cn(variantSlots.fallbackText(), classNames?.fallbackText),
      image: cn(variantSlots.image(), classNames?.image),
      // 优先级：兜底样式 < 父级继承（AvatarGroup）< 显式覆盖
      root: cn(variantSlots.root(), group?.ringClassName, classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** String / number 套一层 Text 拿到字号，ReactNode 原样渲染；返回 undefined 时由 Image 兜底渲染破损图标 */
  function renderFallback() {
    if (isNil(fallback)) return null;

    if (isString(fallback) || isNumber(fallback)) {
      return (
        <Text
          className={slotClassNames.fallbackText}
          numberOfLines={1}
        >
          {fallback}
        </Text>
      );
    }

    return fallback;
  }

  return (
    <Image
      alt={alt}
      classNames={{
        error: slotClassNames.fallback,
        image: slotClassNames.image,
        root: slotClassNames.root
      }}
      contentFit="cover"
      errorSlot={renderFallback()}
      radius="full"
      // 头像尺寸小，转圈是噪音；root 的 bg-muted 已经占住位置，需要时可由 imageProps 打开
      showLoading={false}
      src={src}
      {...imageProps}
    />
  );
};

export { Avatar };
