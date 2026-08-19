import { Button, Radio } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const RadioControlled = () => {
  const [controlled, setControlled] = useState(false);

  return (
    <View className="gap-3 bg-background p-4">
      <Radio
        checked={controlled}
        onCheckedChange={setControlled}
      >
        {controlled ? 'Checked' : 'Unchecked'}
      </Radio>
      <Button
        size="sm"
        onPress={() => setControlled(v => !v)}
      >
        Toggle
      </Button>
    </View>
  );
};

export { RadioControlled };
