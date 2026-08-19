import { Button, Popup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

const PopupRound = () => {
  // round 要在退场动画结束前保持不变，所以和 show 拆成两个 state
  const [round, setRound] = useState(true);
  const [show, setShow] = useState(false);

  function openRound(next: boolean) {
    setRound(next);
    setShow(true);
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => openRound(true)}
      >
        居中 + 圆角
      </Button>
      <Button
        variant="tonal"
        onPress={() => openRound(false)}
      >
        居中 + 直角
      </Button>

      <Popup
        position="center"
        round={round}
        show={show}
        onUpdateShow={setShow}
      >
        <PopupPanel
          title={round ? 'round = true' : 'round = false'}
          onClose={() => setShow(false)}
        >
          <Text color="muted">居中弹层的圆角同样由 round 控制</Text>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupRound };
