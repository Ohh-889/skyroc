import { Search, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SearchUncontrolled = () => {
  const [submitted, setSubmitted] = useState('-');

  function handleSearch(value: string) {
    setSubmitted(value || '(空)');
  }

  return (
    <View className="bg-background py-2">
      {/* 值由 Input 内部托管，onSearch 取的是提交事件里的文本，同样拿得到 */}
      <Search
        defaultValue="非受控默认值"
        placeholder="改一改再按搜索键"
        onSearch={handleSearch}
      />
      <Text className="px-4 pt-2 text-sm text-muted-foreground">onSearch 收到：{submitted}</Text>
    </View>
  );
};

export { SearchUncontrolled };
