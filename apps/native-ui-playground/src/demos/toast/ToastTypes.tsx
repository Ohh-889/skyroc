import { Button, closeToast, showFailToast, showLoadingToast, showSuccessToast, showToast } from '@skyroc/native-ui';
import { View } from 'react-native';

const ToastTypes = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background px-6 py-4">
      <Button onPress={() => showToast('这是一条文字提示')}>文字</Button>
      <Button onPress={() => showSuccessToast('操作成功')}>成功</Button>
      <Button onPress={() => showFailToast('操作失败')}>失败</Button>
      <Button onPress={() => showLoadingToast('加载中...')}>加载（常驻）</Button>
      <Button
        variant="outline"
        onPress={closeToast}
      >
        关闭全部
      </Button>
    </View>
  );
};

export { ToastTypes };
