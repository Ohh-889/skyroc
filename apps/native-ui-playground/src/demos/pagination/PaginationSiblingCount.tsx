import Feather from '@expo/vector-icons/Feather';
import { Pagination, Text } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

const SIBLING_COUNTS = [0, 1, 2];

/** 紧凑箭头让 siblingCount 的差异在窄屏内完整可见 */
const Icon = withUniwind(Feather);

const PrevIcon = () => (
  <Icon
    colorClassName="accent-primary"
    name="chevron-left"
    size={18}
  />
);

const NextIcon = () => (
  <Icon
    colorClassName="accent-primary"
    name="chevron-right"
    size={18}
  />
);

/** SiblingCount 控制当前页左右各显示几个页码，0 表示只显示当前页 */
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
            classNames={{
              content: 'gap-0.5',
              ellipsis: 'min-w-4',
              item: 'min-w-6 px-1',
              navButton: 'min-w-7 px-1'
            }}
            defaultPage={20}
            itemsPerPage={10}
            next={<NextIcon />}
            prev={<PrevIcon />}
            siblingCount={siblingCount}
            totalItems={500}
          />
        </View>
      ))}
    </View>
  );
};

export { PaginationSiblingCount };
