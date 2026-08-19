import Octicons from '@expo/vector-icons/Octicons';
import { NavBar, Text } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

const NavBarCustomContent = () => {
  function handleTitlePress() {
    Alert.alert('点击了自定义标题');
  }

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-background">
      <NavBar
        safeAreaTop={false}
        left={
          <View className="rounded-full bg-secondary px-2 py-1">
            <Text className="text-xs text-foreground">关闭</Text>
          </View>
        }
        right={<Text className="text-sm font-medium text-success">发布</Text>}
        title={
          <View className="flex-row items-center gap-1">
            <Text className="font-semibold">自定义标题</Text>
            <Octicons
              color="var(--muted-foreground)"
              name="chevron-down"
              size={14}
            />
          </View>
        }
        onTitlePress={handleTitlePress}
      />
    </View>
  );
};

export { NavBarCustomContent };
