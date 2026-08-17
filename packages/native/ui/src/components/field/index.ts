// @skyroc/form 的表单实例与校验类型统一由 form 模块出口（见 components/form/index.ts），此处不再重复导出
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
