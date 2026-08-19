import { Search } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES = ['sm', 'md', 'lg'] as const;

const SearchSize = () => {
  return (
    <View className="bg-background py-2">
      {SIZES.map(size => (
        <Search
          key={size}
          placeholder={size}
          size={size}
        />
      ))}
    </View>
  );
};

export { SearchSize };
