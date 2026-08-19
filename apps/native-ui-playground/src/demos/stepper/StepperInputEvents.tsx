import { Button, Stepper, Text } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { View } from 'react-native';

const StepperInputEvents = () => {
  const inputRef = useRef<TextInput>(null);
  const [lastEvent, setLastEvent] = useState('尚未触发');

  function blurInput() {
    inputRef.current?.blur();
  }

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <View className="gap-3 bg-background px-6 pb-6">
      <Stepper
        ref={inputRef}
        accessibilityLabel="可编辑数量"
        defaultValue={2}
        max={99}
        min={0}
        onBlur={() => setLastEvent('onBlur：输入已提交')}
        onChangeText={text => setLastEvent(`onChangeText：${text || '（空）'}`)}
      />
      <Text color="muted">最近事件：{lastEvent}</Text>
      <View className="flex-row gap-2">
        <Button
          size="sm"
          variant="outline"
          onPress={focusInput}
        >
          聚焦输入框
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={blurInput}
        >
          失焦并提交
        </Button>
      </View>
    </View>
  );
};

export { StepperInputEvents };
