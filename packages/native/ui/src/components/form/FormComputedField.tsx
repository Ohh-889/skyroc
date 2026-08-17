import type { AllPathsKeys } from '@skyroc/form';
import { ComputedField, useFieldError } from '@skyroc/form';
import { cn } from '@skyroc/utils';
import { View } from 'react-native';
import { Cell } from '../cell/Cell';
import { FieldExtra } from '../field/FieldExtra';
import { FieldLabel } from '../field/FieldLabel';
import { FORM_ITEM_EXTRA_INDENT, formItemVariants } from './form-variants';
import type { FormComputedFieldProps } from './types';

/**
 * 计算字段组件
 *
 * 基于依赖字段自动计算值，渲染为只读状态。 布局与 Form.Item 的左右布局完全一致（含 labelWidth），同一表单里两者的标签列才能对齐。
 *
 * 子组件是 Input 时 `compute` 要返回字符串 —— RN 的 TextInput 只接受字符串，返回数字不会显示。
 *
 * @example
 * ```tsx
 * <FormComputedField
 *   name="total"
 *   label="合计"
 *   deps={['price', 'quantity']}
 *   compute={(get) => (get('price') || 0) * (get('quantity') || 0)}
 * >
 *   <Input />
 * </FormComputedField>
 * ```
 */
const FormComputedField = <Values = any,>(props: FormComputedFieldProps<Values>) => {
  const {
    children,
    className,
    classNames,
    compute,
    deps,
    description,
    label,
    labelWidth = 120,
    name,
    preserve,
    ref,
    required = false,
    rules,
    size = 'md',
    valuePropName
  } = props;

  const errors = useFieldError<Values, AllPathsKeys<Values>>(name);

  const hasError = errors.length > 0;

  // 提示位只有一行，多条规则同时失败时先暴露第一条，改完再暴露下一条
  const errorText = hasError ? errors[0] : null;

  const hasExtra = hasError || Boolean(description);

  const variantSlots = formItemVariants({ error: hasError, extraOutside: hasExtra, size });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      cell: cn(variantSlots.cell(), classNames?.cell),
      control: cn(variantSlots.control(), classNames?.control),
      description: cn(variantSlots.description(), classNames?.description),
      extra: cn(variantSlots.extra(), classNames?.extra),
      extraRow: variantSlots.extraRow(),
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
      <Cell
        classNames={{ content: slotClassNames.control, root: slotClassNames.cell }}
        size={size}
        leading={
          <FieldLabel
            className={slotClassNames.labelRow}
            label={label}
            labelClassName={slotClassNames.label}
            required={required}
            requiredClassName={slotClassNames.required}
            width={labelWidth}
          />
        }
        title={
          <ComputedField<Values>
            compute={compute}
            deps={deps}
            name={name}
            preserve={preserve}
            rules={rules}
            valuePropName={valuePropName}
          >
            {children}
          </ComputedField>
        }
      />

      {hasExtra ? (
        <View
          className={slotClassNames.extraRow}
          // 提示文案与计算结果左对齐：标签列宽 + Cell 的内边距和标签间距，尺寸不同缩进不同
          style={label ? { paddingLeft: labelWidth + FORM_ITEM_EXTRA_INDENT[size] } : undefined}
        >
          <FieldExtra
            className={slotClassNames.extra}
            description={description}
            descriptionClassName={slotClassNames.description}
            message={errorText}
            messageClassName={slotClassNames.message}
          />
        </View>
      ) : null}
    </View>
  );
};

export { FormComputedField };
