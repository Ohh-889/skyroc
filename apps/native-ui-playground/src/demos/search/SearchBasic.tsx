import { Search } from '@skyroc/native-ui';
import { View } from 'react-native';

const SearchBasic = () => {
  return (
    <View className="bg-background py-2">
      <Search placeholder="搜索商品" />
    </View>
  );
};

export { SearchBasic };
