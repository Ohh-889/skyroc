// 表单实例、校验类型与订阅 hooks 由本模块统一出口，调用方不必再直接依赖 @skyroc/form
export {
  List as FormList,
  useArrayField,
  useEffectField,
  useFieldError,
  useFieldState,
  useForm,
  useSelector,
  useUndoRedo,
  useWatch
} from '@skyroc/form';

export type {
  Action as FormAction,
  AllPathsKeys,
  FormInstance,
  ListProps as FormListProps,
  Meta,
  Rule,
  SubscribeMaskOptions,
  ValidateErrorEntity,
  ValidateMessages
} from '@skyroc/form';

export { Form } from './Form';
export { FORM_ITEM_EXTRA_INDENT, formItemVariants } from './form-variants';
export type { FormItemVariantProps } from './form-variants';
export { FormComputedField } from './FormComputedField';
export { FormItem } from './FormItem';

export type { FormComputedFieldProps, FormItemClassNames, FormItemProps, FormItemSlots, FormProps } from './types';
