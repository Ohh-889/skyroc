import { Badge } from '@skyroc/native-ui';
import { View } from 'react-native';

const BadgeStandalone = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <Badge content={12} />
      <Badge
        color="success"
        content="OK"
      />
      <Badge
        dot
        color="warning"
      />
      <Badge
        className="border-0"
        color="info"
        content={666}
      />
    </View>
  );
};

export { BadgeStandalone };
