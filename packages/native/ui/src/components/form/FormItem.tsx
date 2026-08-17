import type { AllPathsKeys } from '@skyroc/form';
import { Field, useFieldError } from '@skyroc/form';
import { cn } from '@skyroc/utils';
import { View } from 'react-native';
import { Cell } from '../cell/Cell';
import { resolveRequiredRules } from '../field/field-rules';
import { getValueFromArgs } from '../field/field-value';
import { FieldExtra } from '../field/FieldExtra';
import { FieldLabel } from '../field/FieldLabel';
import { FORM_ITEM_EXTRA_INDENT, formItemVariants } from './form-variants';
import type { FormItemProps } from './types';

/**
 * 表单字段组件
 *
 * 基于 Cell 布局 + @skyroc/form Field 数据收集，把 label / error / description 映射到 Cell 的插槽。 与 FieldItem（纵向堆叠布局）平行，用于列表式的表单页面。
 *
 * 除了 value 与变更回调，还会向子组件注入 `error`（当前字段是否校验失败）， Input 这类支持 error 变体的组件因此能自动变红。
 *
 * @example
 * ```tsx
 * // 文本输入
 * <FormItem name="phone" label="手机号" required rules={[{ pattern: /^1\d{10}$/ }]}>
 *   <Input placeholder="请输入手机号" />
 * </FormItem>
 *
 * // 走 onChange(value) 的控件（RadioGroup / CheckboxGroup / Rate / Stepper）直接放进来即可
 * <FormItem name="gender" label="性别">
 *   <RadioGroup direction="horizontal">
 *     <Radio name="male">男</Radio>
 *     <Radio name="female">女</Radio>
 *   </RadioGroup>
 * </FormItem>
 *
 * // 弹层类控件（Picker / DatePicker）值由 onConfirm 回传，改 trigger 即可；
 * // 弹层的 show 由页面持有，整行点击负责打开
 * <FormItem name="city" label="所在城市" showArrow trigger="onConfirm" onPress={() => setShow(true)}>
 *   <Picker columns={CITIES} show={show} onUpdateShow={setShow}>
 *     {args => <Text>{resolveLabel(args.value)}</Text>}
 *   </Picker>
 * </FormItem>
 * ```
 */
const FormItem = <Values = any,>(props: FormItemProps<Values>) => {
  const {
    arrowDirection,
    children,
    className,
    classNames,
    description,
    disabled = false,
    getValueFromEvent = getValueFromArgs,
    label,
    labelAlign = 'left',
    labelWidth = 120,
    name,
    onPress,
    ref,
    required,
    rules,
    showArrow,
    size = 'md',
    trailing,
    ...fieldProps
  } = props;

  const errors = useFieldError<Values, AllPathsKeys<Values>>(name);

  const hasError = errors.length > 0;

  // 提示位只有一行，多条规则同时失败时先暴露第一条，改完再暴露下一条
  const errorText = hasError ? errors[0] : null;

  const hasExtra = hasError || Boolean(description);

  const { mergedRules, showRequired } = resolveRequiredRules(required, rules);

  // 左右布局下提示拆到 Cell 外面独占一行，Cell 因此要交出底部内边距；标签在上时提示跟着内容走，不需要
  const extraOutside = labelAlign === 'left' && hasExtra;

  // 与 Cell 内部同一套推导：可点击的行默认带箭头，提示行也要跟着让出箭头的位置
  const shouldShowArrow = showArrow ?? Boolean(onPress);

  const variantSlots = formItemVariants({ arrow: shouldShowArrow, error: hasError, extraOutside, size });

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

  function renderLabel() {
    return (
      <FieldLabel
        className={slotClassNames.labelRow}
        label={label}
        labelClassName={slotClassNames.label}
        required={showRequired}
        requiredClassName={slotClassNames.required}
        width={labelAlign === 'left' ? labelWidth : undefined}
      />
    );
  }

  function renderControl() {
    return (
      <Field<Values>
        {...fieldProps}
        error={hasError}
        getValueFromEvent={getValueFromEvent}
        name={name}
        rules={mergedRules}
      >
        {children}
      </Field>
    );
  }

  function renderExtra() {
    return (
      <FieldExtra
        className={slotClassNames.extra}
        description={description}
        descriptionClassName={slotClassNames.description}
        message={errorText}
        messageClassName={slotClassNames.message}
      />
    );
  }

  function renderCellTitle() {
    if (labelAlign === 'top') {
      return (
        <View>
          {renderLabel()}
          <View className="mt-1">{renderControl()}</View>
          {renderExtra()}
        </View>
      );
    }

    return renderControl();
  }

  // 注意：无论 hasError / description 是否变化，根元素结构都保持稳定（始终 View > Cell）。
  // 否则根元素类型在 Cell / View 之间切换会导致 React 卸载并重建整棵子树
  // （含内部 TextInput），表现为校验出错后键盘消失、焦点丢失或跳到别的输入框。
  // 间距通过 Cell 的 className 条件切换实现（extraOutside），仅切换 className 不会触发重新挂载。
  return (
    <View
      className={slotClassNames.root}
      ref={ref}
    >
      <Cell
        arrowDirection={arrowDirection}
        center={labelAlign === 'left'}
        classNames={{ content: slotClassNames.control, root: slotClassNames.cell }}
        disabled={disabled}
        leading={labelAlign === 'left' ? renderLabel() : undefined}
        showArrow={shouldShowArrow}
        size={size}
        title={renderCellTitle()}
        trailing={trailing}
        onPress={onPress}
      />

      {extraOutside ? (
        <View
          className={slotClassNames.extraRow}
          // 提示文案与输入区左对齐：标签列宽 + Cell 的内边距和标签间距，尺寸不同缩进不同
          style={label ? { paddingLeft: labelWidth + FORM_ITEM_EXTRA_INDENT[size] } : undefined}
        >
          {renderExtra()}
        </View>
      ) : null}
    </View>
  );
};

export { FormItem };
