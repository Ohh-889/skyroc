import { Button, showConfirmDialog, showDialog } from '@skyroc/native-ui';
import { View } from 'react-native';

const DialogInput = () => {
  function handleInput() {
    // 输入值只在 callback / onConfirm 里给出，Promise 只回传动作本身
    showDialog({
      inputPlaceholder: '请输入昵称',
      message: '请填写你的昵称',
      showCancelButton: true,
      showInput: true,
      title: '编辑昵称'
    });
  }

  function handleAsyncBeforeClose() {
    showConfirmDialog({
      message: '确定后会等待 1.5 秒，期间按钮显示 loading',
      title: '异步拦截',
      beforeClose: nextAction =>
        new Promise<boolean>(resolve => {
          setTimeout(() => resolve(nextAction === 'confirm'), 1500);
        })
    });
  }

  return (
    <View className="mb-8 flex-row flex-wrap items-center gap-3 bg-background px-6">
      <Button
        variant="tonal"
        onPress={handleInput}
      >
        输入框
      </Button>
      <Button
        variant="tonal"
        onPress={handleAsyncBeforeClose}
      >
        异步 beforeClose
      </Button>
    </View>
  );
};

export { DialogInput };
