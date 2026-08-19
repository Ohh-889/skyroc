import { NavBar } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

const NavBarAction = () => {
  function handleBack() {
    Alert.alert('点击了返回');
  }

  function handleAction() {
    Alert.alert('点击了操作');
  }

  return (
    <View className="bg-background">
      <NavBar
        leftArrow
        safeAreaTop={false}
        rightText="完成"
        title="编辑资料"
        onLeftPress={handleBack}
        onRightPress={handleAction}
      />
    </View>
  );
};

export { NavBarAction };
