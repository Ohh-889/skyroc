import type { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

/** RN 的文本输入事件都带 nativeEvent，用它把原生事件和「回调直接给值」两种形态区分开 */
function isTextChangeEvent(value: any): value is NativeSyntheticEvent<TextInputChangeEventData> {
  return Boolean(value) && typeof value === 'object' && 'nativeEvent' in value;
}

/**
 * 从子组件的回调参数里取值。
 *
 * 本库的受控组件走 `onChange(value)` 的 RN 惯例，第一个参数就是值； 而 TextInput 的 onChange 给的是原生事件，值在 `nativeEvent.text`。 两种形态都在这里抹平，调用方不必为
 * Input 单独配 trigger / getValueFromEvent。
 *
 * 注意不能复用 core 的默认取值逻辑：那份实现读的是 `event.target[valuePropName]`， 属于 Web 的事件形状，RN 上 target 是节点句柄，取到的永远是 undefined。
 *
 * FieldItem 与 FormItem 都必须挂上它，否则字段收到的值恒为 undefined。
 */
export function getValueFromArgs(...args: any[]) {
  const [first] = args;

  if (isTextChangeEvent(first)) return first.nativeEvent.text;

  return first;
}
