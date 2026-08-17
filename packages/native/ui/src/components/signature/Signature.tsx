/* eslint-disable react/style-prop-object -- Skia 的 <Path style> 是画笔模式（stroke / fill），
   与 RN 的样式对象同名不同物，规则在这里是误报 */
import { Canvas, Fill, ImageFormat, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import { cn } from '@skyroc/utils';
import { useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useResolveClassNames } from 'uniwind';
import { Button } from '../button/Button';
import { Text } from '../text/Typography';
import {
  DEFAULT_SIGNATURE_LINE_WIDTH,
  SIGNATURE_DOT_LENGTH,
  SIGNATURE_MIN_SAMPLE_DISTANCE,
  SIGNATURE_QUALITY_MAP,
  signatureVariants
} from './signature-variants';
import type { SignatureProps } from './types';

/** 笔色兜底：主题变量在首帧解析不出来时才会用到 */
const FALLBACK_PEN_COLOR = '#000';

/** 只落了一个 moveTo 的 path 的点数，这种轮廓描边渲染不出任何东西 */
const MOVE_ONLY_POINT_COUNT = 1;

const Signature = (props: SignatureProps) => {
  const {
    backgroundColor,
    className,
    classNames,
    clearButtonText = '清除',
    color,
    confirmButtonText = '确认',
    disabled = false,
    lineWidth = DEFAULT_SIGNATURE_LINE_WIDTH,
    onClear,
    onEnd,
    onSigning,
    onStart,
    onSubmit,
    penColor,
    quality,
    readonly = false,
    ref,
    showFooter = true,
    size,
    tips,
    type = 'png'
  } = props;

  const [hasInk, setHasInk] = useState(false);

  const canvasRef = useCanvasRef();

  // 撤销用的笔画历史。只在落笔结束时追加，撤销时整体重建 committedPath，
  // 因此存 SVG 字符串而不是 SkPath —— 跨线程传字符串不涉及宿主对象的生命周期
  const strokesRef = useRef<string[]>([]);

  // 已完成的笔画全部合进一个 path。Skia 对每条轮廓独立描边，
  // 合并后的渲染结果与逐笔画一条 <Path> 完全一致，却把节点数钉死成 2 个
  const committedPath = useSharedValue(Skia.Path.Make());
  const activePath = useSharedValue(Skia.Path.Make());
  const lastPoint = useSharedValue({ x: 0, y: 0 });

  const variantSlots = signatureVariants({ color, disabled, size });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      background: cn(variantSlots.background(), classNames?.background),
      canvas: cn(variantSlots.canvas(), classNames?.canvas),
      footer: cn(variantSlots.footer(), classNames?.footer),
      pen: cn(variantSlots.pen(), classNames?.pen),
      root: cn(variantSlots.root(), classNames?.root, className),
      tips: cn(variantSlots.tips(), classNames?.tips),
      tipsText: cn(variantSlots.tipsText(), classNames?.tipsText)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  // Canvas 不接受 className，只能把「色源」槽解析成真实色值再传给 Skia 节点
  const penStyle = useResolveClassNames(slotClassNames.pen);
  const backgroundStyle = useResolveClassNames(slotClassNames.background);

  const resolvedPenColor = penColor ?? (penStyle.color as string | undefined) ?? FALLBACK_PEN_COLOR;

  // JPEG 没有 alpha 通道，透明底会被压成纯黑，所以 jpeg 缺省时回落到画布底色
  const requestedFill = backgroundColor === 'transparent' ? undefined : backgroundColor;
  const canvasFill = requestedFill ?? (type === 'jpeg' ? (backgroundStyle.backgroundColor as string) : undefined);

  const interactive = !disabled && !readonly;

  // worklet 里只需要知道调用方关不关心「正在书写」，函数本身不进闭包
  const notifiesSigning = Boolean(onSigning);

  function handleStrokeStart() {
    setHasInk(true);
    onStart?.();
  }

  function handleStrokeEnd(stroke: string) {
    strokesRef.current.push(stroke);
    onEnd?.();
  }

  function handleSigning() {
    onSigning?.();
  }

  /** 用剩余笔画重建已完成的 path，撤销与清除共用 */
  function rebuildCommittedPath() {
    const rebuilt = Skia.Path.Make();

    strokesRef.current.forEach(stroke => {
      const path = Skia.Path.MakeFromSVGString(stroke);

      if (path) rebuilt.addPath(path);
    });

    committedPath.value = rebuilt;
    setHasInk(strokesRef.current.length > 0);
  }

  function handleClear() {
    strokesRef.current = [];
    activePath.value = Skia.Path.Make();
    rebuildCommittedPath();
    onClear?.();
  }

  function handleUndo() {
    if (strokesRef.current.length === 0) return;

    strokesRef.current.pop();
    rebuildCommittedPath();
  }

  async function captureImage() {
    if (strokesRef.current.length === 0) return '';

    // 异步快照不阻塞 JS 线程；画布还没上屏时 ref 为空，交给调用方按空串处理
    const snapshot = await canvasRef.current?.makeImageSnapshotAsync();

    if (!snapshot) return '';

    const format = type === 'jpeg' ? ImageFormat.JPEG : ImageFormat.PNG;

    return `data:image/${type};base64,${snapshot.encodeToBase64(format, quality ?? SIGNATURE_QUALITY_MAP[type])}`;
  }

  async function handleSubmit() {
    const isEmpty = strokesRef.current.length === 0;

    onSubmit?.({ image: await captureImage(), isEmpty });
  }

  /**
   * 绘制全程跑在 UI 线程：手势直接改写 shared value 里的 SkPath，Skia 自行重绘， 一帧都不经过 React。落笔与抬笔各跨回 JS 线程一次，只为维护撤销历史和对外回调。
   *
   * 每次都是 copy 出新对象再赋值，而不是就地改 `activePath.value`： shared value 靠重新赋值才通知订阅者，且就地改写正在被渲染的 path 会和绘制抢对象。
   */
  const panGesture = Gesture.Pan()
    .enabled(interactive)
    .minDistance(0)
    .maxPointers(1)
    .onBegin(e => {
      const path = Skia.Path.Make();

      path.moveTo(e.x, e.y);
      activePath.value = path;
      lastPoint.value = { x: e.x, y: e.y };
      scheduleOnRN(handleStrokeStart);
    })
    .onUpdate(e => {
      const previous = lastPoint.value;
      const dx = e.x - previous.x;
      const dy = e.y - previous.y;

      if (dx * dx + dy * dy < SIGNATURE_MIN_SAMPLE_DISTANCE * SIGNATURE_MIN_SAMPLE_DISTANCE) return;

      // 以上一个采样点为控制点、两点中位数为终点做二次贝塞尔，
      // 手写笔迹才是圆滑的曲线而不是一节节的折线
      const next = activePath.value.copy();

      next.quadTo(previous.x, previous.y, (previous.x + e.x) / 2, (previous.y + e.y) / 2);
      activePath.value = next;
      lastPoint.value = { x: e.x, y: e.y };

      if (notifiesSigning) scheduleOnRN(handleSigning);
    })
    .onFinalize(() => {
      const stroke = activePath.value.copy();

      // onFinalize 在手势根本没落下时也会走一遭，此时没有起笔点，直接跳过
      if (stroke.countPoints() === 0) return;

      if (stroke.countPoints() <= MOVE_ONLY_POINT_COUNT) {
        // 只有 moveTo，说明是点按而非划动，补一段极短线段让它落下一个圆点
        const origin = lastPoint.value;

        stroke.lineTo(origin.x + SIGNATURE_DOT_LENGTH, origin.y + SIGNATURE_DOT_LENGTH);
      } else {
        // 最后一段 quadTo 停在中位点上，补一笔到真正的抬手位置
        stroke.lineTo(lastPoint.value.x, lastPoint.value.y);
      }

      const merged = committedPath.value.copy();

      merged.addPath(stroke);
      committedPath.value = merged;
      activePath.value = Skia.Path.Make();
      scheduleOnRN(handleStrokeEnd, stroke.toSVGString());
    });

  useImperativeHandle(ref, () => ({
    clear: handleClear,
    submit: handleSubmit,
    toDataURL: captureImage,
    undo: handleUndo
  }));

  return (
    <View className={slotClassNames.root}>
      <GestureDetector gesture={panGesture}>
        <View className={slotClassNames.canvas}>
          <Canvas
            ref={canvasRef}
            style={StyleSheet.absoluteFill}
          >
            {canvasFill ? <Fill color={canvasFill} /> : null}
            <Path
              color={resolvedPenColor}
              path={committedPath}
              strokeCap="round"
              strokeJoin="round"
              strokeWidth={lineWidth}
              style="stroke"
            />
            <Path
              color={resolvedPenColor}
              path={activePath}
              strokeCap="round"
              strokeJoin="round"
              strokeWidth={lineWidth}
              style="stroke"
            />
          </Canvas>

          {!hasInk && tips ? (
            <View
              className={slotClassNames.tips}
              pointerEvents="none"
            >
              <Text className={slotClassNames.tipsText}>{tips}</Text>
            </View>
          ) : null}
        </View>
      </GestureDetector>

      {showFooter ? (
        <View className={slotClassNames.footer}>
          <Button
            className="flex-1"
            disabled={disabled}
            variant="outline"
            onPress={handleClear}
          >
            {clearButtonText}
          </Button>
          <Button
            className="flex-1"
            disabled={disabled}
            onPress={handleSubmit}
          >
            {confirmButtonText}
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export { Signature };
