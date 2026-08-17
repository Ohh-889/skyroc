import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonColor = () => {
  return (
    <View className="gap-3 bg-background p-6">
      <Button color="primary">Primary</Button>
      <Button color="destructive">Destructive</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="warning">Warning</Button>
      <Button color="info">Info</Button>
      <Button color="muted">Muted</Button>
    </View>
  );
};

export { ButtonColor };
