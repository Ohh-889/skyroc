import { Input, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

/** None 变体不再强制右对齐，需要靠右时由调用方传 textAlign */
const InputInline = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row items-center rounded-lg border border-input px-3">
        <Text className="w-20">昵称</Text>
        <Input
          className="flex-1"
          placeholder="请输入昵称"
          variant="none"
        />
      </View>
      <View className="flex-row items-center rounded-lg border border-input px-3">
        <Text className="w-20">手机号</Text>
        <Input
          className="flex-1"
          keyboardType="number-pad"
          placeholder="请输入手机号"
          textAlign="right"
          variant="none"
        />
      </View>
    </View>
  );
};

export { InputInline };
