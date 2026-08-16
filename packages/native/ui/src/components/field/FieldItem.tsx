import { View } from 'react-native';
import type { AllPathsKeys } from '@skyroc/form';
import { Field, useFieldError } from '@skyroc/form';
import { cn } from '@skyroc/utils';
import { Text } from '../text/Typography';
import { fieldItemVariants } from './field-variants';
import type { FieldItemProps } from './types';

/**
 * 独立字段组件
 *
 * 基于 @skyroc/form Field 数据收集 + 纵向堆叠布局（label / children / error / description）。
 * 与 FormItem（Cell 布局）平行，用于独立页面的字段编辑场景。
 *
 * @example
 * ```tsx
 * <FieldItem name="password" label="输入新密码" rules={[{ required: true }]}>
 *   <Input type="password" placeholder="请输入密码" />
 * </FieldItem>
 *
 * <FieldItem name="duration" label="运动时长" size="sm" description="单位：分钟">
 *   <Input placeholder="请输入" keyboardType="number-pad" />
 * </FieldItem>
 * ```
 */
const FieldItem = <Values = any,>(props: FieldItemProps<Values>) => {
  const { children, classNames, description, label, name, required = false, size = 'lg', ...fieldProps } = props;

  const errors = useFieldError<Values, AllPathsKeys<Values>>(name);
  const hasError = errors.length > 0;

  const slots = fieldItemVariants({ size });

  function renderLabel() {
    if (!label) return null;

    return (
      <View className="flex-row items-center">
        {required ? <Text className={cn(slots.required(), classNames?.required)}>*</Text> : null}
        <Text className={cn(slots.label(), classNames?.label)}>{label}</Text>
      </View>
    );
  }

  function renderExtra() {
    const errorText = hasError ? errors[0] : null;

    if (!errorText && !description) return null;

    return (
      <View>
        {errorText ? <Text className={cn(slots.message(), classNames?.message)}>{errorText}</Text> : null}
        {description ? <Text className={cn(slots.description(), classNames?.description)}>{description}</Text> : null}
      </View>
    );
  }

  return (
    <View className={cn(slots.root(), classNames?.root)}>
      {renderLabel()}

      <View className={label ? 'mt-2' : undefined}>
        <Field<Values>
          size={size}
          {...fieldProps}
          name={name}
        >
          {children}
        </Field>
      </View>

      {renderExtra()}
    </View>
  );
};

export { FieldItem };
