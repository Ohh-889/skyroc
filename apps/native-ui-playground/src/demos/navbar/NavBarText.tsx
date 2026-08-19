import { NavBar } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

const NavBarText = () => {
  function handleBack() {
    Alert.alert('点击了取消');
  }

  function handleAction() {
    Alert.alert('点击了保存');
  }

  return (
    <View className="bg-background">
      <NavBar
        leftText="取消"
        safeAreaTop={false}
        rightText="保存"
        title="新建内容"
        onLeftPress={handleBack}
        onRightPress={handleAction}
      />
    </View>
  );
};

export { NavBarText };
