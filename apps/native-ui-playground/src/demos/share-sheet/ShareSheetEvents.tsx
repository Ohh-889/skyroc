import AntDesign from '@expo/vector-icons/AntDesign';
import type { ShareSheetOption } from '@skyroc/native-ui';
import { Button, ShareSheet, Text } from '@skyroc/native-ui';
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
  },
  {
    icon: (
      <AntDesign
        color="var(--foreground)"
        name="qrcode"
        size={22}
      />
    ),
    name: '二维码',
    value: 'qrcode'
  }
];

const ShareSheetEvents = () => {
  const [show, setShow] = useState(false);
  const [event, setEvent] = useState('等待操作');

  return (
    <View className="gap-3 bg-background p-4">
      <Text className="text-sm text-muted-foreground">最近事件：{event}</Text>
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        打开事件示例
      </Button>

      <ShareSheet
        closeOnSelect
        cancelText="取消"
        options={OPTIONS}
        show={show}
        title="选择一项"
        onCancel={() => setEvent('onCancel')}
        onClosed={() => setEvent(previous => `${previous} → onClosed`)}
        onSelect={option => setEvent(`onSelect: ${option.value}`)}
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ShareSheetEvents };
