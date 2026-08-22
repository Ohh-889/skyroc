import Ionicons from '@expo/vector-icons/Ionicons';
import { FloatingButton, Text } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

const Icon = withUniwind(Ionicons);

/** 开发期悬浮入口，点一下跳到 expo-router 自动生成的 `/_sitemap`，生产包里直接不渲染 */
const DevFloatingButton = () => {
  const router = useRouter();

  if (!__DEV__) {
    return null;
  }

  function handlePress() {
    router.push('/_sitemap');
  }

  return (
    <FloatingButton
      axis="xy"
      magnetic="x"
      size={60}
      onPress={handlePress}
    >
      <View className="items-center gap-1">
        <Icon
          colorClassName="accent-primary-foreground"
          name="list"
          size={18}
        />
        <Text className="text-xs font-semibold text-primary-foreground">Sitemap</Text>
      </View>
    </FloatingButton>
  );
};

export { DevFloatingButton };
