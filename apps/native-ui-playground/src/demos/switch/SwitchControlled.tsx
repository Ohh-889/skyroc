import { Button, Switch, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SwitchControlled = () => {
  const [controlled, setControlled] = useState(true);

  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Switch
            checked={controlled}
            color="success"
            onCheckedChange={setControlled}
          />
          <Text color="muted">{controlled ? '已开启' : '已关闭'}</Text>
        </View>
        <View className="flex-row gap-2">
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(true)}
          >
            开启
          </Button>
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(false)}
          >
            关闭
          </Button>
          <Button
            color="primary"
            variant="ghost"
            onPress={() => setControlled(!controlled)}
          >
            取反
          </Button>
        </View>
      </View>
    </View>
  );
};

export { SwitchControlled };
