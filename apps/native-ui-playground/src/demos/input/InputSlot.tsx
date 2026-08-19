import Feather from '@expo/vector-icons/Feather';
import { Input, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SearchIcon = (
  <Feather
    color="#94a3b8"
    name="search"
    size={18}
  />
);

/** trailing 与密码按钮共存且排在其后 */
const InputSlot = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Input
        leading={SearchIcon}
        placeholder="搜索"
      />
      <Input
        placeholder="带单位"
        trailing={<Text className="text-muted-foreground">元</Text>}
      />
      <Input
        leading={SearchIcon}
        placeholder="password + trailing 同时存在"
        trailing={<Text className="text-muted-foreground">GO</Text>}
        type="password"
      />
    </View>
  );
};

export { InputSlot };
