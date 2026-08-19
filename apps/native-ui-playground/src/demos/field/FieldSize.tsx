import { Button, FieldGroup, FieldItem, Rate, Stepper, Text, useForm } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

interface HabitForm {
  /** 每日运动时长（分钟） */
  duration: number;
  /** 满意度评分 */
  score: number;
}

const FieldSize = () => {
  const [form] = useForm<HabitForm>();

  const [submitted, setSubmitted] = useState('尚未提交');

  function handleFinish(values: HabitForm) {
    setSubmitted(JSON.stringify(values));
  }

  function handleReset() {
    form.resetFields();
    setSubmitted('尚未提交');
  }

  return (
    <FieldGroup<HabitForm>
      className="bg-background p-4"
      form={form}
      initialValues={{ duration: 30, score: 4 }}
      onFinish={handleFinish}
    >
      <FieldItem
        description="单位：分钟"
        label="每日运动时长"
        name="duration"
        size="sm"
      >
        <Stepper min={0} />
      </FieldItem>

      {/* 非文本控件不需要额外配置：onChange(value) 的第一个参数就是值 */}
      <FieldItem
        label="满意度"
        name="score"
        size="md"
      >
        <Rate />
      </FieldItem>

      <View className="flex-row gap-3">
        <Button
          className="flex-1"
          color="primary"
          variant="solid"
          onPress={() => form.submit()}
        >
          提交
        </Button>

        <Button
          className="flex-1"
          color="primary"
          variant="outline"
          onPress={handleReset}
        >
          重置
        </Button>
      </View>

      <Text color="muted">提交结果：{submitted}</Text>
    </FieldGroup>
  );
};

export { FieldSize };
