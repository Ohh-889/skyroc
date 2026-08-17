import { View } from 'react-native';
import type { AllPathsKeys } from '@skyroc/form';
import { Field, useFieldError } from '@skyroc/form';
import { cn } from '@skyroc/utils';
import { Cell } from '../cell/Cell';
import { Text } from '../text/Typography';
import { formItemVariants } from './form-variants';
import type { FormItemProps } from './types';

/**
 * 表单字段组件
 *
 * 基于 Cell 布局 + @skyroc/form Field 数据收集，
 * 将 label / error / description 映射到 Cell 的插槽。
 *
 * @example
 * ```tsx
 * // 文本输入
 * <Form.Item name="phone" label="手机号" required rules={[{ required: true }]}>
 *   <Input placeholder="请输入手机号" />
 * </Form.Item>
 *
 * // 选择器（非输入也用 Form.Item 统一收集）
 * <Form.Item name="gender" label="性别" showArrow onPress={openPicker}>
 *   <Text>{genderLabel || '请选择'}</Text>
 * </Form.Item>
 * ```
 */
const FormItem = <Values = any,>(props: FormItemProps<Values>) => {
  const {
    arrowDirection,
    children,
    classNames,
    description,
    disabled = false,
    label,
    labelAlign = 'left',
    labelWidth = 120,
    name,
    onPress,
    required = false,
    showArrow,
    size = 'md',
    trailing,
    ...fieldProps
  } = props;

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
      <View
        className="flex-row items-center"
        style={labelAlign === 'left' ? { width: labelWidth } : undefined}
      >
        {required ? <Text className={cn(requiredCls(), classNames?.required)}>*</Text> : null}
        <Text className={cn(labelCls(), classNames?.label)}>{label}</Text>
      </View>
    );
  }

  function renderFieldContent() {
    return (
      <Field<Values>
        size={size}
        {...fieldProps}
        name={name}
      >
        {children}
      </Field>
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

  function renderHorizontalExtra() {
    const extra = renderExtra();

    if (!extra) return null;

    return (
      <View
        className={cn('px-4 pb-3.5', showArrow ? 'pr-8' : undefined)}
        style={label ? { paddingLeft: labelWidth + 28 } : undefined}
      >
        {extra}
      </View>
    );
  }

  if (labelAlign === 'top') {
    return (
      <Cell
        center={false}
        classNames={{ root: classNames?.root }}
        disabled={disabled}
        showArrow={showArrow}
        arrowDirection={arrowDirection}
        size={size}
        trailing={trailing}
        onPress={onPress}
        title={
          <View>
            {renderLabel()}
            <View className="mt-1">{renderFieldContent()}</View>
            {renderExtra()}
          </View>
        }
      />
    );
  }

  // 默认左右布局
  // 注意：无论 hasError / description 是否变化，根元素结构都保持稳定（始终 View > Cell）。
  // 否则根元素类型在 Cell / View 之间切换会导致 React 卸载并重建整棵子树
  // （含内部 TextInput），表现为校验出错后键盘消失、焦点丢失或跳到别的输入框。
  // 间距通过 Cell 的 className 条件切换实现：有 extra 时去掉底部内边距交给 extra 接管，
  // 无 extra 时保留 Cell 基于 size 的默认上下内边距（仅切换 className 不会触发重新挂载）。
  const hasExtra = hasError || !!description;

  return (
    <View className={cn('bg-background overflow-hidden', classNames?.root)}>
      <Cell
        classNames={{ root: hasExtra ? 'min-h-0 bg-transparent pb-0' : undefined }}
        disabled={disabled}
        leading={renderLabel()}
        showArrow={showArrow}
        arrowDirection={arrowDirection}
        size={size}
        trailing={trailing}
        onPress={onPress}
        title={renderFieldContent()}
      />
      {renderHorizontalExtra()}
    </View>
  );
};

export { FormItem };
