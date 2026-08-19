import { FieldGroup, FieldItem, Rate, Stepper, Text, useForm } from '@skyroc/native-ui';
import { useState } from 'react';

interface ControlsForm {
  /** 数量 */
  quantity: number;
  /** 评分 */
  score: number;
}

const FieldControls = () => {
  const [form] = useForm<ControlsForm>();
  const [values, setValues] = useState<ControlsForm>({ quantity: 2, score: 3 });

  return (
    <FieldGroup<ControlsForm>
      className="bg-background p-4"
      form={form}
      gap={4}
      initialValues={values}
      onValuesChange={(_, allValues) => setValues(allValues)}
    >
      <FieldItem
        description="Stepper 通过 onChange(value) 直接收集数值。"
        label="数量"
        name="quantity"
        size="md"
      >
        <Stepper min={0} />
      </FieldItem>

      <FieldItem
        description="Rate 同样使用默认 value / onChange 约定。"
        label="评分"
        name="score"
        size="md"
      >
        <Rate />
      </FieldItem>

      <Text className="text-sm text-muted-foreground">
        当前值：数量 {values.quantity}，评分 {values.score}
      </Text>
    </FieldGroup>
  );
};

export { FieldControls };
