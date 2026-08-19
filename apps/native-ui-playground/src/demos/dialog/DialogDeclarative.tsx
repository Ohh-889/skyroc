import { Button, Dialog, Portal, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DialogDeclarative = () => {
  const [show, setShow] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);

  return (
    <View className="gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        打开声明式 Dialog
      </Button>
      <View className="rounded-xl bg-muted p-3">
        <Text className="text-sm text-muted-foreground">
          已打开 {openedCount} 次，已关闭 {closedCount} 次
        </Text>
      </View>

      {/* 声明式 Dialog 不能落在 ScrollView 里面：JS 触摸响应链走的是 React 树，
          键盘弹起时 ScrollView 会在 capture 阶段抢走第一次点击用来收键盘（keyboardShouldPersistTaps 默认 never），
          放在里面的话带输入框的弹窗要点两下才关得掉。这里套 Portal，让它们改挂到 PortalHost 下，
          总览页把本 demo 放进 ScrollView 时也不受影响 */}
      <Portal>
        <Dialog
          message="show 与 onUpdateShow 由外部状态控制。"
          show={show}
          showCancelButton
          title="受控 Dialog"
          onClosed={() => setClosedCount(count => count + 1)}
          onOpened={() => setOpenedCount(count => count + 1)}
          onUpdateShow={setShow}
        />
      </Portal>
    </View>
  );
};

export { DialogDeclarative };
