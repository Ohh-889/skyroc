import { Input } from '@skyroc/native-ui';
import { View } from 'react-native';

const VARIANTS = ['outline', 'filled', 'underline', 'none'] as const;

const InputVariant = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {VARIANTS.map(v => (
        <Input
          key={v}
          placeholder={v}
          variant={v}
        />
      ))}
    </View>
  );
};

export { InputVariant };
