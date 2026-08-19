import { Checkbox, CheckboxCard } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxStyles = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox
        className="rounded-lg bg-muted p-3"
        defaultChecked
      >
        className 作用于根容器
      </Checkbox>

      <Checkbox
        defaultChecked
        shape="square"
        classNames={{
          indicator: 'border-2 border-primary',
          indicatorIcon: 'accent-warning',
          label: 'font-semibold text-primary',
          root: 'rounded-lg border border-primary p-3'
        }}
      >
        classNames 按 slot 覆盖
      </Checkbox>

      <CheckboxCard
        defaultChecked
        description="卡片的 slot 同样可以逐个覆盖"
        label="CheckboxCard"
        classNames={{
          description: 'text-primary/70',
          label: 'text-base text-primary',
          root: 'border-primary bg-primary/5'
        }}
      />
    </View>
  );
};

export { CheckboxStyles };
