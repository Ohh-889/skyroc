import { Input, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 受控与非受控都能真正清空 */
const InputClearable = () => {
  const [clearControlled, setClearControlled] = useState('填了值，点右侧清除');
  const [lastCleared, setLastCleared] = useState('-');

  function handleClear() {
    setLastCleared('clearable 触发了 onClear');
  }

  return (
    <View className="gap-3 bg-background p-4">
      <Input
        clearable
        defaultValue="非受控，组件自己清空"
        onClear={handleClear}
      />
      <Input
        clearable
        placeholder="受控"
        value={clearControlled}
        onChangeText={setClearControlled}
      />
      <Text className="text-sm text-muted-foreground">受控值：{clearControlled || '（空）'}</Text>
      <Text className="text-sm text-muted-foreground">{lastCleared}</Text>
    </View>
  );
};

export { InputClearable };
