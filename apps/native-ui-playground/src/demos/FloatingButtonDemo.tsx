import { Button, FloatingButton, Portal, Text } from '@skyroc/native-ui';
import type { FloatingButtonOffset } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const FloatingButtonDemo = () => {
  const [visible, setVisible] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState<FloatingButtonOffset | null>(null);

  function handleMagneticChange(offset: FloatingButtonOffset) {
    setMagneticOffset(offset);
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-24"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-2 text-lg font-semibold">坐标系约定</Text>
        <Text className="mb-6 text-sm text-muted-foreground">
          边界按窗口尺寸计算，渲染却是相对父容器的 absolute。所以下面全部套了一层 Portal—— PortalHost
          铺满屏幕且原点与屏幕重合，位置才对得上。 直接放在有 NavBar 的页面里，按钮会整体下移一个 NavBar 的高度。
        </Text>

        <Text className="mb-2 text-lg font-semibold">基础用法</Text>
        <Text className="mb-6 text-sm text-muted-foreground">
          默认 axis=&quot;y&quot;，蓝色按钮只能上下拖，点击有反馈。
        </Text>

        <Text className="mb-2 text-lg font-semibold">自由拖拽</Text>
        <Text className="mb-6 text-sm text-muted-foreground">
          绿色按钮 axis=&quot;xy&quot;，可以拖到任意位置，但始终被 gap（默认 24）挡在屏幕边缘之内。
        </Text>

        <Text className="mb-2 text-lg font-semibold">边缘吸附</Text>
        <Text className="mb-2 text-sm text-muted-foreground">
          橙色按钮 magnetic=&quot;x&quot;，松手后自动吸到左右最近的一侧，走临界阻尼的弹簧：有减速手感但不会冲出 gap
          边界再退回来。onOffsetChange 拿到的是吸附的目标坐标，此刻落位动画才刚开始，不是动画结束的回调。
        </Text>
        <Text className="mb-6 text-sm text-muted-foreground">
          最近一次落位：
          {magneticOffset ? ` x=${Math.round(magneticOffset.x)}, y=${Math.round(magneticOffset.y)}` : ' —'}
        </Text>

        <Text className="mb-2 text-lg font-semibold">显隐切换</Text>
        <View className="mb-6 gap-3">
          <Text className="text-sm text-muted-foreground">
            红色按钮进出都是 180ms 的缩放缓动，两个方向都不用弹簧，不会有回弹。 另外挂载时不会先闪一下再收回去，scale
            的初值直接取自当前可见性。
          </Text>
          <Button
            color="primary"
            variant="solid"
            onPress={() => setVisible(prev => !prev)}
          >
            {visible ? '隐藏红色按钮' : '显示红色按钮'}
          </Button>
        </View>

        <Text className="mb-2 text-lg font-semibold">禁用</Text>
        <View className="mb-6 gap-3">
          <Text className="text-sm text-muted-foreground">紫色按钮禁用后不响应点击与拖拽，并整体降低不透明度。</Text>
          <Button
            color="primary"
            variant="outline"
            onPress={() => setDisabled(prev => !prev)}
          >
            {disabled ? '解除禁用' : '禁用紫色按钮'}
          </Button>
        </View>

        <Text className="mb-2 text-lg font-semibold">自定义尺寸与内容</Text>
        <Text className="mb-6 text-sm text-muted-foreground">
          灰色按钮 size=64，className 覆盖底色，children 可以放任意节点。
        </Text>
      </ScrollView>

      <Portal>
        {/* 基础：默认 y 轴拖拽 */}
        <FloatingButton offset={{ x: 24, y: 180 }}>
          <Text className="text-xs font-bold text-primary-foreground">Y</Text>
        </FloatingButton>

        {/* 自由拖拽 */}
        <FloatingButton
          axis="xy"
          className="bg-success"
          offset={{ x: 24, y: 260 }}
        >
          <Text className="text-xs font-bold text-success-foreground">XY</Text>
        </FloatingButton>

        {/* 边缘吸附 */}
        <FloatingButton
          axis="xy"
          className="bg-warning"
          magnetic="x"
          onOffsetChange={handleMagneticChange}
        >
          <Text className="text-xs font-bold text-warning-foreground">MG</Text>
        </FloatingButton>

        {/* 显隐切换 */}
        <FloatingButton
          className="bg-destructive"
          offset={{ x: 96, y: 180 }}
          visible={visible}
        >
          <Text className="text-xs font-bold text-destructive-foreground">HI</Text>
        </FloatingButton>

        {/* 禁用 */}
        <FloatingButton
          axis="xy"
          className="bg-info"
          disabled={disabled}
          offset={{ x: 96, y: 260 }}
        >
          <Text className="text-xs font-bold text-info-foreground">EN</Text>
        </FloatingButton>

        {/* 自定义尺寸 */}
        <FloatingButton
          axis="xy"
          className="bg-carbon"
          offset={{ x: 168, y: 180 }}
          size={64}
        >
          <Text className="text-sm font-bold text-carbon-foreground">BIG</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonDemo };
