import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import { Cursor } from 'react-native-confirmation-code-field';
import { Text } from '../text/Typography';

interface PasswordInputCellProps {
  /** 格子容器 className，边框形态与状态色由外层的变体统一算好 */
  className: string;

  /** 掩码圆点 className */
  dotClassName: string;

  /** 是否为当前待输入的格子，用于渲染闪烁光标 */
  isFocused: boolean;

  /** 是否以圆点代替字符 */
  mask: boolean;

  /** 上报格子布局，供点击定位光标使用 */
  onLayout: (event: LayoutChangeEvent) => void;

  /** 该格子的字符，空串表示尚未输入 */
  symbol: string;

  /** 字符与光标的 className */
  symbolClassName: string;
}

/** 单个密码格子：只负责按 mask / 聚焦态渲染内容，样式一律由外层传入 */
const PasswordInputCell = (props: PasswordInputCellProps) => {
  const { className, dotClassName, isFocused, mask, onLayout, symbol, symbolClassName } = props;

  const hasSymbol = Boolean(symbol);

  return (
    <View
      className={className}
      onLayout={onLayout}
    >
      {hasSymbol && mask ? <View className={dotClassName} /> : null}
      {hasSymbol && !mask ? <Text className={symbolClassName}>{symbol}</Text> : null}
      {!hasSymbol && isFocused ? (
        <Text className={symbolClassName}>
          <Cursor />
        </Text>
      ) : null}
    </View>
  );
};

export { PasswordInputCell };
