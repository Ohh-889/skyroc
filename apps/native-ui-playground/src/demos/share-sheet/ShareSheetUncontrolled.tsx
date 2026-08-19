import AntDesign from '@expo/vector-icons/AntDesign';
import type { ShareSheetOption } from '@skyroc/native-ui';
import { Button, ShareSheet } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const OPTIONS: ShareSheetOption[] = [
  {
    icon: (
      <AntDesign
        color="var(--foreground)"
        name="link"
        size={22}
      />
    ),
    name: '复制链接',
    value: 'link'
  }
];

const ShareSheetUncontrolled = () => {
  const [mounted, setMounted] = useState(false);

  return (
    <View className="bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setMounted(true)}
      >
        按默认状态打开
      </Button>

      {mounted ? (
        <ShareSheet
          closeOnSelect
          defaultShow
          cancelText="取消"
          options={OPTIONS}
          title="非受控分享面板"
          onClosed={() => setMounted(false)}
        />
      ) : null}
    </View>
  );
};

export { ShareSheetUncontrolled };
