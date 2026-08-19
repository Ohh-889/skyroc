import { NavBar } from '@skyroc/native-ui';
import { View } from 'react-native';

const NavBarStyles = () => {
  return (
    <View className="overflow-hidden rounded-xl border border-primary-200 bg-primary-50">
      <NavBar
        leftArrow
        backColor="var(--destructive)"
        className="bg-primary-50 px-5"
        classNames={{
          container: 'bg-primary-50',
          left: 'rounded-full bg-background px-2 py-1',
          right: 'rounded-full bg-primary-100 px-3 py-1',
          title: 'inset-x-20',
          root: 'border-primary-200'
        }}
        rightText="操作"
        safeAreaTop={false}
        title="样式槽覆盖"
      />
    </View>
  );
};

export { NavBarStyles };
