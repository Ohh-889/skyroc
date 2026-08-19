import { FieldGroup, FieldItem, Switch, Text, useForm } from '@skyroc/native-ui';
import { useState } from 'react';

interface BindingForm {
  /** 开关是否启用 */
  enabled: boolean;
}

const FieldBinding = () => {
  const [form] = useForm<BindingForm>();
  const [enabled, setEnabled] = useState(true);

  return (
    <FieldGroup<BindingForm>
      className="bg-background p-4"
      form={form}
      initialValues={{ enabled }}
      onValuesChange={(_, values) => setEnabled(values.enabled)}
    >
      <FieldItem
        classNames={{ control: 'items-start' }}
        description="Switch 使用 checked 保存状态，并通过 onCheckedChange 更新。"
        label="自定义绑定"
        name="enabled"
        trigger="onCheckedChange"
        valuePropName="checked"
      >
        <Switch />
      </FieldItem>

      <Text className="text-sm text-muted-foreground">字段值：{enabled ? 'true' : 'false'}</Text>
    </FieldGroup>
  );
};

export { FieldBinding };
