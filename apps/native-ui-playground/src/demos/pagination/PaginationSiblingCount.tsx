import { Pagination, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIBLING_COUNTS = [0, 1, 2];

/** siblingCount 控制当前页左右各显示几个页码，0 表示只显示当前页 */
const PaginationSiblingCount = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {SIBLING_COUNTS.map(siblingCount => (
        <View
          key={siblingCount}
          className="gap-1"
        >
          <Text color="muted">siblingCount={siblingCount}</Text>
          <Pagination
            showEdges
            defaultPage={20}
            itemsPerPage={10}
            siblingCount={siblingCount}
            totalItems={500}
          />
        </View>
      ))}
    </View>
  );
};

export { PaginationSiblingCount };
