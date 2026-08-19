import { FieldGroup, FieldItem, Input, Text, useForm } from '@skyroc/native-ui';
import { useState } from 'react';

interface TransformForm {
  /** 需要归一化的编码 */
  code: string;
  /** 原始别名 */
  name: string;
}

const FieldTransform = () => {
  const [form] = useForm<TransformForm>();
  const [values, setValues] = useState<TransformForm>({ code: 'AB12', name: 'skyroc' });

  return (
    <FieldGroup<TransformForm>
      className="bg-background p-4"
      form={form}
      gap={4}
      initialValues={values}
      onValuesChange={(_, allValues) => setValues(allValues)}
    >
      <FieldItem
        description="normalize 会移除空格并转成大写后再保存。"
        label="保存前归一化"
        name="code"
        normalize={value => String(value).replaceAll(' ', '').toUpperCase()}
        size="md"
      >
        <Input placeholder="例如 ab 12" />
      </FieldItem>

      <FieldItem
        description="getValueProps 只转换传给子组件的显示值。"
        getValueProps={value => String(value).toUpperCase()}
        label="显示值转换"
        name="name"
        size="md"
      >
        <Input />
      </FieldItem>

      <Text className="text-sm text-muted-foreground">
        表单原值：{values.code} / {values.name}
      </Text>
    </FieldGroup>
  );
};

export { FieldTransform };
