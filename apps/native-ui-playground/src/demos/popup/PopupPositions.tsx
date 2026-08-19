import type { PopupPosition } from '@skyroc/native-ui';
import { Button, Popup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

const POSITIONS: PopupPosition[] = ['center', 'top', 'bottom', 'left', 'right'];

const PopupPositions = () => {
  // show 和 position 必须拆成两个 state。
  // 若用 `position !== null` 当 show，关闭时 position 会在退场动画播放途中被清空，
  // 动画和容器对齐方式会当场跳变成 center 的那一套。
  const [position, setPosition] = useState<PopupPosition>('center');
  const [show, setShow] = useState(false);

  function openPosition(next: PopupPosition) {
    setPosition(next);
    setShow(true);
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      {POSITIONS.map(item => (
        <Button
          key={item}
          variant="tonal"
          onPress={() => openPosition(item)}
        >
          {item}
        </Button>
      ))}

      <Popup
        round
        position={position}
        show={show}
        onUpdateShow={setShow}
      >
        <PopupPanel
          title={`position = ${position}`}
          onClose={() => setShow(false)}
        >
          <Text color="muted">点击遮罩也可以关闭</Text>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupPositions };
