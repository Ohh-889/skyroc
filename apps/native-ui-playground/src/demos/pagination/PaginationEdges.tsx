import { Pagination, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

/** showEdges 始终显示第一页与最后一页，中间用省略号折叠；折叠不足 2 页时不画省略号 */
const PaginationEdges = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Pagination
        showEdges
        defaultPage={1}
        itemsPerPage={10}
        totalItems={500}
      />
      <Pagination
        showEdges
        defaultPage={25}
        itemsPerPage={10}
        totalItems={500}
      />
      <Pagination
        showEdges
        defaultPage={50}
        itemsPerPage={10}
        totalItems={500}
      />
      <Text color="muted">总页数塞得下时（这里只有 6 页）一个省略号都不出现</Text>
      <Pagination
        showEdges
        defaultPage={3}
        itemsPerPage={10}
        totalItems={60}
      />
    </View>
  );
};

export { PaginationEdges };
