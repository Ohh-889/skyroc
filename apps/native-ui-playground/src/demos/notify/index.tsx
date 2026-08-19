import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { NotifyBasic } from './NotifyBasic';
import { NotifyCustom } from './NotifyCustom';
import { NotifyDeclarative } from './NotifyDeclarative';
import { NotifyDefaults } from './NotifyDefaults';
import { NotifyDuration } from './NotifyDuration';
import { NotifyInteraction } from './NotifyInteraction';
import { NotifyLifecycle } from './NotifyLifecycle';
import { NotifyPositions } from './NotifyPositions';
import { NotifyTypes } from './NotifyTypes';
import { NotifyUpdate } from './NotifyUpdate';

/** Notify 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件， 所以这里只负责串场，不要把示例代码写回本文件。 */
const NotifyDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="showNotify 支持字符串简写和 options 对象；closeNotify 关闭当前通知。"
        title="基础用法（showNotify / closeNotify）"
      >
        <NotifyBasic />
      </Section>

      <Section
        description="type 提供 primary、success、warning 和 danger 四种语义类型。"
        title="通知类型（type）"
      >
        <NotifyTypes />
      </Section>

      <Section
        description="position 控制命令式通知贴合屏幕顶部或底部显示。"
        title="显示位置（position）"
      >
        <NotifyPositions />
      </Section>

      <Section
        description="duration 设置自动关闭时间；0 表示常驻，可通过返回实例的 close 关闭。"
        title="展示时长与关闭（duration / close）"
      >
        <NotifyDuration />
      </Section>

      <Section
        description="传入 onClick 后 Notify 可响应点击；未传入时不会拦截下层触摸。"
        title="点击事件（onClick）"
      >
        <NotifyInteraction />
      </Section>

      <Section
        description="实例 update 原地更新内容与配置，不重放进场动画，并按新的 duration 重新计时。"
        title="原地更新（update）"
      >
        <NotifyUpdate />
      </Section>

      <Section
        description="onClose 在超时、主动关闭或被新通知顶替时触发，每条通知只触发一次。"
        title="关闭回调（onClose）"
      >
        <NotifyLifecycle />
      </Section>

      <Section
        description="setNotifyDefaultOptions 设置后续通知的全局默认值，resetNotifyDefaultOptions 恢复初始配置。"
        title="全局默认配置"
      >
        <NotifyDefaults />
      </Section>

      <Section
        description="className 与 classNames 优先使用主题样式；background / color 用于主题外颜色，message 也可传入自定义节点。"
        title="自定义样式与内容（classNames / message）"
      >
        <NotifyCustom />
      </Section>

      <Section
        description="show 控制内联 Notify 的显隐；onUpdateShow 接收自动关闭请求。声明式不自动贴边或补安全区。"
        title="声明式受控模式（show / onUpdateShow）"
      >
        <NotifyDeclarative />
      </Section>
    </ScrollView>
  );
};

export { NotifyDemo };
