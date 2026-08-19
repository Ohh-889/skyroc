import { NavBar } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

const NavBarDisabled = () => {
  function handlePress() {
    Alert.alert('禁用状态下不应触发');
  }

  return (
    <View className="gap-3">
      <View className="overflow-hidden rounded-xl border border-border bg-background">
        <NavBar
          leftArrow
          leftDisabled
          rightDisabled
          rightText="提交"
          safeAreaTop={false}
          title="两侧均禁用"
          onLeftPress={handlePress}
          onRightPress={handlePress}
        />
      </View>
    </View>
  );
};

export { NavBarDisabled };
