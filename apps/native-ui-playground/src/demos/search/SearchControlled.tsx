import { Search, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SearchControlled = () => {
  const [controlled, setControlled] = useState('');
  const [submitted, setSubmitted] = useState('-');

  function handleSearch(value: string) {
    setSubmitted(value || '(空)');
  }

  return (
    <View className="bg-background py-2">
      <Search
        placeholder="输入后按键盘搜索键"
        value={controlled}
        onChangeText={setControlled}
        onSearch={handleSearch}
      />
      <Text className="px-4 pt-2 text-sm text-muted-foreground">当前值：{controlled || '(空)'}</Text>
      <Text className="px-4 text-sm text-muted-foreground">onSearch 收到：{submitted}</Text>
    </View>
  );
};

export { SearchControlled };
