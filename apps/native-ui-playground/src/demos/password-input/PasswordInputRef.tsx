import { Button, PasswordInput, Text } from '@skyroc/native-ui';
import { useRef } from 'react';
import { TextInput, View } from 'react-native';

/** ref 暴露 focus / blur，用于验证码页面进入即弹键盘一类场景 */
const PasswordInputRef = () => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View className="gap-3 bg-background p-4">
      <PasswordInput
        ref={inputRef}
        variant="separated"
      />
      <View className="flex-row gap-3">
        <Button
          size="sm"
          onPress={() => inputRef.current?.focus()}
        >
          聚焦
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={() => inputRef.current?.blur()}
        >
          失焦
        </Button>
      </View>
      <Text className="text-sm text-muted-foreground">输满 6 位后组件也会自动失焦</Text>
    </View>
  );
};

export { PasswordInputRef };
