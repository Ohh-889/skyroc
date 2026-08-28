'use client';

import { Button, Form, FormComputedField, FormField, Input, useForm } from '@skyroc/web-ui';

interface FormValues {
  price: number;
  quantity: number;
  total: number;
}

const ComputedDemo = () => {
  const [form] = useForm<FormValues>();

  function getValue() {
    const value = form.getFieldValue('total');

    console.log('value', value);
  }

  return (
    <Form
      className="w-[480px] space-y-4 max-sm:w-full"
      form={form}
    >
      <FormField
        label="Price"
        name="price"
      >
        <Input placeholder="please input price" />
      </FormField>

      <FormField
        label="Quantity"
        name="quantity"
      >
        <Input placeholder="please input quantity" />
      </FormField>

      <FormComputedField
        deps={['price', 'quantity']}
        label="Total"
        name="total"
        compute={get => {
          return Number(get('price')) * Number(get('quantity')) || 0;
        }}
      >
        <Input placeholder="auto compute total" />
      </FormComputedField>

      <Button
        type="button"
        onClick={getValue}
      >
        Get Value
      </Button>
    </Form>
  );
};

export default ComputedDemo;
