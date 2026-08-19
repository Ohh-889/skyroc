import { Divider } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerText = () => {
  return (
    <View className="bg-background p-4">
      <Divider align="start">起始位置</Divider>
      <Divider align="center">居中位置</Divider>
      <Divider align="end">结束位置</Divider>
    </View>
  );
};

export { DividerText };
