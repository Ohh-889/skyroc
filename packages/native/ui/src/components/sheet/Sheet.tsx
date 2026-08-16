import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { cn } from '@skyroc/utils';
import { useEffect, useRef } from 'react';
import { BackHandler, Platform, Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { Text } from '../text/Typography';
import { sheetVariants } from './sheet-variants';
import type { SheetProps } from './types';

/** 遮罩不透明度 */
const BACKDROP_OPACITY = 0.4;

/** 关闭图标尺寸 */
const CLOSE_ICON_SIZE = 12;

/** AntDesign 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让关闭图标色跟随主题 token */
const CloseIcon = withUniwind(AntDesign);

interface SheetBackdropProps extends BottomSheetBackdropProps {
  /** 点击遮罩的行为 */
  pressBehavior: 'close' | 'none';
}

/** 遮罩层，提到组件外以免每次渲染都产生新的组件类型 */
const SheetBackdrop = (props: SheetBackdropProps) => {
  const { pressBehavior, ...rest } = props;

  return (
    <BottomSheetBackdrop
      {...rest}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={BACKDROP_OPACITY}
      pressBehavior={pressBehavior}
    />
  );
};

interface SheetBackgroundProps extends BottomSheetBackgroundProps {
  /** 面板本体的类名，承载圆角与底色 */
  className: string;
}

/** 面板背景：gorhom 默认那个只认 style，换成认 className 的版本，底色与圆角才能走主题 token。 定位由 gorhom 通过 style 传入（absoluteFill），必须原样透传 */
const SheetBackground = (props: SheetBackgroundProps) => {
  const { className, pointerEvents, style } = props;

  return (
    <View
      className={className}
      pointerEvents={pointerEvents}
      style={style}
    />
  );
};

/** 底部面板组件，基于 @gorhom/bottom-sheet */
const Sheet = (props: SheetProps) => {
  const {
    children,
    className,
    classNames,
    closeable = true,
    closeOnBackdropPress = true,
    description,
    enablePanDownToClose = true,
    onUpdateShow,
    ref,
    show,
    showHandle = true,
    snapPoints,
    title,
    ...rest
  } = props;

  const sheetRef = useRef<BottomSheetModal>(null);

  // Sheet 内部要用 sheetRef 做 present / dismiss，同时把实例抛给调用方，两个 ref 合成一个
  const composedRefs = useComposedRefs(sheetRef, ref);

  const variantSlots = sheetVariants();
  const hasHeader = Boolean(title) || closeable;
  const hasChrome = showHandle || hasHeader || Boolean(description);

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      background: cn(variantSlots.background(), classNames?.background, className),
      chrome: cn(variantSlots.chrome(), classNames?.chrome),
      close: cn(variantSlots.close(), classNames?.close),
      closeIcon: cn(variantSlots.closeIcon(), classNames?.closeIcon),
      description: cn(variantSlots.description(), classNames?.description),
      handle: cn(variantSlots.handle(), classNames?.handle),
      handleBar: cn(variantSlots.handleBar(), classNames?.handleBar),
      header: cn(variantSlots.header(), classNames?.header),
      title: cn(variantSlots.title(), classNames?.title)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function handleDismiss() {
    onUpdateShow(false);
  }

  function handleClose() {
    sheetRef.current?.dismiss();
  }

  function renderBackdrop(backdropProps: BottomSheetBackdropProps) {
    return (
      <SheetBackdrop
        {...backdropProps}
        pressBehavior={closeOnBackdropPress ? 'close' : 'none'}
      />
    );
  }

  function renderBackground(backgroundProps: BottomSheetBackgroundProps) {
    return (
      <SheetBackground
        {...backgroundProps}
        className={slotClassNames.background}
      />
    );
  }

  /**
   * 顶部固定区走 handleComponent 而不是塞进内容里。
   *
   * Gorhom 会用 onLayout 单独量它（BottomSheetHandleContainer），把高度计入动态档位 （useAnimatedDetents：contentHeight +
   * handleHeight），又从内容区高度里扣掉 （BottomSheetContent）。这样内容区就完全留给调用方的容器，标题也不会跟着列表滚。
   */
  function renderChrome() {
    return (
      <View className={slotClassNames.chrome}>
        {showHandle && (
          <View className={slotClassNames.handle}>
            <View className={slotClassNames.handleBar} />
          </View>
        )}

        {hasHeader && (
          <View className={slotClassNames.header}>
            {title ? <Text className={slotClassNames.title}>{title}</Text> : null}
            {closeable && (
              <Pressable
                hitSlop={5}
                className={slotClassNames.close}
                onPress={handleClose}
              >
                <CloseIcon
                  colorClassName={slotClassNames.closeIcon}
                  name="close"
                  size={CLOSE_ICON_SIZE}
                />
              </Pressable>
            )}
          </View>
        )}

        {description ? <Text className={slotClassNames.description}>{description}</Text> : null}
      </View>
    );
  }

  // 根据 show 控制 present / dismiss；未 present 过时不调 dismiss，理由见 hasPresentedRef
  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
    }
  }, [show]);

  // Android 返回键：Sheet 打开时先关闭 Sheet，不返回上一页
  useEffect(() => {
    if (Platform.OS !== 'android' || !show) {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      sheetRef.current?.dismiss();
      return true;
    });

    return () => subscription.remove();
  }, [show]);

  return (
    <BottomSheetModal
      ref={composedRefs}
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      enableDynamicSizing={!snapPoints}
      handleComponent={hasChrome ? renderChrome : null}
      enablePanDownToClose={enablePanDownToClose}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      {...rest}
    >
      {children}
    </BottomSheetModal>
  );
};

export { Sheet };
