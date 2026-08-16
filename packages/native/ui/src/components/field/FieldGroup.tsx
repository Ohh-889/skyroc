import type { ElementType } from 'react';
import { View } from 'react-native';
import type { FormProps } from '@skyroc/form';
import { Form as CoreForm } from '@skyroc/form';
import { cn } from '@skyroc/utils';
import { FIELD_GROUP_GAP_CLASS } from './field-variants';
import type { FieldGroupProps } from './types';

/**
 * 字段组容器
 *
 * 基于 @skyroc/form 提供表单状态管理，容器组件默认 View，子项间距由内容容器统一给出。 与 Form（CellGroup 布局）平行，用于独立页面的字段编辑场景。
 *
 * @example
 * ```tsx
 * const [form] = useForm<{ password: string; confirm: string }>();
 *
 * <FieldGroup form={form} onFinish={handleSubmit}>
 *   <FieldItem name="password" label="密码" required>
 *     <Input type="password" placeholder="请输入密码" />
 *   </FieldItem>
 *   <FieldItem name="confirm" label="确认密码">
 *     <Input type="password" placeholder="请再次输入" />
 *   </FieldItem>
 * </FieldGroup>
 *
 * // 使用 ScrollView 作为容器，ScrollView 自身的属性照常传
 * <FieldGroup
 *   component={ScrollView}
 *   contentContainerClassName="p-6"
 *   form={form}
 *   keyboardShouldPersistTaps="handled"
 * >
 *   ...
 * </FieldGroup>
 * ```
 */
const FieldGroup = <Values = any, As extends ElementType = typeof View>(props: FieldGroupProps<Values, As>) => {
  const { children, className, classNames, component, gap = 6, ...formProps } = props;

  // As 是调用方给的多态参数，泛型层面没法向 CoreForm 证明 className 对它合法，收敛成这一次断言
  const formPropsWithContainer = {
    ...formProps,
    className: cn(className, classNames?.root),
    component: component ?? View
  } as FormProps<Values, ElementType>;

  return (
    <CoreForm<Values, ElementType> {...formPropsWithContainer}>
      {/* 间距挂在内容容器上而不是根节点：component 传 ScrollView 时根节点的样式作用于滚动视图本身，gap 落不到子项上 */}
      <View className={cn(FIELD_GROUP_GAP_CLASS[gap], classNames?.content)}>{children}</View>
    </CoreForm>
  );
};

export { FieldGroup };
