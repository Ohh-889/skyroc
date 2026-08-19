import { PasswordInput } from '@skyroc/native-ui';
import { View } from 'react-native';

const PasswordInputLength = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <PasswordInput
        length={4}
        variant="separated"
      />
      <PasswordInput length={8} />
    </View>
  );
};

export { PasswordInputLength };
