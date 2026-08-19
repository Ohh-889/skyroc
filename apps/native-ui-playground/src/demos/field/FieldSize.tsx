import { FieldGroup, FieldItem, Input, useForm } from '@skyroc/native-ui';

interface SizeForm {
  /** 大尺寸字段 */
  large: string;
  /** 中尺寸字段 */
  medium: string;
  /** 小尺寸字段 */
  small: string;
}

const FieldSize = () => {
  const [form] = useForm<SizeForm>();

  return (
    <FieldGroup<SizeForm>
      className="bg-background p-4"
      form={form}
      gap={4}
    >
      <FieldItem
        description="紧凑标签与辅助文字"
        label="小尺寸"
        name="small"
        size="sm"
      >
        <Input
          placeholder="size=sm"
          size="sm"
        />
      </FieldItem>

      <FieldItem
        description="适合常规信息录入"
        label="中尺寸"
        name="medium"
        size="md"
      >
        <Input placeholder="size=md" />
      </FieldItem>

      <FieldItem
        description="默认尺寸，标签与提示最醒目"
        label="大尺寸"
        name="large"
        size="lg"
      >
        <Input
          placeholder="size=lg"
          size="lg"
        />
      </FieldItem>
    </FieldGroup>
  );
};

export { FieldSize };
