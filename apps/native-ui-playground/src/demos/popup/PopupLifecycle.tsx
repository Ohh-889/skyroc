import { Button, Popup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

const PopupLifecycle = () => {
  const [show, setShow] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);

  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setShow(true)}
        >
          onOpened / onClosed
        </Button>
      </View>
      <Text color="muted">
        已打开 {openedCount} 次，已关闭 {closedCount} 次（都在动画结束后触发）
      </Text>

      <Popup
        round
        position="center"
        show={show}
        onClosed={() => setClosedCount(prev => prev + 1)}
        onOpened={() => setOpenedCount(prev => prev + 1)}
        onUpdateShow={setShow}
      >
        <PopupPanel
          title="生命周期"
          onClose={() => setShow(false)}
        >
          <Text color="muted">关掉后回到列表看计数变化</Text>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupLifecycle };
