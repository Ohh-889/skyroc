import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { PopupAnimation } from './PopupAnimation';
import { PopupBackdrop } from './PopupBackdrop';
import { PopupDrawer } from './PopupDrawer';
import { PopupInline } from './PopupInline';
import { PopupLifecycle } from './PopupLifecycle';
import { PopupPositions } from './PopupPositions';
import { PopupRound } from './PopupRound';
import { PopupSafeArea } from './PopupSafeArea';
import { PopupSurface } from './PopupSurface';

/** Popup 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/popup/PopupPositions" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const PopupDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="position 支持 center、top、bottom、left、right 五个方向。"
        title="弹出位置（position）"
      >
        <PopupPositions />
      </Section>

      <Section
        description="round 统一控制五个方向，贴边的那一侧不加圆角；居中弹层默认是直角。"
        title="圆角（round）"
      >
        <PopupRound />
      </Section>

      <Section
        description="内容自带卡片时要传 surface={false}，否则容器的不透明底会把卡片的圆角填成直角。"
        title="容器背景（surface）"
      >
        <PopupSurface />
      </Section>

      <Section
        description="left / right 默认 w-3/4，cn 底层是 twMerge，传 className 可直接覆盖。"
        title="抽屉宽度（className）"
      >
        <PopupDrawer />
      </Section>

      <Section
        description="顶部与底部弹层可分别避让状态栏、刘海和 home indicator。"
        title="安全区避让（safeAreaInsetTop / safeAreaInsetBottom）"
      >
        <PopupSafeArea />
      </Section>

      <Section
        description="遮罩点击与 Android 返回键可独立控制；backdropColor / backdropOpacity 可自定义遮罩。"
        title="关闭与遮罩（closeOnBackdropPress / closeOnBackPress）"
      >
        <PopupBackdrop />
      </Section>

      <Section
        description="animation 只覆盖传入的那个方向，只指定 in 时 out 仍走该位置的默认动画。"
        title="动画（animation / duration）"
      >
        <PopupAnimation />
      </Section>

      <Section
        description="onOpened 与 onClosed 都在动画结束后触发。"
        title="生命周期（onOpened / onClosed）"
      >
        <PopupLifecycle />
      </Section>

      <Section
        description="coverScreen={false} 让弹层就地渲染，可以和 Portal 渲染的 Toast 共存。"
        title="与 Toast 共存（coverScreen）"
      >
        <PopupInline />
      </Section>
    </ScrollView>
  );
};

export { PopupDemo };
