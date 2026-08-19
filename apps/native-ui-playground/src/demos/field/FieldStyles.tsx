import { FieldGroup, FieldItem, Input } from '@skyroc/native-ui';

const FieldStyles = () => {
  return (
    <FieldGroup
      className="bg-background p-4"
      classNames={{ content: 'rounded-xl bg-primary/5 p-4' }}
      gap={4}
    >
      <FieldItem
        required
        className="rounded-xl border border-primary/20 bg-background p-3"
        classNames={{ description: 'text-primary', label: 'text-primary', required: 'text-warning' }}
        description="root、label、required 与 description 分别覆盖。"
        label="自定义字段"
        name="styled"
      >
        <Input placeholder="FieldItem classNames" />
      </FieldItem>
    </FieldGroup>
  );
};

export { FieldStyles };
