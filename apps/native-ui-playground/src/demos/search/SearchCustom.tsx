import Feather from '@expo/vector-icons/Feather';
import { Search } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，避免写死 hex */
const Icon = withUniwind(Feather);

const SearchCustom = () => {
  return (
    <View className="bg-background py-2">
      <Search
        leading={
          <Icon
            colorClassName="accent-primary"
            name="map-pin"
            size={16}
          />
        }
        placeholder="替换默认放大镜"
      />
      <Search
        showAction
        classNames={{ actionText: 'text-destructive', label: 'text-primary font-semibold' }}
        label="标签"
        placeholder="classNames 覆盖 label / actionText"
      />
    </View>
  );
};

export { SearchCustom };
