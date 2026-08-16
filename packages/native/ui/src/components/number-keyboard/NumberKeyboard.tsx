import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@skyroc/utils';
import { NumberKeyboardHeader } from './NumberKeyboardHeader';
import { NumberKeyboardKey } from './NumberKeyboardKey';
import { NumberKeyboardSidebar } from './NumberKeyboardSidebar';
import { numberKeyboardVariants } from './number-keyboard-variants';
import type { KeyConfig, KeyType, NumberKeyboardProps } from './types';

/** 键盘滑出距离（足够大确保完全隐藏） */
const SLIDE_DISTANCE = 400;

/** Fisher-Yates 洗牌算法 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 生成 1-9 基础按键 */
function genBasicKeys(randomKeyOrder: boolean): KeyConfig[] {
  const keys: KeyConfig[] = Array.from({ length: 9 }, (_, i) => ({
    text: String(i + 1),
    type: '' as KeyType
  }));
  return randomKeyOrder ? shuffle(keys) : keys;
}

/** 生成默认主题按键（4×3 网格） */
function genDefaultKeys(
  randomKeyOrder: boolean,
  extraKey: string | [string, string],
  showDeleteKey: boolean,
  deleteButtonText?: string
): KeyConfig[] {
  const extra = typeof extraKey === 'string' ? extraKey : extraKey[0] || '';
  return [
    ...genBasicKeys(randomKeyOrder),
    { text: extra, type: 'extra' },
    { text: '0', type: '' },
    { text: showDeleteKey ? (deleteButtonText || '') : '', type: showDeleteKey ? 'delete' as KeyType : '' as KeyType }
  ];
}

/** 生成自定义主题按键（3×4 网格，无删除键） */
function genCustomKeys(
  randomKeyOrder: boolean,
  extraKey: string | [string, string]
): KeyConfig[] {
  const keys = genBasicKeys(randomKeyOrder);
  const extras = Array.isArray(extraKey) ? extraKey : [extraKey].filter(Boolean);

  if (extras.length === 0) {
    keys.push({ text: '0', type: '', wider: true });
  } else if (extras.length === 1) {
    keys.push(
      { text: '0', type: '', wider: true },
      { text: extras[0], type: 'extra' }
    );
  } else {
    keys.push(
      { text: extras[0], type: 'extra' },
      { text: '0', type: '' },
      { text: extras[1], type: 'extra' }
    );
  }

  return keys;
}

const NumberKeyboard = (props: NumberKeyboardProps) => {
  const {
    className,
    classNames,
    closeButtonText,
    deleteButtonText,
    extraKey = '',
    hideOnClickOutside = true,
    maxLength = Infinity,
    onBlur,
    onChange,
    onClose,
    onDelete,
    onInput,
    randomKeyOrder = false,
    renderDelete,
    safeAreaInsetBottom = true,
    showDeleteKey = true,
    theme = 'default',
    title,
    value = '',
    visible = false
  } = props;

  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SLIDE_DISTANCE);

  const slots = numberKeyboardVariants();

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : SLIDE_DISTANCE, { duration: 250 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  function handleBlur() {
    if (visible) {
      onBlur?.();
    }
  }

  function handleClose() {
    onClose?.();
    handleBlur();
  }

  function handleKeyPress(text: string, type: KeyType) {
    if (text === '' && type === 'extra') {
      handleBlur();
      return;
    }

    if (type === 'delete') {
      onDelete?.();
      onChange?.(value.slice(0, -1));
    } else if (type === 'close') {
      handleClose();
    } else if (value.length < maxLength) {
      onInput?.(text);
      onChange?.(value + text);
    }
  }

  const keys = useMemo(
    () => theme === 'custom'
      ? genCustomKeys(randomKeyOrder, extraKey)
      : genDefaultKeys(randomKeyOrder, extraKey, showDeleteKey, deleteButtonText),
    [visible, theme, extraKey, randomKeyOrder, showDeleteKey, deleteButtonText]
  );

  return (
    <>
      {visible && hideOnClickOutside ? (
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBlur} />
      ) : null}
      <Animated.View
        style={[
          { bottom: 0, left: 0, position: 'absolute', right: 0, zIndex: 100 },
          animatedStyle
        ]}

      >
        <View className={cn(slots.root(), className, classNames?.root)}>
          <NumberKeyboardHeader
            classNames={classNames}
            closeButtonText={closeButtonText}
            theme={theme}
            title={title}
            onClose={handleClose}
          />
          <View className={cn(slots.body(), classNames?.body)}>
            <View className={cn(theme === 'custom' ? 'flex-3' : 'flex-1', 'flex-row flex-wrap', classNames?.keys)}>
              {keys.map((key, i) => (
                <NumberKeyboardKey
                  key={`${key.text}-${key.type}-${i}`}
                  classNames={classNames}
                  deleteButtonText={deleteButtonText}
                  keyConfig={key}
                  renderDelete={renderDelete}
                  onPress={handleKeyPress}
                />
              ))}
            </View>
            {theme === 'custom' ? (
              <NumberKeyboardSidebar
                classNames={classNames}
                closeButtonText={closeButtonText}
                deleteButtonText={deleteButtonText}
                renderDelete={renderDelete}
                showDeleteKey={showDeleteKey}
                onClose={handleClose}
                onDelete={() => handleKeyPress('', 'delete')}
              />
            ) : null}
          </View>
          {safeAreaInsetBottom && insets.bottom > 0 ? (
            <View style={{ height: insets.bottom }} />
          ) : null}
        </View>
      </Animated.View>
    </>
  );
};

export { NumberKeyboard };
