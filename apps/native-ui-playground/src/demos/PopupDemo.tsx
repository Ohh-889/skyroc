import type { PopupPosition } from '@skyroc/native-ui';
import { Button, Popup, Text, showToast } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const POSITIONS: PopupPosition[] = ['center', 'top', 'bottom', 'left', 'right'];

interface PopupPanelProps {
  /** 面板正文，通常是若干说明文字 */
  children?: ReactNode;

  /** 关闭按钮的回调 */
  onClose: () => void;

  /** 面板标题 */
  title: string;
}

/** 各个示例共用的面板内容，避免每个 Popup 里重复一遍标题 + 关闭按钮 */
const PopupPanel = (props: PopupPanelProps) => {
  const { children, onClose, title } = props;

  return (
    <View className="gap-3 p-6">
      <Text className="text-lg font-semibold">{title}</Text>

      {children}

      <Button
        variant="outline"
        onPress={onClose}
      >
        关闭
      </Button>
    </View>
  );
};

const PopupDemo = () => {
  // 位置示例：show 和 position 必须拆成两个 state。
  // 若用 `position !== null` 当 show，关闭时 position 会在退场动画播放途中被清空，
  // 动画和容器对齐方式会当场跳变成 center 的那一套。
  const [position, setPosition] = useState<PopupPosition>('center');
  const [positionShow, setPositionShow] = useState(false);

  // 圆角示例同理，round 要在退场动画结束前保持不变
  const [round, setRound] = useState(true);
  const [roundShow, setRoundShow] = useState(false);

  const [drawerShow, setDrawerShow] = useState(false);
  const [safeAreaShow, setSafeAreaShow] = useState(false);
  const [lockedShow, setLockedShow] = useState(false);
  const [backdropShow, setBackdropShow] = useState(false);
  const [animationShow, setAnimationShow] = useState(false);
  const [inlineShow, setInlineShow] = useState(false);

  const [lifecycleShow, setLifecycleShow] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);

  function openPosition(next: PopupPosition) {
    setPosition(next);
    setPositionShow(true);
  }

  function openRound(next: boolean) {
    setRound(next);
    setRoundShow(true);
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6 pb-20"
        showsVerticalScrollIndicator={false}
      >
        {/* 弹出位置 */}
        <Text className="mb-4 text-lg font-semibold">弹出位置</Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          {POSITIONS.map(item => (
            <Button
              key={item}
              variant="tonal"
              onPress={() => openPosition(item)}
            >
              {item}
            </Button>
          ))}
        </View>

        {/* 圆角 */}
        <Text className="mb-2 text-lg font-semibold">圆角</Text>
        <Text
          className="mb-4"
          color="muted"
        >
          round 统一控制五个方向，贴边的那一侧不加圆角；居中弹层默认是直角
        </Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
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
        </View>

        {/* 抽屉宽度 */}
        <Text className="mb-2 text-lg font-semibold">抽屉宽度</Text>
        <Text
          className="mb-4"
          color="muted"
        >
          left / right 默认 w-3/4，cn 底层是 twMerge，传 className 可直接覆盖
        </Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={() => setDrawerShow(true)}
          >
            半宽抽屉（w-1/2）
          </Button>
        </View>

        {/* 安全区 */}
        <Text className="mb-2 text-lg font-semibold">安全区避让</Text>
        <Text
          className="mb-4"
          color="muted"
        >
          底部弹层开启 safeAreaInsetBottom，内容不会被 home indicator 压住
        </Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={() => setSafeAreaShow(true)}
          >
            底部 + 安全区
          </Button>
        </View>

        {/* 遮罩 */}
        <Text className="mb-2 text-lg font-semibold">遮罩</Text>
        <Text
          className="mb-4"
          color="muted"
        >
          closeOnBackdropPress 与 closeOnBackPress 相互独立：点遮罩关不掉时，Android 返回键仍然可以退出
        </Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={() => setLockedShow(true)}
          >
            点遮罩不关闭
          </Button>
          <Button
            variant="tonal"
            onPress={() => setBackdropShow(true)}
          >
            自定义遮罩
          </Button>
        </View>

        {/* 动画 */}
        <Text className="mb-2 text-lg font-semibold">动画</Text>
        <Text
          className="mb-4"
          color="muted"
        >
          animation 只覆盖传入的那个方向，下面只指定了 in，out 仍走 bottom 的默认 slideOutDown
        </Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={() => setAnimationShow(true)}
          >
            zoomIn 进 / 默认出（800ms）
          </Button>
        </View>

        {/* 生命周期 */}
        <Text className="mb-4 text-lg font-semibold">生命周期</Text>
        <View className="mb-2 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={() => setLifecycleShow(true)}
          >
            onOpened / onClosed
          </Button>
        </View>
        <Text
          className="mb-8"
          color="muted"
        >
          已打开 {openedCount} 次，已关闭 {closedCount} 次（都在动画结束后触发）
        </Text>

        {/* 与 Toast 共存 */}
        <Text className="mb-2 text-lg font-semibold">与 Toast 共存</Text>
        <Text
          className="mb-4"
          color="muted"
        >
          默认 coverScreen 会开一个原生窗口，Portal 渲染的 Toast 会被挡在后面。传 coverScreen={'{false}'}
          让弹层就地渲染即可共存，代价是盖不住原生导航栏，且 Android 返回键不再生效
        </Text>
        <View className="mb-8 flex-row flex-wrap items-center gap-3">
          <Button
            variant="tonal"
            onPress={() => setInlineShow(true)}
          >
            就地渲染 + Toast
          </Button>
        </View>
      </ScrollView>

      <Popup
        round
        position={position}
        show={positionShow}
        onUpdateShow={setPositionShow}
      >
        <PopupPanel
          title={`position = ${position}`}
          onClose={() => setPositionShow(false)}
        >
          <Text color="muted">点击遮罩也可以关闭</Text>
        </PopupPanel>
      </Popup>

      <Popup
        position="center"
        round={round}
        show={roundShow}
        onUpdateShow={setRoundShow}
      >
        <PopupPanel
          title={round ? 'round = true' : 'round = false'}
          onClose={() => setRoundShow(false)}
        >
          <Text color="muted">居中弹层的圆角同样由 round 控制</Text>
        </PopupPanel>
      </Popup>

      <Popup
        round
        className="w-1/2"
        position="left"
        show={drawerShow}
        onUpdateShow={setDrawerShow}
      >
        <PopupPanel
          title="半宽抽屉"
          onClose={() => setDrawerShow(false)}
        >
          <Text color="muted">className 覆盖掉了默认的 w-3/4</Text>
        </PopupPanel>
      </Popup>

      <Popup
        round
        safeAreaInsetBottom
        position="bottom"
        show={safeAreaShow}
        onUpdateShow={setSafeAreaShow}
      >
        <PopupPanel
          title="底部弹层"
          onClose={() => setSafeAreaShow(false)}
        >
          <Text color="muted">关闭按钮下方留出了 home indicator 的高度</Text>
        </PopupPanel>
      </Popup>

      <Popup
        round
        closeOnBackdropPress={false}
        position="center"
        show={lockedShow}
        onUpdateShow={setLockedShow}
      >
        <PopupPanel
          title="点遮罩不关闭"
          onClose={() => setLockedShow(false)}
        >
          <Text color="muted">只能点下面的按钮，或按 Android 返回键</Text>
        </PopupPanel>
      </Popup>

      <Popup
        round
        backdropColor="#1d4ed8"
        backdropOpacity={0.75}
        position="center"
        show={backdropShow}
        onUpdateShow={setBackdropShow}
      >
        <PopupPanel
          title="自定义遮罩"
          onClose={() => setBackdropShow(false)}
        >
          <Text color="muted">backdropColor #1d4ed8，backdropOpacity 0.75</Text>
        </PopupPanel>
      </Popup>

      <Popup
        round
        animation={{ in: 'zoomIn' }}
        duration={800}
        position="bottom"
        show={animationShow}
        onUpdateShow={setAnimationShow}
      >
        <PopupPanel
          title="混搭动画"
          onClose={() => setAnimationShow(false)}
        >
          <Text color="muted">进场 zoomIn，退场仍是 bottom 默认的 slideOutDown</Text>
        </PopupPanel>
      </Popup>

      <Popup
        round
        position="center"
        show={lifecycleShow}
        onClosed={() => setClosedCount(prev => prev + 1)}
        onOpened={() => setOpenedCount(prev => prev + 1)}
        onUpdateShow={setLifecycleShow}
      >
        <PopupPanel
          title="生命周期"
          onClose={() => setLifecycleShow(false)}
        >
          <Text color="muted">关掉后回到列表看计数变化</Text>
        </PopupPanel>
      </Popup>

      {/* coverScreen={false} 渲染的是一个 absolute inset-0 的 View，定位相对父容器，
          所以必须挂在这个铺满屏幕的 View 下，不能塞进上面的 ScrollView 内容区 */}
      <Popup
        round
        coverScreen={false}
        position="bottom"
        show={inlineShow}
        onUpdateShow={setInlineShow}
      >
        <PopupPanel
          title="就地渲染"
          onClose={() => setInlineShow(false)}
        >
          <Text color="muted">下面这个 Toast 能盖在弹层之上</Text>
          <Button
            variant="tonal"
            onPress={() => showToast('Toast 在弹层上方')}
          >
            弹一条 Toast
          </Button>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupDemo };
