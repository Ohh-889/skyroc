import { Switch, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwitchLoading = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row items-center gap-3">
        <Switch loading />
        <Text color="muted">加载中·关闭</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <Switch
          defaultChecked
          loading
        />
        <Text color="muted">加载中·开启</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <Switch
          defaultChecked
          loading
          size="2xl"
        />
        <Text color="muted">2xl 加载指示器</Text>
      </View>
    </View>
  );
};

export { SwitchLoading };
