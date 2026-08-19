import type { PopupPosition } from '@skyroc/native-ui';
import { Button, Popup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

const PopupSafeArea = () => {
  const [position, setPosition] = useState<Extract<PopupPosition, 'bottom' | 'top'>>('bottom');
  const [show, setShow] = useState(false);

  function openPosition(next: Extract<PopupPosition, 'bottom' | 'top'>) {
    setPosition(next);
    setShow(true);
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => openPosition('bottom')}
      >
        底部 + 安全区
      </Button>
      <Button
        variant="tonal"
        onPress={() => openPosition('top')}
      >
        顶部 + 安全区
      </Button>

      <Popup
        round
        safeAreaInsetBottom={position === 'bottom'}
        safeAreaInsetTop={position === 'top'}
        position={position}
        show={show}
        onUpdateShow={setShow}
      >
        <PopupPanel
          title={position === 'bottom' ? '底部弹层' : '顶部弹层'}
          onClose={() => setShow(false)}
        >
          <Text color="muted">
            {position === 'bottom' ? '面板底部留出了 home indicator 的高度' : '面板顶部避让状态栏与刘海区域'}
          </Text>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupSafeArea };
