import { View } from 'react-native';
import type { AllPathsKeys } from '@skyroc/form';
import { ComputedField, useFieldError } from '@skyroc/form';
import { cn } from '@skyroc/utils';
import { Cell } from '../cell/Cell';
import { Text } from '../text/Typography';
import { formItemVariants } from './form-variants';
import type { FormComputedFieldProps } from './types';

/**
 * 计算字段组件
 *
 * 基于依赖字段自动计算值，使用 Cell 布局，渲染为只读状态。
 *
 * @example
 * ```tsx
 * <FormComputedField
 *   name="total"
 *   label="合计"
 *   deps={['price', 'quantity']}
 *   compute={(get) => (get('price') || 0) * (get('quantity') || 0)}
 * >
 *   <Input editable={false} />
 * </FormComputedField>
 * ```
 */
const FormComputedField = <Values = any,>(props: FormComputedFieldProps<Values>) => {
  const { children, classNames, description, label, name, required = false, size = 'md', ...rest } = props;

  const errors = useFieldError<Values, AllPathsKeys<Values>>(name);
  const hasError = errors.length > 0;

  const {
    description: descCls,
    label: labelCls,
    message: messageCls,
    required: requiredCls
  } = formItemVariants({ error: hasError, size });

  function renderLabel() {
    if (!label) return null;

    return (
      <View className="flex-row items-center w-30">
        {required ? <Text className={cn(requiredCls(), classNames?.required)}>*</Text> : null}
        <Text className={cn(labelCls(), classNames?.label)}>{label}</Text>
      </View>
    );
  }

  function renderExtra() {
    const errorText = hasError ? errors[0] : null;

    if (!errorText && !description) return null;

    return (
      <View>
        {errorText ? <Text className={cn(messageCls(), classNames?.message)}>{errorText}</Text> : null}
        {description ? <Text className={cn(descCls(), classNames?.description)}>{description}</Text> : null}
      </View>
    );
  }

  return (
    <Cell
      leading={renderLabel()}
      size={size}
      title={
        <View>
          <ComputedField<Values>
            {...rest}
            name={name}
          >
            {children}
          </ComputedField>
          {renderExtra()}
        </View>
      }
    />
  );
};

FormComputedField.displayName = 'FormComputedField';

export { FormComputedField };
