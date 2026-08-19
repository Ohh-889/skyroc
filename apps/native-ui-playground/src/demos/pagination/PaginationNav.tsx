import Feather from '@expo/vector-icons/Feather';
import { Pagination } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

/** Feather 不认 className，用 withUniwind 把语义色映射到 color 上 */
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

/** Prev / next 接受任意节点，传字符串会自动包裹 Text */
const PaginationNav = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Pagination
        itemsPerPage={10}
        next="下一页"
        prev="上一页"
        totalItems={95}
      />
      <Pagination
        itemsPerPage={10}
        next={<NextIcon />}
        prev={<PrevIcon />}
        totalItems={95}
      />
    </View>
  );
};

export { PaginationNav };
