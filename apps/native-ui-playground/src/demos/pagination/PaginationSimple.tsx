import { Pagination } from '@skyroc/native-ui';
import { View } from 'react-native';

/** Mode="simple" 只保留「当前页/总页数」，适合空间紧张的场景 */
const PaginationSimple = () => {
  return (
    <View className="bg-background p-4">
      <Pagination
        itemsPerPage={10}
        mode="simple"
        totalItems={95}
      />
    </View>
  );
};

export { PaginationSimple };
