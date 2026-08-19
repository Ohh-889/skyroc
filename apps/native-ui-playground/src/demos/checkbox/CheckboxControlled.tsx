import { Button, Checkbox } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CheckboxControlled = () => {
  const [controlled, setControlled] = useState(false);

  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox
        checked={controlled}
        onCheckedChange={setControlled}
      >
        {controlled ? 'Checked' : 'Unchecked'}
      </Checkbox>
      <Button
        size="sm"
        onPress={() => setControlled(v => !v)}
      >
        Toggle
      </Button>
    </View>
  );
};

export { CheckboxControlled };
