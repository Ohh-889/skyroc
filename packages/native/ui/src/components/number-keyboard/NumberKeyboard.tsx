import { cn } from '@skyroc/utils';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { withTiming } from 'react-native-reanimated';
import type { EntryAnimationsValues, ExitAnimationsValues, LayoutAnimation } from 'react-native-reanimated';
import { Portal } from '../portal';
import { numberKeyboardVariants } from './number-keyboard-variants';
import { NumberKeyboardHeader } from './NumberKeyboardHeader';
import { NumberKeyboardKey } from './NumberKeyboardKey';
import { NumberKeyboardSidebar } from './NumberKeyboardSidebar';
import type { KeyConfig, KeyType, NumberKeyboardProps, ResolvedSlotClassNames } from './types';

/** 键盘在 PortalHost 中的层级：低于 Toast(1000) 与 Notify(1100)，保证提示始终盖在键盘之上 */
const PORTAL_Z_INDEX = 900;

/** 进场动画时长（毫秒） */
const ENTER_DURATION = 250;

/** 退场动画时长（毫秒） */
const EXIT_DURATION = 200;

/** 退格符号，deleteButtonText 与 renderDelete 都没给时的兜底 */
const DELETE_SYMBOL = '⌫';

/** 1-9 的按键文本。顺序固定，随机排列由组件 state 持有，绝不在渲染期现算 */
const DIGITS = Array.from({ length: 9 }, (_, index) => String(index + 1));

/**
 * 进场：从自身高度之下滑入。
 *
 * 位移取 values.targetHeight 而不是写死一个「足够大」的常量：面板高度随标题、主题、安全区变化，常量小于真实高度时收起会露出一截，大于真实高度则起手速度对不上。
 *
 * 用 layout animation 而不是自己维护 shared value：退场必须发生在节点已经从状态里移除之后，只有 layout animation 能把 native view 留到动画播完。
 */
const enterFromBottom = (values: EntryAnimationsValues): LayoutAnimation => {
  'worklet';

  return {
    animations: { transform: [{ translateY: withTiming(0, { duration: ENTER_DURATION }) }] },
    initialValues: { transform: [{ translateY: values.targetHeight }] }
  };
};

/** 退场：滑回自身高度之下 */
const exitToBottom = (values: ExitAnimationsValues): LayoutAnimation => {
  'worklet';

  return {
    animations: { transform: [{ translateY: withTiming(values.currentHeight, { duration: EXIT_DURATION }) }] },
    initialValues: { transform: [{ translateY: 0 }] }
  };
};

