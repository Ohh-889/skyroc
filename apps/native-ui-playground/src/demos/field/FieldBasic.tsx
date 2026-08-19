import { Button, FieldGroup, FieldItem, Input, Text, useForm } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

interface LoginForm {
  /** 登录密码 */
  password: string;
  /** 手机号 */
  phone: string;
}

const FieldBasic = () => {
  const [form] = useForm<LoginForm>();

  const [submitted, setSubmitted] = useState('尚未提交');

  function handleFinish(values: LoginForm) {
    setSubmitted(JSON.stringify(values));
  }

  function handleFinishFailed() {
    setSubmitted('校验未通过');
  }

  function handleReset() {
    form.resetFields();
    setSubmitted('尚未提交');
  }

  return (
    <FieldGroup<LoginForm>
      className="bg-background p-4"
      form={form}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
    >
      {/* required 只写一次：星号与校验规则同源 */}
      <FieldItem
        required
        label="手机号"
        name="phone"
        rules={[{ message: '请输入 11 位手机号', pattern: /^1\d{10}$/ }]}
      >
        <Input
          keyboardType="number-pad"
          placeholder="请输入手机号"
        />
      </FieldItem>

      {/* 校验失败时 error 会注入到 Input，边框同步变红 */}
      <FieldItem
        required
        description="至少 6 位，区分大小写"
        label="登录密码"
        name="password"
        rules={[{ message: '密码至少 6 位', minLength: 6 }]}
      >
        <Input
          placeholder="请输入密码"
          type="password"
        />
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

export { FieldBasic };
