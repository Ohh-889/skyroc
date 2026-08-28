import type { AllPathsKeys } from '@skyroc/form';
import { Field, useFieldError } from '@skyroc/form';
import { cn } from '@skyroc/utils';
import { View } from 'react-native';
import { resolveRequiredRules } from './field-rules';
import { getValueFromArgs } from './field-value';
import { fieldItemVariants } from './field-variants';
import { FieldExtra } from './FieldExtra';
import { FieldLabel } from './FieldLabel';
import type { FieldItemProps } from './types';

/**
 * 独立字段组件
 *
 * 基于 @skyroc/form Field 数据收集 + 纵向堆叠布局（label / children / error / description）。 与 FormItem（Cell 布局）平行，用于独立页面的字段编辑场景。
 *
 * 除了 value 与变更回调，还会向子组件注入 `error`（当前字段是否校验失败）， Input 这类支持 error 变体的组件因此能自动变红。
 *
 * @example
 *   ```tsx
 *   <FieldItem name="password" label="输入新密码" required rules={[{ minLength: 6 }]}>
 *   <Input type="password" placeholder="请输入密码" />
 *   </FieldItem>
 *
 *   <FieldItem name="duration" label="运动时长" size="sm" description="单位：分钟">
 *   <Input placeholder="请输入" keyboardType="number-pad" />
 *   </FieldItem>
 *
 *   // 非文本控件同样不需要额外配置，onChange(value) 的第一个参数就是值
 *   <FieldItem name="score" label="评分">
 *   <Rate />
 *   </FieldItem>
 *   ```;
 */
const FieldItem = <Values = any,>(props: FieldItemProps<Values>) => {
  const {
    children,
    className,
    classNames,
    description,
    getValueFromEvent = getValueFromArgs,
    label,
    name,
    ref,
    required,
    rules,
    size = 'lg',
    ...fieldProps
  } = props;

  const errors = useFieldError<Values, AllPathsKeys<Values>>(name);

  const hasError = errors.length > 0;

  // 提示位只有一行，多条规则同时失败时先暴露第一条，改完再暴露下一条
  const errorText = hasError ? errors[0] : null;

  const { mergedRules, showRequired } = resolveRequiredRules(required, rules);

  const variantSlots = fieldItemVariants({ hasLabel: Boolean(label), size });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      control: cn(variantSlots.control(), classNames?.control),
      description: cn(variantSlots.description(), classNames?.description),
      extra: cn(variantSlots.extra(), classNames?.extra),
      label: cn(variantSlots.label(), classNames?.label),
      labelRow: variantSlots.labelRow(),
      message: cn(variantSlots.message(), classNames?.message),
      required: cn(variantSlots.required(), classNames?.required),
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  return (
    <View
      className={slotClassNames.root}
      ref={ref}
    >
      <FieldLabel
        className={slotClassNames.labelRow}
        label={label}
        labelClassName={slotClassNames.label}
        required={showRequired}
        requiredClassName={slotClassNames.required}
      />

      <View className={slotClassNames.control}>
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

      <FieldExtra
        className={slotClassNames.extra}
        description={description}
        descriptionClassName={slotClassNames.description}
        message={errorText}
        messageClassName={slotClassNames.message}
      />
    </View>
  );
};

export { FieldItem };
