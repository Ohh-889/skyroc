import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { useImperativeHandle } from 'react';
import { View } from 'react-native';
import { Text } from '../text/Typography';
import type { TextEllipsisProps } from './types';
import { useTextEllipsis } from './use-text-ellipsis';

const TextEllipsis = (props: TextEllipsisProps) => {
  const {
    className,
    classNames,
    collapseText = '',
    color,
    content,
    defaultExpanded = false,
    dots = '...',
    expanded: expandedProp,
    expandText = '',
    onExpandedChange,
    ref,
    rows = 1,
    size,
    style,
    weight,
    ...rest
  } = props;

  const [expanded, setExpanded] = useControllableState({
    caller: 'TextEllipsis',
    defaultProp: defaultExpanded,
    onChange: onExpandedChange,
    prop: expandedProp
  });

  const measure = useTextEllipsis({
    content,
    // 省略号与收起态操作文本都要占掉正文的位置，字号字重同理，变化后必须重新二分
    layoutKey: [classNames?.text, dots, expandText, size, weight].join('|'),
    rows,
    sliceable: Boolean(expandText)
  });

  useImperativeHandle(ref, () => ({
    toggle: (value?: boolean) => {
      setExpanded(prev => value ?? !prev);
    }
  }));

  const actionText = expanded ? collapseText : expandText;

  /** Slot 级与根级覆盖合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    // 优先级：兜底样式 < slot 级覆盖（classNames）< 根级覆盖（className）
    return {
      action: cn('text-primary', classNames?.action),
      root: cn(classNames?.root, className),
      text: cn(classNames?.text)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function handleAction() {
    setExpanded(prev => !prev);
  }

  /** 操作文本嵌在正文的 Text 里，才能跟在省略号后面而不是另起一行 */
  function renderAction(text: string) {
    if (!text) return null;

    return (
      <Text
        className={slotClassNames.action}
        onPress={handleAction}
      >
        {text}
      </Text>
    );
  }

  /** 收起态优先渲染二分测出的裁剪结果；测量完成前先交给原生尾部省略号，避免空白闪烁 */
  function renderContent() {
    if (expanded) {
      return (
        <>
          {content}
          {renderAction(actionText)}
        </>
      );
    }

    if (measure.slicedContent === null) return content;

    return (
      <>
        {measure.slicedContent}
        {dots}
        {renderAction(actionText)}
      </>
    );
  }

  /** 量的始终是收起态的排版，因此固定用 expandText，与当前是否展开无关 */
  function renderProbe() {
    if (measure.phase === 'full') return content;

    return (
      <>
        {measure.probeContent}
        {dots}
        {renderAction(expandText)}
      </>
    );
  }

  return (
    <View className={slotClassNames.root}>
      <Text
        className={slotClassNames.text}
        color={color}
        numberOfLines={expanded ? undefined : rows}
        size={size}
        style={style}
        weight={weight}
        {...rest}
      >
        {renderContent()}
      </Text>

      {measure.phase === 'settled' ? null : (
        <View
          aria-hidden
          className="absolute inset-x-0 top-0 opacity-0"
          pointerEvents="none"
        >
          {/* 不设 numberOfLines 才量得到真实行数；影响排版的 props 必须与正文保持一致 */}
          <Text
            className={slotClassNames.text}
            color={color}
            onTextLayout={measure.handleMeasure}
            size={size}
            style={style}
            weight={weight}
          >
            {renderProbe()}
          </Text>
        </View>
      )}
    </View>
  );
};

export { TextEllipsis };
