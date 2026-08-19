import { Divider } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerDashed = () => {
  return (
    <View className="bg-background p-4">
      <Divider border="dashed" />
      <Divider border="dashed">Dashed with Text</Divider>
    </View>
  );
};

export { DividerDashed };
