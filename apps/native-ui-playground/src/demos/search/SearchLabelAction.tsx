import Feather from '@expo/vector-icons/Feather';
import { Search, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，避免写死 hex */
const Icon = withUniwind(Feather);

const SearchLabelAction = () => {
  const [cancelCount, setCancelCount] = useState(0);

  function handleCancel() {
    setCancelCount(prev => prev + 1);
  }

  return (
    <View className="bg-background py-2">
      <Search
        showAction
        label="城市"
        placeholder="搜索地点"
        onCancel={handleCancel}
      />
      <Search
        showAction
        action={
          <Icon
            colorClassName="accent-primary"
            name="sliders"
            size={18}
          />
        }
        placeholder="action 传图标节点"
        shape="round"
        onCancel={handleCancel}
      />
      <Text className="px-4 pt-2 text-sm text-muted-foreground">onCancel 触发次数：{cancelCount}</Text>
    </View>
  );
};

export { SearchLabelAction };
