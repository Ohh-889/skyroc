import type { NotifyPosition, NotifyType } from '@skyroc/native-ui';
import { Button, Notify, Text, closeNotify, showNotify } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const TYPES: NotifyType[] = ['primary', 'success', 'warning', 'danger'];

const POSITIONS: NotifyPosition[] = ['top', 'bottom'];

const NotifyDemo = () => {
  const [closeCount, setCloseCount] = useState(0);
  const [declarativeShow, setDeclarativeShow] = useState(false);

  function handleCountedNotify() {
    showNotify({
      message: '关闭时计数 +1',
      onClose: () => setCloseCount(prev => prev + 1)
    });
  }

  function handleReplaced() {
    // 第一条会被第二条顶替，被顶替同样算关闭，它的 onClose 也应各记一次
    showNotify({ message: '第一条（即将被顶替）', onClose: () => setCloseCount(prev => prev + 1) });
    showNotify({ message: '第二条（顶替了第一条）', onClose: () => setCloseCount(prev => prev + 1) });
  }

  function handleManualClose() {
    const instance = showNotify({ duration: 0, message: '常驻，2 秒后由代码关闭' });

    setTimeout(() => instance.close(), 2000);
  }

  function handleUpdate() {
    const instance = showNotify({ duration: 0, message: '上传中...', type: 'primary' });

    // 原地更新，不重放动画；重新按新的 duration 计时
    setTimeout(() => instance.update({ duration: 2000, message: '上传成功', type: 'success' }), 1500);
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
        {TYPES.map(type => (
          <Button
            key={type}
            variant="tonal"
            onPress={() => showNotify({ message: `${type} 通知`, type })}
          >
            {type}
          </Button>
        ))}
        <Button
          variant="outline"
          onPress={closeNotify}
        >
          关闭
        </Button>
      </View>

      {/* 位置 */}
      <Text className="mb-4 text-lg font-semibold">位置</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {POSITIONS.map(position => (
          <Button
            key={position}
            variant="tonal"
            onPress={() => showNotify({ message: `贴 ${position} 显示`, position })}
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
          onPress={() =>
            showNotify({
              duration: 0,
              message: '点我触发 onClick',
              onClick: () => showNotify({ message: '收到点击', type: 'success' })
            })
          }
        >
          可点击
        </Button>
        <Button
          variant="tonal"
          onPress={handleManualClose}
        >
          常驻 + 命令式关闭
        </Button>
        <Button
          variant="tonal"
          onPress={handleUpdate}
        >
          原地 update
        </Button>
      </View>

      {/* 生命周期 */}
      <Text className="mb-4 text-lg font-semibold">生命周期</Text>
      <View className="mb-2 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={handleCountedNotify}
        >
          onClose 计数
        </Button>
        <Button
          variant="tonal"
          onPress={handleReplaced}
        >
          顶替（应 +1）
        </Button>
      </View>
      <Text
        className="mb-8"
        color="muted"
      >
        onClose 已触发 {closeCount} 次（每关闭一条只应 +1）
      </Text>

      {/* 自定义 */}
      <Text className="mb-4 text-lg font-semibold">自定义样式与内容</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() =>
            showNotify({
              className: 'bg-carbon',
              classNames: { content: 'py-4', message: 'text-base text-carbon-foreground' },
              message: '用 className 覆盖（跟随主题）'
            })
          }
        >
          className 覆盖
        </Button>
        <Button
          variant="tonal"
          onPress={() => showNotify({ background: '#7232dd', color: '#ffffff', message: '写死的品牌色' })}
        >
          背景色兜底
        </Button>
        <Button
          variant="tonal"
          onPress={() =>
            showNotify({
              message: (
                <View className="flex-row items-center gap-2">
                  <Text className="text-2xl">🎉</Text>
                  <Text className="text-sm font-medium text-primary-foreground">自定义节点</Text>
                </View>
              ),
              type: 'primary'
            })
          }
        >
          自定义节点
        </Button>
      </View>

      {/* 声明式 */}
      <Text className="mb-4 text-lg font-semibold">声明式用法</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        内联使用不贴边、也不补安全区，就是页面里的一条普通色块
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onPress={() => setDeclarativeShow(true)}
        >
          显示受控 Notify
        </Button>
      </View>

      <Notify
        message="受控 Notify，3 秒后自动关闭"
        show={declarativeShow}
        type="success"
        onUpdateShow={setDeclarativeShow}
      />
    </ScrollView>
  );
};

export { NotifyDemo };
