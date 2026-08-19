import { Button, Popup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

const PopupSafeArea = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        底部 + 安全区
      </Button>

      <Popup
        round
        safeAreaInsetBottom
        position="bottom"
        show={show}
        onUpdateShow={setShow}
      >
        <PopupPanel
          title="底部弹层"
          onClose={() => setShow(false)}
        >
          <Text color="muted">关闭按钮下方留出了 home indicator 的高度</Text>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupSafeArea };
