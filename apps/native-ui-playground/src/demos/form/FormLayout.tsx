import { Form, FormItem, Input, useForm } from '@skyroc/native-ui';
import { View } from 'react-native';

interface LayoutForm {
  /** 收货地址 */
  address: string;
  /** 昵称 */
  nickname: string;
  /** 备注 */
  remark: string;
}

const FormLayout = () => {
  const [layoutForm] = useForm<LayoutForm>();

  return (
    <View className="bg-background p-4">
      <Form<LayoutForm> form={layoutForm}>
        {/* 长内容用 labelAlign="top"，标签压在输入区上方 */}
        <FormItem<LayoutForm>
          required
          description="送货上门时使用"
          label="收货地址"
          labelAlign="top"
          name="address"
          rules={[{ message: '请填写收货地址', required: true }]}
        >
          <Input
            placeholder="请输入详细地址"
            variant="none"
          />
        </FormItem>

        <FormItem<LayoutForm>
          label="昵称"
          labelWidth={72}
          name="nickname"
          size="sm"
        >
          <Input
            placeholder="小号行高"
            variant="none"
          />
        </FormItem>

        <FormItem<LayoutForm>
          label="备注"
          name="remark"
          size="lg"
        >
          <Input
            placeholder="大号行高"
            variant="none"
          />
        </FormItem>
      </Form>
    </View>
  );
};

export { FormLayout };
