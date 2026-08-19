import { Divider } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerText = () => {
  return (
    <View className="bg-background p-4">
      <Divider>Center Text</Divider>
      <Divider align="start">Left Text</Divider>
      <Divider align="end">Right Text</Divider>
    </View>
  );
};

export { DividerText };
