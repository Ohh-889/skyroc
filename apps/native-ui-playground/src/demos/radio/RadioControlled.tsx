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
        {controlled ? '已选中' : '未选中'}
      </Radio>
      <Button
        size="sm"
        onPress={() => setControlled(v => !v)}
      >
        切换选中状态
      </Button>
    </View>
  );
};

export { RadioControlled };
