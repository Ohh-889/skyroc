import type { ActionSheetAction } from '@skyroc/native-ui';
import { ActionSheet, Button, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const BUTTON_ACTIONS: ActionSheetAction[] = [
  {
    icon: (
      <View className="size-8 items-center justify-center rounded-full bg-success/15">
        <Text className="font-semibold text-success">微</Text>
      </View>
    ),
    name: '微信',
    value: 'wechat'
  },
  {
    icon: (
      <View className="size-8 items-center justify-center rounded-full bg-primary/15">
        <Text className="font-semibold text-primary">链</Text>
      </View>
    ),
    name: '复制链接',
    value: 'link'
  },
  {
    icon: (
      <View className="size-8 items-center justify-center rounded-full bg-warning/15">
        <Text className="font-semibold text-warning">★</Text>
      </View>
    ),
    name: '收藏',
    value: 'star'
  }
];

const ActionSheetButton = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="bg-background">
      <View className="p-4">
        <Button
          variant="tonal"
          onPress={() => setShow(true)}
        >
          打开按钮面板
        </Button>
      </View>

      <ActionSheet
        closeOnClickAction
        actions={BUTTON_ACTIONS}
        cancelText="取消"
        show={show}
        title="分享到"
        variant="button"
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ActionSheetButton };
