import { Form, FormItem, Input, Text, useForm } from '@skyroc/native-ui';
import { View } from 'react-native';

interface InteractionFormValues {
  /** 禁用字段 */
  locked: string;
  /** 可选项 */
  option: string;
}

const FormInteraction = () => {
  const [form] = useForm<InteractionFormValues>();

  function handleOptionPress() {
    const current = form.getFieldValue('option');

    form.setFieldValue('option', current === '选项 A' ? '选项 B' : '选项 A');
  }

  return (
    <View className="bg-background p-4">
      <Form<InteractionFormValues>
        form={form}
        initialValues={{ locked: '不可修改', option: '选项 A' }}
      >
        <FormItem<InteractionFormValues>
          showArrow
          arrowDirection="down"
          label="整行点击"
          name="option"
          onPress={handleOptionPress}
        >
          <Input
            readOnly
            variant="none"
          />
        </FormItem>

        <FormItem<InteractionFormValues>
          disabled
          label="禁用字段"
          name="locked"
          trailing={<Text className="text-sm text-muted-foreground">disabled</Text>}
        >
          <Input
            readOnly
            variant="none"
          />
        </FormItem>
      </Form>
    </View>
  );
};

export { FormInteraction };
