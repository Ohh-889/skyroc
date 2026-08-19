import { Input } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES = ['sm', 'md', 'lg'] as const;

const InputSize = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {SIZES.map(s => (
        <Input
          key={s}
          placeholder={s}
          size={s}
        />
      ))}
    </View>
  );
};

export { InputSize };
