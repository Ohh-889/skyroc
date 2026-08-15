import { cn, isString } from '@skyroc/utils';
import { Children } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../text/Typography';
import { dividerVariants } from './divider-variants';
import type { DividerProps } from './types';

/** 分割线组件 */
const Divider = (props: DividerProps) => {
  const {
    align = 'center',
    border = 'solid',
    children,
    className,
    classNames,
    hairline = true,
    orientation = 'horizontal',
    ...rest
  } = props;

  const {
    line: lineCls,
    lineLeading: lineLeadingCls,
    lineTrailing: lineTrailingCls,
    root: rootCls,
    text: textCls
  } = dividerVariants({ align, border, orientation });

  const isHorizontal = orientation === 'horizontal';

  // Children.toArray 会过滤掉 null / undefined / boolean，避免 `{flag && '文字'}` 在 false 时把线切成两段
  const hasContent = Children.toArray(children).length > 0;

  /**
   * hairline 是 0.5/0.33dp，没有对应工具类只能落到 style；关掉时回落到类名里的 1dp，让 classNames.line 仍可改粗细。
   *
   * 只对实线生效：虚线/点线是用边框画的，iOS 上 1dp 以下的 dashed border 画不出来，只能固定 1dp。
   */
  function getLineStyle() {
    if (!hairline || border !== 'solid') return undefined;

    const thickness = StyleSheet.hairlineWidth;

    return isHorizontal ? { height: thickness } : { width: thickness };
  }

  const lineStyle = getLineStyle();

  /** edgeCls 只在有内容时传入，无内容的单条线不能被 align 的 10% 限制压扁 */
  function renderLine(edgeCls?: string, edgeClassName?: string) {
    return (
      <View
        className={cn(lineCls(), edgeCls, classNames?.line, edgeClassName)}
        style={lineStyle}
      />
    );
  }

  function renderContent() {
    if (isString(children)) {
      return <Text className={cn(textCls(), classNames?.text)}>{children}</Text>;
    }

    return children;
  }

  return (
    <View
      className={cn(rootCls(), className, classNames?.root)}
      role="separator"
      {...rest}
    >
      {hasContent ? (
        <>
          {renderLine(lineLeadingCls(), classNames?.lineLeading)}
          {renderContent()}
          {renderLine(lineTrailingCls(), classNames?.lineTrailing)}
        </>
      ) : (
        renderLine()
      )}
    </View>
  );
};

export { Divider };
