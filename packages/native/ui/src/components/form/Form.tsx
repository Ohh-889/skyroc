import { Form as CoreForm } from '@skyroc/form';
import { CellGroup } from '../cell/CellGroup';
import type { FormProps } from './types';

/**
 * RN 表单容器
 *
 * 使用 component={CellGroup} 将分组样式（分隔线 / 圆角 / 标题）
 * 与 @skyroc/form 状态管理 / 校验上下文合为一层渲染。
 *
 * @example
 * ```tsx
 * const [form] = useForm<{ name: string }>();
 *
 * <Form form={form} onFinish={(values) => console.log(values)}>
 *   <FormItem name="name" label="姓名" rules={[{ required: true }]}>
 *     <Input placeholder="请输入姓名" />
 *   </FormItem>
 *   <Button onPress={() => form.submit()}>提交</Button>
 * </Form>
 * ```
 */
const Form = <Values = any,>(props: FormProps<Values>) => {
  const { children, ...rest } = props;

  return (
    <CoreForm<Values, typeof CellGroup>
      {...rest}
      component={CellGroup}
    >
      {children}
    </CoreForm>
  );
};

export { Form };
