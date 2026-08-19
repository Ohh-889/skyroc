import { Space, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SpaceWrap = () => {
  return (
    <View className="bg-background p-4">
      <Space wrap>
        {Array.from({ length: 10 }, (_, index) => (
          <View
            className="size-11 items-center justify-center rounded-xl bg-primary/10"
            key={index}
          >
            <Text className="text-sm font-medium text-primary">{index + 1}</Text>
          </View>
        ))}
      </Space>
    </View>
  );
};

export { SpaceWrap };
