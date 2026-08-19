import { Search } from '@skyroc/native-ui';
import { View } from 'react-native';

const SearchDisabled = () => {
  return (
    <View className="bg-background py-2">
      <Search
        disabled
        defaultValue="不可编辑"
      />
    </View>
  );
};

export { SearchDisabled };
