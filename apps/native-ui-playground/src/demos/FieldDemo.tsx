import { Button, FieldGroup, FieldItem, Input, Rate, Stepper, Text, useForm } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

interface ProfileForm {
  /** 每日运动时长（分钟） */
  duration: number;
  /** 登录密码 */
  password: string;
  /** 手机号 */
  phone: string;
  /** 满意度评分 */
  score: number;
}

const FieldDemo = () => {
  const [form] = useForm<ProfileForm>();

  const [submitted, setSubmitted] = useState('尚未提交');

  function handleFinish(values: ProfileForm) {
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
    <FieldGroup<ProfileForm, typeof ScrollView>
      className="flex-1 bg-background"
      component={ScrollView}
      contentContainerClassName="p-6 pb-20"
      form={form}
      initialValues={{ duration: 30, score: 4 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
    >
      <Text className="text-lg font-semibold">基础用法</Text>

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

      <Text className="mt-4 text-lg font-semibold">尺寸</Text>

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

      <View className="mt-4 flex-row gap-3">
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

export { FieldDemo };
