import { Button, Pagination, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** Page + onPageChange 由外部持有页码；父级不更新 page 时组件也不会自己走 */
const PaginationControlled = () => {
  const [controlled, setControlled] = useState(3);

  return (
    <View className="gap-3 bg-background p-4">
      <Pagination
        itemsPerPage={10}
        page={controlled}
        totalItems={200}
        onPageChange={setControlled}
      />
      <Text color="muted">当前页：{controlled}</Text>
      <View className="flex-row gap-2">
        <Button
          color="primary"
          variant="outline"
          onPress={() => setControlled(1)}
        >
          回到首页
        </Button>
        <Button
          color="primary"
          variant="outline"
          onPress={() => setControlled(20)}
        >
          跳到末页
        </Button>
      </View>
    </View>
  );
};

export { PaginationControlled };
