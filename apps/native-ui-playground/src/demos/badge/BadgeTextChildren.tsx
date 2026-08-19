import { Badge } from '@skyroc/native-ui';
import { View } from 'react-native';

const BadgeTextChildren = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-8 bg-background p-4">
      <Badge content={1}>消息</Badge>
      <Badge dot>动态</Badge>
      <Badge content="new">7</Badge>
    </View>
  );
};

export { BadgeTextChildren };
