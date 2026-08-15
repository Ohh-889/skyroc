import type { ToastPosition } from '@skyroc/native-ui';
import {
  Button,
  Text,
  Toast,
  allowMultipleToast,
  closeToast,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
  showToast
} from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const POSITIONS: ToastPosition[] = ['top', 'middle', 'bottom'];

const ToastDemo = () => {
  const [closeCount, setCloseCount] = useState(0);
  const [declarativeShow, setDeclarativeShow] = useState(false);

  function handleCountedToast() {
    showToast({
      message: '关闭时计数 +1',
      onClose: () => setCloseCount(prev => prev + 1)
    });
  }

  function handleLoadingThenSuccess() {
    const instance = showLoadingToast('上传中...');

    setTimeout(() => {
      // loading 常驻是从 type 推导的，改成 success 后自动恢复 2 秒关闭，无需再传 duration
      instance.update({ message: '上传成功', type: 'success' });
    }, 1500);
  }

  function handleManualClose() {
    const instance = showToast({ duration: 0, message: '常驻，2 秒后由代码关闭' });

    setTimeout(() => instance.close(), 2000);
  }

  function handleMultiple() {
    allowMultipleToast(true);

    showToast({ message: '第一条', position: 'top' });
    showToast({ message: '第二条', position: 'top' });
    showToast({ message: '第三条', position: 'top' });

    allowMultipleToast(false);
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 类型 */}
      <Text className="mb-4 text-lg font-semibold">类型</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
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

      {/* 位置 */}
      <Text className="mb-4 text-lg font-semibold">位置</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {POSITIONS.map(position => (
          <Button
            key={position}
            variant="tonal"
            onPress={() => showToast({ message: position, position })}
          >
            {position}
          </Button>
        ))}
      </View>

      {/* 交互 */}
      <Text className="mb-4 text-lg font-semibold">交互</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => showToast({ closeOnClick: true, duration: 0, message: '点我关闭' })}
        >
          点击关闭
        </Button>
        <Button
          variant="tonal"
          onPress={() => showToast({ forbidClick: true, message: '背景已被遮罩拦截', position: 'top' })}
        >
          禁止背景点击
        </Button>
        <Button
          variant="tonal"
          onPress={handleManualClose}
        >
          常驻 + 命令式关闭
        </Button>
      </View>

      {/* 生命周期 */}
      <Text className="mb-4 text-lg font-semibold">生命周期</Text>
      <View className="mb-2 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={handleLoadingThenSuccess}
        >
          loading → success
        </Button>
        <Button
          variant="tonal"
          onPress={handleCountedToast}
        >
          onClose 计数
        </Button>
        <Button
          variant="tonal"
          onPress={handleMultiple}
        >
          同时显示多条
        </Button>
      </View>
      <Text
        className="mb-8"
        color="muted"
      >
        onClose 已触发 {closeCount} 次（每关闭一次只应 +1）
      </Text>

      {/* 自定义 */}
      <Text className="mb-4 text-lg font-semibold">自定义图标</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() =>
            showToast({
              icon: <Text className="text-3xl">🎉</Text>,
              message: '自定义图标'
            })
          }
        >
          Emoji 图标
        </Button>
      </View>

      {/* 声明式 */}
      <Text className="mb-4 text-lg font-semibold">声明式用法</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onPress={() => setDeclarativeShow(true)}
        >
          显示受控 Toast
        </Button>
      </View>

      <View className="items-center">
        <Toast
          message="受控 Toast，2 秒后自动关闭"
          show={declarativeShow}
          type="success"
          onUpdateShow={setDeclarativeShow}
        />
      </View>
    </ScrollView>
  );
};

export { ToastDemo };
