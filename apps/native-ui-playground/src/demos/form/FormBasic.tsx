import { Button, Form, FormItem, Input, Text, useForm } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

interface BasicFormValues {
  /** 联系邮箱 */
  email: string;
  /** 昵称 */
  nickname: string;
}

const FormBasic = () => {
  const [result, setResult] = useState('尚未提交');

  const [form] = useForm<BasicFormValues>();

  function handleFinish(values: BasicFormValues) {
    setResult(`提交成功：${values.nickname} / ${values.email}`);
  }

  function handleFinishFailed() {
    setResult('校验未通过');
  }

  function handleReset() {
    form.resetFields();
    setResult('尚未提交');
  }

  return (
    <View className="gap-4 bg-background p-4">
      <Form<BasicFormValues>
        form={form}
        initialValues={{ nickname: '示例用户' }}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
      >
        <FormItem<BasicFormValues>
          label="昵称"
          name="nickname"
        >
          <Input
            placeholder="请输入昵称"
            variant="none"
          />
        </FormItem>

        <FormItem<BasicFormValues>
          description="提交时会校验邮箱格式"
          label="邮箱"
          name="email"
          rules={[{ message: '请输入正确的邮箱', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, required: true }]}
        >
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="name@example.com"
            variant="none"
          />
        </FormItem>
      </Form>

      <View className="flex-row gap-3">
        <Button
          className="flex-1"
          onPress={() => form.submit()}
        >
          提交
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          onPress={handleReset}
        >
          重置
        </Button>
      </View>

      <Text className="text-sm text-muted-foreground">{result}</Text>
    </View>
  );
};

export { FormBasic };
