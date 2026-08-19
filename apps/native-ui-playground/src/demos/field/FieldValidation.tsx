import { Button, FieldGroup, FieldItem, Input, Text, useForm } from '@skyroc/native-ui';
import { useState } from 'react';

interface ValidationForm {
  /** 联系邮箱 */
  email: string;
}

const FieldValidation = () => {
  const [form] = useForm<ValidationForm>();
  const [result, setResult] = useState('点击提交触发校验');

  function handleFinish(values: ValidationForm) {
    setResult(`校验通过：${values.email}`);
  }

  function handleFinishFailed() {
    setResult('校验未通过');
  }

  return (
    <FieldGroup<ValidationForm>
      className="bg-background p-4"
      form={form}
      gap={4}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
    >
      <FieldItem
        description="required 由 rules 推导，错误信息显示在描述上方。"
        label="联系邮箱"
        name="email"
        rules={[
          { message: '请输入邮箱地址', required: true },
          { message: '邮箱格式不正确', type: 'email' }
        ]}
        validateTrigger={false}
      >
        <Input placeholder="name@example.com" />
      </FieldItem>

      <Button onPress={() => form.submit()}>提交校验</Button>
      <Text className="text-sm text-muted-foreground">{result}</Text>
    </FieldGroup>
  );
};

export { FieldValidation };
