import { Form, FormItem, Input, Switch, useForm } from '@skyroc/native-ui';
import { View } from 'react-native';

interface AdapterFormValues {
  /** 自动转为大写的编号 */
  code: string;
  /** 是否启用 */
  enabled: boolean;
}

const FormValueAdapter = () => {
  const [form] = useForm<AdapterFormValues>();

  return (
    <View className="bg-background p-4">
      <Form<AdapterFormValues>
        form={form}
        initialValues={{ code: 'demo', enabled: true }}
      >
        <FormItem<AdapterFormValues>
          description="先过滤非字母数字字符，再统一转换为大写"
          getValueFromEvent={event => String(event.nativeEvent.text).replace(/[^a-z0-9]/gi, '')}
          label="编号"
          name="code"
          normalize={value => String(value).toUpperCase()}
        >
          <Input
            autoCapitalize="characters"
            placeholder="请输入编号"
            variant="none"
          />
        </FormItem>

        <FormItem<AdapterFormValues>
          classNames={{ control: 'items-end' }}
          label="启用"
          name="enabled"
          trigger="onCheckedChange"
          valuePropName="checked"
        >
          <Switch />
        </FormItem>
      </Form>
    </View>
  );
};

export { FormValueAdapter };
