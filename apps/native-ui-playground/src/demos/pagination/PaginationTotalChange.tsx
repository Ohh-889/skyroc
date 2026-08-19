import { Button, Pagination, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 改筛选条件让总数变小、当前页越界时，组件只把显示值夹回合法区间，不会擅自回写外部状态 */
const PaginationTotalChange = () => {
  const [page, setPage] = useState(3);
  const [total, setTotal] = useState(200);

  return (
    <View className="gap-3 bg-background p-4">
      <Pagination
        itemsPerPage={10}
        page={page}
        totalItems={total}
        onPageChange={setPage}
      />
      <Text color="muted">
        totalItems={total}，外部持有的 page={page}
      </Text>
      <View className="flex-row gap-2">
        <Button
          color="primary"
          variant="outline"
          onPress={() => setTotal(200)}
        >
          200 条
        </Button>
        <Button
          color="primary"
          variant="outline"
          onPress={() => setTotal(30)}
        >
          30 条
        </Button>
        <Button
          color="primary"
          variant="outline"
          onPress={() => setTotal(0)}
        >
          空数据
        </Button>
      </View>
    </View>
  );
};

export { PaginationTotalChange };
