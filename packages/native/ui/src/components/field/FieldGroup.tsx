import type { ElementType } from 'react';
import { View } from 'react-native';
import { Form as CoreForm } from '@skyroc/form';
import type { FieldGroupProps } from './types';

/** gap 值到 px 的映射（Tailwind 间距标准） */
const GAP_MAP: Record<number, number> = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40
};

/**
 * 字段组容器
 *
 * 基于 @skyroc/form 提供表单状态管理，使用 View + gap 纵向布局。
 * 与 Form（CellGroup 布局）平行，用于独立页面的字段编辑场景。
 *
 * @example
 * ```tsx
 * const [form] = useForm<{ password: string; confirm: string }>();
 *
 * <FieldGroup form={form} onFinish={handleSubmit}>
 *   <FieldItem name="password" label="密码" rules={[{ required: true }]}>
 *     <Input type="password" placeholder="请输入密码" />
 *   </FieldItem>
 *   <FieldItem name="confirm" label="确认密码">
 *     <Input type="password" placeholder="请再次输入" />
 *   </FieldItem>
 * </FieldGroup>
 *
 * // 使用 ScrollView 作为容器
 * <FieldGroup component={ScrollView} form={form}>
 *   ...
 * </FieldGroup>
 * ```
 */
const FieldGroup = <Values = any, As extends ElementType = typeof View>(props: FieldGroupProps<Values, As>) => {
  const { component = View, gap = 6, className, style, children, ...formProps } = props;

  const gapPx = GAP_MAP[gap] ?? gap * 4;

  return (
    <CoreForm<Values, ElementType>
      {...formProps}
      component={component}
      className={className}
      style={{ gap: gapPx, ...style }}
    >
      {children}
    </CoreForm>
  );
};

export { FieldGroup };
