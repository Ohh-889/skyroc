import { Form, FormItem, Input, useForm } from '@skyroc/native-ui';
import { View } from 'react-native';

interface StylesFormValues {
  /** 示例值 */
  value: string;
}

const FormStyles = () => {
  const [form] = useForm<StylesFormValues>();

  return (
    <View className="bg-muted p-4">
      <Form<StylesFormValues>
        inset
        form={form}
        initialValues={{ value: '可覆盖各个 slot' }}
        title="自定义分组标题"
        classNames={{ divider: 'bg-primary/20', root: 'border border-primary/30', title: 'text-primary' }}
      >
        <FormItem<StylesFormValues>
          className="bg-primary/5"
          classNames={{ description: 'text-info', label: 'font-semibold text-primary' }}
          description="FormItem 支持 root、label、description 等 slot"
          label="样式"
          name="value"
        >
          <Input variant="none" />
        </FormItem>
      </Form>
    </View>
  );
};

export { FormStyles };
