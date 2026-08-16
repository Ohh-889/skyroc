import type { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { View } from 'react-native';
import type { AllPathsKeys, Rule } from '@skyroc/form';
import { Field, useFieldError } from '@skyroc/form';
import { cn } from '@skyroc/utils';
import { Text } from '../text/Typography';
import { fieldItemVariants } from './field-variants';
import type { FieldItemProps } from './types';

/** RN 的文本输入事件都带 nativeEvent，用它把原生事件和「回调直接给值」两种形态区分开 */
function isTextChangeEvent(value: any): value is NativeSyntheticEvent<TextInputChangeEventData> {
  return Boolean(value) && typeof value === 'object' && 'nativeEvent' in value;
}

/**
 * 从子组件的回调参数里取值。
 *
 * 本库的受控组件走 `onChange(value)` 的 RN 惯例，第一个参数就是值； 而 TextInput 的 onChange 给的是原生事件，值在 `nativeEvent.text`。
 * 两种形态都在这里抹平，调用方不必为 Input 单独配 trigger / getValueFromEvent。
 *
 * 注意不能复用 core 的默认取值逻辑：那份实现读的是 `event.target[valuePropName]`， 属于 Web 的事件形状，RN 上 target 是节点句柄，取到的永远是
 * undefined。
 */
function getValueFromArgs(...args: any[]) {
  const [first] = args;

  if (isTextChangeEvent(first)) return first.nativeEvent.text;

  return first;
}

/**
 * 独立字段组件
 *
 * 基于 @skyroc/form Field 数据收集 + 纵向堆叠布局（label / children / error / description）。 与 FormItem（Cell 布局）平行，用于独立页面的字段编辑场景。
 *
 * 除了 value 与变更回调，还会向子组件注入 `error`（当前字段是否校验失败）， Input 这类支持 error 变体的组件因此能自动变红。
 *
 * @example
 * ```tsx
 * <FieldItem name="password" label="输入新密码" required rules={[{ minLength: 6 }]}>
 *   <Input type="password" placeholder="请输入密码" />
 * </FieldItem>
 *
 * <FieldItem name="duration" label="运动时长" size="sm" description="单位：分钟">
 *   <Input placeholder="请输入" keyboardType="number-pad" />
 * </FieldItem>
 *
 * // 非文本控件同样不需要额外配置，onChange(value) 的第一个参数就是值
 * <FieldItem name="score" label="评分">
 *   <Rate />
 * </FieldItem>
 * ```
 */
const FieldItem = <Values = any,>(props: FieldItemProps<Values>) => {
  const {
    children,
    classNames,
    description,
    getValueFromEvent = getValueFromArgs,
    label,
    name,
    required,
    rules,
    size = 'lg',
    ...fieldProps
  } = props;

  const errors = useFieldError<Values, AllPathsKeys<Values>>(name);

  const hasError = errors.length > 0;

  // 必填标记与校验共用 rules 这一份事实：只写 rules 也能推出星号，只写 required 也能得到校验
  const requiredByRules = rules?.some(rule => rule.required) ?? false;
  const showRequired = required ?? requiredByRules;
  const mergedRules = required && !requiredByRules ? [{ required: true } as Rule, ...(rules ?? [])] : rules;

  const slots = fieldItemVariants({ hasLabel: Boolean(label), size });

  function renderLabel() {
    if (!label) return null;

    return (
      <View className="flex-row items-center">
        {showRequired ? <Text className={cn(slots.required(), classNames?.required)}>*</Text> : null}
        <Text className={cn(slots.label(), classNames?.label)}>{label}</Text>
      </View>
    );
  }

  function renderExtra() {
    // 提示位只有一行，多条规则同时失败时先暴露第一条，改完再暴露下一条
    const errorText = hasError ? errors[0] : null;

    if (!errorText && !description) return null;

    return (
      <View className={cn(slots.extra(), classNames?.extra)}>
        {errorText ? <Text className={cn(slots.message(), classNames?.message)}>{errorText}</Text> : null}
        {description ? <Text className={cn(slots.description(), classNames?.description)}>{description}</Text> : null}
      </View>
    );
  }

  return (
    <View className={cn(slots.root(), classNames?.root)}>
      {renderLabel()}

      <View className={cn(slots.control(), classNames?.control)}>
        <Field<Values>
          {...fieldProps}
          error={hasError}
          getValueFromEvent={getValueFromEvent}
          name={name}
          rules={mergedRules}
        >
          {children}
        </Field>
      </View>

      {renderExtra()}
    </View>
  );
};

export { FieldItem };
