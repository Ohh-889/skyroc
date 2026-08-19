import { Button, Popup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

/** animation 只覆盖传入的那个方向，这里只指定了 in，out 仍走 bottom 的默认 slideOutDown */
const PopupAnimation = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        zoomIn 进 / 默认出（800ms）
      </Button>

      <Popup
        round
        animation={{ in: 'zoomIn' }}
        duration={800}
        position="bottom"
        show={show}
        onUpdateShow={setShow}
      >
        <PopupPanel
          title="混搭动画"
          onClose={() => setShow(false)}
        >
          <Text color="muted">进场 zoomIn，退场仍是 bottom 默认的 slideOutDown</Text>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupAnimation };
