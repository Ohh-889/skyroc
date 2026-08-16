/* eslint-disable consistent-return */
import { useCallback, useEffect, useRef } from 'react';
import { BackHandler, Platform, Pressable, View } from 'react-native';
import { cn } from '@skyroc/utils';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../text/Typography';
import { sheetVariants } from './sheet-variants';
import type { SheetProps } from './types';

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
    show,
    showHandle = true,
    snapPoints,
    title,
    ...rest
  } = props;

  const sheetRef = useRef<BottomSheetModal>(null);
  const slots = sheetVariants();
  const hasHeader = Boolean(title) || closeable;
  const insets = useSafeAreaInsets();

  // 根据 show 控制 present / dismiss
  useEffect(() => {
    if (show) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [show]);

  // Android 返回键：Sheet 打开时先关闭 Sheet，不返回上一页
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (show) {
        sheetRef.current?.dismiss();
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [show]);

  function handleDismiss() {
    onUpdateShow?.(false);
  }

  function handleClose() {
    sheetRef.current?.dismiss();
  }

  function renderInner() {
    return (
      <View className={cn(slots.root(), className)}>
        {/* Handle */}
        {showHandle && (
          <View className={cn(slots.handle(), classNames?.handle)}>
            <View className={cn(slots.handleBar(), classNames?.handleBar)} />
          </View>
        )}

        {/* Header */}
        {hasHeader && (
          <View className={cn(slots.header(), classNames?.header)}>
            {title ? <Text className={cn(slots.title(), classNames?.title)}>{title}</Text> : null}
            {closeable && (
              <Pressable
                hitSlop={5}
                className={cn(slots.close(), classNames?.close)}
                onPress={handleClose}
              >
                <AntDesign
                  color="#333"
                  name="close"
                  size={12}
                />
              </Pressable>
            )}
          </View>
        )}

        {/* Description */}
        {description ? <Text className={cn(slots.description(), classNames?.description)}>{description}</Text> : null}

        {/* Body */}
        <View className={cn(slots.body(), classNames?.body)}>{children}</View>
      </View>
    );
  }

  /**
   * 有 snapPoints 时高度已固定，用普通 View 包裹即可，
   * 这样内部的 BottomSheetScrollView / BottomSheetFlatList 手势不会被 BottomSheetView 拦截。
   * 无 snapPoints 时使用 BottomSheetView 支持动态尺寸。
   */
  function renderContent() {
    if (snapPoints) {
      return <View style={{ flex: 1, paddingBottom: insets.bottom }}>{renderInner()}</View>;
    }

    return <BottomSheetView style={{ paddingBottom: insets.bottom }}>{renderInner()}</BottomSheetView>;
  }

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        style={[backdropProps.style, insets.bottom > 0 ? { bottom: -insets.bottom } : null]}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
        pressBehavior={closeOnBackdropPress ? 'close' : 'none'}
      />
    ),
    [closeOnBackdropPress, insets.bottom]
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={!snapPoints}
      handleComponent={null}
      enablePanDownToClose={enablePanDownToClose}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      {...rest}
    >
      {renderContent()}
    </BottomSheetModal>
  );
};

export { Sheet };