/** Fisher-Yates 洗牌，返回新数组，不改动传入的顺序 */
function shuffle(source: string[]): string[] {
  const result = [...source];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/** 把数字文本包成普通按键 */
function toDigitKey(text: string): KeyConfig {
  return { text, type: 'normal' };
}

/** 生成 default 主题的按键：4×3 网格，末行依次是额外键、0、删除键，缺席的位置留占位格保持对齐 */
function genDefaultKeys(digits: string[], extraKey: string | [string, string], showDeleteKey: boolean): KeyConfig[] {
  const extra = typeof extraKey === 'string' ? extraKey : extraKey[0];

  return [
    ...digits.map(toDigitKey),
    extra ? { text: extra, type: 'extra' } : { text: '', type: 'placeholder' },
    toDigitKey('0'),
    showDeleteKey ? { text: '', type: 'delete' } : { text: '', type: 'placeholder' }
  ];
}

/** 生成 custom 主题的按键：3×4 网格，删除与完成都在右侧边栏，网格内只有数字和额外键 */
function genCustomKeys(digits: string[], extraKey: string | [string, string]): KeyConfig[] {
  const extras = (Array.isArray(extraKey) ? extraKey : [extraKey]).filter(Boolean);

  if (extras.length === 0) {
    return [...digits.map(toDigitKey), { text: '0', type: 'normal', wider: true }];
  }

  if (extras.length === 1) {
    return [...digits.map(toDigitKey), { text: '0', type: 'normal', wider: true }, { text: extras[0], type: 'extra' }];
  }

  return [
    ...digits.map(toDigitKey),
    { text: extras[0], type: 'extra' },
    toDigitKey('0'),
    { text: extras[1], type: 'extra' }
  ];
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
    style,
    theme = 'default',
    title,
    value,
    visible = false
  } = props;

  const [innerValue, setInnerValue] = useState('');
  const [digits, setDigits] = useState<string[]>(() => (randomKeyOrder ? shuffle(DIGITS) : DIGITS));

  // 这里必须显式和 undefined 比较：受控传入的空串与「没传 value」是两种语义，Boolean(value) 分不开这两者
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : innerValue;

  const variantSlots = numberKeyboardVariants({ safeAreaInsetBottom, theme });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames(): ResolvedSlotClassNames {
    // 优先级：变体样式 < slot 级覆盖（classNames）< 根级覆盖（className）
    return {
      body: cn(variantSlots.body(), classNames?.body),
      closeBtn: cn(variantSlots.closeBtn(), classNames?.closeBtn),
      confirmKey: cn(variantSlots.confirmKey(), classNames?.confirmKey),
      deleteKey: cn(variantSlots.deleteKey(), classNames?.deleteKey),
      functionKeyText: cn(variantSlots.functionKeyText(), classNames?.functionKeyText),
      header: cn(variantSlots.header(), classNames?.header),
      headerSide: cn(variantSlots.headerSide(), classNames?.headerSide),
      key: cn(variantSlots.key(), classNames?.key),
      keys: cn(variantSlots.keys(), classNames?.keys),
      keyText: cn(variantSlots.keyText(), classNames?.keyText),
      keyWrapper: cn(variantSlots.keyWrapper(), classNames?.keyWrapper),
      root: cn(variantSlots.root(), classNames?.root, className),
      sidebar: cn(variantSlots.sidebar(), classNames?.sidebar),
      title: cn(variantSlots.title(), classNames?.title)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  const keys = theme === 'custom' ? genCustomKeys(digits, extraKey) : genDefaultKeys(digits, extraKey, showDeleteKey);

  // default 主题的关闭按钮在标题栏，custom 主题的在侧边栏，两处不会同时出现
  const showHeaderClose = theme === 'default' && Boolean(closeButtonText);

  /** 删除键内容在网格与侧边栏共用，父组件解析一次后下发 */
  const deleteContent = renderDelete ? renderDelete() : deleteButtonText || DELETE_SYMBOL;

  function updateValue(next: string) {
    if (!isControlled) {
      setInnerValue(next);
    }

    onChange?.(next);
  }

  function handleBlur() {
    onBlur?.();
  }

  function handleClose() {
    onClose?.();
    onBlur?.();
  }

  function handleDelete() {
    onDelete?.();
    updateValue(currentValue.slice(0, -1));
  }

  function handleKeyPress(text: string, type: KeyType) {
    if (type === 'delete') {
      handleDelete();
      return;
    }

    if (currentValue.length >= maxLength) return;

    onInput?.(text);
    updateValue(currentValue + text);
  }

  // 每次打开重新洗牌。关闭时不动：退场动画还在播，此刻换顺序会让数字当场跳变
  useEffect(() => {
    if (!randomKeyOrder) {
      setDigits(DIGITS);
      return;
    }

    if (visible) {
      setDigits(shuffle(DIGITS));
    }
  }, [randomKeyOrder, visible]);

  return (
    <Portal zIndex={PORTAL_Z_INDEX}>
      {/* 容器常驻不做空判断：键盘关闭时若父节点跟着卸载，Reanimated 的退场动画会被连根拔掉。
          box-none 让容器本身不吃触摸，hideOnClickOutside 为 false 时下层内容照常可点 */}
      <View
        className="absolute inset-0"
        pointerEvents="box-none"
      >
        {/* 透明遮罩只负责接住外部点击。它随 visible 立即消失而不等退场动画，
            这样收起途中的点击会落到下层内容上，正是用户此刻想要的 */}
        {visible && hideOnClickOutside ? (
          <Pressable
            className="absolute inset-0"
            onPress={handleBlur}
          />
        ) : null}

        {visible ? (
          <Animated.View
            className="absolute inset-x-0 bottom-0"
            entering={enterFromBottom}
            exiting={exitToBottom}
          >
            <View
              className={slotClassNames.root}
              style={style}
            >
              <NumberKeyboardHeader
                classNames={slotClassNames}
                closeButtonText={closeButtonText}
                showClose={showHeaderClose}
                title={title}
                onClose={handleClose}
              />

              <View className={slotClassNames.body}>
                <View className={slotClassNames.keys}>
                  {keys.map((keyConfig, index) => (
                    <NumberKeyboardKey
                      classNames={slotClassNames}
                      deleteContent={deleteContent}
                      key={`${keyConfig.type}-${keyConfig.text}-${index}`}
                      keyConfig={keyConfig}
                      onPress={handleKeyPress}
                    />
                  ))}
                </View>

                {theme === 'custom' ? (
                  <NumberKeyboardSidebar
                    classNames={slotClassNames}
                    closeButtonText={closeButtonText}
                    deleteContent={deleteContent}
                    showDeleteKey={showDeleteKey}
                    onClose={handleClose}
                    onDelete={handleDelete}
                  />
                ) : null}
              </View>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </Portal>
  );
};

export { NumberKeyboard };
