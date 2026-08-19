import { Button, NumberKeyboard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NumberKeyboardHideDelete = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [showDeleteKey, setShowDeleteKey] = useState(true);

  function openKeyboard(showDelete: boolean) {
    setValue('');
    setShowDeleteKey(showDelete);
    setVisible(true);
  }

  function closeKeyboard() {
    setVisible(false);
  }

  return (
    <View className="gap-3 bg-background p-4">
      <Text color="muted">当前输入：{value || '—'}</Text>
      <View className="flex-row flex-wrap gap-2">
        <Button
          variant="outline"
          onPress={() => openKeyboard(true)}
        >
          文字删除键
        </Button>
        <Button
          variant="outline"
          onPress={() => openKeyboard(false)}
        >
          隐藏删除键
        </Button>
      </View>

      <NumberKeyboard
        deleteButtonText="删除"
        showDeleteKey={showDeleteKey}
        title={showDeleteKey ? '文字删除键' : '无删除键'}
        value={value}
        visible={visible}
        onBlur={closeKeyboard}
        onChange={setValue}
        onClose={closeKeyboard}
      />
    </View>
  );
};

export { NumberKeyboardHideDelete };
