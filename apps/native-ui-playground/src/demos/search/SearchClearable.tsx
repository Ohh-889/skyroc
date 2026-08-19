import { Search, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SearchClearable = () => {
  const [clearCount, setClearCount] = useState(0);

  function handleClear() {
    setClearCount(prev => prev + 1);
  }

  return (
    <View className="bg-background py-2">
      <Search
        defaultValue="可清除的关键词"
        onClear={handleClear}
      />
      <Search
        clearable={false}
        defaultValue="不显示清除按钮"
      />
      <Text className="px-4 pt-2 text-sm text-muted-foreground">onClear 触发次数：{clearCount}</Text>
    </View>
  );
};

export { SearchClearable };
