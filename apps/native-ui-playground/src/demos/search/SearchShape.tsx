import { Search } from '@skyroc/native-ui';
import { View } from 'react-native';

const SHAPES = ['square', 'round'] as const;

const SearchShape = () => {
  return (
    <View className="bg-background py-2">
      {SHAPES.map(shape => (
        <Search
          key={shape}
          placeholder={shape}
          shape={shape}
        />
      ))}
    </View>
  );
};

export { SearchShape };
