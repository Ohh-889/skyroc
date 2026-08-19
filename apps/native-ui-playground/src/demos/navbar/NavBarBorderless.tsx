import { NavBar } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

const NavBarBorderless = () => {
  function handleBack() {
    Alert.alert('点击了返回');
  }

  return (
    <View className="bg-background">
      <NavBar
        border={false}
        leftArrow
        safeAreaTop={false}
        title="沉浸式页面"
        onLeftPress={handleBack}
      />
    </View>
  );
};

export { NavBarBorderless };
