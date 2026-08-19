import { Avatar, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 固定 seed，避免每次刷新拿到不同的示例图片 */
const FACES = ['https://picsum.photos/seed/av2/100', 'https://picsum.photos/seed/av3/100'];

const AvatarImageProps = () => {
  return (
    <View className="flex-row flex-wrap items-end gap-5 bg-background p-4">
      <View className="items-center gap-2">
        <Avatar
          imageProps={{ transition: 300 }}
          size="xl"
          src={FACES[0]}
        />
        <Text className="text-xs text-muted-foreground">transition=300</Text>
      </View>
      <View className="items-center gap-2">
        <Avatar
          imageProps={{ showLoading: true, transition: 500 }}
          size="xl"
          src={`${FACES[1]}?loading`}
        />
        <Text className="text-xs text-muted-foreground">showLoading</Text>
      </View>
    </View>
  );
};

export { AvatarImageProps };
