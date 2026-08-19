import Feather from '@expo/vector-icons/Feather';
import { Pagination } from '@skyroc/native-ui';
import { View } from 'react-native';

const PrevIcon = () => (
  <Feather
    color="#94a3b8"
    name="chevron-left"
    size={18}
  />
);

const NextIcon = () => (
  <Feather
    color="#94a3b8"
    name="chevron-right"
    size={18}
  />
);

/** prev / next 接受任意节点，传字符串会自动包裹 Text */
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
