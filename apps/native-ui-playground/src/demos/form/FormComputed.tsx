import { Form, FormComputedField, FormItem, Input, Stepper, useForm } from '@skyroc/native-ui';
import { View } from 'react-native';

interface OrderForm {
  /** 单价 */
  price: string;
  /** 数量 */
  quantity: number;
  /** 合计金额，展示在 Input 里，因此存字符串 */
  total: string;
}

const FormComputed = () => {
  const [orderForm] = useForm<OrderForm>();

  return (
    <View className="bg-background p-4">
      <Form<OrderForm>
        form={orderForm}
        initialValues={{ price: '99', quantity: 1 }}
      >
        <FormItem<OrderForm>
          label="单价"
          name="price"
        >
          <Input
            keyboardType="decimal-pad"
            placeholder="请输入单价"
            variant="none"
          />
        </FormItem>

        <FormItem<OrderForm>
          label="数量"
          name="quantity"
        >
          <Stepper min={1} />
        </FormItem>

        {/* 合计由单价与数量推出，字段本身只读；RN 的 TextInput 只接受字符串，算完要转成字符串 */}
        <FormComputedField<OrderForm>
          deps={['price', 'quantity']}
          description="随单价与数量自动重算"
          label="合计"
          name="total"
          compute={get => (Number(get('price') || 0) * Number(get('quantity') || 0)).toFixed(2)}
        >
          <Input variant="none" />
        </FormComputedField>
      </Form>
    </View>
  );
};

export { FormComputed };
