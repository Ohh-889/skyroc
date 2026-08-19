import { Switch, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SwitchAsync = () => {
  const [pending, setPending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /** 模拟一次异步落库：期间保持 loading，成功后再翻转 */
  function handlePendingChange(next: boolean) {
    setSubmitting(true);

    setTimeout(() => {
      setPending(next);
      setSubmitting(false);
    }, 1200);
  }

  return (
    <View className="bg-background px-6">
      <View className="mb-8 flex-row items-center gap-3">
        <Switch
          checked={pending}
          loading={submitting}
          size="lg"
          onCheckedChange={handlePendingChange}
        />
        <Text color="muted">{submitting ? '保存中…' : `已保存：${pending ? '开' : '关'}`}</Text>
      </View>
    </View>
  );
};

export { SwitchAsync };
