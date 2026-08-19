import { Divider } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerCustomStyle = () => {
  return (
    <View className="bg-background p-4">
      <Divider classNames={{ line: 'bg-primary' }} />
      <Divider classNames={{ line: 'bg-primary', text: 'text-destructive' }}>Warning</Divider>
    </View>
  );
};

export { DividerCustomStyle };
