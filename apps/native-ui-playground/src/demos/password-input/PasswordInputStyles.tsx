import { PasswordInput } from '@skyroc/native-ui';
import { View } from 'react-native';

/** className 落在 root，classNames 逐槽覆盖 */
const PasswordInputStyles = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <PasswordInput
        classNames={{ security: 'border-success rounded-none' }}
        defaultValue="12"
      />
      <PasswordInput
        classNames={{ cell: 'bg-secondary', dot: 'bg-primary' }}
        defaultValue="123"
      />
      <PasswordInput
        classNames={{ symbol: 'text-primary font-semibold' }}
        defaultValue="12"
        mask={false}
        variant="separated"
      />
    </View>
  );
};

export { PasswordInputStyles };
