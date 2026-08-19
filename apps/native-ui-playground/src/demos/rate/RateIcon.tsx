import Ionicons from '@expo/vector-icons/Ionicons';
import { Rate } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

/** 与库内一致的取色方式：`accent-*` 工具类映射到矢量图标的 color 上 */
const HeartIcon = withUniwind(Ionicons);

const RateIcon = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Rate
        allowHalf
        color="destructive"
        defaultValue={3.5}
        icon={(_index, active) => (
          <HeartIcon
            colorClassName="accent-destructive"
            name={active ? 'heart' : 'heart-outline'}
            size={24}
          />
        )}
        voidIcon={
          <HeartIcon
            colorClassName="accent-muted-foreground"
            name="heart-outline"
            size={24}
          />
        }
      />
    </View>
  );
};

export { RateIcon };
