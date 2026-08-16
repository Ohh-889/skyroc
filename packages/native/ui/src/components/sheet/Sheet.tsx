import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { cn } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { BackHandler, Platform, Pressable, View } from 'react-native';
import { useResolveClassNames, withUniwind } from 'uniwind';
import { Text } from '../text/Typography';
import { sheetVariants } from './sheet-variants';
import type { SheetProps } from './types';

/** 遮罩不透明度 */
const BACKDROP_OPACITY = 0.4;

/** 关闭图标尺寸 */
const CLOSE_ICON_SIZE = 12;

/** AntDesign 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让关闭图标色跟随主题 token */
const CloseIcon = withUniwind(AntDesign);

/**
 * 生成一个固定 pressBehavior 的遮罩组件。
 *
 * gorhom 把 backdropComponent 当组件类型用，引用一变整层遮罩就卸载重挂。 所以两种行为在模块级各生成一个零闭包的组件、渲染时二选一，
 * 而不是在组件内包一层 render 函数——那样每次渲染都是新类型。
 */
function createBackdrop(pressBehavior: 'close' | 'none') {
  const SheetBackdrop = (props: BottomSheetBackdropProps) => {
    return (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={BACKDROP_OPACITY}
        pressBehavior={pressBehavior}
      />
    );
  };

  return SheetBackdrop;
}

const ClosableBackdrop = createBackdrop('close');

const StaticBackdrop = createBackdrop('none');

/** 字符串走 Text 承接主题字号与颜色；自定义节点原样渲染——RN 里把 View 塞进 Text 会挤坏布局 */
function renderTextNode(node: ReactNode, className: string) {
  if (typeof node === 'string' || typeof node === 'number') {
    return <Text className={className}>{node}</Text>;
  }

  return node ?? null;
}

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
  const slotClassNames = {
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

  /**
   * 面板底色与圆角走 gorhom 自带的 backgroundStyle，不再自定义 backgroundComponent。
   *
   * 自定义组件每次渲染都是新的组件类型，背景层会跟着卸载重挂，还会丢掉 gorhom 默认背景 自带的无障碍属性；换成 style 就只是个普通 prop，不参与协调。 uniwind
   * 这个 hook 把 className 解析成 RN style 并订阅主题变化，底色仍然跟着 token 走。 位置跟随它依赖的 slotClassNames，不提到最前面。
   */
  const backgroundStyle = useResolveClassNames(slotClassNames.background);

  function handleDismiss() {
    onUpdateShow(false);
  }

  function handleClose() {
    sheetRef.current?.dismiss();
  }

  /**
   * 顶部固定区走 handleComponent 而不是塞进内容里。
   *
   * Gorhom 会用 onLayout 单独量它（BottomSheetHandleContainer），把高度计入动态档位 （useAnimatedDetents：contentHeight +
   * handleHeight），又从内容区高度里扣掉 （BottomSheetContent）。这样内容区就完全留给调用方的容器，标题也不会跟着列表滚。
   *
   * 这个函数没法像遮罩那样提到模块级：它要闭包 title / description / slotClassNames， 而 gorhom 不给 handleComponent 传自定义 props，portal
   * 又切断了 context。 所以引用每次渲染都会变、chrome 跟着重挂——重挂范围只有标题栏本身，量出来的 handleHeight 不变、不会引起档位跳动，权衡后接受。
   * 反过来若强行把组件类型钉死（比如数据塞进 ref），BottomSheetHandleContainer 是 memo 的， 标题更新就再也传不进去了。
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
            {renderTextNode(title, slotClassNames.title)}
            {closeable && (
              <Pressable
                className={slotClassNames.close}
                hitSlop={5}
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

        {renderTextNode(description, slotClassNames.description)}
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
      sheetRef.current?.close();
      return true;
    });

    return () => subscription.remove();
  }, [show]);

  return (
    <BottomSheetModal
      ref={composedRefs}
      backdropComponent={closeOnBackdropPress ? ClosableBackdrop : StaticBackdrop}
      backgroundStyle={backgroundStyle}
      enableDynamicSizing={!snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      handleComponent={hasChrome ? renderChrome : null}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      {...rest}
    >
      {children}
    </BottomSheetModal>
  );
};

export { Sheet };
