import Ionicons from '@expo/vector-icons/Ionicons';
import { Switch, Text } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

/** 与库内一致的取色方式：`accent-*` 工具类映射到矢量图标的 color 上 */
const ThumbIcon = withUniwind(Ionicons);

const SwitchThumb = () => {
  return (
    <View className="flex-row items-center gap-3 bg-background p-4">
      <Switch
        defaultChecked
        size="2xl"
      >
        <ThumbIcon
          colorClassName="accent-primary"
          name="checkmark"
          size={14}
        />
      </Switch>
      <Switch size="2xl">
        <Text className="text-[10px] text-muted-foreground">off</Text>
      </Switch>
    </View>
  );
};

export { SwitchThumb };
