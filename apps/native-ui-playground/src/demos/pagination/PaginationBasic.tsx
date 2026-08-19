import { Pagination } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 总页数由 totalItems / itemsPerPage 推出，默认显示当前页左右各 1 个兄弟页码 */
const PaginationBasic = () => {
  return (
    <View className="bg-background p-4">
      <Pagination
        itemsPerPage={10}
        totalItems={95}
      />
    </View>
  );
};

export { PaginationBasic };
