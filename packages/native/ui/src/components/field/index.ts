// 表单实例由字段组件消费，从这里一并出口，调用方不必再直接依赖 @skyroc/form
export { useForm } from '@skyroc/form';
export type { FormInstance, Rule } from '@skyroc/form';
export { FIELD_GROUP_GAP_CLASS, fieldItemVariants } from './field-variants';
export type { FieldGroupGap, FieldItemVariantProps } from './field-variants';
export { FieldGroup } from './FieldGroup';
export { FieldItem } from './FieldItem';
export type {
  FieldGroupOwnProps,
  FieldGroupProps,
  FieldGroupSlots,
  FieldItemClassNames,
  FieldItemProps,
  FieldItemSlots
} from './types';
