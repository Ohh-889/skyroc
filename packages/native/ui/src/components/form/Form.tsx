import { Form as CoreForm } from '@skyroc/form';
import type { Ref } from 'react';
import { CellGroup } from '../cell/CellGroup';
import type { FormProps } from './types';

/**
 * RN 表单容器
 *
 * 用 component={CellGroup} 把分组样式（分隔线 / 圆角 / 标题） 与 @skyroc/form 的状态管理、校验上下文合为一层渲染， 因此 CellGroup 的 border / inset / title
 * / classNames 在这里都能直接传。
 *
 * 需要自由布局（ScrollView 容器、自定义间距）时用 FieldGroup + FieldItem。
 *
 * @example
 * ```tsx
 * const [form] = useForm<{ name: string }>();
 *
 * <Form inset title="基本信息" form={form} onFinish={(values) => console.log(values)}>
 *   <FormItem name="name" label="姓名" required>
 *     <Input placeholder="请输入姓名" />
 *   </FormItem>
 * </Form>
 * ```
 */
const Form = <Values = any,>(props: FormProps<Values>) => {
  const { children, ref, ...rest } = props;

  return (
    <CoreForm<Values, typeof CellGroup>
      {...rest}
      component={CellGroup}
      // core 把 ref 声明成 Ref<As>（As 是容器组件类型本身），实际转发到的是容器实例，收敛成这一次断言
      ref={ref as Ref<typeof CellGroup>}
    >
      {children}
    </CoreForm>
  );
};

export { Form };
