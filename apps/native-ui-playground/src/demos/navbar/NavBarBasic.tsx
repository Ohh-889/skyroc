import { NavBar } from '@skyroc/native-ui';
import { View } from 'react-native';

const NavBarBasic = () => {
  return (
    <View className="bg-background">
      <NavBar
        safeAreaTop={false}
        title="页面标题"
      />
    </View>
  );
};

export { NavBarBasic };
