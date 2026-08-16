import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { type LayoutChangeEvent, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { cn } from '@skyroc/utils';
import { type SwipeCellEntry, registerOpenCell, unregisterOpenCell } from './swipe-cell-registry';
import { swipeCellVariants } from './swipe-cell-variants';
import type { SwipeCellPosition, SwipeCellProps, SwipeCellSide, SwipeCellWidths } from './types';

/** 弹簧动画配置 */
const SPRING_CONFIG = {
  damping: 20,
  mass: 0.5,
  stiffness: 200
};

/** 触发开启的滑动速度阈值 */
const VELOCITY_THRESHOLD = 500;

/** 触发开启的距离比例阈值 */
const OPEN_THRESHOLD = 0.3;

/** 拖出边界后的阻尼系数，越小越「拉不动」 */
const OVERDRAG_RESISTANCE = 0.25;

function noop() {}

/** 某一侧展开时内容区应停靠的位移；null 表示收起态 */
function offsetForSide(side: SwipeCellSide | null, widths: SwipeCellWidths) {
  'worklet';

  if (side === 'left') return widths.leading;
  if (side === 'right') return -widths.trailing;
  return 0;
}

/** 把拖拽位移夹在可视范围内，越界部分按阻尼衰减，避免拖到头是硬撞墙 */
function withRubberBand(offset: number, widths: SwipeCellWidths) {
  'worklet';

  if (offset > widths.leading) return widths.leading + (offset - widths.leading) * OVERDRAG_RESISTANCE;
  if (offset < -widths.trailing) return -widths.trailing + (offset + widths.trailing) * OVERDRAG_RESISTANCE;
  return offset;
}

/**
 * 根据松手时的位移与速度决定最终停靠在哪一侧，null 表示收起。
 *
 * 速度优先于位移：从左侧展开态快速左划时位移仍是正的，只看位移会误判成「继续展开」。
 */
function resolveSettleSide(offset: number, velocityX: number, widths: SwipeCellWidths): SwipeCellSide | null {
  'worklet';

  if (velocityX > VELOCITY_THRESHOLD) {
    return offset >= 0 && widths.leading > 0 ? 'left' : null;
  }
  if (velocityX < -VELOCITY_THRESHOLD) {
    return offset <= 0 && widths.trailing > 0 ? 'right' : null;
  }
  if (widths.leading > 0 && offset > widths.leading * OPEN_THRESHOLD) return 'left';
  if (widths.trailing > 0 && -offset > widths.trailing * OPEN_THRESHOLD) return 'right';
  return null;
}

const SwipeCell = (props: SwipeCellProps) => {
  const {
    beforeClose,
    children,
    classNames,
    disabled = false,
    exclusive = true,
    leading,
    leadingWidth,
    name = '',
    onClose,
    onOpen,
    ref,
    style,
    trailing,
    trailingWidth
  } = props;

  const [openSide, setOpenSide] = useState<SwipeCellSide | null>(null);
  const [measuredWidths, setMeasuredWidths] = useState<SwipeCellWidths>({ leading: 0, trailing: 0 });

  // 展开态的权威值。openSide 只是它的渲染镜像——互斥表会在 React 提交之前跨实例同步调用收起，
  // scheduleOnRN 送回的 commit 也可能晚于当次渲染，两处都不能读被闭包冻住的 state
  const openSideRef = useRef<SwipeCellSide | null>(null);

  // 互斥表按引用摘除成员，句柄对象必须全生命周期保持同一引用，其 close 由下面的 effect 保持新鲜
  const entryRef = useRef<SwipeCellEntry>({ close: noop });

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const variantSlots = swipeCellVariants();

  const isOpen = Boolean(openSide);

  // worklet 里只需要知道「有没有拦截」，函数本身不进闭包
  const guarded = Boolean(beforeClose);

  // 宽度用普通值而非 shared value：手势对象每次渲染重建，worklet 闭包捕获到的就是最新数字，
  // 省掉「渲染期写 shared value」这个 Reanimated 明令禁止的动作
  const widths: SwipeCellWidths = {
    leading: leadingWidth ?? measuredWidths.leading,
    trailing: trailingWidth ?? measuredWidths.trailing
  };

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content),
      leading: cn(variantSlots.leading(), classNames?.leading),
      overlay: cn(variantSlots.overlay(), classNames?.overlay),
      root: cn(variantSlots.root(), classNames?.root),
      trailing: cn(variantSlots.trailing(), classNames?.trailing)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function snapTo(side: SwipeCellSide | null) {
    translateX.value = withSpring(offsetForSide(side, widths), SPRING_CONFIG);
  }

  /**
   * 提交前的落位：有 beforeClose 且这次会导致关闭时原地不动，等确认结果。
   *
   * 否则用户看到的是「先关掉又弹回来」——那读起来像动画 bug，而不是一次被拒绝的关闭。
   */
  function snapPending(next: SwipeCellSide | null) {
    const current = openSideRef.current;
    const willClose = Boolean(current) && next !== current;

    snapTo(guarded && willClose ? current : next);
  }

  function applyOpen(side: SwipeCellSide) {
    openSideRef.current = side;
    setOpenSide(side);

    if (exclusive) {
      registerOpenCell(entryRef.current);
    }

    onOpen?.({ name, position: side });
  }

  function applyClose(position: SwipeCellPosition) {
    openSideRef.current = null;
    setOpenSide(null);
    unregisterOpenCell(entryRef.current);
    onClose?.({ name, position });
  }

  /**
   * 提交一次状态迁移，next 为 null 表示收起。
   *
   * 只要涉及关闭就先过 beforeClose：被拒则维持原展开态、内容区不动；通过后才真正移动。 position 省略时取当前展开的一侧。
   *
   * 落位由调用方在此之前用 snapPending 处理，这里只在 beforeClose 出结果后补齐真正的位移。
   */
  async function commit(next: SwipeCellSide | null, position?: SwipeCellPosition) {
    const current = openSideRef.current;

    if (next === current) return;

    if (current) {
      const closePosition = position ?? current;

      if (beforeClose) {
        const allowed = await beforeClose({ name, position: closePosition });

        // 拦下了就什么都不做：snapPending 让内容区一直停在展开位，此刻无需回弹
        if (!allowed) return;

        // 等待确认期间可能已被互斥表或 disabled 收起，此时这次迁移已经作废
        if (openSideRef.current !== current) return;

        snapTo(next);
      }

      applyClose(closePosition);
    }

    if (next) {
      applyOpen(next);
    }
  }

  /** 强制收起，不经过 beforeClose；供互斥表与 disabled 使用 */
  function forceClose() {
    const current = openSideRef.current;

    if (!current) return;

    snapTo(null);
    applyClose(current);
  }

  function handleOpen(side: SwipeCellSide) {
    // 该侧没有内容或尚未测量时直接忽略，否则会进入「视觉没展开、状态却是展开」的死区
    if (side === openSideRef.current || offsetForSide(side, widths) === 0) return;

    snapPending(side);
    commit(side);
  }

  function handleClose() {
    if (!openSideRef.current) return;

    snapPending(null);
    commit(null);
  }

  function handleContentPress() {
    if (!openSideRef.current) return;

    snapPending(null);
    commit(null, 'cell');
  }

  function handleLeadingLayout(e: LayoutChangeEvent) {
    const width = e.nativeEvent.layout.width;

    setMeasuredWidths(prev => (prev.leading === width ? prev : { ...prev, leading: width }));
  }

  function handleTrailingLayout(e: LayoutChangeEvent) {
    const width = e.nativeEvent.layout.width;

    setMeasuredWidths(prev => (prev.trailing === width ? prev : { ...prev, trailing: width }));
  }

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetX([-10, 10])
    // 不加纵向失败判定，放进垂直列表后斜向滑动会把滚动手势抢走
    .failOffsetY([-12, 12])
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate(e => {
      translateX.value = withRubberBand(startX.value + e.translationX, widths);
    })
    .onEnd(e => {
      const side = resolveSettleSide(translateX.value, e.velocityX, widths);

      // 与 snapPending 同一套判断，只是跑在 UI 线程上：无拦截时立即停靠保证跟手，
      // 有拦截且这次会关闭时停回原展开位，等 commit 拿到确认结果再动
      const willClose = openSide !== null && side !== openSide;
      const target = guarded && willClose ? openSide : side;

      translateX.value = withSpring(offsetForSide(target, widths), SPRING_CONFIG);
      scheduleOnRN(commit, side);
    });

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  useImperativeHandle(ref, () => ({
    close: handleClose,
    open: handleOpen
  }));

  // 每次渲染刷新句柄上的收起逻辑，让互斥表拿到的始终是最新闭包
  useEffect(() => {
    entryRef.current.close = forceClose;
  });

  // 禁用时立刻收起，否则会卡在展开态且手势已经关掉、收不回来
  useEffect(() => {
    if (disabled) {
      entryRef.current.close();
    }
  }, [disabled]);

  useEffect(() => {
    const entry = entryRef.current;

    return () => unregisterOpenCell(entry);
  }, []);

  return (
    <View
      className={slotClassNames.root}
      style={style}
    >
      {leading ? (
        <View
          className={slotClassNames.leading}
          onLayout={handleLeadingLayout}
        >
          {leading}
        </View>
      ) : null}

      {trailing ? (
        <View
          className={slotClassNames.trailing}
          onLayout={handleTrailingLayout}
        >
          {trailing}
        </View>
      ) : null}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={contentAnimatedStyle}>
          <View className={slotClassNames.content}>{children}</View>
          {isOpen ? (
            <Pressable
              className={slotClassNames.overlay}
              onPress={handleContentPress}
            />
          ) : null}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export { SwipeCell };
